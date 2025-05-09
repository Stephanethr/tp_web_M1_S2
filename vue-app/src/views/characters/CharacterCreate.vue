<template>
  <div class="character-create-container">
    <div class="character-create-card">
      <h2>Création de personnage</h2>

      <Alert v-if="error" type="danger">{{ error }}</Alert>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="name">Nom du personnage</label>
          <input type="text" id="name" v-model="name" class="form-control" :class="{ 'is-invalid': submitted && !name }"
            required>
          <div v-if="submitted && !name" class="invalid-feedback">
            Le nom du personnage est requis
          </div>
        </div>

        <div class="form-group">
          <label for="race">Race</label>
          <select id="race" v-model="race" class="form-select" :class="{ 'is-invalid': submitted && !race }" required>
            <option v-for="raceOption in races" :key="raceOption" :value="raceOption">
              {{ getRaceDisplayName(raceOption) }}
            </option>
          </select>
          <div v-if="submitted && !race" class="invalid-feedback">
            La race est requise
          </div>
        </div>

        <div class="form-group">
          <label for="characterClass">Classe</label>
          <select id="characterClass" v-model="characterClass" class="form-select"
            :class="{ 'is-invalid': submitted && !characterClass }" required>
            <option v-for="typeOption in characterTypes" :key="typeOption" :value="typeOption">
              {{ getClassDisplayName(typeOption) }}
            </option>
          </select>
          <div v-if="submitted && !characterClass" class="invalid-feedback">
            La classe est requise
          </div>
        </div>

        <div class="character-preview">
          <h3>Aperçu du personnage</h3>
          <div class="character-preview-content">
            <div class="preview-name">{{ name || 'Nom du personnage' }}</div>
            <div class="preview-type">
              {{ getClassDisplayName(characterClass) }}
            </div>
            <div class="preview-race">Race: {{ getRaceDisplayName(race) }}</div>

            <div class="preview-stats">
              <div class="preview-stat">
                <span>Santé:</span>
                <span class="preview-value">{{ characterClass === 'warrior' ? '100' : '80' }}</span>
              </div>
              <div class="preview-stat">
                <span>Attaque:</span>
                <span class="preview-value">{{ characterClass === 'warrior' ? '15' : '20' }}</span>
              </div>
              <div class="preview-stat">
                <span>Défense:</span>
                <span class="preview-value">{{ characterClass === 'warrior' ? '10' : '5' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Créer le personnage
          </button>
          <router-link to="/characters" class="btn btn-secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/store/character'
import { Race, CharacterType, getRaceDisplayName, getClassDisplayName } from '@/utils/enums'
import Alert from '@/components/ui/Alert.vue'

export default {
  name: 'CharacterCreate',
  components: {
    Alert
  },
  setup() {
    const router = useRouter()
    const characterStore = useCharacterStore()

    const name = ref('')
    const race = ref(Race.HUMAN)
    const characterClass = ref(CharacterType.WARRIOR)
    const error = ref('')
    const loading = ref(false)
    const submitted = ref(false)

    // Listes des options disponibles
    const races = Object.values(Race)
    const characterTypes = Object.values(CharacterType)

    const onSubmit = async () => {
      submitted.value = true

      // Validation basique
      if (!name.value || !race.value || !characterClass.value) {
        return
      }

      loading.value = true
      error.value = ''

      try {
        const result = await characterStore.createCharacter(name.value, race.value, characterClass.value)

        if (result.success) {
          // Rediriger vers la liste des personnages
          router.push('/characters')
        } else {
          error.value = result.message || 'Erreur lors de la création du personnage'
        }
      } catch (err) {
        error.value = 'Une erreur est survenue lors de la création du personnage'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      race,
      characterClass,
      races,
      characterTypes,
      error,
      loading,
      submitted,
      getRaceDisplayName,
      getClassDisplayName,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.character-create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.character-create-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;

  h2 {
    margin-bottom: 20px;
    text-align: center;
    color: #007bff;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .form-control,
  .form-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;

    &:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    &.is-invalid {
      border-color: #dc3545;

      &:focus {
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
      }
    }
  }

  .invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #dc3545;
  }
}

.character-preview {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;

  h3 {
    margin-bottom: 15px;
    font-size: 1.25rem;
  }
}

.character-preview-content {
  .preview-name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .preview-type,
  .preview-race {
    margin-bottom: 10px;
    color: #6c757d;
  }

  .preview-stats {
    margin-top: 15px;

    .preview-stat {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .preview-value {
        font-weight: 600;
      }
    }
  }
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;

  button,
  a {
    flex: 1;
    margin: 0 5px;
  }
}
</style>