<template>
  <UApp>
    <div class="min-h-screen flex flex-col pb-24 md:pb-0">
      <AppHeader />
      <main class="flex-1">
        <NuxtPage />
      </main>
      <AppFooter />
      <AppBottomNav />
      <ScrollTopButton />
    </div>
  </UApp>
</template>