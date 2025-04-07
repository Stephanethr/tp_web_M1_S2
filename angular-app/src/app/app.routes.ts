import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Auth
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Character
import { CharacterListComponent } from './features/character/character-list/character-list.component';
import { CharacterCreateComponent } from './features/character/character-create/character-create.component';
import { CharacterProfileComponent } from './features/character/character-profile/character-profile.component';

// Inventory
import { InventoryListComponent } from './features/inventory/inventory-list/inventory-list.component';
import { ItemEditComponent } from './features/inventory/item-edit/item-edit.component';

// Game
import { BoardGameComponent } from './features/game/board-game/board-game.component';
import { QuestsComponent } from './features/game/quests/quests.component';
import { VersusComponent } from './features/game/versus/versus.component';

export const routes: Routes = [
  // Auth routes
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  
  // Character routes
  { 
    path: 'character/list', 
    component: CharacterListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'character/create', 
    component: CharacterCreateComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'character/profile', 
    component: CharacterProfileComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  
  // Inventory routes
  { 
    path: 'inventory', 
    component: InventoryListComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  { 
    path: 'add-item', 
    component: ItemEditComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  { 
    path: 'edit/:id', 
    component: ItemEditComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  
  // Game routes
  { 
    path: 'game/board', 
    component: BoardGameComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  { 
    path: 'game/quests', 
    component: QuestsComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  { 
    path: 'game/versus', 
    component: VersusComponent, 
    canActivate: [AuthGuard],
    data: { requiresCharacter: true }
  },
  
  // Default routes
  { 
    path: '', 
    redirectTo: '/character/list', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/character/list' 
  }
];