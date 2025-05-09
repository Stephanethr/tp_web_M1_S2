import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GameService } from '../../../core/services/game.service';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-versus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './versus.component.html',
  styleUrls: ['./versus.component.scss']
})
export class VersusComponent implements OnInit {
  characters: Character[] = [];
  player1Id: number | null = null;
  player2Id: number | null = null;
  fightResult: any = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private gameService: GameService,
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si un personnage est sélectionné
    const activeCharacter = this.characterService.getActiveCharacter();
    
    if (!activeCharacter) {
      this.errorMessage = 'Vous devez sélectionner un personnage pour accéder au mode versus';
      setTimeout(() => {
        this.router.navigate(['/characters']);
      }, 2000);
      return;
    }
    
    this.player1Id = activeCharacter.id;
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.characterService.getAllCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        
        if (characters.length < 2) {
          this.errorMessage = 'Vous avez besoin d\'au moins deux personnages pour le mode versus';
        } else {
          this.successMessage = 'Personnages chargés avec succès';
          
          // Par défaut, sélectionner un adversaire différent du joueur 1
          const opponents = characters.filter(char => char.id !== this.player1Id);
          if (opponents.length > 0) {
            this.player2Id = opponents[0].id;
          }
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des personnages';
        this.loading = false;
      }
    });
  }

  getCharacterById(id: number): Character | undefined {
    return this.characters.find(character => character.id === id);
  }

  startFight(): void {
    if (!this.player1Id || !this.player2Id) {
      this.errorMessage = 'Veuillez sélectionner deux personnages pour le combat';
      return;
    }

    if (this.player1Id === this.player2Id) {
      this.errorMessage = 'Vous ne pouvez pas combattre contre vous-même. Veuillez sélectionner deux personnages différents.';
      return;
    }

    this.loading = true;
    this.fightResult = null;
    
    this.gameService.startFight(this.player1Id, this.player2Id).subscribe({
      next: (result) => {
        if (result.success) {
          this.fightResult = result.result || result.battle_result;
        } else {
          this.errorMessage = result.message || 'Erreur lors du lancement du combat';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du lancement du combat';
        this.loading = false;
      }
    });
  }

  resetFight(): void {
    this.fightResult = null;
  }
}