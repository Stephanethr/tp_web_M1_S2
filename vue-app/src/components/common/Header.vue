<template>
    <header class="app-header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/characters" v-if="isAuthenticated">RPG Game</router-link>
        </div>
        
        <nav class="main-nav" v-if="isAuthenticated && !isLoginPage && !isRegisterPage">
          <ul>
            <li>
              <router-link to="/characters" active-class="active">Personnages</router-link>
            </li>
            <li>
              <router-link to="/inventory" active-class="active">Inventaire</router-link>
            </li>
          </ul>
        </nav>
        
        <!-- Affichage du titre centré uniquement sur les pages de login/register -->
        <div v-if="!isAuthenticated && (isLoginPage || isRegisterPage)" class="app-title">
          RPG Game Adventure
        </div>
        
        <div class="user-actions">
          <template v-if="isAuthenticated">
            <span class="username" v-if="currentUser">{{ currentUser.username }}</span>
            <button class="btn btn-outline-danger" @click="logout">Déconnexion</button>
          </template>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  
  export default {
    name: 'Header',
    setup() {
      const route = useRoute()
      const router = useRouter()
      const authStore = useAuthStore()
      
      const isLoginPage = ref(false)
      const isRegisterPage = ref(false)
      
      // Déterminer si la page actuelle est la page de connexion ou d'inscription
      const updatePageStatus = () => {
        isLoginPage.value = route.path === '/login'
        isRegisterPage.value = route.path === '/register'
      }
      
      // Surveiller les changements de route
      watch(() => route.path, updatePageStatus)
      
      // Initialiser les états au montage du composant
      onMounted(updatePageStatus)
      
      const logout = () => {
        authStore.logout()
        router.push('/login')
      }
      
      return {
        isAuthenticated: computed(() => authStore.isAuthenticated),
        currentUser: computed(() => authStore.currentUser),
        isLoginPage,
        isRegisterPage,
        logout
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .app-header {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem 2rem;
    position: relative;
    z-index: 100;
    border-bottom: 1px solid #dee2e6;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo a {
    font-size: 1.5rem;
    font-weight: 600;
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: darken(#007bff, 10%);
    }
  }
  
  .main-nav {
    flex: 1;
    margin: 0 2rem;
    display: flex;
    justify-content: center;
    
    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0.5rem;
      
      li {
        margin: 0;
        
        a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px;
          height: 40px;
          color: white;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0.25rem;
          transition: all 0.3s ease;
          position: relative;
          background-color: #007bff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
          
          &:hover {
            color: white;
            background-color: lighten(#007bff, 10%);
            transform: translateY(-2px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          &.active {
            color: white;
            background-color: darken(#007bff, 10%);
            font-weight: 600;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
  
  .user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .username {
      font-weight: 600;
      color: #333;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      font-weight: 600;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }
  }
  
  .app-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #007bff;
    text-align: center;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-in-out;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    .main-nav {
      margin: 0;
      
      ul {
        justify-content: center;
        width: 100%;
      }
      
      a {
        width: auto;
        padding: 0.5rem;
        font-size: 0.9rem;
      }
    }
    
    .header-container {
      flex-direction: column;
      gap: 1rem;
    }
    
    .user-actions {
      width: 100%;
      justify-content: center;
    }
  }
  </style>