import { Race, CharacterType } from './enums';

export interface Character {
  id: number;
  name: string;
  race: Race | string;
  type: CharacterType | string;  // Dans l'API, c'est 'class' mais on garde 'type' côté frontend pour éviter le mot-clé JS
  health: number;
  attack: number;
  defense: number;
  level: number;
  experience?: number;
  is_active?: boolean;
  items?: any[];
  user_id?: number;
}