import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  _id?: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  image?: string;
  status?: string;
  orderDate?: string;
}

export interface CreateOrderData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  quantity: number;
  totalPrice: number;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface GetOrdersResponse {
  orders: Order[];
}

export interface GetOrderResponse {
  order: Order;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://final-nti-83xh.vercel.app/orders';


  // ================= USER =================

  // Create order
  createOrder(
    data: CreateOrderData
  ): Observable<CreateOrderResponse> {

    return this.http.post<CreateOrderResponse>(
      this.apiUrl,
      data
    );

  }


  // Get logged-in user's orders
  getOrders():
    Observable<Order[] | GetOrdersResponse> {

    return this.http.get<
      Order[] | GetOrdersResponse
    >(this.apiUrl);

  }


  // Get one user's order
  getOrderById(
    id: string
  ): Observable<GetOrderResponse> {

    return this.http.get<GetOrderResponse>(
      `${this.apiUrl}/${id}`
    );

  }


  // Update user's own order
  updateOrder(
    id: string,
    data: Partial<Order>
  ): Observable<CreateOrderResponse> {

    return this.http.patch<CreateOrderResponse>(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // Delete user's own order
  deleteOrder(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


  // ================= ADMIN =================

  // Get ALL orders for admin
  getAllOrdersAdmin():
    Observable<Order[] | GetOrdersResponse> {

    return this.http.get<
      Order[] | GetOrdersResponse
    >(
      `${this.apiUrl}/admin`
    );

  }


  // Update ANY order as admin
  updateOrderAdmin(
    id: string,
    data: Partial<Order>
  ): Observable<CreateOrderResponse> {

    return this.http.patch<CreateOrderResponse>(
      `${this.apiUrl}/admin/${id}`,
      data
    );

  }


  // Delete ANY order as admin
  deleteOrderAdmin(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/admin/${id}`
    );

  }

}