import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AppComponent } from './app.component';

// Core
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Shared Components
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { AuthModule } from './features/auth/auth.module';
import { CharacterModule } from './features/character/character.module';
import { InventoryModule } from './features/inventory/inventory.module';
import { GameModule } from './features/game/game.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routes,
    SharedModule,
    AuthModule,
    CharacterModule,
    InventoryModule,
    GameModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }