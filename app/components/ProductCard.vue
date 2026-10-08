<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{ product: Product }>()
const { isFavorite, toggleFavorite } = useFavorites()
const { addToCart, isInCart } = useCart()

const fav = computed(() => isFavorite(props.product.id))
const inCart = computed(() => isInCart(props.product.id))

const previewOpen = ref(false)

// === Карусель в предпросмотре ===
// Если у товара есть массив images — используем его,
// иначе создаём 4 «ракурса» из одного фото (разные зум и позиция кадра).
type Slide = { src: string; scale: number; position: string }

const slides = computed<Slide[]>(() => {
  const base = props.product.image
  const extra: string[] = (props.product as any).images ?? []

  if (extra.length > 0) {
    return [base, ...extra].map(src => ({ src, scale: 1, position: 'center' }))
  }

  return [
    { src: base, scale: 1,    position: 'center' },
    { src: base, scale: 1.6,  position: 'top left' },
    { src: base, scale: 1.6,  position: 'bottom right' },
    { src: base, scale: 2.2,  position: 'center' },
  ]
})

const activeSlide = ref(0)

const nextSlide = () => {
  if (!slides.value.length) return
  activeSlide.value = (activeSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (!slides.value.length) return
  activeSlide.value = (activeSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (i: number) => {
  activeSlide.value = i
}

watch(previewOpen, (open) => {
  if (open) activeSlide.value = 0
})

const openProductTab = () => {
  if (typeof window !== 'undefined') {
    window.open(`/product/${props.product.id}`, '_blank', 'noopener,noreferrer')
  }
}

const onCardClick = (e: MouseEvent) => {
  // Не переходить, если кликнули по интерактивным элементам (кнопки, ссылки, модалка)
  const target = e.target as HTMLElement | null
  if (target?.closest('button') || target?.closest('a') || target?.closest('[role="dialog"]')) {
    return
  }
  openProductTab()
}

const onAddToCart = (e: Event) => {
  e.stopPropagation()
  if (!props.product.inStock) return
  addToCart(props.product, 1)
}
</script>

<template>
  <div
    class="group cursor-pointer flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 p-3 sm:p-4"
    @click="onCardClick"
  >
    <!-- Картинка + бейджи -->
    <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/60 mb-3">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      >
      <UBadge
        v-if="!product.inStock"
        color="error"
        variant="solid"
        class="absolute top-2 left-2 text-[10px]"
      >
        Нет в наличии
      </UBadge>
      <UBadge
        v-if="product.oldPrice"
        color="warning"
        variant="solid"
        class="absolute top-2 right-2 text-[10px] font-bold"
      >
        -{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
      </UBadge>

      <!-- Быстрый просмотр и избранное поверх фото на ховере -->
      <div class="absolute bottom-2 right-2 flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          :icon="fav ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          :color="fav ? 'error' : 'neutral'"
          :variant="fav ? 'solid' : 'subtle'"
          size="xs"
          class="shadow-md backdrop-blur-md"
          @click.stop="toggleFavorite(product)"
        />
        <UButton
          icon="i-heroicons-eye"
          color="neutral"
          variant="subtle"
          size="xs"
          class="shadow-md backdrop-blur-md"
          @click.stop="previewOpen = true"
        />
      </div>
    </div>

    <!-- Текстовое описание -->
    <div class="flex flex-col flex-1 gap-1.5">
      <div class="flex items-center justify-between gap-1">
        <span class="text-xs font-medium text-primary line-clamp-1">{{ product.category }}</span>
        <div class="flex items-center gap-1 text-xs shrink-0">
          <UIcon name="i-heroicons-star-solid" class="w-3.5 h-3.5 text-amber-400" />
          <span class="font-semibold text-zinc-700 dark:text-zinc-300">{{ product.rating }}</span>
        </div>
      </div>

      <a
        :href="`/product/${product.id}`"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 leading-snug"
        @click.stop
      >
        {{ product.name }}
      </a>

      <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 flex-1">
        {{ product.description }}
      </p>

      <div class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
        {{ product.brand }} · {{ product.weight }}
      </div>
    </div>

    <!-- Цены и кнопка В корзину -->
    <div class="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
      <div>
        <div class="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
          {{ product.price.toLocaleString('ru-RU') }} ₽
        </div>
        <div v-if="product.oldPrice" class="text-xs text-zinc-400 line-through">
          {{ product.oldPrice.toLocaleString('ru-RU') }} ₽
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <UButton
          :label="inCart ? 'В корзине' : 'В корзину'"
          :icon="inCart ? 'i-heroicons-check' : 'i-heroicons-shopping-bag'"
          :color="inCart ? 'neutral' : 'primary'"
          :variant="inCart ? 'soft' : 'solid'"
          size="sm"
          :disabled="!product.inStock"
          class="font-medium"
          @click="onAddToCart"
        />
        <a
          :href="`/product/${product.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="p-1.5 text-zinc-400 hover:text-primary transition-colors"
          title="Открыть в новой вкладке"
          @click.stop
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- Модальное окно быстрого просмотра -->
    <UModal v-model:open="previewOpen" :title="product.name">
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Карусель изображений товара -->
          <div class="flex flex-col gap-2">
            <div class="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group/preview">
              <div
                class="flex h-full transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
              >
                <div
                  v-for="(slide, i) in slides"
                  :key="i"
                  class="w-full h-full shrink-0 overflow-hidden"
                >
                  <img
                    :src="slide.src"
                    :alt="`${product.name} — фото ${i + 1}`"
                    class="w-full h-full object-cover"
                    :style="{
                      transform: `scale(${slide.scale})`,
                      transformOrigin: slide.position,
                    }"
                  >
                </div>
              </div>

              <template v-if="slides.length > 1">
                <button
                  type="button"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-md opacity-0 group-hover/preview:opacity-100 hover:bg-white dark:hover:bg-zinc-900 transition-all"
                  aria-label="Предыдущее фото"
                  @click="prevSlide"
                >
                  <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
                </button>
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-md opacity-0 group-hover/preview:opacity-100 hover:bg-white dark:hover:bg-zinc-900 transition-all"
                  aria-label="Следующее фото"
                  @click="nextSlide"
                >
                  <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
                </button>

                <!-- Индикаторы -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <button
                    v-for="(_, i) in slides"
                    :key="i"
                    type="button"
                    class="h-2 rounded-full transition-all"
                    :class="i === activeSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80 w-2'"
                    :aria-label="`Фото ${i + 1}`"
                    @click="goToSlide(i)"
                  />
                </div>
              </template>
            </div>

            <!-- Миниатюры -->
            <div v-if="slides.length > 1" class="flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(slide, i) in slides"
                :key="i"
                type="button"
                class="shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-zinc-100 dark:bg-zinc-800"
                :class="i === activeSlide ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'"
                @click="goToSlide(i)"
              >
                <img
                  :src="slide.src"
                  :alt="`Миниатюра ${i + 1}`"
                  class="w-full h-full object-cover"
                  :style="{
                    transform: `scale(${slide.scale})`,
                    transformOrigin: slide.position,
                  }"
                >
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UBadge :label="product.category" color="primary" variant="subtle" />
              <UBadge :label="product.brand" color="neutral" variant="subtle" />
            </div>
            <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ product.fullDescription }}</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div v-if="product.protein" class="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <div class="text-zinc-500 text-xs">Белки</div>
                <div class="font-bold">{{ product.protein }} г</div>
              </div>
              <div v-if="product.calories" class="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <div class="text-zinc-500 text-xs">Ккал</div>
                <div class="font-bold">{{ product.calories }}</div>
              </div>
            </div>
            <div class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {{ product.price.toLocaleString('ru-RU') }} ₽
            </div>
            <div class="flex gap-2 pt-2">
              <a
                :href="`/product/${product.id}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1"
              >
                <UButton color="primary" block>
                  Подробнее в новой вкладке
                  <template #trailing>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                  </template>
                </UButton>
              </a>
              <UButton
                :icon="inCart ? 'i-heroicons-check' : 'i-heroicons-shopping-bag'"
                :color="inCart ? 'neutral' : 'primary'"
                :variant="inCart ? 'soft' : 'outline'"
                @click="onAddToCart"
              />
              <UButton
                :icon="fav ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                :color="fav ? 'error' : 'neutral'"
                variant="soft"
                @click="toggleFavorite(product)"
              />
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>