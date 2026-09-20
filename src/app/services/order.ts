import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  _id?: string;
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

private apiUrl = 'https://elghandourabackend1-hhz2vvoy.b4a.run/orders';
  createOrder(
    data: CreateOrderData
  ): Observable<CreateOrderResponse> {

    return this.http.post<CreateOrderResponse>(
      this.apiUrl,
      data
    );

  }

  getOrders():
    Observable<Order[] | GetOrdersResponse> {

    return this.http.get<
      Order[] | GetOrdersResponse
    >(this.apiUrl);

  }

  getOrderById(
    id: string
  ): Observable<GetOrderResponse> {

    return this.http.get<GetOrderResponse>(
      `${this.apiUrl}/${id}`
    );

  }

  updateOrder(
    id: string,
    data: Partial<Order>
  ): Observable<CreateOrderResponse> {

    return this.http.patch<CreateOrderResponse>(
      `${this.apiUrl}/${id}`,
      data
    );

  }

  deleteOrder(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}