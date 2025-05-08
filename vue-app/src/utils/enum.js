export const Race = {
    HUMAN: 'HUMAN',
    VAMPIRE: 'VAMPIRE',
    WEREWOLF: 'WEREWOLF'
  }
  
  export const CharacterType = {
    WARRIOR: 'warrior',
    MAGE: 'mage'
  }
  
  export const ItemType = {
    POTION: 1,
    PLANT: 2,
    WEAPON: 3,
    KEY: 4,
    ARMOR: 5
  }
  
  // Fonction utilitaire pour obtenir le nom d'affichage d'une race
  export function getRaceDisplayName(race) {
    switch(race) {
      case Race.HUMAN:
        return 'Humain'
      case Race.VAMPIRE:
        return 'Vampire'
      case Race.WEREWOLF:
        return 'Loup-Garou'
      default:
        return String(race)
    }
  }
  
  // Fonction utilitaire pour obtenir le nom d'affichage d'une classe de personnage
  export function getClassDisplayName(type) {
    switch(type) {
      case CharacterType.WARRIOR:
        return 'Guerrier'
      case CharacterType.MAGE:
        return 'Mage'
      default:
        return String(type)
    }
  }
  
  // Fonction utilitaire pour obtenir le nom d'affichage d'un type d'objet
  export function getItemTypeName(typeId) {
    switch (typeId) {
      case ItemType.POTION:
        return 'Potion'
      case ItemType.PLANT:
        return 'Plante'
      case ItemType.WEAPON:
        return 'Arme'
      case ItemType.KEY:
        return 'Clé'
      case ItemType.ARMOR:
        return 'Armure'
      default:
        return 'Inconnu'
    }
  }
  
  // Fonction utilitaire pour obtenir la classe CSS associée à un type d'objet
  export function getItemTypeClass(typeId) {
    switch (typeId) {
      case ItemType.WEAPON:
        return 'badge-danger'
      case ItemType.ARMOR:
        return 'badge-info'
      case ItemType.POTION:
        return 'badge-success'
      case ItemType.PLANT:
        return 'badge-warning'
      case ItemType.KEY:
        return 'badge-secondary'
      default:
        return 'badge-secondary'
    }
  }
  
  // Fonction utilitaire pour obtenir l'icône associée à un type d'objet
  export function getItemTypeIcon(typeId) {
    switch (typeId) {
      case ItemType.WEAPON:
        return 'bi-lightning-fill'
      case ItemType.ARMOR:
        return 'bi-shield-fill'
      case ItemType.POTION:
        return 'bi-droplet-fill'
      case ItemType.PLANT:
        return 'bi-flower1'
      case ItemType.KEY:
        return 'bi-key-fill'
      default:
        return 'bi-box'
    }
  }