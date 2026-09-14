import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = signal<Product[]>(
    this.loadCart()
  );

  items = this.cartItems.asReadonly();

  cartCount = computed(
    () => this.cartItems().length
  );

  private loadCart(): Product[] {

    const savedCart =
      localStorage.getItem('cart');

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }

  }

  private saveCart(items: Product[]): void {

    localStorage.setItem(
      'cart',
      JSON.stringify(items)
    );

  }

  addToCart(product: Product): void {

    this.cartItems.update(items => {

      const newItems = [
        ...items,
        product
      ];

      this.saveCart(newItems);

      return newItems;

    });

  }

  removeFromCart(index: number): void {

    this.cartItems.update(items => {

      const newItems =
        items.filter(
          (_, i) => i !== index
        );

      this.saveCart(newItems);

      return newItems;

    });

  }

  clearCart(): void {

    this.cartItems.set([]);

    localStorage.removeItem('cart');

  }

}