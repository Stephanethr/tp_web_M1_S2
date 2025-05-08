import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Détecter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
      this.isRegisterPage = event.url === '/register';
    });
    
    // Initialiser selon la route initiale
    const currentUrl = this.router.url;
    this.isLoginPage = currentUrl === '/login';
    this.isRegisterPage = currentUrl === '/register';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // Rediriger quand même vers la page de login en cas d'erreur
        this.router.navigate(['/login']);
      }
    });
  }
}