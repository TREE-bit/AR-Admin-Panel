/**
 * 本地缓存
 */
export function useStorage() {
  const localStore = {
    set(key: string, value: any, expires = -1) {
      if (expires !== -1) {
        expires = Date.now() + expires * 1000
      }
      window.localStorage.setItem(key, JSON.stringify({ value, expires }))
    },
    get<T = string>(key: string): T | null {
      const result = window.localStorage.getItem(key)
      if (result) {
        const store = JSON.parse(result)
        if (store.expires !== -1 && store.expires < Date.now()) {
          localStore.remove(key)
          return null
        }
        return store.value
      }
      return null
    },
    remove(key: string) {
      window.localStorage.removeItem(key)
    },
  }
  return { localStore }
}
