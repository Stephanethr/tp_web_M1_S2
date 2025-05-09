<template>
  <div class="app-container">
    <Header />
    
    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const authStore = useAuthStore()
    
    // Vérifier si l'utilisateur est déjà connecté (si un token est présent)
    authStore.checkAuth()
    
    return {}
  }
}
</script>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>