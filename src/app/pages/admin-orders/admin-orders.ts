import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  OrderService,
  Order
} from '../../services/order';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders {

  private orderService = inject(OrderService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  selectedStatus = 'All';

  loading = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading = true;

    this.orderService.getOrders().subscribe({

      next: (response) => {

        console.log(
          'ADMIN ORDERS RESPONSE:',
          response
        );

        const data: any = response;

        this.orders = Array.isArray(data)
          ? data
          : (data.orders || []);

        console.log(
          'ORDERS:',
          this.orders
        );

        console.log(
          'ORDERS COUNT:',
          this.orders.length
        );

        this.filteredOrders = [...this.orders];

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'FAILED TO GET ORDERS:',
          error
        );

        this.orders = [];
        this.filteredOrders = [];

        this.loading = false;
      }

    });
  }

  filterOrders(): void {

    if (this.selectedStatus === 'All') {

      this.filteredOrders = [...this.orders];

      return;
    }

    this.filteredOrders = this.orders.filter(
      order => order.status === this.selectedStatus
    );
  }

  updateStatus(
    order: Order,
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    const newStatus = select.value;

    if (!order._id) {
      return;
    }

    this.orderService
      .updateOrder(
        order._id,
        {
          status: newStatus
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'ORDER UPDATED:',
            response
          );

          order.status = newStatus;

          this.filterOrders();

        },

        error: (error) => {

          console.error(
            'FAILED TO UPDATE ORDER:',
            error
          );

          alert(
            'Failed to update order.'
          );

        }

      });
  }

  deleteOrder(order: Order): void {

    if (!order._id) {
      return;
    }

    const confirmed = confirm(
      `Delete order ${order._id}?`
    );

    if (!confirmed) {
      return;
    }

    this.orderService
      .deleteOrder(order._id)
      .subscribe({

        next: () => {

          console.log(
            'ORDER DELETED:',
            order._id
          );

          this.orders = this.orders.filter(
            item => item._id !== order._id
          );

          this.filterOrders();

        },

        error: (error) => {

          console.error(
            'FAILED TO DELETE ORDER:',
            error
          );

          alert(
            'Failed to delete order.'
          );

        }

      });
  }

}