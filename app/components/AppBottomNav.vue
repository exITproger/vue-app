<script setup lang="ts">
const { count: favCount } = useFavorites()
const { totalCount: cartCount } = useCart()
const route = useRoute()

const navItems = [
  { label: 'Главная', to: '/', icon: 'i-heroicons-home' },
  { label: 'Каталог', to: '/catalog', icon: 'i-heroicons-squares-2x2' },
  { label: 'Избранное', to: '/favorites', icon: 'i-heroicons-heart', badgeKey: 'fav' },
  { label: 'Корзина', to: '/cart', icon: 'i-heroicons-shopping-bag', badgeKey: 'cart' },
  { label: 'Профиль', to: '/profile', icon: 'i-heroicons-user' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

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
  <nav
    class="md:hidden fixed inset-x-0 bottom-0 z-9999 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] safe-bottom"
    aria-label="Мобильная навигация"
  >
    <div class="grid grid-cols-5 h-16 w-full max-w-lg mx-auto px-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-0.5 transition-colors relative py-1 text-center select-none"
        :class="isActive(item.to) ? 'text-primary font-semibold' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'"
        @click="onNavClick(item.to)"
      >
        <div class="relative flex items-center justify-center">
          <UIcon :name="item.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          <UBadge
            v-if="item.badgeKey && getBadgeCount(item.badgeKey) > 0"
            :label="getBadgeCount(item.badgeKey)"
            color="primary"
            size="xs"
            class="absolute -top-1.5 -right-3 px-1 min-w-4 h-4 text-[10px] leading-none flex items-center justify-center font-bold"
          />
        </div>
        <span class="text-[10px] sm:text-xs tracking-tight truncate max-w-full px-0.5">
          {{ item.label }}
        </span>
        <span
          v-if="isActive(item.to)"
          class="absolute bottom-1 w-6 h-0.5 bg-primary rounded-full"
        />
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>