import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { Item } from 'src/app/core/models/item.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InventoryListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';
  sortBy = 'item_name';
  order = 'asc';
  characterName = '';

  private inventoryService = inject(InventoryService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Check if user has an active character
    if (!this.authService.currentUserValue?.activeCharacterId) {
      this.router.navigate(['/character/list'], { 
        queryParams: { returnUrl: '/inventory' } 
      });
      return;
    }
    
    this.loadInventory();
  }

  loadInventory() {
    this.loading = true;
    this.inventoryService.getInventory(this.sortBy, this.order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
          // Utilisation de as any pour éviter l'erreur de typage
          if (data.length > 0 && (data[0] as any).character_name) {
            this.characterName = (data[0] as any).character_name;
          }
        },
        error: (error) => {
          this.error = error?.error?.message || 'Failed to load inventory';
          this.loading = false;
        }
      });
  }

  onSort(column: string) {
    if (this.sortBy === column) {
      // Toggle order if clicking the same column
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending when changing columns
      this.sortBy = column;
      this.order = 'asc';
    }
    this.loadInventory();
  }

  deleteItem(itemId: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(itemId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadInventory();
          },
          error: (error) => {
            this.error = error?.error?.message || 'Failed to delete item';
          }
        });
    }
  }

  consumeItem(itemId: number) {
    this.inventoryService.consumeItem(itemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadInventory();
        },
        error: (error) => {
          this.error = error?.error?.message || 'Failed to consume item';
        }
      });
  }

  isConsumable(typeName: string): boolean {
    return typeName === 'potion' || typeName === 'plante';
  }
}