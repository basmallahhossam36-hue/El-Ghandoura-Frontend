import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { LanguageService } from '../../services/language';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  private languageService = inject(LanguageService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  get cartItems() {
    return this.cartService.items();
  }

  get cartCount(): number {
    return this.cartService.cartCount();
  }

  get subtotal(): number {
    return this.cartItems.reduce((total, product) => {
      const price = product.price.replace(/[^0-9.]/g, '');
      return total + (Number(price) || 0);
    }, 0);
  }

  get currency(): string {
    if (this.cartItems.length === 0) {
      return 'SAR';
    }

    return this.cartItems[0].price
      .toUpperCase()
      .includes('EGP')
      ? 'EGP'
      : 'SAR';
  }

  get formattedSubtotal(): string {
    return `${this.subtotal.toLocaleString()} ${this.currency}`;
  }

  checkoutForm = new FormGroup({

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

    address: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ])

  });

  placeOrder(): void {

    if (this.cartItems.length === 0) {

      alert(
        this.isArabic
          ? 'السلة فارغة'
          : 'Your cart is empty.'
      );

      this.router.navigate(['/products']);

      return;
    }

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }

    const customerName =
      this.checkoutForm.value.name ?? '';

    const productName =
      this.cartItems
        .map(product => product.name)
        .join(', ');

    const quantity =
      this.cartItems.length;

    const totalPrice =
      this.subtotal;

    const orderData = {
  customerName,
  email: this.checkoutForm.value.email ?? '',
  phone: this.checkoutForm.value.phone ?? '',
  address: this.checkoutForm.value.address ?? '',
  productName,
  quantity,
  totalPrice
};

    this.orderService.createOrder(orderData).subscribe({

      next: (response) => {

        console.log(
          'Order created successfully:',
          response
        );

        const orderId = response.order._id;

        this.cartService.clearCart();

        if (orderId) {

          alert(
            this.isArabic
              ? `تم تأكيد طلبك بنجاح\nرقم الطلب: ${orderId}`
              : `Your order has been placed successfully.\nOrder ID: ${orderId}`
          );

          this.router.navigate(
            ['/track-order'],
            {
              queryParams: {
                id: orderId
              }
            }
          );

        } else {

          alert(
            this.isArabic
              ? 'تم إنشاء الطلب بنجاح'
              : 'Order created successfully.'
          );

          this.router.navigate(['/']);

        }

      },

      error: (error) => {

        console.error(
          'Failed to create order:',
          error
        );

        alert(
          error.error?.message ||
          (
            this.isArabic
              ? 'حدث خطأ أثناء إنشاء الطلب'
              : 'Failed to create order.'
          )
        );

      }

    });

  }

}