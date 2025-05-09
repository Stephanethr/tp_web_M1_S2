import { defineStore } from 'pinia'
import { authService } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(email, password)
        
        if (response.data && response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Stocker le token dans localStorage
          localStorage.setItem('token', response.data.token)
          
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de la connexion' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la connexion'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async register(username, email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(username, email, password)
        
        if (response.data && response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Stocker le token dans localStorage
          localStorage.setItem('token', response.data.token)
          
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de l\'inscription' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'inscription'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async checkAuth() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await authService.getCurrentUser()
        this.user = response.data
      } catch (error) {
        this.logout()
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
