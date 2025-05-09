import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../core/services/inventory.service';
import { ItemTypeModel } from '../../../core/models/item.model';
import { ItemType, getItemTypeName, getItemTypeClass, getItemTypeIcon } from '../../../core/models/item-types.enum';

@Component({
  selector: 'app-item-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit {
  itemForm: FormGroup;
  itemTypes: ItemTypeModel[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  itemId: number | null = null;
  
  // Rendre l'énumération accessible dans le template
  itemTypeEnum = ItemType;
  
  // Array avec tous les types d'objets disponibles, en cas de défaillance de l'API
  defaultItemTypes: ItemTypeModel[] = [
    { id: ItemType.WEAPON, type_name: getItemTypeName(ItemType.WEAPON) },
    { id: ItemType.ARMOR, type_name: getItemTypeName(ItemType.ARMOR) },
    { id: ItemType.POTION, type_name: getItemTypeName(ItemType.POTION) },
    { id: ItemType.PLANT, type_name: getItemTypeName(ItemType.PLANT) },
    { id: ItemType.KEY, type_name: getItemTypeName(ItemType.KEY) }
  ];
  
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      type_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadItemTypes();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = +id;
      this.loadItemDetails(this.itemId);
    } else {
      // Par défaut, sélectionner le premier type d'objet (Arme)
      this.itemForm.get('type_id')?.setValue(ItemType.WEAPON);
    }
  }

  loadItemTypes(): void {
    this.inventoryService.getItemTypes().subscribe({
      next: (types) => {
        if (types && types.length > 0) {
          this.itemTypes = types;
        } else {
          // Si l'API ne renvoie pas de types, utiliser les types par défaut
          this.itemTypes = this.defaultItemTypes;
        }
        
        // Si nous sommes en mode création, sélectionner le premier type par défaut
        if (!this.isEditMode && !this.itemForm.get('type_id')?.value && this.itemTypes.length > 0) {
          this.itemForm.get('type_id')?.setValue(this.itemTypes[0].id);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types d\'objets :', error);
        // En cas d'erreur, utiliser les types par défaut
        this.itemTypes = this.defaultItemTypes;
        
        // Et sélectionner le premier type par défaut
        if (!this.isEditMode && !this.itemForm.get('type_id')?.value) {
          this.itemForm.get('type_id')?.setValue(this.itemTypes[0].id);
        }
      }
    });
  }

  loadItemDetails(itemId: number): void {
    this.loading = true;
    // Récupérer les détails de l'objet à modifier
    this.inventoryService.getInventory().subscribe({
      next: (response) => {
        if (response.success) {
          const item = response.items?.find((i: any) => i.id === itemId);
          if (item) {
            this.itemForm.patchValue({
              name: item.name,
              type_id: item.type_id,
              quantity: item.quantity
            });
          } else {
            this.errorMessage = 'Objet non trouvé';
          }
        } else {
          this.errorMessage = response.message || 'Erreur lors du chargement des détails de l\'objet';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des détails de l\'objet';
        this.loading = false;
      }
    });
  }

  getItemTypeName(typeId: number): string {
    // D'abord, chercher dans les types récupérés de l'API
    const apiType = this.itemTypes.find(type => type.id === typeId);
    if (apiType) {
      return apiType.type_name;
    }
    
    // Si non trouvé, utiliser la fonction d'énumération
    return getItemTypeName(typeId as ItemType);
  }

  getItemTypeClass(typeId: number): string {
    return getItemTypeClass(typeId as ItemType);
  }
  
  getItemTypeIcon(typeId: number): string {
    return getItemTypeIcon(typeId as ItemType);
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { name, type_id, quantity } = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      this.inventoryService.editItem(this.itemId, name, type_id, quantity).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Objet modifié avec succès';
            setTimeout(() => {
              this.router.navigate(['/inventory']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la modification de l\'objet';
            this.loading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification de l\'objet';
          this.loading = false;
        }
      });
    } else {
      this.inventoryService.addItem(name, type_id, quantity).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Objet ajouté avec succès';
            setTimeout(() => {
              this.router.navigate(['/inventory']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Erreur lors de l\'ajout de l\'objet';
            this.loading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout de l\'objet';
          this.loading = false;
        }
      });
    }
  }
}