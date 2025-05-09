<template>
    <div class="versus-container">
      <div class="versus-header">
        <h2>Mode Versus</h2>
        <router-link to="/characters" class="btn btn-outline-secondary">Retour aux personnages</router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement du mode versus..." />
      
      <div v-if="!loading && characters.length < 2" class="no-characters">
        <p>Vous avez besoin d'au moins deux personnages pour le mode versus.</p>
        <router-link to="/characters/create" class="btn btn-primary">Créer un personnage</router-link>
      </div>
      
      <div v-if="!loading && characters.length >= 2 && !fightResult" class="versus-selection">
        <div class="versus-form">
          <div class="form-group">
            <label for="player1">Personnage 1</label>
            <select id="player1" v-model="player1Id" class="form-select">
              <option :value="null" disabled>Sélectionnez un personnage</option>
              <option v-for="character in characters" :key="character.id" :value="character.id">
                {{ character.name }} - {{ character.type === 'warrior' ? 'Guerrier' : 'Mage' }} (Niv. {{ character.level }})
              </option>
            </select>
          </div>
          
          <div class="versus-separator">VS</div>
          
          <div class="form-group">
            <label for="player2">Personnage 2</label>
            <select id="player2" v-model="player2Id" class="form-select">
              <option :value="null" disabled>Sélectionnez un personnage</option>
              <option v-for="character in characters" :key="character.id" :value="character.id">
                {{ character.name }} - {{ character.type === 'warrior' ? 'Guerrier' : 'Mage' }} (Niv. {{ character.level }})
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="player1Id && player2Id" class="versus-preview">
          <div class="character-card">
            <h3>{{ getCharacterById(player1Id)?.name }}</h3>
            <div class="character-stats">
              <div class="stat">
                <span class="stat-name">Santé:</span>
                <span class="stat-value">{{ getCharacterById(player1Id)?.health }}</span>
              </div>
              <div class="stat">
                <span class="stat-name">Attaque:</span>
                <span class="stat-value">{{ getCharacterById(player1Id)?.attack }}</span>
              </div>
              <div class="stat">
                <span class="stat-name">Défense:</span>
                <span class="stat-value">{{ getCharacterById(player1Id)?.defense }}</span>
              </div>
            </div>
          </div>
          
          <div class="versus-icon">VS</div>
          
          <div class="character-card">
            <h3>{{ getCharacterById(player2Id)?.name }}</h3>
            <div class="character-stats">
              <div class="stat">
                <span class="stat-name">Santé:</span>
                <span class="stat-value">{{ getCharacterById(player2Id)?.health }}</span>
              </div>
              <div class="stat">
                <span class="stat-name">Attaque:</span>
                <span class="stat-value">{{ getCharacterById(player2Id)?.attack }}</span>
              </div>
              <div class="stat">
                <span class="stat-name">Défense:</span>
                <span class="stat-value">{{ getCharacterById(player2Id)?.defense }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="versus-actions">
          <button 
            class="btn btn-primary" 
            :disabled="!player1Id || !player2Id || player1Id === player2Id" 
            @click="startFight"
          >
            Lancer le combat
          </button>
          <p v-if="player1Id === player2Id" class="error-message">
            Vous ne pouvez pas combattre contre vous-même
          </p>
        </div>
      </div>
      
      <div v-if="fightResult" class="fight-result">
        <h3>Résultat du combat</h3>
        
        <div class="battle-summary">
          <div class="battle-participants">
            <div class="player1">
              <h4>{{ fightResult.players?.player1?.name }}</h4>
              <div class="health-bar">
                <div class="health-progress" :style="{ width: getHealthPercent(fightResult.players?.player1?.original_health) }"></div>
              </div>
            </div>
            
            <div class="versus">VS</div>
            
            <div class="player2">
              <h4>{{ fightResult.players?.player2?.name }}</h4>
              <div class="health-bar">
                <div class="health-progress" :style="{ width: getHealthPercent(fightResult.players?.player2?.original_health) }"></div>
              </div>
            </div>
          </div>
          
          <div class="battle-rounds">
            <div v-for="(round, index) in fightResult.rounds" :key="index" class="battle-round">
              <h5>Tour {{ round.round }}</h5>
              <div class="round-details">
                <div class="player1-health">Santé de {{ fightResult.players?.player1?.name }}: {{ round.player1_health }}</div>
                <div class="player2-health">Santé de {{ fightResult.players?.player2?.name }}: {{ round.player2_health }}</div>
                
                <div v-if="round.initiative" class="initiative">
                  Initiative: {{ round.initiative }}
                </div>
                
                <div v-if="round.damage_to_player1" class="damage-taken">
                  {{ fightResult.players?.player2?.name }} inflige {{ round.damage_to_player1 }} points de dégâts à {{ fightResult.players?.player1?.name }}
                </div>
                
                <div v-if="round.damage_to_player2" class="damage-dealt">
                  {{ fightResult.players?.player1?.name }} inflige {{ round.damage_to_player2 }} points de dégâts à {{ fightResult.players?.player2?.name }}
                </div>
                
                <div v-if="round.winner" class="round-winner">
                  {{ round.winner }} remporte ce tour!
                </div>
              </div>
            </div>
          </div>
          
          <div class="battle-result">
            <h4>Résultat final</h4>
            <div class="winner">{{ fightResult.winner }} a gagné le combat!</div>
          </div>
        </div>
        
        <div class="fight-actions">
          <button class="btn btn-primary" @click="resetFight">Nouveau combat</button>
          <router-link to="/characters" class="btn btn-secondary">Retour aux personnages</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, computed } from 'vue'
  import { useGameStore } from '@/store/game'
  import Alert from '@/components/ui/Alert.vue'
  import Loading from '@/components/ui/Loading.vue'
  
  export default {
    name: 'Versus',
    components: {
      Alert,
      Loading
    },
    setup() {
      const gameStore = useGameStore()
      
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      const player1Id = ref(null)
      const player2Id = ref(null)
      
      // Charger les personnages pour le mode versus
      const loadCharacters = async () => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.startVersusMode()
          
          if (result.success) {
            // Si un personnage actif existe, le sélectionner par défaut
            const activeCharacter = gameStore.characters.find(char => char.is_active)
            if (activeCharacter) {
              player1Id.value = activeCharacter.id
              
              // Sélectionner un adversaire différent par défaut
              const opponents = gameStore.characters.filter(char => char.id !== player1Id.value)
              if (opponents.length > 0) {
                player2Id.value = opponents[0].id
              }
            } else if (gameStore.characters.length >= 2) {
              // Aucun personnage actif, sélectionner les deux premiers
              player1Id.value = gameStore.characters[0].id
              player2Id.value = gameStore.characters[1].id
            }
          } else {
            error.value = result.message || 'Erreur lors du chargement des personnages'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du chargement des personnages'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Démarrer un combat
      const startFight = async () => {
        if (!player1Id.value || !player2Id.value) {
          error.value = 'Veuillez sélectionner deux personnages pour le combat'
          return
        }
        
        if (player1Id.value === player2Id.value) {
          error.value = 'Vous ne pouvez pas combattre contre vous-même'
          return
        }
        
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.startFight(player1Id.value, player2Id.value)
          
          if (result.success) {
            // Le résultat du combat est déjà stocké dans le store
          } else {
            error.value = result.message || 'Erreur lors du lancement du combat'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du lancement du combat'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Réinitialiser le combat
      const resetFight = () => {
        gameStore.fightResult = null
      }
      
      // Obtenir un personnage par son ID
      const getCharacterById = (id) => {
        return gameStore.characters.find(char => char.id === id)
      }
      
      // Calculer le pourcentage de santé
      const getHealthPercent = (health) => {
        if (!health) return '0%'
        return `${health}%`
      }
      
      onMounted(() => {
        loadCharacters()
      })
      
      return {
        characters: computed(() => gameStore.characters),
        fightResult: computed(() => gameStore.fightResult),
        player1Id,
        player2Id,
        error,
        success,
        loading,
        getCharacterById,
        getHealthPercent,
        startFight,
        resetFight
      }
    }
  }
  </script>
  <style lang="scss" scoped>
  .versus-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .versus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
  .no-characters {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .versus-selection {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .versus-form {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    
    .form-group {
      flex: 1;
      
      label {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
      }
      
      .form-select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        
        &:focus {
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      }
    }
    
    .versus-separator {
      margin: 0 20px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #6c757d;
    }
  }
  
  .versus-preview {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    
    .character-card {
      flex: 1;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      max-width: 45%;
      
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .character-stats {
        .stat {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          
          .stat-name {
            font-weight: 600;
          }
        }
      }
    }
    
    .versus-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: #6c757d;
    }
  }
  
  .versus-actions {
    text-align: center;
    
    button {
      min-width: 200px;
      margin-bottom: 10px;
    }
    
    .error-message {
      color: #dc3545;
      font-weight: 600;
    }
  }
  
  .fight-result {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    
    h3 {
      text-align: center;
      margin-bottom: 20px;
    }
  }
  
  .battle-summary {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .battle-participants {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .versus {
      font-size: 1.5rem;
      font-weight: 600;
      color: #6c757d;
    }
    
    .player1, .player2 {
      flex: 1;
      text-align: center;
      
      h4 {
        margin-bottom: 10px;
      }
    }
  }
  
  .health-bar {
    height: 15px;
    width: 100%;
    background-color: rgba(220, 53, 69, 0.2);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  .health-progress {
    height: 100%;
    background-color: #dc3545;
    transition: width 0.8s ease;
  }
  
  .battle-rounds {
    margin: 20px 0;
  }
  
  .battle-round {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateX(5px);
      background-color: #e9ecef;
    }
    
    h5 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #6c757d;
    }
  }
  
  .round-details {
    padding: 10px;
    border-left: 3px solid #007bff;
    margin-top: 10px;
  }
  
  .initiative {
    font-weight: 600;
    margin-bottom: 5px;
    color: #6c757d;
  }
  
  .damage-dealt {
    color: #28a745;
    font-weight: 600;
    margin: 5px 0;
  }
  
  .damage-taken {
    color: #dc3545;
    font-weight: 600;
    margin: 5px 0;
  }
  
  .round-winner {
    font-weight: 700;
    color: #007bff;
    margin-top: 10px;
    text-align: center;
  }
  
  .battle-result {
    background-color: rgba(0, 123, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    text-align: center;
    
    h4 {
      margin-bottom: 10px;
    }
    
    .winner {
      font-size: 1.25rem;
      font-weight: 700;
      color: #007bff;
    }
  }
  
  .fight-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    
    button, a {
      min-width: 150px;
    }
  }
  
  @media (max-width: 768px) {
    .versus-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .versus-form {
      flex-direction: column;
      gap: 15px;
      
      .versus-separator {
        margin: 10px 0;
      }
    }
    
    .versus-preview {
      flex-direction: column;
      align-items: center;
      gap: 20px;
      
      .character-card {
        max-width: 100%;
        width: 100%;
      }
      
      .versus-icon {
        margin: 10px 0;
      }
    }
    
    .battle-participants {
      flex-direction: column;
      gap: 15px;
      
      .versus {
        margin: 10px 0;
      }
    }
    
    .fight-actions {
      flex-direction: column;
      
      button, a {
        width: 100%;
      }
    }
  }
  </style>