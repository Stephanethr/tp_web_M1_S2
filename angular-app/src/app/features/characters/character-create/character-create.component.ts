import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ajouter cette importation
import { CharacterService } from '../../../core/services/character.service';
import { Race, CharacterType } from '../../../core/models/enums';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Ajouter RouterModule ici
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent {
  characterForm: FormGroup;
  races = Object.values(Race);
  characterTypes = Object.values(CharacterType);
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private router: Router
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      race: [Race.HUMAN, Validators.required],
      class: [CharacterType.WARRIOR, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.characterForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { name, race, class: characterClass } = this.characterForm.value;

    this.characterService.createCharacter(name, race, characterClass).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/characters']);
        } else {
          this.errorMessage = response.message || 'Erreur lors de la création du personnage';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la création du personnage';
        this.loading = false;
      }
    });
  }
}