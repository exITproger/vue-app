<script setup lang="ts">
// Плавающая кнопка «Наверх»: появляется при прокрутке вниз,
// показывается поверх футера и в любой момент возвращает наверх страницы.
const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 600
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-y-3"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 translate-y-3"
    >
      <button
        v-if="visible"
        type="button"
        aria-label="Наверх"
        class="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
        @click="scrollToTop"
      >
        <UIcon name="i-heroicons-arrow-up" class="w-6 h-6" />
      </button>
    </Transition>
  </ClientOnly>
</template>
