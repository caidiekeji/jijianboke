import { defineStore } from 'pinia'
import api from '../utils/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      siteTitle: '我的博客',
      siteDescription: '分享技术、记录生活、探索未知',
      siteKeywords: '博客, 技术, 生活, 学习',
      enableAnalytics: true,
      enableRss: true,
      enableSitemap: true
    },
    isLoading: false,
    error: null
  }),

  getters: {
    siteTitle: (state) => state.settings.siteTitle,
    siteDescription: (state) => state.settings.siteDescription,
    siteKeywords: (state) => state.settings.siteKeywords,
    enableAnalytics: (state) => state.settings.enableAnalytics,
    enableRss: (state) => state.settings.enableRss,
    enableSitemap: (state) => state.settings.enableSitemap
  },

  actions: {
    async fetchSettings() {
      try {
        this.isLoading = true
        this.error = null
        
        const response = await api.settings.getSettings()
        
        // 将设置数据转换为对象
        const settingsObj = {}
        response.data.forEach(setting => {
          // 尝试将值转换为适当的类型
          let value = setting.value
          if (value === 'true') value = true
          if (value === 'false') value = false
          settingsObj[setting.id] = value
        })
        
        this.settings = { ...this.settings, ...settingsObj }
        
        return this.settings
      } catch (error) {
        this.error = error.message || '获取设置失败'
        console.error('获取设置失败:', error)
        // 失败时使用默认设置
        return this.settings
      } finally {
        this.isLoading = false
      }
    },

    async updateSetting(key, value) {
      try {
        this.isLoading = true
        this.error = null
        
        // 确保值是字符串
        const stringValue = typeof value === 'boolean' ? value.toString() : value
        
        const response = await api.settings.updateSetting(key, { value: stringValue })
        
        // 更新本地设置
        this.settings[key] = value
        
        return response
      } catch (error) {
        this.error = error.message || '更新设置失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateSettings(settingsData) {
      try {
        this.isLoading = true
        this.error = null
        
        // 并行更新所有设置
        const updatePromises = Object.entries(settingsData).map(([key, value]) => {
          // 确保值是字符串
          const stringValue = typeof value === 'boolean' ? value.toString() : value
          return api.settings.updateSetting(key, { value: stringValue })
        })
        
        await Promise.all(updatePromises)
        
        // 更新本地设置
        this.settings = { ...this.settings, ...settingsData }
        
        return this.settings
      } catch (error) {
        this.error = error.message || '更新设置失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})