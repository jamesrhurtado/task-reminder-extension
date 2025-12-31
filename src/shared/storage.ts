import type { AutoPromptConfig } from "./types"

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key)
    return (result[key] as T) ?? null
  },

  async set<T>(key: string, value: T) {
    await chrome.storage.local.set({ [key]: value })
  },

  async getAutoPromptDomains(): Promise<string[]> {
    const config = await this.get<AutoPromptConfig>("autoPromptConfig")
    return config?.domains ?? []
  },

  async addAutoPromptDomain(domain: string) {
    const domains = await this.getAutoPromptDomains()
    if (!domains.includes(domain)) {
      domains.push(domain)
      await this.set("autoPromptConfig", { domains })
    }
  },

  async removeAutoPromptDomain(domain: string) {
    const domains = await this.getAutoPromptDomains()
    const filtered = domains.filter(d => d !== domain)
    await this.set("autoPromptConfig", { domains: filtered })
  }
}
