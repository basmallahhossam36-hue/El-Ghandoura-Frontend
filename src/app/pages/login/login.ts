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
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    const data = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.login(data).subscribe({

      next: (response) => {

        console.log('Login successful:', response);

        this.authService.saveToken(response.token);

        alert(
          this.isArabic
            ? 'تم تسجيل الدخول بنجاح'
            : 'Login successful'
        );

        if (this.authService.getRole() === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }

      },

      error: (error) => {

        console.error('Login failed:', error);

        alert(
          error.error?.message ||
          (
            this.isArabic
              ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
              : 'Invalid email or password'
          )
        );

      }

    });

  }

}