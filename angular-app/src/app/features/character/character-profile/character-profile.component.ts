import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/core/services/character.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Character } from 'src/app/core/models/character.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-profile',
  templateUrl: './character-profile.component.html',
  styleUrls: ['./character-profile.component.scss']
})
export class CharacterProfileComponent implements OnInit {
  character: Character | null = null;
  loading = false;
  error = '';

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCharacter();
  }

  loadCharacter() {
    const activeCharacterId = this.authService.currentUserValue?.activeCharacterId;
    
    if (!activeCharacterId) {
      this.router.navigate(['/character/list']);
      return;
    }

    this.loading = true;
    this.characterService.getCharacterById(activeCharacterId)
      .subscribe(
        data => {
          this.character = data;
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to load character profile';
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