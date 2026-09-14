import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language';
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  private languageService = inject(LanguageService);
  private cartService = inject(CartService);

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  get cartItems(): Product[] {
    return this.cartService.items();
  }

  get cartCount(): number {
    return this.cartService.cartCount();
  }

  get subtotal(): number {
    return this.cartItems.reduce((total, product) => {
      return total + this.getPriceNumber(product.price);
    }, 0);
  }

  get currency(): string {
    if (this.cartItems.length === 0) {
      return 'SAR';
    }

    const price = this.cartItems[0].price;

    if (price.toUpperCase().includes('EGP')) {
      return 'EGP';
    }

    return 'SAR';
  }

  get formattedSubtotal(): string {
    return `${this.subtotal.toLocaleString()} ${this.currency}`;
  }

  getPriceNumber(price: string): number {
    const numberOnly = price.replace(/[^0-9.]/g, '');
    return Number(numberOnly) || 0;
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    if (this.cartItems.length === 0) {
      return;
    }

    const confirmed = confirm(
      this.isArabic
        ? 'هل تريد حذف جميع المنتجات من السلة؟'
        : 'Are you sure you want to clear your cart?'
    );

    if (confirmed) {
      this.cartService.clearCart();
    }
  }

}