import api from './api'

export const authService = {
  login(email, password) {
    return api.post('/api/v1/auth/login/', { email, password })
  },
  
  register(username, email, password) {
    return api.post('/api/v1/auth/register/', { username, email, password })
  },
  
  getCurrentUser() {
    return api.get('/api/v1/auth/user/')
  }
}