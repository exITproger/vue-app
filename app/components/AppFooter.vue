<script setup lang="ts">
import { categories } from '~/data/products'

// Категории кликабельны -> фильтр каталога по категории
const footerCategories = categories.filter(c => c !== 'Все').slice(0, 4)

// Ссылки в футере
const phoneHref = 'tel:88005553535'
const phoneLabel = '8 (800) 555-35-35'
const emailHref = 'mailto:info@sportfuel.ru'
const emailLabel = 'info@sportfuel.ru'
const helpCenterHref = 'https://t.me/sportfuel_help'

// Логотип: клик -> наверх и на главную
const goHome = async () => {
  await navigateTo('/')
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
        <div>
          <a
            href="#"
            class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity"
            @click.prevent="goHome"
          >
            <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-primary" />
            <span>Sport<span class="text-primary">Fuel</span></span>
          </a>
          <p class="mt-3 text-sm text-gray-500">
            Спортивное питание для тех, кто движется к цели.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Категории
          </h3>
          <ul class="mt-3 space-y-2 text-sm text-gray-500">
            <li v-for="category in footerCategories" :key="category">
              <NuxtLink :to="`/catalog?category=${encodeURIComponent(category)}`" class="hover:text-primary transition-colors">
                {{ category }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Помощь
          </h3>
          <ul class="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <NuxtLink to="/support" class="hover:text-primary transition-colors">
                Центр поддержки
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/delivery" class="hover:text-primary transition-colors">
                Доставка и оплата
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/returns" class="hover:text-primary transition-colors">
                Возврат товара
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Контакты
          </h3>
          <ul class="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <a :href="phoneHref" class="inline-flex items-center hover:text-primary transition-colors">
                <UIcon name="i-heroicons-phone" class="w-4 h-4 mr-1" />
                {{ phoneLabel }}
              </a>
            </li>
            <li>
              <a :href="emailHref" class="inline-flex items-center hover:text-primary transition-colors">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-1" />
                {{ emailLabel }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500">
        © {{ new Date().getFullYear() }} SportFuel. Все права защищены.
      </div>
    </UContainer>
  </footer>
</template>
