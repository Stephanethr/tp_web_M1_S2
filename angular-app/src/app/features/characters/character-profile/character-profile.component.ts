import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-character-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-profile.component.html',
  styleUrls: ['./character-profile.component.scss']
})
export class CharacterProfileComponent implements OnInit {
  character: Character | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  stats: any = {};
  equipment: any = {};
  completedQuests: any[] = [];
  isActive: boolean = false;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacter();
  }

  loadCharacter(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Aucun personnage sélectionné';
      return;
    }

    this.loading = true;
    this.characterService.getCharacterById(+id).subscribe({
      next: (response) => {
        if (response) {
          this.character = response;
          // Si la réponse contient des données supplémentaires comme stats, equipment, etc.
          if ('stats' in response) {
            this.stats = response.stats;
          }
          if ('equipment' in response) {
            this.equipment = response.equipment;
          }
          if ('completed_quests' in response) {
            // Correction : ajouter une vérification de type avec un opérateur de type
            this.completedQuests = (response.completed_quests as any[]) || [];
          }
          if ('is_active' in response) {
            // Correction : utiliser un opérateur logique pour garantir un booléen
            this.isActive = !!response.is_active;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement du personnage';
        this.loading = false;
      }
    });
  }

  selectCharacter(): void {
    if (!this.character) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.characterService.selectCharacter(this.character.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.isActive = true;
          this.successMessage = 'Personnage sélectionné avec succès';
        } else {
          this.errorMessage = response.message || 'Erreur lors de la sélection du personnage';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la sélection du personnage';
        this.loading = false;
      }
    });
  }

  goToGameMode(mode: string): void {
    // Vérifie si le personnage est actif avant de rediriger
    if (!this.isActive) {
      // Sélectionne le personnage d'abord puis redirige
      this.characterService.selectCharacter(this.character!.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/game', mode]);
          } else {
            this.errorMessage = 'Veuillez d\'abord sélectionner ce personnage';
          }
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la sélection du personnage';
        }
      });
    } else {
      // Si déjà actif, redirige directement
      this.router.navigate(['/game', mode]);
    }
  }
}