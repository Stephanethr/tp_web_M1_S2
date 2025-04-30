import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BoardGameComponent } from './board-game/board-game.component';
import { QuestsComponent } from './quests/quests.component';
import { VersusComponent } from './versus/versus.component';

@NgModule({
  declarations: [
    BoardGameComponent,
    QuestsComponent,
    VersusComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class GameModule { }