<template>
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        
        <Alert v-if="error" type="danger">{{ error }}</Alert>
        <Alert v-if="success" type="success">{{ success }}</Alert>
        
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="form-control" 
              :class="{ 'is-invalid': submitted && !email }"
              required
            >
            <div v-if="submitted && !email" class="invalid-feedback">
              L'email est requis
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="form-control"
              :class="{ 'is-invalid': submitted && !password }"
              required
            >
            <div v-if="submitted && !password" class="invalid-feedback">
              Le mot de passe est requis
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              Se connecter
            </button>
            <p class="mt-3">
              Pas encore de compte ? <router-link to="/register">S'inscrire</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import Alert from '@/components/ui/Alert.vue'
  
  export default {
    name: 'Login',
    components: {
      Alert
    },
    setup() {
      const router = useRouter()
      const authStore = useAuthStore()
      
      const email = ref('')
      const password = ref('')
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      const submitted = ref(false)
      
      const onSubmit = async () => {
        submitted.value = true
        
        // Validation basique
        if (!email.value || !password.value) {
          return
        }
        
        loading.value = true
        error.value = ''
        
        try {
          const result = await authStore.login(email.value, password.value)
          
          if (result.success) {
            success.value = 'Connexion réussie. Redirection...'
            
            // Rediriger après un court délai
            setTimeout(() => {
              router.push('/characters')
            }, 1000)
          } else {
            error.value = result.message || 'Erreur de connexion'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors de la connexion'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      return {
        email,
        password,
        error,
        success,
        loading,
        submitted,
        onSubmit
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 150px);
  }
  
  .login-card {
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin-bottom: 1.5rem;
      text-align: center;
      color: #007bff;
    }
  }
  
  .form-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .form-control {
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      
      &:focus {
        color: #495057;
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
      
      &.is-invalid {
        border-color: #dc3545;
        
        &:focus {
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
      }
    }
    
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 80%;
      color: #dc3545;
    }
  }
  
  .form-actions {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    button {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
  </style>
  