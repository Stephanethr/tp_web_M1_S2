<template>
    <div class="item-edit-container">
        <div class="item-edit-card">
            <h2>{{ isEditMode ? 'Modifier' : 'Ajouter' }} un objet</h2>

            <Alert v-if="error" type="danger">{{ error }}</Alert>
            <Alert v-if="success" type="success">{{ success }}</Alert>

            <form @submit.prevent="onSubmit">
                <div class="form-group">
                    <label for="name">Nom de l'objet</label>
                    <input type="text" id="name" v-model="name" class="form-control"
                        :class="{ 'is-invalid': submitted && !name }" required>
                    <div v-if="submitted && !name" class="invalid-feedback">
                        Le nom de l'objet est requis
                    </div>
                </div>

                <div class="form-group">
                    <label>Type d'objet</label>
                    <div class="item-types-container">
                        <div v-for="type in itemTypes" :key="type.id" class="item-type-card"
                            :class="{ 'selected': typeId === type.id }" @click="typeId = type.id">
                            <div class="item-type-icon">
                                <i class="bi" :class="getItemTypeIcon(type.id)"></i>
                            </div>
                            <div class="item-type-name">
                                <Badge :type="getItemTypeClass(type.id)">{{ type.type_name }}</Badge>
                            </div>
                        </div>
                    </div>

                    <div v-if="submitted && !typeId" class="invalid-feedback d-block">
                        Le type d'objet est requis
                    </div>
                </div>

                <div class="form-group">
                    <label for="quantity">Quantité</label>
                    <input type="number" id="quantity" v-model.number="quantity" class="form-control"
                        :class="{ 'is-invalid': submitted && !isValidQuantity }" min="1">
                    <div v-if="submitted && !quantity" class="invalid-feedback">
                        La quantité est requise
                    </div>
                    <div v-if="submitted && quantity && !isValidQuantity" class="invalid-feedback">
                        La quantité doit être au moins 1
                    </div>
                </div>

                <div v-if="name && typeId && isValidQuantity" class="item-preview">
                    <h3>Aperçu de l'objet</h3>
                    <div class="item-preview-content">
                        <div class="preview-name">{{ name }}</div>
                        <div class="preview-type">
                            <Badge :type="getItemTypeClass(typeId)">
                                {{ getItemTypeName(typeId) }}
                            </Badge>
                        </div>
                        <div class="preview-quantity">Quantité: {{ quantity }}</div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                        {{ isEditMode ? 'Modifier' : 'Ajouter' }} l'objet
                    </button>
                    <router-link to="/inventory" class="btn btn-secondary">Annuler</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore } from '@/store/inventory'
import { ItemType, getItemTypeName, getItemTypeClass, getItemTypeIcon } from '@/utils/enums'
import Alert from '@/components/ui/Alert.vue'
import Badge from '@/components/ui/Badge.vue'

export default {
  name: 'ItemEdit',
  components: {
    Alert,
    Badge
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const inventoryStore = useInventoryStore()
    
    const name = ref('')
    const typeId = ref(null)
    const quantity = ref(1)
    const error = ref('')
    const success = ref('')
    const loading = ref(false)
    const submitted = ref(false)
    const itemId = ref(null)
    
    // Détecter si on est en mode édition
    const isEditMode = computed(() => !!itemId.value)
    
    // Validation de la quantité
    const isValidQuantity = computed(() => {
      return quantity.value && quantity.value >= 1
    })
    
    // Charger les types d'objets au montage du composant
    onMounted(async () => {
      // Charger les types d'objets
      await inventoryStore.fetchItemTypes()
      
      // Vérifier si on est en mode édition
      const id = route.params.id
      if (id) {
        itemId.value = parseInt(id)
        loadItemDetails(itemId.value)
      } else {
        // Par défaut, sélectionner le premier type d'objet
        if (inventoryStore.itemTypes.length > 0) {
          typeId.value = inventoryStore.itemTypes[0].id
        }
      }
    })
    
    // Charger les détails d'un objet pour l'édition
    const loadItemDetails = async (id) => {
      loading.value = true
      
      try {
        // Charger l'inventaire pour trouver l'objet
        await inventoryStore.fetchInventory()
        
        // Trouver l'objet dans l'inventaire
        const item = inventoryStore.items.find(item => item.id === id)
        
        if (item) {
          name.value = item.name
          typeId.value = item.type_id
          quantity.value = item.quantity
        } else {
          error.value = 'Objet non trouvé'
        }
      } catch (err) {
        error.value = 'Une erreur est survenue lors du chargement des détails de l\'objet'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    // Soumettre le formulaire
    const onSubmit = async () => {
      submitted.value = true
      
      // Validation basique
      if (!name.value || !typeId.value || !isValidQuantity.value) {
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        let result
        
        if (isEditMode.value) {
          // Mode édition
          result = await inventoryStore.editItem(itemId.value, name.value, typeId.value, quantity.value)
        } else {
          // Mode création
          result = await inventoryStore.addItem(name.value, typeId.value, quantity.value)
        }
        
        if (result.success) {
          success.value = `Objet ${isEditMode.value ? 'modifié' : 'ajouté'} avec succès`
          
          // Rediriger après un court délai
          setTimeout(() => {
            router.push('/inventory')
          }, 1500)
        } else {
          error.value = result.message || `Erreur lors de ${isEditMode.value ? 'la modification' : 'l\'ajout'} de l'objet`
        }
      } catch (err) {
        error.value = `Une erreur est survenue lors de ${isEditMode.value ? 'la modification' : 'l\'ajout'} de l'objet`
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    return {
      name,
      typeId,
      quantity,
      error,
      success,
      loading,
      submitted,
      isEditMode,
      isValidQuantity,
      itemTypes: computed(() => inventoryStore.itemTypes),
      getItemTypeName,
      getItemTypeClass,
      getItemTypeIcon,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.item-edit-container {
    padding: 1.5rem;
}

.item-edit-card {
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;

    h2 {
        margin-bottom: 1.5rem;
        text-align: center;
        color: #007bff;
    }
}

.form-group {
    margin-bottom: 1.5rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
}

.item-types-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 15px;
}

.item-type-card {
    flex: 1 0 18%;
    min-width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #ced4da;
        background-color: #f1f3f5;
        transform: translateY(-2px);
    }

    &.selected {
        border-color: #007bff;
        background-color: rgba(0, 123, 255, 0.05);
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);

        .item-type-icon {
            color: #007bff;
        }
    }

    .item-type-icon {
        font-size: 2rem;
        margin-bottom: 10px;
        color: #6c757d;
    }

    .item-type-name {
        text-align: center;
    }
}

.item-preview {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 0.25rem;
    border: 1px solid #dee2e6;

    h3 {
        margin-bottom: 1rem;
    }
}

.item-preview-content {
    .preview-name {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .preview-type,
    .preview-quantity {
        margin-bottom: 0.5rem;
    }
}

.form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    button,
    a {
        flex: 1;
    }
}

.d-block {
    display: block;
}

@media (max-width: 576px) {
    .item-types-container {
        justify-content: center;
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>