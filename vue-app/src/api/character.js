import api from './api'

export const characterService = {
  getAllCharacters() {
    return api.get('/api/v1/characters/')
  },
  
  getCharacterById(id) {
    return api.get(`/api/v1/characters/${id}/`)
  },
  
  createCharacter(name, race, characterClass) {
    return api.post('/api/v1/characters/', { 
      name, 
      race, 
      class: characterClass 
    })
  },
  
  selectCharacter(characterId) {
    return api.post(`/api/v1/characters/${characterId}/select/`)
  },
  
  deleteCharacter(characterId) {
    return api.delete(`/api/v1/characters/${characterId}/`)
  }
}
