<script setup lang="ts">
import { products, categories } from '~/data/products'

const route = useRoute()
const router = useRouter()

const BATCH_SIZE = 8

const searchQuery = ref((route.query.q as string) || '')
const category = ref((route.query.category as string) || 'Все')
const sortBy = ref<'popular' | 'price-asc' | 'price-desc' | 'rating'>(
  (['popular', 'price-asc', 'price-desc', 'rating'].includes(route.query.sort as string)
    ? (route.query.sort as any)
    : 'popular')
)

// Количество отображаемых элементов (порциями как на WB)
const visibleCount = ref(BATCH_SIZE)
const isLoadingMore = ref(false)
const sentinelRef = ref<HTMLElement | null>(null)

const { addQuery } = useSearchHistory()

const syncUrl = () => {
  const nextQuery: Record<string, string | undefined> = {
    q: searchQuery.value.trim() || undefined,
    category: category.value !== 'Все' ? category.value : undefined,
    sort: sortBy.value !== 'popular' ? sortBy.value : undefined,
  }
  router.push({ path: '/catalog', query: nextQuery })
}

watch(() => route.query, (q) => {
  const qStr = (q.q as string) || ''
  const catStr = (q.category as string) || 'Все'
  const sortStr = (q.sort as any) || 'popular'

  if (searchQuery.value !== qStr) searchQuery.value = qStr
  if (category.value !== catStr) category.value = catStr
  if (sortBy.value !== sortStr) sortBy.value = sortStr
  visibleCount.value = BATCH_SIZE
})

const filtered = computed(() => {
  let list = [...products]
  if (category.value !== 'Все') {
    list = list.filter(p => p.category === category.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q)
      || p.description.toLowerCase().includes(q)
      || p.brand.toLowerCase().includes(q)
      || p.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  switch (sortBy.value) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break
    case 'price-desc': list.sort((a, b) => b.price - a.price); break
    case 'rating': list.sort((a, b) => b.rating - a.rating); break
  }
  return list
})

const displayedProducts = computed(() => {
  return filtered.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < filtered.value.length
})

const loadMore = () => {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    visibleCount.value += BATCH_SIZE
    isLoadingMore.value = false
  }, 250)
}

// Intersection Observer для бесконечного скролла (как на WB при прокрутке до конца)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore.value) {
        loadMore()
      }
    }, { rootMargin: '300px' })

    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(sentinelRef, (el) => {
  if (observer) {
    observer.disconnect()
    if (el) observer.observe(el)
  }
})

const onSearch = (q: string) => {
  searchQuery.value = q
  if (q.trim()) addQuery(q.trim())
  visibleCount.value = BATCH_SIZE
  syncUrl()
}

const setCategory = (c: string) => {
  category.value = c
  visibleCount.value = BATCH_SIZE
  syncUrl()
}

const onSortChange = () => {
  visibleCount.value = BATCH_SIZE
  syncUrl()
}
</script>

<template>
  <UContainer class="py-10">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-1 tracking-tight">Каталог товаров</h1>
      <p class="text-zinc-500 text-sm">
        Найдено {{ filtered.length }} товаров · Кликните на карточку для открытия в новой вкладке
      </p>
    </div>

    <!-- Поиск -->
    <div class="mb-6 max-w-2xl">
      <SearchBar v-model="searchQuery" @search="onSearch" />
    </div>

    <!-- Фильтр по категориям -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <UButton
        v-for="c in categories"
        :key="c"
        :label="c"
        :variant="category === c ? 'solid' : 'soft'"
        :color="category === c ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="setCategory(c)"
      />
    </div>

    <!-- Панель управления и сортировки -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
      <div class="text-sm text-zinc-500">
        Показано <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ displayedProducts.length }}</span> из <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ filtered.length }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-400">Сортировка:</span>
        <USelect
          v-model="sortBy"
          :items="[
            { label: 'По популярности', value: 'popular' },
            { label: 'Цена: по возрастанию', value: 'price-asc' },
            { label: 'Цена: по убыванию', value: 'price-desc' },
            { label: 'По рейтингу', value: 'rating' },
          ]"
          class="w-52"
          @update:model-value="onSortChange"
        />
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="filtered.length === 0" class="py-20 text-center text-zinc-500">
      <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
      <p class="text-lg font-semibold">Ничего не найдено</p>
      <p class="text-sm mt-1">Попробуйте изменить запрос или выбрать другую категорию</p>
      <UButton
        label="Сбросить фильтры"
        color="primary"
        variant="soft"
        class="mt-4"
        @click="() => { searchQuery = ''; category = 'Все'; syncUrl() }"
      />
    </div>

    <!-- Сетка товаров в стиле WB -->
    <div v-else class="grid grid-cols-1 min-[480px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 gap-3 sm:gap-5">
      <ProductCard
        v-for="p in displayedProducts"
        :key="p.id"
        :product="p"
      />
    </div>

    <!-- Блок бесконечной прокрутки (Infinite Scroll) -->
    <div v-if="hasMore" class="mt-12 text-center flex flex-col items-center gap-4">
      <UButton
        size="lg"
        color="primary"
        variant="soft"
        :loading="isLoadingMore"
        class="px-8 font-semibold rounded-xl"
        @click="loadMore"
      >
        Показать ещё (+{{ Math.min(BATCH_SIZE, filtered.length - visibleCount) }})
      </UButton>
      <div ref="sentinelRef" class="h-4 w-full" />
    </div>

    <div v-else-if="filtered.length > 0" class="mt-12 text-center text-xs text-zinc-400 py-6 border-t border-zinc-200 dark:border-zinc-800">
      Вы посмотрели все {{ filtered.length }} товаров
    </div>
  </UContainer>
</template>