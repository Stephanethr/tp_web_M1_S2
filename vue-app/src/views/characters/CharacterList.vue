<template>
    <div class="characters-container">
      <div class="characters-header">
        <h2>Mes Personnages</h2>
        <router-link to="/characters/create" class="btn btn-primary">Créer un nouveau personnage</router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement des personnages..." />
      
      <div v-if="!loading && characters.length === 0" class="no-characters">
        <p>Vous n'avez pas encore de personnage.</p>
        <router-link to="/characters/create" class="btn btn-primary">Créer un personnage</router-link>
      </div>
      
      <div v-if="!loading && characters.length > 0" class="character-list">
        <CharacterCard 
          v-for="character in characters" 
          :key="character.id" 
          :character="character" 
        >
          <template #actions>
            <button 
              class="btn" 
              :class="{'btn-primary': !character.is_active, 'btn-success': character.is_active}"
              :disabled="character.is_active"
              @click="selectCharacter(character.id)"
            >
              {{ character.is_active ? 'Personnage actif' : 'Sélectionner' }}
            </button>
            <router-link :to="`/character/${character.id}`" class="btn btn-outline-secondary">Détails</router-link>
          </template>
        </CharacterCard>
      </div>
      
      <!-- Section Mode de Jeu - Visible uniquement quand un personnage est sélectionné -->
      <div v-if="hasSelectedCharacter" class="game-modes-section">
        <h3>Modes de jeu</h3>
        <div class="game-modes-container">
          <div class="game-mode-card">
            <div class="mode-icon">
              <i class="bi bi-journal-text"></i>
            </div>
            <h4>Quêtes</h4>
            <p>Partez à l'aventure et relevez des défis pour gagner de l'expérience.</p>
            <router-link to="/game/quests" class="btn btn-primary">Jouer aux quêtes</router-link>
          </div>
          
          <div class="game-mode-card">
            <div class="mode-icon">
              <i class="bi bi-dice-6"></i>
            </div>
            <h4>Plateau de jeu</h4>
            <p>Avancez sur le plateau, lancez les dés et découvrez ce qui vous attend.</p>
            <router-link to="/game/board" class="btn btn-primary">Jouer au plateau</router-link>
          </div>
          
          <div class="game-mode-card">
            <div class="mode-icon">
              <i class="bi bi-lightning-charge"></i>
            </div>
            <h4>Mode Versus</h4>
            <p>Affrontez d'autres personnages dans des combats impitoyables.</p>
            <router-link to="/game/versus" class="btn btn-primary">Jouer en versus</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, computed } from 'vue'
  import { useCharacterStore } from '@/store/character'
  import Alert from '@/components/ui/Alert.vue'
  import Loading from '@/components/ui/Loading.vue'
  import CharacterCard from '@/components/game/CharacterCard.vue'
  
  export default {
    name: 'CharacterList',
    components: {
      Alert,
      Loading,
      CharacterCard
    },
    setup() {
      const characterStore = useCharacterStore()
      
      const loading = ref(false)
      const error = ref('')
      const success = ref('')
      
      const loadCharacters = async () => {
        loading.value = true
        try {
          await characterStore.fetchAllCharacters()
          if (characterStore.error) {
            error.value = characterStore.error
          }
        } catch (err) {
          error.value = 'Une erreur est survenue lors du chargement des personnages'
          console.error(err)
        } finally {
          loading.value = false
        }
      }
      
      const selectCharacter = async (characterId) => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await characterStore.selectCharacter(characterId)
          
          if (result.success) {
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
        loadCharacters()
      })
      
      return {
        characters: computed(() => characterStore.characters),
        hasSelectedCharacter: computed(() => characterStore.hasSelectedCharacter),
        loading,
        error,
        success,
        selectCharacter
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .characters-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .characters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .no-characters {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .character-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .game-modes-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #dee2e6;
    
    h3 {
      text-align: center;
      margin-bottom: 20px;
    }
  }
  
  .game-modes-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .game-mode-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 20px;
    text-align: center;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
    
    .mode-icon {
      font-size: 2rem;
      margin-bottom: 15px;
      color: #007bff;
    }
    
    h4 {
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 15px;
      color: #6c757d;
    }
  }
  
  @media (max-width: 768px) {
    .characters-header {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .character-list {
      grid-template-columns: 1fr;
    }
    
    .game-modes-container {
      grid-template-columns: 1fr;
    }
  }
  </style>