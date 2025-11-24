const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avxuuzywjutffyyvpsan.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eHV1enl3anV0ZmZ5eXZwc2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE0MTcsImV4cCI6MjA3NTk1NzQxN30.G6EswU9YRoje5Z_r2C8nUNSq_m-r-fu-S0VEbAK9Osc';

// Use service role key for admin operations
const supabaseAdminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eHV1enl3anV0ZmZ5eXZwc2FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM4MTQxNywiZXhwIjoyMDc1OTU3NDE3fQ.j75rjr9jHjNn2VW8s8GlGVFEbP-8Y2O3XvCXh_dZHrI';

const supabase = createClient(supabaseUrl, supabaseAdminKey);

async function createOrdersTable() {
  try {
    console.log('📦 Criando tabela de pedidos no Supabase...\n');

    // Execute SQL directly
    const { data, error } = await supabase.rpc('execute_sql', {
      query: `
-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
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

-- Criar índices
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver seus próprios pedidos
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuário pode criar pedidos
CREATE POLICY IF NOT EXISTS "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode atualizar seus próprios pedidos
CREATE POLICY IF NOT EXISTS "Users can update their own orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id);
      `
    });

    if (error) throw error;

    console.log('✅ Tabela criada com sucesso!\n');
    console.log('📊 Estrutura da tabela:');
    console.log('   - id (UUID, Primary Key)');
    console.log('   - user_id (UUID, Foreign Key → auth.users)');
    console.log('   - order_id (TEXT, Unique)');
    console.log('   - items (JSONB)');
    console.log('   - subtotal (DECIMAL)');
    console.log('   - shipping_cost (DECIMAL)');
    console.log('   - total (DECIMAL)');
    console.log('   - cep (VARCHAR)');
    console.log('   - status (VARCHAR)');
    console.log('   - created_at (TIMESTAMP)');
    console.log('   - updated_at (TIMESTAMP)\n');
    console.log('✅ Índices criados');
    console.log('✅ RLS (Row Level Security) habilitado');
    console.log('✅ Políticas de segurança configuradas\n');
    console.log('🎉 Pronto para usar!');

  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error.message);
    console.log('\n💡 Alternativa: Crie manualmente via Dashboard Supabase');
    console.log('   1. Acesse https://supabase.com/dashboard');
    console.log('   2. SQL Editor → Cole o SQL do arquivo ORDERS_SETUP.md');
    console.log('   3. Execute\n');
    process.exit(1);
  }
}

createOrdersTable();
