export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key)
    return (result[key] as T) ?? null
  },

  async set<T>(key: string, value: T) {
    await chrome.storage.local.set({ [key]: value })
  }
}
