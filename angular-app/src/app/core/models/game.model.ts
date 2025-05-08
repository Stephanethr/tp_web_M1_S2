// Modèles pour le mode quête
export interface Quest {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    recommended_level: number;
    reward_experience?: number;
    monster_data?: any;
  }
  
  // Modèles pour les combats
  export interface CombatResult {
    mode: string;  // "PVP" ou "Quest"
    players?: {
      player1: {
        name: string;
        original_health: number;
        id: number;
      };
      player2: {
        name: string;
        original_health: number;
        id: number;
      };
    };
    hero?: {
      name: string;
      original_health: number;
    };
    monster?: {
      name: string;
      original_health: number;
    };
    rounds: CombatRound[];
    winner: string;
  }
  
  export interface CombatRound {
    round: number;
    player1_health?: number;
    player2_health?: number;
    hero_health?: number;
    monster_health?: number;
    damage_to_player1?: number;
    damage_to_player2?: number;
    damage_to_monster?: number;
    damage_to_hero?: number;
    initiative?: string;
    winner?: string;
  }
  
  // Modèles pour le jeu de plateau
  export interface BoardGame {
    length: number;
    current_position: number;
    status: string;
    board?: BoardCell[];
    is_completed?: boolean;
    is_game_over?: boolean;
  }
  
  export interface BoardCell {
    type?: string;     // "empty", "item", "enemy"
    name?: string;     // Nom de l'objet ou de l'ennemi
    health?: number;   // Pour les ennemis
    attack?: number;   // Pour les ennemis
    effect?: string;   // Pour les objets
  }
  
  // Style pour le jeu de plateau
  export interface GameStyle {
    background_color: string;
    header_color: string;
    button_color: string;
    text_color: string;
    font_family: string;
    font_size: string;
    board_border: string;
    game_title_font_size: string;
  }