export enum Race {
    HUMAN = 'HUMAN',
    VAMPIRE = 'VAMPIRE',
    WEREWOLF = 'WEREWOLF'
  }
  
  export enum CharacterType {
    WARRIOR = 'warrior',
    MAGE = 'mage'
  }
  
  export interface Character {
    id?: number;
    name: string;
    race: Race;
    type: CharacterType;
    health: number;
    attack: number;
    defense: number;
    level: number;
    userId?: number;
  }