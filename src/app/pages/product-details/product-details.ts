import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {

  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);

  loading = true;
  error = false;

  // Image gallery
  currentImageIndex = 0;

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  get cartCount(): number {
    return this.cartService.cartCount();
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.error = true;
      return;
    }

    this.productService.getProductById(id).subscribe({

      next: (product) => {

        console.log('PRODUCT DETAILS:', product);

        this.product.set(product);

        this.currentImageIndex = 0;

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'FAILED TO GET PRODUCT:',
          error
        );

        this.loading = false;
        this.error = true;
      }

    });
  }

  // Previous image
  previousImage(): void {

    const currentProduct = this.product();

    if (!currentProduct || currentProduct.images.length === 0) {
      return;
    }

    if (this.currentImageIndex === 0) {

      this.currentImageIndex =
        currentProduct.images.length - 1;

    } else {

      this.currentImageIndex--;

    }
  }

  // Next image
  nextImage(): void {

    const currentProduct = this.product();

    if (!currentProduct || currentProduct.images.length === 0) {
      return;
    }

    if (
      this.currentImageIndex ===
      currentProduct.images.length - 1
    ) {

      this.currentImageIndex = 0;

    } else {

      this.currentImageIndex++;

    }
  }

  // Select thumbnail
  selectImage(index: number): void {

    this.currentImageIndex = index;

  }

  // Add product to cart
  addToCart(): void {

    const currentProduct = this.product();

    console.log(
      'PRODUCT TO ADD:',
      currentProduct
    );

    if (!currentProduct) {

      console.log(
        'NO PRODUCT FOUND'
      );

      return;
    }

    this.cartService.addToCart(
      currentProduct
    );

    console.log(
      'CART AFTER ADD:',
      this.cartService.items()
    );

    alert(
      this.isArabic
        ? 'تمت إضافة المنتج إلى السلة'
        : 'Product added to cart successfully.'
    );
  }

}