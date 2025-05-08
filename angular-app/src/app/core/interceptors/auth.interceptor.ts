import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  
  // Cloner la requête pour ajouter les en-têtes d'autorisation si un token existe
  let modifiedRequest = req.clone({
    headers: req.headers.set('Content-Type', 'application/json')
  });
  
  if (token) {
    // Ajouter le token JWT dans l'en-tête Authorization
    modifiedRequest = modifiedRequest.clone({
      headers: modifiedRequest.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Si erreur d'authentification, rediriger vers la page de connexion
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};