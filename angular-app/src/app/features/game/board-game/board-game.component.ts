import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GameService } from '../../../core/services/game.service';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-board-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './board-game.component.html',
  styleUrls: ['./board-game.component.scss']
})
export class BoardGameComponent implements OnInit {
  gameResult: any = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  character: Character | null = null;
  styleData: any = {};
  plateauGame: any = null;
  gameState: any = null;
  currentDirection: string = '';

  constructor(
    private gameService: GameService,
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si un personnage est sélectionné
    this.character = this.characterService.getActiveCharacter();
    
    if (!this.character) {
      this.errorMessage = 'Vous devez sélectionner un personnage pour accéder au jeu de plateau';
      setTimeout(() => {
        this.router.navigate(['/characters']);
      }, 2000);
      return;
    }
    
    this.startGame();
  }

  startGame(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.gameService.startBoardGame().subscribe({
      next: (data) => {
        if (data.success) {
          this.gameResult = data.game_result || '';
          // Si le backend renvoie un personnage, utiliser ses infos
          if (data.character) {
            // Mettre à jour localement avec les données du serveur
            this.character = {
              ...this.character!,  // Conserver les données locales
              ...data.character    // Mais mettre à jour avec les données du serveur
            };
          }
          this.styleData = data.style_data || this.getDefaultStyleData();
          this.plateauGame = data.game_state || data.tableau_game;
          this.gameState = data.game_state;
          this.successMessage = 'Jeu de plateau chargé avec succès!';
        } else {
          this.errorMessage = data.message || 'Erreur lors du chargement du jeu de plateau';
          
          // Si le problème est lié au personnage actif, tenter de le gérer
          if (data.message && data.message.includes('personnage actif')) {
            this.errorMessage = 'Veuillez sélectionner un personnage dans la liste des personnages';
            setTimeout(() => {
              this.router.navigate(['/characters']);
            }, 2000);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement du jeu de plateau';
        this.loading = false;
        
        // Gestion spécifique de l'erreur d'absence de personnage actif
        if (error.error?.message && error.error.message.includes('personnage actif')) {
          this.errorMessage = 'Veuillez sélectionner un personnage dans la liste des personnages';
          setTimeout(() => {
            this.router.navigate(['/characters']);
          }, 2000);
        }
      }
    });
  }

  // Méthode pour lancer le dé et se déplacer
  rollDiceAndMove(): void {
    // Simuler un lancer de dé (1 à 6)
    const diceValue = Math.floor(Math.random() * 6) + 1;
    this.playTurn('forward_' + diceValue); // Par exemple, "forward_3" pour avancer de 3 cases
  }

  // Méthode pour choisir une direction (si le jeu le permet)
  chooseDirection(direction: string): void {
    this.playTurn(direction); // Par exemple, "left", "right", "up", "down"
  }

  playTurn(direction: string): void {
    if (!this.character) {
      this.errorMessage = 'Vous devez sélectionner un personnage pour jouer';
      return;
    }

    this.loading = true;
    this.currentDirection = direction;
    
    this.gameService.playBoardGameTurn(direction).subscribe({
      next: (data) => {
        if (data.success) {
          this.gameResult = (this.gameResult || '') + '\n' + (data.turn_result || '');
          this.plateauGame = data.game_state;
          this.gameState = data.game_state;
          
          // Mise à jour du personnage si le backend le renvoie
          if (data.character) {
            this.character = {
              ...this.character!,
              ...data.character
            };
          }
        } else {
          this.errorMessage = data.message || 'Erreur lors du jeu';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du jeu';
        this.loading = false;
      }
    });
  }

  // Styles par défaut si le backend n'en fournit pas
  getDefaultStyleData(): any {
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