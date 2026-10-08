<script setup lang="ts">
import { products } from '~/data/products'

const { favorites, clearFavorites } = useFavorites()

const favProducts = computed(() =>
  products.filter(p => favorites.value.some(f => f.id === p.id))
)

const total = computed(() => favProducts.value.reduce((s, p) => s + p.price, 0))
</script>

<template>
  <UContainer class="py-10">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold">Избранное</h1>
        <p class="text-gray-500 mt-1">{{ favProducts.length }} товаров</p>
      </div>
      <UButton
        v-if="favProducts.length"
        label="Очистить всё"
        icon="i-heroicons-trash"
        color="error"
        variant="soft"
        @click="clearFavorites"
      />
    </div>

    <div v-if="favProducts.length === 0" class="py-20 text-center">
      <UIcon name="i-heroicons-heart" class="w-20 h-20 mx-auto mb-4 text-gray-300" />
      <p class="text-xl font-semibold mb-2">В избранном пока пусто</p>
      <p class="text-gray-500 mb-6">Добавляйте товары, чтобы не потерять их</p>
      <UButton to="/catalog" color="primary" size="lg">Перейти в каталог</UButton>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <ProductCard v-for="p in favProducts" :key="p.id" :product="p" />
      </div>

      <UCard>
        <div class="flex items-center justify-between">
          <span class="text-lg">Итого ({{ favProducts.length }} товаров):</span>
          <span class="text-2xl font-bold">{{ total.toLocaleString('ru-RU') }} ₽</span>
        </div>
      </UCard>
    </template>
  </UContainer>
</template>