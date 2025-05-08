import { defineStore } from 'pinia'
import { inventoryService } from '@/api/inventory'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [],
    itemTypes: [],
    characterName: '',
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchInventory(sortBy = 'item_name', order = 'asc') {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.getInventory(sortBy, order)
        
        if (response.data) {
          this.items = response.data.items || []
          this.characterName = response.data.character_name || ''
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement de l\'inventaire'
      } finally {
        this.loading = false
      }
    },
    
    async fetchItemTypes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.getItemTypes()
        
        if (response.data && response.data.item_types) {
          this.itemTypes = response.data.item_types
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des types d\'objets'
        // Utiliser des types par défaut en cas d'erreur
        this.itemTypes = [
          { id: 1, type_name: 'Potion' },
          { id: 2, type_name: 'Plante' },
          { id: 3, type_name: 'Arme' },
          { id: 4, type_name: 'Clé' },
          { id: 5, type_name: 'Armure' }
        ]
      } finally {
        this.loading = false
      }
    },
    
    async addItem(name, typeId, quantity) {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.addItem(name, typeId, quantity)
        
        if (response.data) {
          // Rafraîchir l'inventaire
          await this.fetchInventory()
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de l\'ajout de l\'objet' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'ajout de l\'objet'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async editItem(itemId, name, typeId, quantity) {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.editItem(itemId, name, typeId, quantity)
        
        if (response.data) {
          // Rafraîchir l'inventaire
          await this.fetchInventory()
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de la modification de l\'objet' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la modification de l\'objet'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async deleteItem(itemId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.deleteItem(itemId)
        
        if (response.status === 200) {
          // Rafraîchir l'inventaire
          await this.fetchInventory()
          return { success: true }
        }
        
        return { success: false, message: 'Erreur lors de la suppression de l\'objet' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de l\'objet'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async consumeItem(itemId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await inventoryService.consumeItem(itemId)
        
        if (response.data) {
          // Rafraîchir l'inventaire
          await this.fetchInventory()
          return { success: true, message: response.data.message }
        }
        
        return { success: false, message: 'Erreur lors de la consommation de l\'objet' }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la consommation de l\'objet'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})