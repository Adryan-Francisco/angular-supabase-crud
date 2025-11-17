import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router);

  cepInput: string = '';
  showCepError: boolean = false;

  /**
   * Valida e define o CEP
   */
  onCepChange(value: string) {
    this.cepInput = value;
    if (value.length === 8 || value.replace(/\D/g, '').length === 8) {
      this.cartService.setCep(value);
      this.showCepError = false;
    } else if (value.length > 0) {
      this.showCepError = true;
    }
  }

  /**
   * Volta para listagem de produtos
   */
  continueShopping() {
    this.router.navigate(['/products']);
  }

  /**
   * Vai para tela de resumo
   */
  goToCheckout() {
    if (!this.cartService.isEmpty()) {
      this.router.navigate(['/checkout']);
    }
  }

  /**
   * Limpa o carrinho
   */
  clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.cartService.clearCart();
      this.cepInput = '';
    }
  }

  /**
   * Trata erro ao carregar imagem
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/100?text=Produto';
  }
}
