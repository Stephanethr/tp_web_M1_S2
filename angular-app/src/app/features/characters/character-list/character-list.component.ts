import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedCharacterId: number | null = null;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    this.characterService.getAllCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        // Déterminer le personnage actuellement actif
        const activeCharacter = this.characters.find(char => char.is_active);
        if (activeCharacter) {
          this.selectedCharacterId = activeCharacter.id;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des personnages';
        this.loading = false;
      }
    });
  }

  selectCharacter(characterId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.characterService.selectCharacter(characterId).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedCharacterId = characterId;
          this.successMessage = 'Personnage sélectionné avec succès';
          // Mettre à jour la liste pour refléter la sélection
          this.characters.forEach(character => {
            character.is_active = character.id === characterId;
          });
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

  // Vérifier si un personnage est sélectionné
  get hasSelectedCharacter(): boolean {
    return this.selectedCharacterId !== null;
  }
}