<template>
    <div class="character-profile-container">
      <div class="character-profile-header">
        <router-link to="/characters" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Retour à la liste
        </router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement du personnage..." />
      
      <div v-if="!loading && character" class="character-card">
        <div class="character-header">
          <h2>{{ character.name }}</h2>
          <div class="character-badges">
            <Badge :type="character.type === 'warrior' ? 'warrior' : 'mage'">
              {{ character.type === 'warrior' ? 'Guerrier' : 'Mage' }}
            </Badge>
            <Badge type="level">Niveau {{ character.level }}</Badge>
            <Badge v-if="isActive" type="active">Personnage actif</Badge>
          </div>
          
          <!-- Bouton pour sélectionner le personnage s'il n'est pas actif -->
          <button v-if="!isActive" class="btn btn-success mt-2" @click="selectCharacter">
            <i class="bi bi-check-circle"></i> Sélectionner ce personnage
          </button>
        </div>
        
        <div class="character-info">
          <div class="character-avatar">
            <!-- Avatar placeholder, you can replace with actual images based on class/race -->
            <div class="avatar-placeholder" :class="character.type === 'warrior' ? 'avatar-warrior' : 'avatar-mage'">
              <i class="bi" :class="character.type === 'warrior' ? 'bi-shield-fill' : 'bi-magic'"></i>
            </div>
            <p class="race-name">{{ character.race }}</p>
          </div>
          
          <div class="character-stats">
            <h3>Statistiques</h3>
            
            <div class="stat-container">
              <div class="stat-label">Santé</div>
              <div class="progress">
                <div class="progress-bar bg-danger" :style="{ width: `${character.health}%` }"></div>
              </div>
              <div class="stat-value">{{ character.health }}/100</div>
            </div>
            
            <div class="stat-container">
              <div class="stat-label">Attaque</div>
              <div class="progress">
                <div class="progress-bar bg-primary" :style="{ width: `${character.attack * 5}%` }"></div>
              </div>
              <div class="stat-value">{{ character.attack }}</div>
            </div>
            
            <div class="stat-container">
              <div class="stat-label">Défense</div>
              <div class="progress">
                <div class="progress-bar bg-success" :style="{ width: `${character.defense * 10}%` }"></div>
              </div>
              <div class="stat-value">{{ character.defense }}</div>
            </div>
          </div>
        </div>
        
        <!-- Ajout d'une section pour les modes de jeu -->
        <div class="character-actions">
          <h3>Actions disponibles</h3>
          
          <!-- Button pour accéder à l'inventaire -->
          <div class="action-group">
            <router-link to="/inventory" class="btn btn-primary">
              <i class="bi bi-briefcase"></i> Voir l'inventaire
            </router-link>
          </div>
          
          <!-- Boutons pour les modes de jeu -->
          <div class="game-modes">
            <h4>Modes de jeu</h4>
            <div class="game-buttons">
              <router-link to="/game/quests" class="btn btn-success">
                <i class="bi bi-journal-text"></i> Quêtes
              </router-link>
              
              <router-link to="/game/board" class="btn btn-info">
                <i class="bi bi-dice-6"></i> Plateau de jeu
              </router-link>
              
              <router-link to="/game/versus" class="btn btn-warning">
                <i class="bi bi-lightning-charge"></i> Versus
              </router-link>
            </div>
            <p v-if="!isActive" class="mt-2 text-muted">
              <i class="bi bi-info-circle"></i> Note: Si vous n'avez pas encore sélectionné ce personnage, il sera automatiquement défini comme personnage actif lorsque vous accéderez à un mode de jeu.
            </p>
          </div>
          
          <!-- Bouton pour retourner à la liste des personnages et en sélectionner un autre -->
          <div class="action-group mt-4">
            <router-link to="/characters" class="btn btn-outline-secondary">
              <i class="bi bi-people"></i> Choisir un autre personnage
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useCharacterStore } from '@/store/character'
  import Alert from '@/components/ui/Alert.vue'
  import Loading from '@/components/ui/Loading.vue'
  import Badge from '@/components/ui/Badge.vue'
  
  export default {
    name: 'CharacterProfile',
    components: {
      Alert,
      Loading,
      Badge
    },
    setup() {
      const route = useRoute()
      const router = useRouter()
      const characterStore = useCharacterStore()
      
      const character = ref(null)
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      
      const loadCharacter = async () => {
        const characterId = parseInt(route.params.id)
        if (!characterId) {
          error.value = 'Aucun personnage sélectionné'
          return
        }
        
        loading.value = true
        try {
          const loadedCharacter = await characterStore.fetchCharacterById(characterId)
          if (loadedCharacter) {
            character.value = loadedCharacter
          } else {
            error.value = 'Personnage non trouvé'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du chargement du personnage'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      const selectCharacter = async () => {
        if (!character.value) return
        
        loading.value = true
        error.value = ''
        success.value = ''
        
        try {
          const result = await characterStore.selectCharacter(character.value.id)
          
          if (result.success) {
            // Mettre à jour le statut actif du personnage localement
            character.value.is_active = true
            success.value = 'Personnage sélectionné avec succès'
            
            // Effacer le message après un court délai
            setTimeout(() => {
              success.value = ''
            }, 3000)
          } else {
            error.value = result.message || 'Erreur lors de la sélection du personnage'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors de la sélection du personnage'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      onMounted(() => {
        loadCharacter()
      })
      
      return {
        character,
        isActive: computed(() => character.value?.is_active),
        error,
        success,
        loading,
        selectCharacter
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .character-profile-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .character-profile-header {
    margin-bottom: 20px;
  }
  
  .character-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .character-header {
    padding: 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    
    h2 {
      margin-bottom: 10px;
    }
    
    .character-badges {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
  }
  
  .character-info {
    display: flex;
    padding: 20px;
    gap: 30px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .character-avatar {
    flex: 0 0 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media (max-width: 768px) {
      margin: 0 auto 20px;
    }
    
    .avatar-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      margin-bottom: 10px;
      
      &.avatar-warrior {
        background-color: rgba(220, 53, 69, 0.1);
        color: #dc3545;
      }
      
      &.avatar-mage {
        background-color: rgba(0, 123, 255, 0.1);
        color: #007bff;
      }
    }
    
    .race-name {
      font-weight: 600;
      color: #6c757d;
    }
  }
  
  .character-stats {
    flex: 1;
    
    h3 {
      margin-bottom: 15px;
      font-size: 1.3rem;
    }
    
    .stat-container {
      margin-bottom: 15px;
      
      .stat-label {
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .progress {
        height: 12px;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.1);
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        margin-bottom: 5px;
      }
      
      .progress-bar {
        transition: width 0.8s ease;
      }
      
      .stat-value {
        text-align: right;
        font-size: 14px;
        color: #6c757d;
      }
    }
  }
  
  .character-actions {
    padding: 20px;
    border-top: 1px solid #dee2e6;
    
    h3 {
      margin-bottom: 15px;
      font-size: 1.3rem;
    }
    
    h4 {
      margin: 15px 0 10px;
      font-size: 1.1rem;
      color: #6c757d;
    }
    
    .action-group {
      margin-bottom: 15px;
    }
    
    .game-modes {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .game-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
        
        .btn {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
  </style>