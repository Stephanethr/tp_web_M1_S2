<template>
    <div class="register-container">
      <div class="register-card">
        <h2>Inscription</h2>
        
        <Alert v-if="error" type="danger">{{ error }}</Alert>
        <Alert v-if="success" type="success">{{ success }}</Alert>
        
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="form-control" 
              :class="{ 'is-invalid': submitted && !username }"
              required
            >
            <div v-if="submitted && !username" class="invalid-feedback">
              Le nom d'utilisateur est requis
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="form-control" 
              :class="{ 'is-invalid': submitted && !validEmail }"
              required
            >
            <div v-if="submitted && !email" class="invalid-feedback">
              L'email est requis
            </div>
            <div v-if="submitted && email && !validEmail" class="invalid-feedback">
              L'email n'est pas valide
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="form-control"
              :class="{ 'is-invalid': submitted && !validPassword }"
              required
            >
            <div v-if="submitted && !password" class="invalid-feedback">
              Le mot de passe est requis
            </div>
            <div v-if="submitted && password && !validPassword" class="invalid-feedback">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              class="form-control"
              :class="{ 'is-invalid': submitted && !validConfirmPassword }"
              required
            >
            <div v-if="submitted && !confirmPassword" class="invalid-feedback">
              La confirmation du mot de passe est requise
            </div>
            <div v-if="submitted && confirmPassword && !validConfirmPassword" class="invalid-feedback">
              Les mots de passe ne correspondent pas
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              S'inscrire
            </button>
            <p class="mt-3">
              Déjà un compte ? <router-link to="/login">Se connecter</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import Alert from '@/components/ui/Alert.vue'
  
  export default {
    name: 'Register',
    components: {
      Alert
    },
    setup() {
      const router = useRouter()
      const authStore = useAuthStore()
      
      const username = ref('')
      const email = ref('')
      const password = ref('')
      const confirmPassword = ref('')
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      const submitted = ref(false)
      
      // Validations
      const validEmail = computed(() => {
        return /\S+@\S+\.\S+/.test(email.value)
      })
      
      const validPassword = computed(() => {
        return password.value.length >= 6
      })
      
      const validConfirmPassword = computed(() => {
        return confirmPassword.value === password.value
      })
      
      const onSubmit = async () => {
        submitted.value = true
        
        // Validation basique
        if (!username.value || !validEmail.value || !validPassword.value || !validConfirmPassword.value) {
          return
        }
        
        loading.value = true
        error.value = ''
        
        try {
          const result = await authStore.register(username.value, email.value, password.value)
          
          if (result.success) {
            success.value = 'Compte créé avec succès. Redirection...'
            
            // Rediriger après un court délai
            setTimeout(() => {
              router.push('/characters')
            }, 1000)
          } else {
            error.value = result.message || 'Erreur lors de l\'inscription'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors de l\'inscription'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      return {
        username,
        email,
        password,
        confirmPassword,
        error,
        success,
        loading,
        submitted,
        validEmail,
        validPassword,
        validConfirmPassword,
        onSubmit
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 150px);
  }
  
  .register-card {
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