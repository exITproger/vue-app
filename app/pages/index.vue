<script setup lang="ts">
import { products } from '~/data/products'

const router = useRouter()
const search = ref('')

const popular = computed(() => products.slice(0, 4))

const onSearch = (q: string) => {
  router.push({ path: '/catalog', query: { q } })
}
</script>

<template>
  <div>
    <section class="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
      <UContainer>
        <div class="relative py-24 md:py-32 max-w-3xl">
          <UBadge color="neutral" variant="solid" class="mb-4 bg-white/20 text-white border-0">
            <UIcon name="i-heroicons-fire" class="w-4 h-4 mr-1" />
            Более 5000 довольных клиентов
          </UBadge>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Топливо для твоих <span class="text-yellow-300">рекордов</span>
          </h1>
          <p class="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Протеин, креатин, аминокислоты и витамины от ведущих мировых брендов. Доставка по всей России.
          </p>

          <div class="relative z-10 max-w-xl">
            <SearchBar v-model="search" @search="onSearch" />
          </div>

          <div class="flex flex-wrap gap-2 mt-4">
            <UButton
              v-for="tag in ['Протеин', 'Креатин', 'BCAA', 'Витамины']"
              :key="tag"
              :label="tag"
              size="sm"
              variant="soft"
              class="bg-white/20 text-white hover:bg-white/30 border-0"
              @click="onSearch(tag)"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <UContainer class="py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <UCard v-for="f in [
          { icon: 'i-heroicons-truck', title: 'Быстрая доставка', text: 'От 1 дня' },
          { icon: 'i-heroicons-shield-check', title: '100% оригинал', text: 'Гарантия качества' },
          { icon: 'i-heroicons-credit-card', title: 'Удобная оплата', text: 'Онлайн и при получении' },
          { icon: 'i-heroicons-trophy', title: 'Лучшие бренды', text: 'Optimum, MyProtein, C4' },
        ]" :key="f.title">
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon :name="f.icon" class="w-8 h-8 text-primary" />
            <div class="font-semibold">{{ f.title }}</div>
            <div class="text-sm text-gray-500">{{ f.text }}</div>
          </div>
        </UCard>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-bold">Популярное</h2>
        <UButton to="/catalog" variant="link" trailing-icon="i-heroicons-arrow-right">
          Весь каталог
        </UButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCard v-for="p in popular" :key="p.id" :product="p" />
      </div>
    </UContainer>
  </div>
</template>