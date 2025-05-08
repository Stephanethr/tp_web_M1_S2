import api from './api'

export const gameService = {
  // Jeu de plateau
  startBoardGame() {
    return api.get('/api/v1/game/board/')
  },
  
  playBoardGameTurn(current_position) {
    return api.post('/api/v1/game/board/play/', { current_position })
  },
  
  // Mode quête
  startQuestMode() {
    return api.get('/api/v1/game/quests/')
  },
  
  startQuest(questId) {
    return api.post(`/api/v1/game/quests/${questId}/`)
  },
  
  // Mode versus
  startVersusMode() {
    return api.get('/api/v1/game/versus/')
  },
  
  startFight(player1Id, player2Id) {
    return api.post('/api/v1/game/versus/fight/', {
      player1: player1Id,
      player2: player2Id
    })
  }
}