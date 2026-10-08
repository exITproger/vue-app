<script setup lang="ts">
import { products } from '~/data/products'

const route = useRoute()
const router = useRouter()

const product = computed(() => products.find(p => p.id === Number(route.params.id)))

if (!product.value) {
  router.replace('/catalog')
}

const { isFavorite, toggleFavorite } = useFavorites()
const { addToCart, isInCart } = useCart()

const inCart = computed(() => product.value ? isInCart(product.value.id) : false)
const fav = computed(() => product.value ? isFavorite(product.value.id) : false)

const related = computed(() => {
  if (!product.value) return []
  return products.filter(p => p.category === product.value!.category && p.id !== product.value!.id).slice(0, 3)
})

const toast = useToast()

const onAddToCart = () => {
  if (!product.value || !product.value.inStock) return
  addToCart(product.value, 1)
  toast.add({
    title: 'Товар добавлен в корзину',
    description: product.value.name,
    icon: 'i-heroicons-shopping-bag',
    color: 'success',
  })
}

const addToFav = () => {
  if (!product.value) return
  const wasFav = fav.value
  toggleFavorite(product.value)
  toast.add({
    title: wasFav ? 'Удалено из избранного' : 'Добавлено в избранное',
    icon: wasFav ? 'i-heroicons-heart' : 'i-heroicons-heart-solid',
    color: wasFav ? 'neutral' : 'success',
  })
}

// === Карусель ===
// Если у товара есть массив images — используем его.
// Иначе создаём 4 «ракурса» из одного фото: разные зум и позиция кадра.
type Slide = { src: string; scale: number; position: string }

const slides = computed<Slide[]>(() => {
  if (!product.value) return []
  const base = product.value.image
  const extra: string[] = (product.value as any).images ?? []

  if (extra.length > 0) {
    return [base, ...extra].map(src => ({ src, scale: 1, position: 'center' }))
  }

  // Одно фото → 4 виртуальных ракурса
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

watch(() => route.params.id, () => {
  activeSlide.value = 0
})
</script>

<template>
  <UContainer v-if="product" class="py-10">
    <UBreadcrumb
      :links="[
        { label: 'Главная', to: '/' },
        { label: 'Каталог', to: '/catalog' },
        { label: product.name },
      ]"
      class="mb-6"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <!-- Карусель -->
      <div class="flex flex-col gap-3">
        <div class="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
          <!-- Слайды -->
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

          <!-- Стрелки -->
          <template v-if="slides.length > 1">
            <button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-zinc-900 transition-all"
              aria-label="Предыдущее фото"
              @click="prevSlide"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
            </button>
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-zinc-900 transition-all"
              aria-label="Следующее фото"
              @click="nextSlide"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
            </button>

            <!-- Индикаторы -->
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
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
            class="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all bg-zinc-100 dark:bg-zinc-800"
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

      <!-- Информация о товаре -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <UBadge :label="product.category" color="primary" variant="subtle" />
          <UBadge :label="product.brand" color="neutral" variant="subtle" />
          <div class="flex items-center gap-1 ml-auto">
            <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-amber-400" />
            <span class="font-semibold">{{ product.rating }}</span>
          </div>
        </div>

        <h1 class="text-3xl font-bold">{{ product.name }}</h1>

        <p class="text-zinc-600 dark:text-zinc-400">{{ product.fullDescription }}</p>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-if="product.protein" class="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div class="text-xs text-zinc-500">Белки</div>
            <div class="font-bold text-lg">{{ product.protein }} г</div>
          </div>
          <div v-if="product.calories !== undefined" class="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div class="text-xs text-zinc-500">Калории</div>
            <div class="font-bold text-lg">{{ product.calories }} ккал</div>
          </div>
          <div class="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div class="text-xs text-zinc-500">Вес</div>
            <div class="font-bold text-lg">{{ product.weight }}</div>
          </div>
        </div>

        <div class="flex items-baseline gap-3 mt-2">
          <div class="text-4xl font-extrabold">{{ product.price.toLocaleString('ru-RU') }} ₽</div>
          <div v-if="product.oldPrice" class="text-xl text-zinc-400 line-through">
            {{ product.oldPrice.toLocaleString('ru-RU') }} ₽
          </div>
        </div>

        <!-- Кнопки: компактные -->
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <UButton
            size="xl"
            :color="inCart ? 'neutral' : 'primary'"
            :variant="inCart ? 'soft' : 'solid'"
            :icon="inCart ? 'i-heroicons-check' : 'i-heroicons-shopping-bag'"
            :disabled="!product.inStock"
            class="font-semibold"
            @click="onAddToCart"
          >
            {{ !product.inStock ? 'Нет в наличии' : (inCart ? 'В корзине (добавить ещё)' : 'Добавить в корзину') }}
          </UButton>
          <UButton
            size="xl"
            :icon="fav ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :color="fav ? 'error' : 'neutral'"
            :variant="fav ? 'soft' : 'outline'"
            @click="addToFav"
          >
            {{ fav ? 'В избранном' : 'В избранное' }}
          </UButton>
        </div>

        <div class="flex flex-wrap gap-2 mt-2">
          <UBadge v-for="tag in product.tags" :key="tag" :label="`#${tag}`" variant="subtle" color="neutral" />
        </div>
      </div>
    </div>

    <div v-if="related.length" class="mt-16">
      <h2 class="text-2xl font-bold mb-6">Похожие товары</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </div>
  </UContainer>
</template>