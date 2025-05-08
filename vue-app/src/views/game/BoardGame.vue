<template>
    <div class="board-game-container" :style="{'background-color': styleData.background_color}">
      <div class="board-game-header" :style="{'color': styleData.header_color}">
        <h2 :style="{'font-size': styleData.game_title_font_size}">Jeu de Plateau</h2>
        <router-link to="/characters" class="btn btn-outline-secondary">Retour aux personnages</router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement du jeu..." />
      
      <div v-if="!loading && character && boardGame" class="board-game-content" :style="{'color': styleData.text_color, 'font-family': styleData.font_family, 'font-size': styleData.font_size}">
        <div class="character-info">
          <h3>{{ character.name }}</h3>
          <div class="character-stats">
            <div class="stat">
              <span class="stat-name">Santé:</span>
              <span class="stat-value">{{ character.health }}/100</span>
            </div>
            <div class="stat">
              <span class="stat-name">Niveau:</span>
              <span class="stat-value">{{ character.level }}</span>
            </div>
          </div>
        </div>
        
        <!-- Plateau de jeu avec le composant -->
        <BoardGameComponent 
          :board="boardGame.board"
          :current-position="boardGame.current_position"
          :board-length="boardGame.length"
          :disabled="loading || boardGame.is_completed || boardGame.is_game_over"
          @roll="handleRoll"
        />
        
        <!-- Journal de jeu -->
        <div class="game-result" :style="{'color': styleData.text_color}">
          <h3>Déroulement du jeu</h3>
          <pre class="game-log">{{ gameResult }}</pre>
          
          <div class="game-status">
            <div v-if="boardGame.is_completed" class="game-completed">
              <h4>Félicitations !</h4>
              <p>Vous avez terminé le plateau avec succès !</p>
            </div>
            
            <div v-if="boardGame.is_game_over" class="game-over">
              <h4>Game Over</h4>
              <p>Votre personnage est mort durant le jeu.</p>
            </div>
          </div>
        </div>
        
        <div class="game-actions">
          <button 
            class="btn" 
            :style="{'background-color': styleData.button_color, 'color': styleData.text_color}" 
            @click="restartGame"
          >
            Rejouer
          </button>
          <router-link to="/characters" class="btn btn-secondary">Retour aux personnages</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '@/store/game'
  import Alert from '@/components/ui/Alert.vue'
  import Loading from '@/components/ui/Loading.vue'
  import BoardGameComponent from '@/components/game/BoardGame.vue'
  
  export default {
    name: 'BoardGame',
    components: {
      Alert,
      Loading,
      BoardGameComponent
    },
    setup() {
      const router = useRouter()
      const gameStore = useGameStore()
      
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      const styleData = ref(getDefaultStyleData())
      
      // Démarrer le jeu
      const startGame = async () => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.startBoardGame()
          
          if (result.success) {
            success.value = 'Jeu de plateau chargé avec succès'
            
            // Effacer le message après un court délai
            setTimeout(() => {
              success.value = ''
            }, 2000)
          } else {
            error.value = result.message || 'Erreur lors du chargement du jeu de plateau'
            
            // Si le problème est lié au personnage actif, rediriger vers la liste des personnages
            if (result.message && result.message.includes('personnage actif')) {
              setTimeout(() => {
                router.push('/characters')
              }, 2000)
            }
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du chargement du jeu'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Gérer le lancer de dé et le déplacement
      const handleRoll = async (diceValue) => {
        if (loading.value || !gameStore.boardGame) return
        
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.playBoardGameTurn(`forward_${diceValue}`)
          
          if (result.success) {
            // Si le joueur a monté de niveau, afficher un message
            if (result.level_up) {
              success.value = 'Vous avez gagné un niveau !'
              
              // Effacer le message après un court délai
              setTimeout(() => {
                success.value = ''
              }, 3000)
            }
          } else {
            error.value = result.message || 'Erreur lors du tour de jeu'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du tour de jeu'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Redémarrer le jeu
      const restartGame = () => {
        gameStore.resetGameStates()
        startGame()
      }
      
      // Styles par défaut
      const getDefaultStyleData = () => {
        return {
          "background_color": "#282c34",
          "header_color": "#61dafb",
          "button_color": "#ff5733",
          "text_color": "#ffffff",
          "font_family": "Arial, sans-serif",
          "font_size": "16px",
          "board_border": "2px solid #61dafb",
          "game_title_font_size": "2rem"
        }
      }
      
      onMounted(() => {
        startGame()
      })
      
      return {
        character: computed(() => gameStore.character),
        boardGame: computed(() => gameStore.boardGame),
        gameResult: computed(() => gameStore.gameResult),
        styleData,
        error,
        success,
        loading,
        handleRoll,
        restartGame
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .board-game-container {
    min-height: calc(100vh - 150px);
    padding: 20px;
    transition: background-color 0.3s ease;
  }
  
  .board-game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
  .board-game-content {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .character-info {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .character-stats {
      display: flex;
      gap: 20px;
      
      .stat {
        .stat-name {
          font-weight: 600;
          margin-right: 5px;
        }
      }
    }
  }
  
  .game-result {
    margin-top: 30px;
    
    h3 {
      margin-bottom: 15px;
    }
    
    .game-log {
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-family: monospace;
      overflow-y: auto;
      max-height: 300px;
      white-space: pre-wrap;
    }
    
    .game-status {
      margin-top: 20px;
      text-align: center;
      
      h4 {
        font-size: 1.5rem;
        margin-bottom: 10px;
      }
      
      .game-completed {
        color: #28a745;
      }
      
      .game-over {
        color: #dc3545;
      }
    }
  }
  
  .game-actions {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 20px;
    
    button, a {
      min-width: 120px;
    }
  }
  
  @media (max-width: 768px) {
    .board-game-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .character-stats {
      flex-direction: column;
      gap: 5px !important;
    }
    
    .game-actions {
      flex-direction: column;
      align-items: center;
      
      button, a {
        width: 100%;
      }
    }
  }
  </style>