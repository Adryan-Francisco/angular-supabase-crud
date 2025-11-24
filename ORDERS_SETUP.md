# 📦 Setup de Pedidos no Supabase

## ✅ Funcionalidade Implementada

O sistema agora está preparado para salvar as compras no Supabase. Para isso funcionar, você precisa criar uma tabela de pedidos no seu banco de dados.

---

## 🗄️ Criando a Tabela de Pedidos

### Opção 1: Via Dashboard Supabase (Recomendado)

1. **Acesse o Supabase**: https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá para SQL Editor** (lado esquerdo)
4. **Cole o SQL abaixo**:

```sql
-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para buscas rápidas
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_order_id_idx ON orders(order_id);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver seus próprios pedidos
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuário pode criar pedidos
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode atualizar seus próprios pedidos
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id);
```

5. **Clique em "Run"** ou **Ctrl+Enter**

---

### Opção 2: Via Table Editor Supabase

1. **Vá para "Table Editor"**
2. **Clique em "Create a new table"**
3. **Nome da tabela**: `orders`
4. **Adicione as colunas**:

| Nome | Tipo | Nullable | Default |
|------|------|----------|---------|
| id | uuid | false | gen_random_uuid() |
| user_id | uuid | false | - |
| order_id | text | false | - |
| items | jsonb | false | - |
| subtotal | numeric | false | - |
| shipping_cost | numeric | false | - |
| total | numeric | false | - |
| cep | varchar(8) | false | - |
| status | varchar(50) | true | 'pendente' |
| created_at | timestamptz | false | now() |
| updated_at | timestamptz | false | now() |

5. **Configure as políticas de RLS** conforme o SQL acima

---

## 🔒 Estrutura de Dados

### Table: `orders`

```typescript
interface Order {
  id?: string;                    // UUID gerado
  user_id: string;                // ID do usuário autenticado
  order_id: string;               // ID único (ORD-timestamp-random)
  items: OrderItem[];             // JSON com itens da compra
  subtotal: number;               // Subtotal (sem frete)
  shipping_cost: number;          // Frete
  total: number;                  // Total final
  cep: string;                    // CEP de entrega
  status: string;                 // 'pendente', 'processando', 'enviado', etc.
  created_at?: string;            // Data de criação
  updated_at?: string;            // Data de atualização
}

interface OrderItem {
  productId: number;              // ID do produto
  productName: string;            // Nome do produto
  quantity: number;               // Quantidade
  price: number;                  // Preço unitário
  image: string;                  // URL da imagem
}
```

---

## 🚀 Como Usar

### 1. **Fazer uma Compra**

- Navegue até `/products`
- Adicione produtos ao carrinho
- Vá para `/cart`
- Preencha o CEP
- Clique "Ir para Resumo"
- Clique "Confirmar Compra"

### 2. **Verificar Pedidos no Supabase**

1. **Dashboard Supabase** → **Table Editor** → **orders**
2. Você verá todos os pedidos criados
3. Clique em um pedido para ver os detalhes

### 3. **Programaticamente**

```typescript
// No seu serviço ou componente
const orders = await this.supabaseService.getOrdersByUser(userId);
console.log(orders);
```

---

## ✨ Funcionalidades Implementadas

### ✅ No SupabaseService (`supabase.service.ts`)

```typescript
// Criar um novo pedido
await this.supabaseService.createOrder(order);

// Buscar pedidos de um usuário
await this.supabaseService.getOrdersByUser(userId);

// Buscar um pedido específico
await this.supabaseService.getOrderById(orderId);
```

### ✅ No CheckoutComponent (`checkout.component.ts`)

- Salva o pedido automaticamente ao confirmar
- Mostra mensagens de erro se houver problemas
- Exibe loading enquanto processa
- Redireciona após sucesso

---

## 🧪 Teste a Integração

### Passo 1: Criar a Tabela
Execute o SQL acima no Supabase

### Passo 2: Fazer um Pedido
```
1. npm start
2. Login
3. Ir para /products
4. Adicionar produtos
5. Ir para /cart
6. Preencher CEP: 12345678
7. Ir para /checkout
8. Confirmar Compra
```

### Passo 3: Verificar no Supabase
- Vá para **Table Editor** → **orders**
- Você deve ver o pedido recém criado

---

## 🐛 Troubleshooting

### Erro: "relation 'public.orders' does not exist"
**Solução**: Crie a tabela executando o SQL no Supabase

### Erro: "RLS policy violation"
**Solução**: Verifique se as políticas RLS foram criadas corretamente

### Erro: "user_id not found"
**Solução**: Certifique-se de estar logado antes de confirmar a compra

### Pedido não aparece após confirmar
**Solução**: 
1. Abra o console do navegador (F12)
2. Procure por mensagens de erro
3. Verifique se `supabaseKey` e `supabaseUrl` estão corretos em `environment.ts`

---

## 📝 Próximos Passos Opcionais

- [ ] Adicionar coluna de endereço
- [ ] Adicionar métodos de pagamento
- [ ] Criar página de histórico de pedidos
- [ ] Enviar email de confirmação
- [ ] Integrar com sistema de rastreamento
- [ ] Dashboard de vendas (admin)

---

**Data**: 24 de Novembro de 2025  
**Status**: ✅ Pronto para usar
