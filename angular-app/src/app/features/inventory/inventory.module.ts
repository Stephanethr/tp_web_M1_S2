import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { ItemEditComponent } from './item-edit/item-edit.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    ItemEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class InventoryModule { }