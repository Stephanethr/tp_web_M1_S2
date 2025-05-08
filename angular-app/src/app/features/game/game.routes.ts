import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const GAME_ROUTES: Routes = [
  { 
    path: 'quests', 
    loadComponent: () => import('./quests/quests.component').then(m => m.QuestsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'board-game', 
    loadComponent: () => import('./board-game/board-game.component').then(m => m.BoardGameComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'versus', 
    loadComponent: () => import('./versus/versus.component').then(m => m.VersusComponent),
    canActivate: [AuthGuard]
  }
];