// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recheck_password: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const recheckPassword = control.get('recheck_password')?.value;
    
    return password === recheckPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password, recheck_password } = this.registerForm.value;

    this.authService.register(username, email, password, recheck_password).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.successMessage = 'Compte créé avec succès. Redirection...';
          
          // Redirection après un petit délai pour montrer le message de succès
          setTimeout(() => {
            this.router.navigate(['/characters']);
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de l\'inscription';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}