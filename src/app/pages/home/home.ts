import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  get cartCount(): number {
    return this.cartService.cartCount();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}