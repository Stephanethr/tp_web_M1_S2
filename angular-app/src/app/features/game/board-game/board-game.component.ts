import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { GameState, BoardElement } from 'src/app/core/models/game.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-board-game',
  templateUrl: './board-game.component.html',
  styleUrls: ['./board-game.component.scss']
})
export class BoardGameComponent implements OnInit {
  gameState: GameState | null = null;
  loading = false;
  error = '';
  gameFinished = false;
  gameLog: string[] = [];
  diceRoll: number | null = null;
  currentTurn = 0;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user has an active character
    if (!this.authService.currentUserValue?.activeCharacterId) {
      this.router.navigate(['/character/list'], { 
        queryParams: { returnUrl: '/game/board' } 
      });
      return;
    }
    
    this.startGame();
  }

  startGame() {
    this.loading = true;
    this.gameLog = [];
    this.gameFinished = false;
    this.diceRoll = null;
    this.currentTurn = 0;
    
    this.gameService.startBoardGame()
      .subscribe(
        state => {
          this.gameState = state;
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to start board game';
          this.loading = false;
        }
      );
  }

  playTurn() {
    if (!this.gameState || this.gameState.isGameOver || this.gameState.isCompleted) {
      return;
    }
    
    this.loading = true;
    this.currentTurn++;
    this.diceRoll = Math.floor(Math.random() * 6) + 1; // Simulate dice roll client-side for animation
    
    this.gameService.playTurn(this.gameState)
      .subscribe(
        updatedState => {
          this.gameState = updatedState;
          this.gameLog = [...this.gameLog, ...updatedState.gameLog];
          this.loading = false;
          this.gameFinished = updatedState.isGameOver || updatedState.isCompleted;
        },
        error => {
          this.error = error?.error?.message || 'Failed to play turn';
          this.loading = false;
        }
      );
  }

  getBoardElementClass(element: BoardElement | null, index: number): string {
    if (!element) {
      return 'empty-cell';
    }
    if (element.type === 'enemy') {
      return 'enemy-cell';
    }
    if (element.type === 'item') {
      return 'item-cell';
    }
    return 'empty-cell';
  }

  getPositionClass(index: number): string {
    if (!this.gameState) return '';
    if (index === this.gameState.currentPosition) {
      return 'current-position';
    }
    return '';
  }

  restartGame() {
    this.startGame();
  }
}