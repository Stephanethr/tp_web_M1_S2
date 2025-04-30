import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { FightResult } from 'src/app/core/models/game.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss']
})
export class QuestsComponent implements OnInit {
  quests = [
    { id: 1, name: 'Forest Adventure', description: 'Face the Forest Monster in this beginner quest.', difficulty: 'Easy', reward: 'Health Potion', enemyLevel: 1 },
    { id: 2, name: 'Cave Expedition', description: 'Descend into the dark cave and defeat the Cave Troll.', difficulty: 'Medium', reward: 'Steel Sword', enemyLevel: 3 },
    { id: 3, name: 'Dragon\'s Lair', description: 'Challenge the mighty Dragon in its lair. Only for the bravest heroes!', difficulty: 'Hard', reward: 'Dragon Scale Armor', enemyLevel: 5 }
  ];
  
  loading = false;
  error = '';
  selectedQuest: any = null;
  fightResult: FightResult | null = null;
  showResult = false;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user has an active character
    if (!this.authService.currentUserValue?.activeCharacterId) {
      this.router.navigate(['/character/list'], { 
        queryParams: { returnUrl: '/game/quests' } 
      });
      return;
    }
  }

  startQuest(quest: any) {
    this.loading = true;
    this.selectedQuest = quest;
    this.showResult = false;
    
    this.gameService.startQuest(quest.id)
      .subscribe(
        result => {
          this.fightResult = result;
          this.showResult = true;
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to start quest';
          this.loading = false;
        }
      );
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Hard': return 'text-danger';
      default: return '';
    }
  }

  resetQuest() {
    this.showResult = false;
    this.fightResult = null;
    this.selectedQuest = null;
  }
}