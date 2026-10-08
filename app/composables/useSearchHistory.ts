/**
 * Composable для хранения последних 5 поисковых запросов.
 * Данные сохраняются в LocalStorage под ключом 'searchHistory'.
 */
export const useSearchHistory = () => {
  const history = useState<string[]>('searchHistory', () => [])
  const MAX = 5

  const load = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('searchHistory')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            history.value = parsed.slice(0, MAX)
          }
        } catch {
          localStorage.removeItem('searchHistory')
        }
      }
    }
  }

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem('searchHistory', JSON.stringify(history.value))
    }
  }

  /** Добавить запрос в историю (дубликаты поднимаются наверх) */
  const addQuery = (query: string) => {
    const q = query.trim()
    if (!q) return

    history.value = [
      q,
      ...history.value.filter(h => h.toLowerCase() !== q.toLowerCase()),
    ].slice(0, MAX)

    save()
  }

  /** Удалить один запрос */
  const removeQuery = (q: string) => {
    history.value = history.value.filter(h => h !== q)
    save()
  }

  /** Очистить всю историю */
  const clearHistory = () => {
    history.value = []
    save()
  }

  if (import.meta.client) {
    load()
  }

  return {
    history,
    addQuery,
    removeQuery,
    clearHistory,
    load,
  }
}