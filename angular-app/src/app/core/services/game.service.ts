import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Méthode pour démarrer le jeu de plateau
  startBoardGame(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/game/board/`)
      .pipe(
        map(response => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            character: response.character,
            game_state: {
              board: Array(response.board.length).fill(null), // Créer un tableau vide pour le plateau
              current_position: response.board.current_position,
              length: response.board.length,
              is_completed: false,
              is_game_over: false
            },
            style_data: this.getDefaultStyleData(),
            message: response.message
          };
        })
      );
  }

  // Méthode pour jouer un tour de jeu de plateau
  playBoardGameTurn(direction: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/game/board/play/`, { 
      current_position: parseInt(direction.split('_')[1]) || 0
    }).pipe(
      map(response => {
        // Adapter la réponse de l'API au format attendu par les composants
        return {
          success: true,
          character: response.character,
          game_state: {
            board: Array(response.board.length).fill(null), // Créer un tableau vide pour le plateau
            current_position: response.board.current_position,
            length: response.board.length,
            is_completed: response.board.status === 'completed',
            is_game_over: response.board.status === 'game_over'
          },
          turn_result: response.turn_result,
          level_up: response.level_up
        };
      })
    );
  }

  // Méthode pour démarrer le mode quête
  startQuestMode(): Observable<any> {
    // Route pour obtenir la liste des quêtes disponibles
    return this.http.get<any>(`${this.apiUrl}/api/v1/game/quests/`)
      .pipe(
        map(response => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            character: response.character,
            quests: response.quests.map((quest: any) => ({
              id: quest.id,
              name: quest.name,
              description: quest.description,
              difficulty: quest.difficulty,
              recommended_level: quest.recommended_level,
              monster: 'Monstre adversaire', // Information générique car non fournie dans l'API
              reward: `${quest.reward_experience} XP` // Adapter selon les informations disponibles
            }))
          };
        })
      );
  }

  // Méthode pour démarrer une quête spécifique
  startQuest(questId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/game/quests/${questId}/`, {})
      .pipe(
        map(response => {
          // La réponse contient directement les résultats du combat pour ce backend
          return response;
        })
      );
  }

  // Méthode pour démarrer le mode versus
  startVersusMode(): Observable<any> {
    // Route pour récupérer les données du mode versus
    return this.http.get<any>(`${this.apiUrl}/api/v1/game/versus/`)
      .pipe(
        map(response => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            characters: response.characters
          };
        })
      );
  }

  // Méthode pour démarrer un combat
  startFight(player1Id: number, player2Id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/game/versus/fight/`, {
      player1: player1Id,
      player2: player2Id
    }).pipe(
      map(response => {
        // Adapter la réponse de l'API au format attendu par les composants
        return {
          success: true,
          result: response // Le backend fournit directement les résultats du combat
        };
      })
    );
  }

  // Styles par défaut pour le jeu de plateau
  private getDefaultStyleData(): any {
    return {
      "background_color": "#282c34",
      "header_color": "#61dafb",
      "button_color": "#ff5733",
      "text_color": "#ffffff",
      "font_family": "Arial, sans-serif",
      "font_size": "16px",
      "board_border": "2px solid #61dafb",
      "game_title_font_size": "2rem"
    };
  }
}