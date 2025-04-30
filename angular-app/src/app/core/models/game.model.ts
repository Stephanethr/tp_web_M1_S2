import { Character } from './character.model';

export interface BoardElement {
  type: 'empty' | 'item' | 'enemy';
  name?: string;
  health?: number;
  attack?: number;
  effect?: string;
}

export interface GameState {
  hero: Character;
  boardLength: number;
  board: BoardElement[];
  currentPosition: number;
  isCompleted: boolean;
  isGameOver: boolean;
  gameLog: string[];
}

export interface FightResult {
  mode: 'PVP' | 'Quest';
  winner: string;
  players?: {
    player1: {
      name: string;
      originalHealth: number;
    };
    player2: {
      name: string;
      originalHealth: number;
    };
  };
  hero?: {
    name: string;
    originalHealth: number;
  };
  monster?: {
    name: string;
    originalHealth: number;
  };
  rounds: FightRound[];
}

export interface FightRound {
  round: number;
  heroHealth?: number;
  monsterHealth?: number;
  player1Health?: number;
  player2Health?: number;
  initiative?: string;
  damageToMonster?: number;
  damageToHero?: number;
  damageToPlayer1?: number;
  damageToPlayer2?: number;
  winner?: string;
}