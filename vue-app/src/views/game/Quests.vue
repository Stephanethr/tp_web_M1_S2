<template>
    <div class="quests-container">
      <div class="quests-header">
        <h2>Quêtes disponibles</h2>
        <router-link to="/characters" class="btn btn-outline-secondary">Retour aux personnages</router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement des quêtes..." />
      
      <div v-if="!character && !loading" class="no-character">
        <p>Vous devez d'abord sélectionner un personnage pour accéder aux quêtes.</p>
        <router-link to="/characters" class="btn btn-primary">Sélectionner un personnage</router-link>
      </div>
      
      <div v-if="character && !loading && !questResult" class="quests-list">
        <div class="character-info">
          <h3>{{ character.name }}</h3>
          <div class="character-stats">
            <div class="stat">
              <span class="stat-name">Santé:</span>
              <span class="stat-value">{{ character.health }}/100</span>
            </div>
            <div class="stat">
              <span class="stat-name">Attaque:</span>
              <span class="stat-value">{{ character.attack }}</span>
            </div>
            <div class="stat">
              <span class="stat-name">Défense:</span>
              <span class="stat-value">{{ character.defense }}</span>
            </div>
          </div>
        </div>
        
        <div class="quests-grid">
          <div v-for="quest in quests" :key="quest.id" class="quest-card">
            <div class="quest-card-header">
              <h3>{{ quest.name }}</h3>
              <span class="quest-difficulty" :class="'difficulty-' + quest.difficulty">
                {{ getDifficultyText(quest.difficulty) }}
              </span>
            </div>
            
            <div class="quest-card-body">
              <p>{{ quest.description }}</p>
              <p>Monstre: {{ quest.monster || "Inconnu" }}</p>
              <p>Récompense: {{ quest.reward || "Expérience" }}</p>
              <p>Niveau recommandé: {{ quest.recommended_level }}</p>
            </div>
            
            <div class="quest-card-footer">
              <button class="btn btn-primary" @click="startQuest(quest.id)">Démarrer la quête</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="questResult" class="quest-result">
        <h3>Résultat de la quête</h3>
        
        <div class="battle-summary">
          <div class="battle-participants">
            <div class="hero">
              <h4>{{ questResult.hero?.name }}</h4>
              <div class="health-bar">
                <div class="health-progress" :style="{ width: getHealthPercent(questResult.hero?.original_health) }"></div>
              </div>
            </div>
            
            <div class="versus">VS</div>
            
            <div class="monster">
              <h4>{{ questResult.monster?.name }}</h4>
              <div class="health-bar">
                <div class="health-progress" :style="{ width: getHealthPercent(questResult.monster?.original_health) }"></div>
              </div>
            </div>
          </div>
          
          <div class="battle-rounds">
            <div v-for="(round, index) in questResult.rounds" :key="index" class="battle-round">
              <h5>Tour {{ round.round }}</h5>
              <div class="round-details">
                <div class="hero-health">Santé du héros: {{ round.hero_health }}</div>
                <div class="monster-health">Santé du monstre: {{ round.monster_health }}</div>
                
                <div v-if="round.damage_to_monster" class="damage-dealt">
                  {{ questResult.hero?.name }} inflige {{ round.damage_to_monster }} points de dégâts à {{ questResult.monster?.name }}
                </div>
                
                <div v-if="round.damage_to_hero" class="damage-taken">
                  {{ questResult.monster?.name }} inflige {{ round.damage_to_hero }} points de dégâts à {{ questResult.hero?.name }}
                </div>
                
                <div v-if="round.winner" class="round-winner">
                  {{ round.winner }} remporte ce tour!
                </div>
              </div>
            </div>
          </div>
          
          <div class="battle-result">
            <h4>Résultat final</h4>
            <div class="winner">{{ questResult.winner }} a gagné le combat!</div>
            
            <div v-if="questResult.character" class="character-update">
              <h5>Mise à jour du personnage</h5>
              <div class="updated-stats">
                <div class="stat">
                  <span class="stat-name">Santé:</span>
                  <span class="stat-value">{{ questResult.character.health }}/100</span>
                </div>
                <div class="stat">
                  <span class="stat-name">Niveau:</span>
                  <span class="stat-value">{{ questResult.character.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quest-actions">
          <button class="btn btn-primary" @click="resetQuest">Nouvelle quête</button>
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
  
  export default {
    name: 'Quests',
    components: {
      Alert,
      Loading
    },
    setup() {
      const router = useRouter()
      const gameStore = useGameStore()
      
      const error = ref('')
      const success = ref('')
      const loading = ref(false)
      
      // Charger les quêtes
      const loadQuestData = async () => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.startQuestMode()
          
          if (result.success) {
            success.value = 'Quêtes chargées avec succès'
            
            // Effacer le message après un court délai
            setTimeout(() => {
              success.value = ''
            }, 2000)
          } else {
            error.value = result.message || 'Erreur lors du chargement des quêtes'
            
            // Si le problème est lié au personnage actif, rediriger vers la liste des personnages
            if (result.message && result.message.includes('personnage actif')) {
              setTimeout(() => {
                router.push('/characters')
              }, 2000)
            }
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du chargement des quêtes'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Démarrer une quête
      const startQuest = async (questId) => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await gameStore.startQuest(questId)
          
          if (result.success) {
            // Le questResult sera automatiquement mis à jour dans le store
          } else {
            error.value = result.message || 'Erreur lors du lancement de la quête'
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du lancement de la quête'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      // Réinitialiser le résultat de la quête
      const resetQuest = () => {
        gameStore.questResult = null
        loadQuestData() // Recharger les données pour avoir le personnage à jour
      }
      
      // Utilitaires
      const getDifficultyText = (difficulty) => {
        switch (parseInt(difficulty)) {
          case 1: return 'Facile'
          case 2: return 'Moyen'
          case 3: return 'Difficile'
          default: return 'Inconnu'
        }
      }
      
      const getHealthPercent = (health) => {
        if (!health) return '0%'
        return `${health}%`
      }
      
      onMounted(() => {
        loadQuestData()
      })
      
      return {
        character: computed(() => gameStore.character),
        quests: computed(() => gameStore.quests),
        questResult: computed(() => gameStore.questResult),
        error,
        success,
        loading,
        getDifficultyText,
        getHealthPercent,
        startQuest,
        resetQuest
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .quests-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .quests-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
  .no-character {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .character-info {
    background-color: #f8f9fa;
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
  
  .quests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .quest-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
  }
  
  .quest-card-header {
    padding: 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
    }
  }
  
  .quest-difficulty {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .difficulty-1 {
    background-color: #28a745;
    color: white;
  }
  
  .difficulty-2 {
    background-color: #ffc107;
    color: #212529;
  }
  
  .difficulty-3 {
    background-color: #dc3545;
    color: white;
  }
  
  .quest-card-body {
    padding: 15px;
    
    p {
      margin-bottom: 8px;
    }
  }
  
  .quest-card-footer {
    padding: 15px;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: center;
  }
  
  .quest-result {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
    
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
    
    .hero, .monster {
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
      margin-bottom: 15px;
    }
    
    .character-update {
      margin-top: 20px;
      text-align: left;
      
      h5 {
        margin-bottom: 10px;
      }
      
      .updated-stats {
        display: flex;
        justify-content: space-around;
        
        .stat {
          .stat-name {
            font-weight: 600;
            margin-right: 5px;
          }
        }
      }
    }
  }
  
  .quest-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    
    button, a {
      min-width: 150px;
    }
  }
  
  @media (max-width: 768px) {
    .quests-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .quests-grid {
      grid-template-columns: 1fr;
    }
    
    .character-stats {
      flex-direction: column;
      gap: 5px !important;
    }
    
    .battle-participants {
      flex-direction: column;
      gap: 15px;
      
      .versus {
        margin: 10px 0;
      }
    }
    
    .quest-actions {
      flex-direction: column;
      
      button, a {
        width: 100%;
      }
    }
  }
  </style>