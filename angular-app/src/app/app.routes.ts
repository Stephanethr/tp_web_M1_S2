import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'characters', 
    loadComponent: () => import('./features/characters/character-list/character-list.component').then(m => m.CharacterListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'characters/create', 
    loadComponent: () => import('./features/characters/character-create/character-create.component').then(m => m.CharacterCreateComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'character/:id', 
    loadComponent: () => import('./features/characters/character-profile/character-profile.component').then(m => m.CharacterProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'inventory', 
    loadComponent: () => import('./features/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'inventory/add', 
    loadComponent: () => import('./features/inventory/item-edit/item-edit.component').then(m => m.ItemEditComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'inventory/edit/:id', 
    loadComponent: () => import('./features/inventory/item-edit/item-edit.component').then(m => m.ItemEditComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'game/quests', 
    loadComponent: () => import('./features/game/quests/quests.component').then(m => m.QuestsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'game/board-game', 
    loadComponent: () => import('./features/game/board-game/board-game.component').then(m => m.BoardGameComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'game/versus', 
    loadComponent: () => import('./features/game/versus/versus.component').then(m => m.VersusComponent),
    canActivate: [AuthGuard]
  },
  // La route wildcard pour gérer les routes inexistantes
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];