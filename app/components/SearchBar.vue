<script setup lang="ts">
import { products, type Product } from '~/data/products'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const router = useRouter()
const { history, addQuery, removeQuery, clearHistory } = useSearchHistory()
const query = ref(props.modelValue || '')
const isFocused = ref(false)

watch(() => props.modelValue, v => {
  if (v !== undefined && v !== query.value) {
    query.value = v
  }
})

const onInput = (val: string) => {
  query.value = val
  emit('update:modelValue', val)
}

const productSuggestions = computed<Product[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return products.filter(p =>
    p.name.toLowerCase().includes(q)
    || p.category.toLowerCase().includes(q)
    || p.brand.toLowerCase().includes(q)
    || p.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 5)
})

const historySuggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return history.value
  return history.value.filter(h => h.toLowerCase().includes(q) && h.toLowerCase() !== q)
})

const hasDropdownContent = computed(() => {
  if (!isFocused.value) return false
  if (!query.value.trim()) return history.value.length > 0
  return productSuggestions.value.length > 0 || categorySuggestions.value.length > 0 || historySuggestions.value.length > 0
})

const submit = () => {
  const trimmed = query.value.trim()
  if (!trimmed) return
  addQuery(trimmed)
  emit('search', trimmed)
  isFocused.value = false
}

const pickHistory = (h: string) => {
  query.value = h
  emit('update:modelValue', h)
  submit()
}

const goToProduct = (id: number) => {
  if (query.value.trim()) {
    addQuery(query.value.trim())
  }
  isFocused.value = false
  // Товар открываем в новой вкладке
  window.open(router.resolve(`/product/${id}`).href, '_blank')
}

const goToCategory = (category: string) => {
  if (query.value.trim()) {
    addQuery(query.value.trim())
  }
  isFocused.value = false
  // Категрию открываем в этой же вкладке
  router.push(`/catalog?category=${encodeURIComponent(category)}`)
}

const categorySuggestions = computed<string[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  const categories = new Set<string>()
  for (const p of products) {
    const c = p.category.toLowerCase()
    if (c.includes(q) && !c.startsWith(q)) {
      categories.add(p.category)
    }
  }
  return [...categories].slice(0, 3)
})

const clearInput = () => {
  query.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
const onBlur = () => {
  if (typeof window !== 'undefined') {
    window.setTimeout(() => {
      isFocused.value = false
    }, 200)
  }
}
</script>

<template>
  <div class="relative w-full">
    <UInput
      :model-value="query"
      icon="i-heroicons-magnifying-glass"
      placeholder="Поиск: протеин, креатин, BCAA..."
      size="lg"
      class="w-full"
      autocomplete="off"
      @update:model-value="onInput"
      @focus="isFocused = true"
      @blur="onBlur"
      @keydown.enter="submit"
    >
      <template #trailing>
        <UButton
          v-if="query"
          icon="i-heroicons-x-mark"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="clearInput"
        />
        <UButton
          v-else
          icon="i-heroicons-arrow-right"
          variant="ghost"
          color="primary"
          size="xs"
          @click="submit"
        />
      </template>
    </UInput>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hasDropdownContent"
        class="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-[100] overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
      >
        <!-- Подсказки по товарам -->
        <div v-if="productSuggestions.length > 0" class="pb-2">
          <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Товары ({{ productSuggestions.length }})
          </div>
          <div
            v-for="p in productSuggestions"
            :key="p.id"
            class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            @mousedown.prevent="goToProduct(p.id)"
          >
            <img
              :src="p.image"
              :alt="p.name"
              class="w-10 h-10 rounded-md object-cover shrink-0 bg-gray-100 dark:bg-gray-800"
            >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {{ p.name }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ p.brand }} · {{ p.category }}
              </div>
            </div>
            <div class="text-sm font-semibold text-primary whitespace-nowrap">
              {{ p.price.toLocaleString('ru-RU') }} ₽
            </div>
          </div>
        </div>

        <!-- Подсказки по категориям -->
        <div v-if="categorySuggestions.length > 0" :class="{ 'pt-2': productSuggestions.length > 0 }" class="pb-2">
          <div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Категории ({{ categorySuggestions.length }})
          </div>
          <div
            v-for="c in categorySuggestions"
            :key="c"
            class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            @mousedown.prevent="goToCategory(c)"
          >
            <UIcon name="i-heroicons-tag" class="w-5 h-5 text-gray-400 shrink-0" />
            <div class="flex-1 min-w-0 text-sm font-medium truncate text-gray-900 dark:text-gray-100">
              {{ c }}
            </div>
            <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        <!-- Подсказки из истории -->
        <div v-if="historySuggestions.length > 0" :class="{ 'pt-2': productSuggestions.length > 0 || categorySuggestions.length > 0 }">
          <div class="flex items-center justify-between px-2 py-1 mb-1">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {{ query ? 'Похожие запросы' : 'История поиска' }}
            </span>
            <UButton
              v-if="!query"
              label="Очистить"
              variant="link"
              color="neutral"
              size="xs"
              @mousedown.prevent="clearHistory"
            />
          </div>
          <div
            v-for="h in historySuggestions"
            :key="h"
            class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group transition-colors"
            @mousedown.prevent="pickHistory(h)"
          >
            <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
              <span>{{ h }}</span>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              size="xs"
              class="opacity-0 group-hover:opacity-100"
              @mousedown.prevent.stop="removeQuery(h)"
            />
          </div>
        </div>

        <!-- Кнопка "Найти все" -->
        <div v-if="query.trim()" class="pt-2">
          <button
            type="button"
            class="w-full text-left flex items-center justify-between px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            @mousedown.prevent="submit"
          >
            <span>Показать все результаты для «{{ query.trim() }}»</span>
            <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>