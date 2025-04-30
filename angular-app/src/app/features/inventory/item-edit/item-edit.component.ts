import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { Item, ItemType } from 'src/app/core/models/item.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit {
  itemForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isAddMode = true;
  itemId?: number;
  itemTypes: ItemType[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    this.isAddMode = !this.itemId;
    
    // Check if user has an active character
    if (!this.authService.currentUserValue?.activeCharacterId) {
      this.router.navigate(['/character/list'], { 
        queryParams: { returnUrl: this.isAddMode ? '/add-item' : `/edit/${this.itemId}` } 
      });
      return;
    }

    // Load item types
    this.inventoryService.getItemTypes()
      .subscribe(
        types => {
          this.itemTypes = types;
        },
        error => {
          this.error = error?.error?.message || 'Failed to load item types';
        }
      );
    
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      typeId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    if (!this.isAddMode) {
      this.loadItem();
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.itemForm.controls; }

  loadItem() {
    this.loading = true;
    // Assuming you have a method to get an item by ID
    this.inventoryService.getInventory()
      .subscribe(
        items => {
          const item = items.find(i => i.id === this.itemId);
          if (item) {
            this.itemForm.patchValue({
              name: item.name,
              typeId: item.typeId,
              quantity: item.quantity
            });
          } else {
            this.error = 'Item not found';
          }
          this.loading = false;
        },
        error => {
          this.error = error?.error?.message || 'Failed to load item';
          this.loading = false;
        }
      );
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.itemForm.invalid) {
      return;
    }

    this.loading = true;
    
    const item: Item = {
      characterId: this.authService.currentUserValue!.activeCharacterId!,
      name: this.f['name'].value,
      typeId: this.f['typeId'].value,
      quantity: this.f['quantity'].value
    };

    if (this.isAddMode) {
      this.createItem(item);
    } else {
      item.id = this.itemId;
      this.updateItem(item);
    }
  }

  private createItem(item: Item) {
    this.inventoryService.addItem(item)
      .subscribe(
        () => {
          this.router.navigate(['/inventory']);
        },
        error => {
          this.error = error?.error?.message || 'Failed to add item';
          this.loading = false;
        }
      );
  }

  private updateItem(item: Item) {
    this.inventoryService.updateItem(item)
      .subscribe(
        () => {
          this.router.navigate(['/inventory']);
        },
        error => {
          this.error = error?.error?.message || 'Failed to update item';
          this.loading = false;
        }
      );
  }
}