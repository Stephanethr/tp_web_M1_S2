import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GameService } from '../../../core/services/game.service';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss']
})
export class QuestsComponent implements OnInit {
  character: Character | null = null;
  quests: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  questResult: any = null;
  
  constructor(
    private gameService: GameService,
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si un personnage est sélectionné
    this.character = this.characterService.getActiveCharacter();
    
    if (!this.character) {
      this.errorMessage = 'Vous devez sélectionner un personnage pour accéder aux quêtes';
      setTimeout(() => {
        this.router.navigate(['/characters']);
      }, 2000);
      return;
    }
    
    this.loadQuestData();
  }

  loadQuestData(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.gameService.startQuestMode().subscribe({
      next: (data) => {
        if (data.success) {
          this.quests = data.quests || [];
          // Si le backend renvoie un personnage, utiliser ses infos
          if (data.character) {
            // Mettre à jour localement avec les données du serveur
            this.character = {
              ...this.character!,  // Conserver les données locales
              ...data.character    // Mais mettre à jour avec les données du serveur
            };
          }
          this.successMessage = 'Quêtes chargées avec succès!';
        } else {
          this.errorMessage = data.message || 'Erreur lors du chargement des quêtes';
          
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
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des quêtes';
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

  startQuest(questId: number): void {
    if (!this.character) {
      this.errorMessage = 'Vous devez sélectionner un personnage pour démarrer une quête';
      return;
    }

    this.loading = true;
    this.questResult = null;
    
    this.gameService.startQuest(questId).subscribe({
      next: (result) => {
        if (result.success) {
          this.questResult = result;
        } else {
          this.errorMessage = result.message || 'Erreur lors du lancement de la quête';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du lancement de la quête';
        this.loading = false;
      }
    });
  }

  resetQuest(): void {
    this.questResult = null;
    this.loadQuestData(); // Recharger les données pour avoir le personnage à jour
  }
}