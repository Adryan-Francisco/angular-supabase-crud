import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cartService = inject(CartService);
  router = inject(Router);

  orderConfirmed = false;
  orderId = '';

  /**
   * Confirma a compra
   */
  confirmPurchase() {
    if (!this.cartService.isEmpty() && this.cartService.cepValue()) {
      // Simula a criação de um pedido
      this.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Aqui você poderia fazer uma chamada ao serviço Supabase para salvar o pedido
      // await this.orderService.createOrder(this.cartService.getCartSummary());

      this.orderConfirmed = true;

      // Limpa o carrinho após 2 segundos e redireciona
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/products']);
      }, 3000);
    }
  }

  /**
   * Volta para o carrinho
   */
  backToCart() {
    this.router.navigate(['/cart']);
  }

  /**
   * Volta para produtos
   */
  backToProducts() {
    this.router.navigate(['/products']);
  }

  /**
   * Trata erro ao carregar imagem
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/80?text=Produto';
  }
}
