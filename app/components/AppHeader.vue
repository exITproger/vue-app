<script setup lang="ts">
const { count: favCount } = useFavorites()
const { totalCount: cartCount } = useCart()
const route = useRoute()

const links = [
  { label: 'Каталог', to: '/catalog', icon: 'i-heroicons-squares-2x2' },
  { label: 'Избранное', to: '/favorites', icon: 'i-heroicons-heart', badgeKey: 'fav' },
  { label: 'Корзина', to: '/cart', icon: 'i-heroicons-shopping-bag', badgeKey: 'cart' },
  { label: 'Профиль', to: '/profile', icon: 'i-heroicons-user' },
]

const getBadgeCount = (key?: string) => {
  if (key === 'fav') return favCount.value
  if (key === 'cart') return cartCount.value
  return 0
}

// Если кликнули по ссылке текущей страницы — плавно скроллим вверх
const onNavClick = (to: string) => {
  if (route.path === to && typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-zinc-900/85 border-b border-zinc-200 dark:border-zinc-800">
    <UContainer>
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
            <UIcon name="i-heroicons-bolt" class="w-5 h-5" />
          </div>
          <span>Sport<span class="text-primary">Fuel</span></span>
        </NuxtLink>

        <!-- Меню для десктопа -->
        <nav class="hidden md:flex items-center gap-1">
          <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :icon="link.icon"
            :variant="route.path === link.to ? 'soft' : 'ghost'"
            :color="route.path === link.to ? 'primary' : 'neutral'"
            @click="onNavClick(link.to)"
          >
            {{ link.label }}
            <UBadge
              v-if="link.badgeKey && getBadgeCount(link.badgeKey) > 0"
              :label="getBadgeCount(link.badgeKey)"
              color="primary"
              size="xs"
              class="ml-1"
            />
          </UButton>
        </nav>

        <div class="flex items-center gap-2">
          <UColorModeButton />
        </div>
      </div>
    </UContainer>
  </header>
</template>