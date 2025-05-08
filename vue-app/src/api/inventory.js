import api from './api'

export const inventoryService = {
  getInventory(sortBy = 'item_name', order = 'asc') {
    return api.get(`/api/v1/inventory/?sort_by=${sortBy}&order=${order}`)
  },
  
  getItemTypes() {
    return api.get('/api/v1/inventory/types/')
  },
  
  addItem(name, type_id, quantity) {
    return api.post('/api/v1/inventory/', { name, type_id, quantity })
  },
  
  editItem(itemId, name, type_id, quantity) {
    return api.put(`/api/v1/inventory/${itemId}/`, { name, type_id, quantity })
  },
  
  deleteItem(itemId) {
    return api.delete(`/api/v1/inventory/${itemId}/`)
  },
  
  consumeItem(itemId) {
    return api.post(`/api/v1/inventory/${itemId}/consume/`)
  }
}