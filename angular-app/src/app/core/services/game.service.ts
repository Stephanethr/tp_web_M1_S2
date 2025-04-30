import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FightResult, GameState } from '../models/game.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  startBoardGame(): Observable<GameState> {
    return this.http.get<GameState>(`${this.apiUrl}/game/board_game`);
  }

  playTurn(gameState: GameState): Observable<GameState> {
    return this.http.post<GameState>(`${this.apiUrl}/game/play_turn`, gameState);
  }

  startQuest(questId: number): Observable<FightResult> {
    return this.http.post<FightResult>(`${this.apiUrl}/game/quest/${questId}`, {});
  }

  startVersus(player1Id: number, player2Id: number): Observable<FightResult> {
    const formData = new FormData();
    formData.append('player1', player1Id.toString());
    formData.append('player2', player2Id.toString());
    
    return this.http.post<FightResult>(`${this.apiUrl}/game/fight`, formData);
  }

  getQuests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/game/quests`);
  }
}