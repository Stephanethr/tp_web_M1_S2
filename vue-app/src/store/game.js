// Suite du store/game.js
import { defineStore } from 'pinia'
import { gameService } from '@/api/game'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Jeu de plateau
    boardGame: null,
    gameResult: '',
    // Mode quête
    quests: [],
    questResult: null,
    // Mode versus
    characters: [],
    fightResult: null,
    // Commun
    character: null,
    loading: false,
    error: null
  }),
  
  actions: {
    // Jeu de plateau
    async startBoardGame() {
      this.loading = true
      this.error = null
      this.gameResult = ''
      
      try {
        const response = await gameService.startBoardGame()
        
        if (response.data) {
          this.character = response.data.character
          this.boardGame = {
            board: Array(response.data.board.length).fill(null), // Tableau vide initialement
            current_position: response.data.board.current_position,
            length: response.data.board.length,
            is_completed: false,
            is_game_over: false
          }
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors du chargement du jeu de plateau' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du jeu de plateau'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async playBoardGameTurn(direction) {
      this.loading = true
      this.error = null
      
      try {
        // Extraire la position si direction est au format 'forward_X'
        const currentPosition = direction.startsWith('forward_') 
          ? parseInt(direction.split('_')[1]) || 0 
          : this.boardGame?.current_position || 0
        
        const response = await gameService.playBoardGameTurn(currentPosition)
        
        if (response.data) {
          // Mettre à jour le personnage
          if (response.data.character) {
            this.character = response.data.character
          }
          
          // Mettre à jour l'état du jeu
          this.boardGame = {
            board: Array(response.data.board.length).fill(null), // Encore un tableau vide
            current_position: response.data.board.current_position,
            length: response.data.board.length,
            is_completed: response.data.board.status === 'completed',
            is_game_over: response.data.board.status === 'game_over'
          }
          
          // Ajouter au résultat du jeu
          this.gameResult += (this.gameResult ? '\n' : '') + (response.data.turn_result || '')
          
          return { 
            success: true, 
            is_completed: this.boardGame.is_completed,
            is_game_over: this.boardGame.is_game_over,
            level_up: response.data.level_up
          }
        }
        
        return { success: false, message: 'Erreur lors du tour de jeu' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du tour de jeu'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Mode quête
    async startQuestMode() {
      this.loading = true
      this.error = null
      this.questResult = null
      
      try {
        const response = await gameService.startQuestMode()
        
        if (response.data) {
          this.character = response.data.character
          this.quests = response.data.quests.map(quest => ({
            id: quest.id,
            name: quest.name,
            description: quest.description,
            difficulty: quest.difficulty,
            recommended_level: quest.recommended_level,
            monster: 'Monstre de niveau ' + quest.difficulty, // Information générique
            reward: `${quest.recommended_level * 20} XP` // Estimation
          }))
          
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors du chargement des quêtes' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des quêtes'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async startQuest(questId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await gameService.startQuest(questId)
        
        if (response.data) {
          this.questResult = response.data
          // Si la réponse contient des informations sur le personnage, les mettre à jour
          if (response.data.character) {
            this.character = response.data.character
          }
          
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors du lancement de la quête' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du lancement de la quête'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Mode versus
    async startVersusMode() {
      this.loading = true
      this.error = null
      this.fightResult = null
      
      try {
        const response = await gameService.startVersusMode()
        
        if (response.data && response.data.characters) {
          this.characters = response.data.characters
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors du chargement du mode versus' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du mode versus'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async startFight(player1Id, player2Id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await gameService.startFight(player1Id, player2Id)
        
        if (response.data) {
          this.fightResult = response.data.result || response.data
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors du lancement du combat' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du lancement du combat'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Réinitialiser les états
    resetGameStates() {
      this.boardGame = null
      this.gameResult = ''
      this.questResult = null
      this.fightResult = null
    }
  }
})