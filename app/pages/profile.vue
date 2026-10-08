<script setup lang="ts">
const { count: favCount } = useFavorites()
const { totalCount: cartCount } = useCart()

const user = ref({
  name: 'Александр Иванов',
  email: 'alex.ivanov@example.com',
  phone: '+7 (999) 123-45-67',
  bonusPoints: 850,
  level: 'PRO Атлет',
})

const orders = ref([
  {
    id: 'SF-94821',
    date: '18 сентября 2026',
    status: 'Доставлен',
    statusColor: 'success' as const,
    itemsCount: 3,
    total: 8070,
  },
  {
    id: 'SF-81204',
    date: '2 августа 2026',
    status: 'Доставлен',
    statusColor: 'success' as const,
    itemsCount: 2,
    total: 3480,
  },
  {
    id: 'SF-75390',
    date: '14 июня 2026',
    status: 'Доставлен',
    statusColor: 'success' as const,
    itemsCount: 1,
    total: 4590,
  },
])

const isEditing = ref(false)
const saved = ref(false)

const saveProfile = () => {
  isEditing.value = false
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}
</script>

<template>
  <UContainer class="py-10 max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Личный кабинет</h1>
      <p class="text-gray-500 mt-1">Управление профилем, заказами и бонусами</p>
    </div>

    <!-- Карточка пользователя -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard class="md:col-span-2">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div class="flex items-center gap-4 min-w-0 flex-1">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
              {{ user.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-lg truncate">{{ user.name }}</div>
              <div class="text-sm text-gray-500 truncate">{{ user.email }}</div>
              <UBadge :label="user.level" color="primary" variant="subtle" size="xs" class="mt-1" />
            </div>
          </div>
          <UButton
            :label="isEditing ? 'Сохранить' : 'Изменить'"
            :icon="isEditing ? 'i-heroicons-check' : 'i-heroicons-pencil'"
            variant="soft"
            color="primary"
            size="sm"
            class="shrink-0 self-start sm:self-auto"
            @click="isEditing ? saveProfile() : (isEditing = true)"
          />
        </div>

        <div v-if="saved" class="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
          Данные профиля успешно обновлены
        </div>

        <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <div class="text-xs text-gray-400">Телефон</div>
            <div class="font-medium mt-0.5">{{ user.phone }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400">Адрес доставки</div>
            <div class="font-medium mt-0.5">г. Москва, ул. Спортивная, д. 12, кв. 45</div>
          </div>
        </div>

        <div v-else class="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label class="text-xs text-gray-400 block mb-1">Имя и фамилия</label>
            <UInput v-model="user.name" size="sm" />
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Email</label>
            <UInput v-model="user.email" size="sm" />
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Телефон</label>
            <UInput v-model="user.phone" size="sm" />
          </div>
        </div>
      </UCard>

      <!-- Бонусная программа -->
      <UCard class="flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 dark:from-zinc-900 dark:to-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/50">
        <div>
          <div class="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
            <span>Бонусный баланс</span>
          </div>
          <div class="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {{ user.bonusPoints }} <span class="text-sm font-normal text-gray-500">баллов</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            1 балл = 1 ₽. Оплачивайте до 30% от суммы любых покупок в каталоге.
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Кэшбек 5% с покупок</span>
          <span class="font-bold text-primary">Активен</span>
        </div>
      </UCard>
    </div>

    <!-- Быстрые ссылки -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/favorites" class="group">
        <UCard class="h-full hover:border-primary/50 transition-colors text-center py-2">
          <UIcon name="i-heroicons-heart" class="w-6 h-6 mx-auto mb-1 text-primary group-hover:scale-110 transition-transform" />
          <div class="text-sm font-semibold">Избранное</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ favCount }} товаров</div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/cart" class="group">
        <UCard class="h-full hover:border-primary/50 transition-colors text-center py-2">
          <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6 mx-auto mb-1 text-primary group-hover:scale-110 transition-transform" />
          <div class="text-sm font-semibold">Корзина</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ cartCount }} товаров</div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/catalog" class="group">
        <UCard class="h-full hover:border-primary/50 transition-colors text-center py-2">
          <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 mx-auto mb-1 text-primary group-hover:scale-110 transition-transform" />
          <div class="text-sm font-semibold">Каталог</div>
          <div class="text-xs text-gray-400 mt-0.5">Все разделы</div>
        </UCard>
      </NuxtLink>

      <a href="#" class="group">
        <UCard class="h-full hover:border-primary/50 transition-colors text-center py-2">
          <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6 mx-auto mb-1 text-primary group-hover:scale-110 transition-transform" />
          <div class="text-sm font-semibold">Поддержка</div>
          <div class="text-xs text-gray-400 mt-0.5">24/7 в чате</div>
        </UCard>
      </a>
    </div>

    <!-- История заказов -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold">История заказов</h2>
          <span class="text-xs text-gray-500">{{ orders.length }} заказа</span>
        </div>
      </template>

      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="order in orders"
          :key="order.id"
          class="py-3 flex items-center justify-between flex-wrap gap-2 text-sm"
        >
          <div>
            <div class="font-semibold text-gray-900 dark:text-gray-100">{{ order.id }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ order.date }} · {{ order.itemsCount }} товара</div>
          </div>

          <div class="flex items-center gap-4">
            <UBadge :label="order.status" :color="order.statusColor" variant="subtle" size="xs" />
            <div class="font-bold text-gray-900 dark:text-gray-100 text-right min-w-[90px]">
              {{ order.total.toLocaleString('ru-RU') }} ₽
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>   