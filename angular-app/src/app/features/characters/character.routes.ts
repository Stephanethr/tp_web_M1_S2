import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const CHARACTERS_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./character-list/character-list.component').then(m => m.CharacterListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'create', 
    loadComponent: () => import('./character-create/character-create.component').then(m => m.CharacterCreateComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: ':id', 
    loadComponent: () => import('./character-profile/character-profile.component').then(m => m.CharacterProfileComponent),
    canActivate: [AuthGuard]
  }
];