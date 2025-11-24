import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../services/cart.service';
import { SupabaseService } from '../services/supabase.service';

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
  supabaseService = inject(SupabaseService);
  router = inject(Router);

  orderConfirmed = false;
  orderId = '';
  isLoading = false;
  errorMessage = '';

  /**
   * Confirma a compra
   */
  async confirmPurchase() {
    if (!this.cartService.isEmpty() && this.cartService.cepValue()) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const userId = this.supabaseService.user()?.id;
        
        if (!userId) {
          this.errorMessage = 'Usuário não autenticado';
          this.isLoading = false;
          return;
        }

        // Gera ID único do pedido
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Prepara os dados do pedido
        const order = {
          user_id: userId,
          order_id: orderNumber,
          items: this.cartService.items().map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.imageUrl,
          })),
          subtotal: this.cartService.subtotal(),
          shipping_cost: this.cartService.shippingCost(),
          total: this.cartService.total(),
          cep: this.cartService.cepValue(),
          status: 'pendente',
        };

        // Salva o pedido no Supabase
        await this.supabaseService.createOrder(order);

        this.orderId = orderNumber;
        this.orderConfirmed = true;

        // Limpa o carrinho após 2 segundos e redireciona
        setTimeout(() => {
          this.cartService.clearCart();
          this.router.navigate(['/products']);
        }, 3000);
      } catch (error) {
        console.error('Erro ao confirmar compra:', error);
        this.errorMessage = 'Erro ao processar pedido. Tente novamente.';
        this.isLoading = false;
      }
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
