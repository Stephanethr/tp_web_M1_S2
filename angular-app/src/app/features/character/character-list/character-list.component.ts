import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/core/services/character.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Character } from 'src/app/core/models/character.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  loading = false;
  error = '';
  activeCharacterId?: number;

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.activeCharacterId = this.authService.currentUserValue?.activeCharacterId;
  }

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading = true;
    this.characterService.getAllCharacters()
      .subscribe(
        data => {
          this.characters = data;
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to load characters';
          this.loading = false;
        }
      );
  }

  selectCharacter(character: Character) {
    this.loading = true;
    this.characterService.selectCharacter(character.id!)
      .subscribe(
        () => {
          this.activeCharacterId = character.id;
          // Update auth service with new active character
          this.authService.updateActiveCharacter(character.id!).subscribe();
          this.router.navigate(['/character/profile']);
        },
        error => {
          this.error = error?.error?.message || 'Failed to select character';
          this.loading = false;
        }
      );
  }

  getRaceDisplay(race: string): string {
    switch (race) {
      case 'HUMAN': return 'Human';
      case 'VAMPIRE': return 'Vampire';
      case 'WEREWOLF': return 'Werewolf';
      default: return race;
    }
  }

  getClassDisplay(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}