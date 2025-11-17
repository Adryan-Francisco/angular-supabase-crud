import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Signal para armazenar itens do carrinho
  private cartItems = signal<CartItem[]>([]);

  // Signal para CEP
  private cep = signal<string>('');

  // Getter para acessar os itens do carrinho
  items = computed(() => this.cartItems());

  // Getter para acessar o CEP
  cepValue = computed(() => this.cep());

  // Quantidade total de itens
  totalItems = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  // Subtotal (sem frete)
  subtotal = computed(() => {
    return this.cartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  });

  // Calcula o valor do frete
  shippingCost = computed(() => {
    const subtotal = this.subtotal();
    // Frete grátis para compras acima de R$ 100
    return subtotal > 100 ? 0 : 15; // R$ 15 de frete padrão
  });

  // Total geral (subtotal + frete)
  total = computed(() => {
    return this.subtotal() + this.shippingCost();
  });

  // Verifica se o carrinho está vazio
  isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {}

  /**
   * Adiciona um produto ao carrinho ou incrementa sua quantidade
   */
  addToCart(product: Product) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      // Incrementa a quantidade
      existingItem.quantity++;
      this.cartItems.set([...currentItems]);
    } else {
      // Adiciona novo item
      this.cartItems.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  /**
   * Incrementa a quantidade de um item
   */
  incrementQuantity(productId: number | undefined) {
    const currentItems = this.cartItems();
    const item = currentItems.find((it) => it.product.id === productId);

    if (item) {
      item.quantity++;
      this.cartItems.set([...currentItems]);
    }
  }

  /**
   * Decrementa a quantidade de um item
   */
  decrementQuantity(productId: number | undefined) {
    const currentItems = this.cartItems();
    const item = currentItems.find((it) => it.product.id === productId);

    if (item && item.quantity > 1) {
      item.quantity--;
      this.cartItems.set([...currentItems]);
    }
  }

  /**
   * Remove um item do carrinho
   */
  removeFromCart(productId: number | undefined) {
    const currentItems = this.cartItems();
    this.cartItems.set(currentItems.filter((it) => it.product.id !== productId));
  }

  /**
   * Define o CEP para cálculo de frete
   */
  setCep(cepValue: string) {
    // Remove caracteres não numéricos
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      this.cep.set(cleanCep);
    }
  }

  /**
   * Limpa o carrinho
   */
  clearCart() {
    this.cartItems.set([]);
    this.cep.set('');
  }

  /**
   * Obtém o resumo do carrinho
   */
  getCartSummary() {
    return {
      items: this.cartItems(),
      subtotal: this.subtotal(),
      shipping: this.shippingCost(),
      total: this.total(),
      cep: this.cep(),
    };
  }
}
