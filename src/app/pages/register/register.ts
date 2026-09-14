import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9+\-\s]{8,15}$/)
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    const data = {
      name: this.registerForm.value.name ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? '',
      phone: this.registerForm.value.phone ?? ''
    };

    this.authService.signup(data).subscribe({

      next: (response) => {

        console.log('Signup successful:', response);

        this.authService.saveToken(response.token);

        alert(
          this.isArabic
            ? 'تم إنشاء الحساب بنجاح'
            : 'Account created successfully'
        );

        this.router.navigate(['/']);

      },

      error: (error) => {

        console.error('Signup failed:', error);

        alert(
          error.error?.message ||
          (
            this.isArabic
              ? 'حدث خطأ أثناء إنشاء الحساب'
              : 'Signup failed'
          )
        );

      }

    });

  }

}