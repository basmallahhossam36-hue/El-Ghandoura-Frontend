import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LanguageService } from '../../services/language';
import { OrderService, Order } from '../../services/order';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './track-order.html',
  styleUrl: './track-order.css'
})
export class TrackOrder {

  private languageService = inject(LanguageService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  orderId = '';
  order: Order | null = null;

  loading = false;
  notFound = false;

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  ngOnInit(): void {

    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.orderId = id;
      this.trackOrder();
    }

  }

  trackOrder(): void {

    if (!this.orderId.trim()) {
      alert(
        this.isArabic
          ? 'من فضلك أدخل رقم الطلب'
          : 'Please enter your order ID'
      );
      return;
    }

    this.loading = true;
    this.notFound = false;

    this.orderService.getOrderById(this.orderId.trim()).subscribe({

      next: (response: any) => {

        console.log('TRACK ORDER RESPONSE:', response);

        this.order = response.order ?? response;

        this.loading = false;

      },

      error: (error) => {

        console.error('TRACK ORDER ERROR:', error);

        this.order = null;
        this.loading = false;
        this.notFound = true;

      }

    });

  }

  isStepActive(status: string): boolean {

    if (!this.order) {
      return false;
    }

    const statuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Reached KSA',
      'Shipped',
      'Reached Egypt',
      'Delivered'
    ];

    const currentIndex =
      statuses.indexOf(this.order.status || 'Pending');

    const stepIndex =
      statuses.indexOf(status);

    return stepIndex <= currentIndex;
  }

}