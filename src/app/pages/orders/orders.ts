import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  OrderService,
  Order
} from '../../services/order';

import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  private orderService = inject(OrderService);

  private languageService = inject(LanguageService);

  orders: Order[] = [];

  // Loading is disabled so the page opens immediately
  loading = false;

  errorMessage = '';

  // ================= LANGUAGE =================

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  // ================= INIT =================

  ngOnInit(): void {
    this.loadOrders();
  }

  // ================= LOAD ORDERS =================

  loadOrders(): void {

    // Don't show loading screen
    this.loading = false;

    this.errorMessage = '';

    this.orderService.getOrders().subscribe({

      next: (response) => {

        if (Array.isArray(response)) {

          this.orders = response;

        } else {

          this.orders = response.orders;

        }

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load orders:',
          error
        );

        this.loading = false;

        this.errorMessage = this.isArabic
          ? 'لم نتمكن من تحميل طلباتك حاليًا. يرجى المحاولة مرة أخرى.'
          : 'We could not load your orders right now. Please try again.';

      }

    });

  }

  // ================= STATUS CLASS =================

  getStatusClass(status?: string): string {

    switch (status) {

      case 'Delivered':
        return 'delivered';

      case 'Shipped':
      case 'Reached Egypt':
        return 'shipped';

      case 'Preparing':
      case 'Reached KSA':
        return 'preparing';

      case 'Confirmed':
        return 'confirmed';

      case 'Pending':
      default:
        return 'pending';

    }

  }

  // ================= STATUS TEXT =================

  getStatusText(status?: string): string {

    if (!this.isArabic) {

      return status || 'Pending';

    }

    switch (status) {

      case 'Delivered':
        return 'تم التوصيل';

      case 'Shipped':
        return 'تم الشحن';

      case 'Reached Egypt':
        return 'وصل مصر';

      case 'Preparing':
        return 'جاري التجهيز';

      case 'Reached KSA':
        return 'وصل السعودية';

      case 'Confirmed':
        return 'تم التأكيد';

      case 'Pending':
      default:
        return 'قيد الانتظار';

    }

  }

  // ================= DATE =================

  formatDate(date?: string): string {

    if (!date) {

      return '';

    }

    return new Date(date).toLocaleDateString(

      this.isArabic
        ? 'ar-EG'
        : 'en-GB',

      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }

    );

  }

}