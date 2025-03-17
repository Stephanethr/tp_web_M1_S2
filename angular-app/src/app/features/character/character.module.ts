import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterCreateComponent } from './character-create/character-create.component';
import { CharacterProfileComponent } from './character-profile/character-profile.component';

@NgModule({
  declarations: [
    CharacterListComponent,
    CharacterCreateComponent,
    CharacterProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class CharacterModule { }