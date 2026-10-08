import type { Product } from '~/data/products'

/**
 * Composable для работы с избранными товарами.
 * Данные сохраняются в LocalStorage под ключом 'favorites'.
 */
export const useFavorites = () => {
  const favorites = useState<Product[]>('favorites', () => [])

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            favorites.value = parsed
          }
        } catch {
          localStorage.removeItem('favorites')
        }
      }
    }
  }

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  const isFavorite = (id: number) =>
    favorites.value.some(f => f.id === id)

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      favorites.value = favorites.value.filter(f => f.id !== product.id)
    } else {
      favorites.value = [...favorites.value, product]
    }
    save()
  }

  const clearFavorites = () => {
    favorites.value = []
    save()
  }

  const count = computed(() => favorites.value.length)

  if (import.meta.client) {
    load()
  }

  return {
    favorites,
    count,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    load,
  }
}
