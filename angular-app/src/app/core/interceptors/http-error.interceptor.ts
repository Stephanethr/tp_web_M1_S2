import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          if (error.status === 401) {
            // Non autorisé, redirection vers la page de login
            this.router.navigate(['/login']);
            errorMessage = 'Votre session a expiré, veuillez vous reconnecter.';
          } else if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.';
          } else if (error.status === 404) {
            errorMessage = 'La ressource demandée n\'existe pas.';
          } else if (error.status === 500) {
            errorMessage = 'Une erreur interne du serveur s\'est produite.';
          } else {
            errorMessage = `Code: ${error.status}, Message: ${error.message}`;
          }
        }
        
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}