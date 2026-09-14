import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {

  private productService = inject(ProductService);

  productName = '';
  description = '';
  price = '';

  selectedImages: File[] = [];

  products: Product[] = [];

  editingProductId: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      }
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.selectedImages = Array.from(input.files).slice(0, 5);
    }
  }

  addProduct(): void {

    if (!this.productName || !this.description || !this.price) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.productName);
    formData.append('description', this.description);
    formData.append('price', this.price);

    this.selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    this.productService.addProduct(formData).subscribe({
      next: (response) => {

        console.log('Product added successfully:', response);

        this.clearForm();
        this.loadProducts();

        alert('Product added successfully.');
      },

      error: (error) => {
        console.error('Failed to add product:', error);
        alert('Failed to add product.');
      }
    });
  }

  startEdit(product: Product): void {

    if (!product._id) {
      return;
    }

    this.editingProductId = product._id;

    this.productName = product.name;
    this.description = product.description;
    this.price = product.price;

    this.selectedImages = [];
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.clearForm();
  }

  updateProduct(): void {

    if (!this.editingProductId) {
      return;
    }

    if (!this.productName || !this.description || !this.price) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.productName);
    formData.append('description', this.description);
    formData.append('price', this.price);

    this.selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    this.productService
      .updateProduct(this.editingProductId, formData)
      .subscribe({
        next: (response) => {

          console.log('Product updated successfully:', response);

          this.editingProductId = null;

          this.clearForm();
          this.loadProducts();

          alert('Product updated successfully.');
        },

        error: (error) => {
          console.error('Failed to update product:', error);
          alert('Failed to update product.');
        }
      });
  }

  deleteProduct(product: Product): void {

    if (!product._id) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product._id).subscribe({
      next: () => {

        console.log('Product deleted successfully.');

        this.loadProducts();

        if (this.editingProductId === product._id) {
          this.cancelEdit();
        }

        alert('Product deleted successfully.');
      },

      error: (error) => {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product.');
      }
    });
  }

  private clearForm(): void {

    this.productName = '';
    this.description = '';
    this.price = '';
    this.selectedImages = [];
  }
}