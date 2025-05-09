<!-- src/views/inventory/InventoryList.vue -->
<template>
    <div class="inventory-container">
      <div class="inventory-header">
        <h2>Inventaire de {{ characterName }}</h2>
        <router-link to="/inventory/add" class="btn btn-primary">Ajouter un objet</router-link>
      </div>
      
      <Alert v-if="error" type="danger">{{ error }}</Alert>
      <Alert v-if="success" type="success">{{ success }}</Alert>
      
      <Loading :show="loading" message="Chargement de l'inventaire..." />
      
      <div v-if="!loading && items.length === 0" class="no-items">
        <p>Vous n'avez pas encore d'objets dans votre inventaire.</p>
        <router-link to="/inventory/add" class="btn btn-primary">Ajouter un objet</router-link>
      </div>
      
      <div v-if="!loading && items.length > 0" class="inventory-table-container">
        <table class="inventory-table">
          <thead>
            <tr>
              <th @click="sortInventory('item_name')">
                Nom
                <i class="bi" :class="getSortIcon('item_name')"></i>
              </th>
              <th @click="sortInventory('item_type')">
                Type
                <i class="bi" :class="getSortIcon('item_type')"></i>
              </th>
              <th @click="sortInventory('item_quantity')">
                Quantité
                <i class="bi" :class="getSortIcon('item_quantity')"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>
                <Badge :type="getItemTypeClass(item.type_name)">
                  {{ item.type_name }}
                </Badge>
              </td>
              <td>{{ item.quantity }}</td>
              <td class="item-actions">
                <button 
                  v-if="isConsumable(item.type_name)" 
                  class="btn btn-success btn-sm" 
                  @click="consumeItem(item.id)"
                >
                  <i class="bi bi-cup-hot"></i> Utiliser
                </button>
                <router-link :to="`/inventory/edit/${item.id}`" class="btn btn-info btn-sm">
                  <i class="bi bi-pencil"></i> Modifier
                </router-link>
                <button class="btn btn-danger btn-sm" @click="confirmDeleteItem(item.id, item.name)">
                  <i class="bi bi-trash"></i> Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal de confirmation de suppression -->
      <div v-if="showDeleteModal" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Confirmation de suppression</h4>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer l'objet "{{ itemToDelete.name }}" ?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cancelDelete">Annuler</button>
            <button class="btn btn-danger" @click="deleteItem">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useInventoryStore } from '@/store/inventory'
import Alert from '@/components/ui/Alert.vue'
import Loading from '@/components/ui/Loading.vue'
import Badge from '@/components/ui/Badge.vue'

export default {
    name: 'InventoryList',
    components: {
        Alert,
        Loading,
        Badge
    },
    setup() {
        const inventoryStore = useInventoryStore()

        const loading = ref(false)
        const error = ref('')
        const success = ref('')
        const sortBy = ref('item_name')
        const order = ref('asc')
        const showDeleteModal = ref(false)
        const itemToDelete = ref({ id: null, name: '' })

        // Fonction pour charger l'inventaire
        const loadInventory = async () => {
            loading.value = true
            error.value = ''

            try {
                await inventoryStore.fetchInventory(sortBy.value, order.value)

                if (inventoryStore.error) {
                    error.value = inventoryStore.error
                }
            } catch (err) {
                error.value = 'Une erreur est survenue lors du chargement de l\'inventaire'
                console.error(err)
            } finally {
                loading.value = false
            }
        }

        // Fonction pour trier l'inventaire
        const sortInventory = (column) => {
            if (sortBy.value === column) {
                // Inverser l'ordre si on clique sur la même colonne
                order.value = order.value === 'asc' ? 'desc' : 'asc'
            } else {
                // Sinon, définir la nouvelle colonne et réinitialiser l'ordre
                sortBy.value = column
                order.value = 'asc'
            }

            // Recharger l'inventaire avec les nouveaux paramètres de tri
            loadInventory()
        }

        // Fonction pour obtenir l'icône de tri
        const getSortIcon = (column) => {
            if (sortBy.value !== column) {
                return 'bi-sort'
            }

            return order.value === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'
        }

        // Fonction pour vérifier si un objet est consommable
        const isConsumable = (typeName) => {
            if (!typeName) return false
            return ['potion', 'plante'].includes(typeName.toLowerCase())
        }
        // pour obtenir la classe CSS du type d'objet
        const getItemTypeClass = (typeName) => {
            if (!typeName) return 'secondary'

            switch (typeName.toLowerCase()) {
                case 'potion':
                    return 'success'
                case 'arme':
                case 'weapon':
                    return 'danger'
                case 'armure':
                case 'armor':
                    return 'info'
                case 'plante':
                    return 'warning'
                default:
                    return 'secondary'
            }
        }

        // Fonction pour afficher la confirmation de suppression
        const confirmDeleteItem = (id, name) => {
            itemToDelete.value = { id, name }
            showDeleteModal.value = true
        }

        // Fonction pour annuler la suppression
        const cancelDelete = () => {
            showDeleteModal.value = false
            itemToDelete.value = { id: null, name: '' }
        }

        // Fonction pour supprimer un objet
        const deleteItem = async () => {
            if (!itemToDelete.value.id) return

            loading.value = true
            error.value = ''

            try {
                const result = await inventoryStore.deleteItem(itemToDelete.value.id)

                if (result.success) {
                    success.value = 'Objet supprimé avec succès'

                    // Effacer le message après un court délai
                    setTimeout(() => {
                        success.value = ''
                    }, 3000)
                } else {
                    error.value = result.message || 'Erreur lors de la suppression de l\'objet'
                }
            } catch (err) {
                error.value = 'Une erreur est survenue lors de la suppression de l\'objet'
                console.error(err)
            } finally {
                loading.value = false
                showDeleteModal.value = false
                itemToDelete.value = { id: null, name: '' }
            }
        }

        // Fonction pour consommer un objet
        const consumeItem = async (itemId) => {
            loading.value = true
            error.value = ''

            try {
                const result = await inventoryStore.consumeItem(itemId)

                if (result.success) {
                    success.value = result.message || 'Objet consommé avec succès'

                    // Effacer le message après un court délai
                    setTimeout(() => {
                        success.value = ''
                    }, 3000)
                } else {
                    error.value = result.message || 'Erreur lors de la consommation de l\'objet'
                }
            } catch (err) {
                error.value = 'Une erreur est survenue lors de la consommation de l\'objet'
                console.error(err)
            } finally {
                loading.value = false
            }
        }

        // Charger l'inventaire au montage du composant
        onMounted(() => {
            loadInventory()
        })

        return {
            items: computed(() => inventoryStore.items),
            characterName: computed(() => inventoryStore.characterName),
            loading,
            error,
            success,
            sortBy,
            order,
            showDeleteModal,
            itemToDelete,
            sortInventory,
            getSortIcon,
            isConsumable,
            getItemTypeClass,
            confirmDeleteItem,
            cancelDelete,
            deleteItem,
            consumeItem
        }
    }
}
</script>

<style lang="scss" scoped>
.inventory-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.no-items {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.inventory-table-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
}

.inventory-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
    }

    th {
        background-color: #f8f9fa;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #e9ecef;
        }

        i {
            margin-left: 5px;
        }
    }

    tr:last-child td {
        border-bottom: none;
    }

    .item-actions {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
    }
}

// Style pour la modale de confirmation
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

    .modal-header {
        padding: 15px;
        border-bottom: 1px solid #dee2e6;

        h4 {
            margin: 0;
        }
    }

    .modal-body {
        padding: 15px;
    }

    .modal-footer {
        padding: 15px;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

@media (max-width: 768px) {
    .inventory-header {
        flex-direction: column;
        gap: 10px;

        h2 {
            margin-bottom: 10px;
        }
    }

    .inventory-table {

        th,
        td {
            padding: 10px;
        }

        .item-actions {
            flex-direction: column;
            gap: 5px;

            .btn {
                width: 100%;
            }
        }
    }
}
</style>

