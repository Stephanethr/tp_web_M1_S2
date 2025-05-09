import { defineStore } from 'pinia'
import { characterService } from '@/api/character'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    characters: [],
    activeCharacter: null,
    loading: false,
    error: null
  }),
  
  getters: {
    hasSelectedCharacter: (state) => !!state.activeCharacter,
    getCharacterById: (state) => (id) => state.characters.find(char => char.id === id)
  },
  
  actions: {
    async fetchAllCharacters() {
      this.loading = true
      this.error = null
      
      try {
        const response = await characterService.getAllCharacters()
        
        if (response.data && response.data.characters) {
          this.characters = response.data.characters
          
          // Trouver le personnage actif
          const activeChar = this.characters.find(char => char.is_active)
          if (activeChar) {
            this.activeCharacter = activeChar
          }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des personnages'
      } finally {
        this.loading = false
      }
    },
    
    async fetchCharacterById(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await characterService.getCharacterById(id)
        
        if (response.data && response.data.character) {
          const character = response.data.character
          
          // Mettre à jour le personnage dans la liste si présent
          const index = this.characters.findIndex(char => char.id === character.id)
          if (index !== -1) {
            this.characters[index] = character
          } else {
            this.characters.push(character)
          }
          
          return character
        }
        
        return null
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du personnage'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async createCharacter(name, race, characterClass) {
      this.loading = true
      this.error = null
      
      try {
        const response = await characterService.createCharacter(name, race, characterClass)
        
        if (response.data && response.data.character) {
          const newCharacter = response.data.character
          this.characters.push(newCharacter)
          this.activeCharacter = newCharacter
          
          return { success: true, character: newCharacter }
        }
        
        return { success: false, message: 'Erreur lors de la création du personnage' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création du personnage'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async selectCharacter(characterId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await characterService.selectCharacter(characterId)
        
        if (response.data && response.status === 200) {
          // Mettre à jour les états des personnages
          this.characters.forEach(char => {
            char.is_active = char.id === characterId
          })
          
          // Définir le personnage actif
          this.activeCharacter = this.characters.find(char => char.id === characterId) || null
          
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de la sélection du personnage' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la sélection du personnage'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})