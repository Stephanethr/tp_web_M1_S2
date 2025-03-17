import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { CharacterService } from 'src/app/core/services/character.service';
import { Character } from 'src/app/core/models/character.model';
import { FightResult } from 'src/app/core/models/game.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-versus',
  templateUrl: './versus.component.html',
  styleUrls: ['./versus.component.scss']
})
export class VersusComponent implements OnInit {
  characters: Character[] = [];
  loading = false;
  error = '';
  player1Id: number | null = null;
  player2Id: number | null = null;
  fightResult: FightResult | null = null;
  showResult = false;

  constructor(
    private gameService: GameService,
    private characterService: CharacterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user has an active character
    if (!this.authService.currentUserValue?.activeCharacterId) {
      this.router.navigate(['/character/list'], { 
        queryParams: { returnUrl: '/game/versus' } 
      });
      return;
    }
    
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading = true;
    this.characterService.getAllCharacters()
      .subscribe(
        data => {
          this.characters = data;
          this.loading = false;
          
          // Set active character as player 1 by default
          const activeCharacterId = this.authService.currentUserValue?.activeCharacterId;
          if (activeCharacterId) {
            this.player1Id = activeCharacterId;
          }
        },
        error => {
          this.error = error?.error?.message || 'Failed to load characters';
          this.loading = false;
        }
      );
  }

  startFight() {
    if (!this.player1Id || !this.player2Id) {
      this.error = 'Please select both fighters';
      return;
    }
    
    if (this.player1Id === this.player2Id) {
      this.error = 'Please select two different characters';
      return;
    }
    
    this.loading = true;
    this.showResult = false;
    
    this.gameService.startVersus(this.player1Id, this.player2Id)
      .subscribe(
        result => {
          this.fightResult = result;
          this.showResult = true;
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to start fight';
          this.loading = false;
        }
      );
  }

  getCharacterName(id: number): string {
    const character = this.characters.find(c => c.id === id);
    return character ? character.name : '';
  }

  resetFight() {
    this.showResult = false;
    this.fightResult = null;
  }
}