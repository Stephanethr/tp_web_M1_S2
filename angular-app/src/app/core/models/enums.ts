// Les races d'après le fichier game.py
export enum Race {
  HUMAN = 'HUMAN',
  VAMPIRE = 'VAMPIRE',
  WEREWOLF = 'WEREWOLF',
}

// Conversion des races pour l'affichage
export function getRaceDisplayName(race: Race | string): string {
  switch(race) {
    case Race.HUMAN:
      return 'Humain';
    case Race.VAMPIRE:
      return 'Vampire';
    case Race.WEREWOLF:
      return 'Loup-Garou';
    default:
      return String(race);
  }
}

// Les classes de personnage d'après le fichier game.py
export enum CharacterType {
  WARRIOR = 'warrior',
  MAGE = 'mage'
}

// Conversion des classes pour l'affichage
export function getClassDisplayName(type: CharacterType | string): string {
  switch(type) {
    case CharacterType.WARRIOR:
      return 'Guerrier';
    case CharacterType.MAGE:
      return 'Mage';
    default:
      return String(type);
  }
}