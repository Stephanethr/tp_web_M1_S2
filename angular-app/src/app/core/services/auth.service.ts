import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier si l'utilisateur est déjà connecté en vérifiant le token dans localStorage
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/login/`, { email, password })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            // Stocker le token JWT
            localStorage.setItem('token', response.token);
            
            // Mettre à jour l'utilisateur courant
            if (response.user) {
              const user: User = {
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                active_character_id: response.user.active_character_id
              };
              this.currentUserSubject.next(user);
            }
          }
        })
      );
  }

  register(username: string, email: string, password: string, recheck_password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/register/`, { 
      username, 
      email, 
      password
    }).pipe(
      tap((response) => {
        if (response && response.token) {
          // Stocker le token JWT
          localStorage.setItem('token', response.token);
          
          // Mettre à jour l'utilisateur courant
          if (response.user) {
            const user: User = {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              active_character_id: response.user.active_character_id
            };
            this.currentUserSubject.next(user);
          }
        }
      })
    );
  }

  logout(): Observable<any> {
    // Supprimer le token et l'utilisateur courant
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    
    // Pour l'interface utilisateur, on renvoie un observable avec succès
    // Le backend pourrait ne pas avoir de route de déconnexion explicite avec JWT
    return of({ success: true });
  }

  checkAuthStatus(): void {
    // Si un token existe, récupérer les infos de l'utilisateur
    const token = localStorage.getItem('token');
    
    if (token) {
      this.http.get<any>(`${this.apiUrl}/api/v1/auth/user/`)
        .subscribe({
          next: (response) => {
            if (response) {
              // Adapter la réponse au format User
              const user: User = {
                id: response.id,
                username: response.username,
                email: response.email,
                active_character_id: response.active_character_id
              };
              this.currentUserSubject.next(user);
            } else {
              this.currentUserSubject.next(null);
              localStorage.removeItem('token');
            }
          },
          error: () => {
            this.currentUserSubject.next(null);
            localStorage.removeItem('token');
          }
        });
    }
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem('token');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}