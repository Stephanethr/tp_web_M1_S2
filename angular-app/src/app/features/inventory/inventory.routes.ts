import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const INVENTORY_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'add', 
    loadComponent: () => import('./item-edit/item-edit.component').then(m => m.ItemEditComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./item-edit/item-edit.component').then(m => m.ItemEditComponent),
    canActivate: [AuthGuard]
  }
];