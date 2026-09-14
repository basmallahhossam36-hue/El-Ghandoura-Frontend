import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);

  currentImageIndexes: { [key: string]: number } = {};

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  ngOnInit(): void {

    this.productService.getProducts().subscribe({

      next: (data) => {
        this.products.set(data);
        console.log('Products:', data);
      },

      error: (error) => {
        console.error('Failed to load products:', error);
      }

    });

  }

  nextImage(product: Product): void {

    if (!product._id || product.images.length === 0) {
      return;
    }

    const currentIndex =
      this.currentImageIndexes[product._id] ?? 0;

    this.currentImageIndexes[product._id] =
      (currentIndex + 1) % product.images.length;

  }

  previousImage(product: Product): void {

    if (!product._id || product.images.length === 0) {
      return;
    }

    const currentIndex =
      this.currentImageIndexes[product._id] ?? 0;

    this.currentImageIndexes[product._id] =
      (currentIndex - 1 + product.images.length) %
      product.images.length;

  }

  addToCart(product: Product): void {

    this.cartService.addToCart(product);

    alert(
      this.isArabic
        ? 'تمت إضافة المنتج إلى السلة'
        : 'Product added to cart'
    );

  }

}