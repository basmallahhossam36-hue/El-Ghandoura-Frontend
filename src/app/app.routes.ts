import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { Login } from './pages/login/login';

import { Register } from './pages/register/register';

import { Admin } from './pages/admin/admin';

import { AdminProducts } from './pages/admin-products/admin-products';

import { Products } from './pages/products/products';

import { ProductDetails } from './pages/product-details/product-details';

import { SheinInstructions } from './pages/shein-instructions/shein-instructions';

import { Cart } from './pages/cart/cart';

import { Checkout } from './pages/checkout/checkout';

import { TrackOrder } from './pages/track-order/track-order';

import { AdminOrders } from './pages/admin-orders/admin-orders';

import { authGuard } from './guards/auth-guard';

import { adminGuard } from './guards/admin-guard-guard';


export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],

    children: [

      {
        path: 'products',
        component: AdminProducts
      },

      {
        path: 'orders',
        component: AdminOrders
      }

    ]
  },

  {
    path: 'products',
    component: Products
  },

  {
    path: 'products/:id',
    component: ProductDetails
  },

  {
    path: 'shein-instructions',
    component: SheinInstructions
  },

  {
    path: 'cart',
    component: Cart
  },

  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard]
  },

  {
    path: 'track-order',
    component: TrackOrder
  }

];