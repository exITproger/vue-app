import type { Product } from '~/data/products'

export interface CartItem {
  product: Product
  quantity: number
}

/**
 * Composable корзины покупок.
 * Хранит список товаров с количеством в LocalStorage.
 */
export const useCart = () => {
  const items = useState<CartItem[]>('cart_items', () => [])

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('cart')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            items.value = parsed
          }
        } catch {
          localStorage.removeItem('cart')
        }
      }
    }
  }

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value))
    }
  }

  const isInCart = (productId: number) => {
    return items.value.some(i => i.product.id === productId)
  }

  const getItem = (productId: number) => {
    return items.value.find(i => i.product.id === productId)
  }

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    save()
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      save()
    }
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(i => i.product.id !== productId)
    save()
  }

  const clearCart = () => {
    items.value = []
    save()
  }

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const totalDiscount = computed(() =>
    items.value.reduce((sum, item) => {
      if (item.product.oldPrice) {
        return sum + (item.product.oldPrice - item.product.price) * item.quantity
      }
      return sum
    }, 0)
  )

  if (import.meta.client) {
    load()
  }

  return {
    items,
    totalCount,
    totalPrice,
    totalDiscount,
    isInCart,
    getItem,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    load,
  }
}
