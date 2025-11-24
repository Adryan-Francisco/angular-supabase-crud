export interface Order {
  id?: string;
  user_id: string;
  order_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  cep: string;
  created_at?: string;
  status?: string;
}

export interface OrderItem {
  productId: number | undefined;
  productName: string;
  quantity: number;
  price: number;
  image: any;
}
