import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.successMessage = 'Connexion réussie. Redirection...';
          
          // Redirection après un petit délai pour montrer le message de succès
          setTimeout(() => {
            this.router.navigate(['/characters']);
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Erreur de connexion';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect !';
        this.loading = false;
      }
    });
  }
}