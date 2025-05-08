// D'après le fichier init_db.py où les types sont définis
export enum ItemType {
  POTION = 1,
  PLANT = 2,
  WEAPON = 3,
  KEY = 4,
  ARMOR = 5
}

// Fonction utilitaire pour obtenir le nom d'affichage en français
export function getItemTypeName(typeId: ItemType): string {
  switch (typeId) {
    case ItemType.POTION:
      return 'Potion';
    case ItemType.PLANT:
      return 'Plante';
    case ItemType.WEAPON:
      return 'Arme';
    case ItemType.KEY:
      return 'Clé';
    case ItemType.ARMOR:
      return 'Armure';
    default:
      return 'Inconnu';
  }
}

// Fonction utilitaire pour obtenir la classe CSS associée au type d'objet
export function getItemTypeClass(typeId: ItemType): string {
  switch (typeId) {
    case ItemType.WEAPON:
      return 'badge-danger';
    case ItemType.ARMOR:
      return 'badge-info';
    case ItemType.POTION:
      return 'badge-success';
    case ItemType.PLANT:
      return 'badge-warning';
    case ItemType.KEY:
      return 'badge-secondary';
    default:
      return 'badge-secondary';
  }
}

// Fonction utilitaire pour obtenir l'icône associée au type d'objet
export function getItemTypeIcon(typeId: ItemType): string {
  switch (typeId) {
    case ItemType.WEAPON:
      return 'bi-lightning-fill';
    case ItemType.ARMOR:
      return 'bi-shield-fill';
    case ItemType.POTION:
      return 'bi-droplet-fill';
    case ItemType.PLANT:
      return 'bi-flower1';
    case ItemType.KEY:
      return 'bi-key-fill';
    default:
      return 'bi-box';
  }
}