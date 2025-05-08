import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  items: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  sortBy: string = 'name';
  order: string = 'asc';
  characterName: string = '';
  
  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getInventory(this.sortBy, this.order).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.items = response.items || [];
          this.characterName = response.character_name || '';
        } else {
          this.errorMessage = response.message || 'Erreur lors du chargement de l\'inventaire';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement de l\'inventaire';
        this.loading = false;
      }
    });
  }

  sortInventory(column: string): void {
    if (this.sortBy === column) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.order = 'asc';
    }
    this.loadInventory();
  }

  deleteItem(itemId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      this.inventoryService.deleteItem(itemId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadInventory();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la suppression de l\'objet';
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression de l\'objet';
        }
      });
    }
  }

  consumeItem(itemId: number): void {
    this.inventoryService.consumeItem(itemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadInventory();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la consommation de l\'objet';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la consommation de l\'objet';
      }
    });
  }

  getItemTypeClass(typeName: string | undefined): string {
    if (!typeName) return 'badge-secondary';
    
    switch (typeName.toLowerCase()) {
      case 'potion':
        return 'badge-success';
      case 'arme':
      case 'weapon':
        return 'badge-danger';
      case 'armure':
      case 'armor':
        return 'badge-info';
      case 'plante':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  isConsumable(typeName: string | undefined): boolean {
    if (!typeName) return false;
    return ['potion', 'plante'].includes(typeName.toLowerCase());
  }
}