<script setup lang="ts">
const { items, totalCount, totalPrice, totalDiscount, updateQuantity, removeFromCart, clearCart } = useCart()

const deliveryPrice = computed(() => (totalPrice.value >= 3000 || totalPrice.value === 0 ? 0 : 350))
const finalPrice = computed(() => totalPrice.value + deliveryPrice.value)

const promoCode = ref('')
const promoApplied = ref(false)
const promoDiscount = ref(0)

const applyPromo = () => {
  if (promoCode.value.trim().toUpperCase() === 'SPORT10') {
    promoApplied.value = true
    promoDiscount.value = Math.round(totalPrice.value * 0.1)
  }
}

const isOrderSuccess = ref(false)
const orderNumber = ref('')

const makeOrder = () => {
  if (items.value.length === 0) return
  orderNumber.value = String(Math.floor(100000 + Math.random() * 900000))
  isOrderSuccess.value = true
  clearCart()
}
</script>

<template>
  <UContainer class="py-10">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold">Корзина</h1>
        <p class="text-gray-500 mt-1">
          <span v-if="totalCount > 0">{{ totalCount }} товаров на сумму {{ totalPrice.toLocaleString('ru-RU') }} ₽</span>
          <span v-else>Корзина пуста</span>
        </p>
      </div>
      <UButton
        v-if="items.length > 0"
        label="Очистить корзину"
        icon="i-heroicons-trash"
        color="error"
        variant="soft"
        size="sm"
        @click="clearCart"
      />
    </div>

    <!-- Заказ успешно оформлен -->
    <div v-if="isOrderSuccess" class="py-16 text-center max-w-md mx-auto">
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-check" class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold mb-2">Заказ №{{ orderNumber }} оформлен!</h2>
      <p class="text-gray-500 mb-6">Мы отправили подтверждение на вашу почту. Курьер свяжется с вами для уточнения деталей доставки.</p>
      <UButton to="/catalog" color="primary" size="lg">Продолжить покупки</UButton>
    </div>

    <!-- Пустая корзина -->
    <div v-else-if="items.length === 0" class="py-20 text-center">
      <UIcon name="i-heroicons-shopping-cart" class="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
      <p class="text-xl font-semibold mb-2">Ваша корзина пуста</p>
      <p class="text-gray-500 mb-6">Посмотрите наш каталог и выберите спортивное питание под ваши цели</p>
      <UButton to="/catalog" color="primary" size="lg">Перейти в каталог</UButton>
    </div>

    <!-- Список товаров + чек -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <UCard
          v-for="item in items"
          :key="item.product.id"
          class="hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-4">
            <a
              :href="`/product/${item.product.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0"
            >
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="w-20 h-20 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 hover:opacity-90 transition-opacity"
              >
            </a>

            <div class="flex-1 min-w-0">
              <a
                :href="`/product/${item.product.id}`"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1"
              >
                {{ item.product.name }}
              </a>
              <div class="text-xs text-gray-500 mt-0.5">
                {{ item.product.brand }} · {{ item.product.weight }}
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-base font-bold text-gray-900 dark:text-gray-100">
                  {{ (item.product.price * item.quantity).toLocaleString('ru-RU') }} ₽
                </span>
                <span v-if="item.product.oldPrice" class="text-xs text-gray-400 line-through">
                  {{ (item.product.oldPrice * item.quantity).toLocaleString('ru-RU') }} ₽
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
              <div class="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                <button
                  type="button"
                  class="px-2.5 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-40"
                  :disabled="item.quantity <= 1"
                  @click="updateQuantity(item.product.id, item.quantity - 1)"
                >
                  -
                </button>
                <span class="px-2 text-sm font-semibold min-w-[24px] text-center">
                  {{ item.quantity }}
                </span>
                <button
                  type="button"
                  class="px-2.5 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  @click="updateQuantity(item.product.id, item.quantity + 1)"
                >
                  +
                </button>
              </div>

              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
                color="error"
                size="sm"
                @click="removeFromCart(item.product.id)"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Итог заказа -->
      <div class="space-y-4">
        <UCard>
          <template #header>
            <h3 class="font-bold text-lg">Детали заказа</h3>
          </template>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Товары ({{ totalCount }} шт.)</span>
              <span class="font-medium">{{ totalPrice.toLocaleString('ru-RU') }} ₽</span>
            </div>

            <div v-if="totalDiscount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Скидка по акциям</span>
              <span>-{{ totalDiscount.toLocaleString('ru-RU') }} ₽</span>
            </div>

            <div v-if="promoDiscount > 0" class="flex justify-between text-indigo-600 dark:text-indigo-400">
              <span>Промокод SPORT10 (10%)</span>
              <span>-{{ promoDiscount.toLocaleString('ru-RU') }} ₽</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500">Доставка</span>
              <span v-if="deliveryPrice === 0" class="font-medium text-emerald-600 dark:text-emerald-400">Бесплатно</span>
              <span v-else class="font-medium">{{ deliveryPrice }} ₽</span>
            </div>

            <div v-if="deliveryPrice > 0" class="text-xs text-gray-500">
              До бесплатной доставки не хватает {{ (3000 - totalPrice).toLocaleString('ru-RU') }} ₽
            </div>

            <div class="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline">
              <span class="text-base font-bold">Итого к оплате</span>
              <span class="text-2xl font-extrabold text-primary">
                {{ Math.max(0, finalPrice - promoDiscount).toLocaleString('ru-RU') }} ₽
              </span>
            </div>

            <div class="pt-2">
              <UButton
                color="primary"
                size="xl"
                block
                class="font-semibold"
                @click="makeOrder"
              >
                Оформить заказ
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Промокод -->
        <UCard>
          <div class="flex gap-2">
            <UInput
              v-model="promoCode"
              placeholder="Промокод (SPORT10)"
              size="sm"
              class="flex-1"
              :disabled="promoApplied"
            />
            <UButton
              label="Применить"
              size="sm"
              color="neutral"
              variant="soft"
              :disabled="promoApplied || !promoCode.trim()"
              @click="applyPromo"
            />
          </div>
          <p v-if="promoApplied" class="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            Промокод применён: скидка 10%!
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
