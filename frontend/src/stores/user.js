import { defineStore } from 'pinia'
import api from '../utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    username: (state) => state.user?.name || '未知用户',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async login(credentials) {
      try {
        this.isLoading = true
        this.error = null
        
        const response = await api.users.login(credentials)
        
        this.user = response.data.user
        this.token = response.data.token
        
        // 保存 token 到本地存储
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        this.error = error.message || '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      try {
        this.isLoading = true
        this.error = null
        
        const response = await api.users.register(userData)
        
        this.user = response.data.user
        this.token = response.data.token
        
        // 保存 token 到本地存储
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        this.error = error.message || '注册失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // 清除本地存储
        localStorage.removeItem('token')
        
        // 重置状态
        this.user = null
        this.token = null
        this.error = null
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },

    async fetchCurrentUser() {
      try {
        if (!this.token) return
        
        this.isLoading = true
        this.error = null
        
        const response = await api.users.getCurrentUser()
        this.user = response.data
        
        return response.data
      } catch (error) {
        this.error = error.message || '获取用户信息失败'
        // 如果获取用户信息失败，可能是 token 过期，清除 token
        if (error.message?.includes('登录已过期')) {
          this.logout()
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(userData) {
      try {
        this.isLoading = true
        this.error = null
        
        const response = await api.users.updateProfile(userData)
        this.user = response.data
        
        return response.data
      } catch (error) {
        this.error = error.message || '更新个人资料失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(passwordData) {
      try {
        this.isLoading = true
        this.error = null
        
        const response = await api.users.changePassword(passwordData)
        
        return response
      } catch (error) {
        this.error = error.message || '修改密码失败'
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