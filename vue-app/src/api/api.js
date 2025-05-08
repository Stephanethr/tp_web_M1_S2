import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  return config
})

// Intercepteur pour gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Déconnecter l'utilisateur et rediriger vers la page de connexion
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api