import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/core/services/character.service';
import { Race, CharacterType } from 'src/app/core/models/character.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  races = Object.values(Race);
  characterTypes = Object.values(CharacterType);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      race: [Race.HUMAN, Validators.required],
      class: [CharacterType.WARRIOR, Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    this.characterService.createCharacter({
      name: this.f['name'].value,
      race: this.f['race'].value,
      class: this.f['class'].value
    })
    .subscribe(
      character => {
        // Update active character in user
        this.authService.updateActiveCharacter(character.id!).subscribe();
        this.router.navigate(['/character/profile']);
      },
      error => {
        this.error = error?.error?.message || 'Character creation failed';
        this.loading = false;
      }
    );
  }
}