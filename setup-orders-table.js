#!/usr/bin/env node

const https = require('https');

const supabaseUrl = 'https://avxuuzywjutffyyvpsan.supabase.co';
const supabaseAdminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eHV1enl3anV0ZmZ5eXZwc2FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM4MTQxNywiZXhwIjoyMDc1OTU3NDE3fQ.j75rjr9jHjNn2VW8s8GlGVFEbP-8Y2O3XvCXh_dZHrI';

const sql = `
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode ver seus próprios pedidos
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuário pode criar pedidos
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuário pode atualizar seus próprios pedidos
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id);
`;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, supabaseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAdminKey}`,
        'apikey': supabaseAdminKey,
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function createTable() {
  try {
    console.log('📦 Criando tabela de pedidos no Supabase...\n');

    // Tentar via SQL endpoint
    const payload = JSON.stringify({ query: sql });
    
    try {
      const response = await makeRequest('POST', '/rest/v1/rpc/execute_sql', payload);
      
      if (response.statusCode >= 400) {
        throw new Error(`HTTP ${response.statusCode}`);
      }

      console.log('✅ Tabela criada com sucesso!\n');
      console.log('📊 Estrutura criada:');
      console.log('   ✓ Tabela: orders');
      console.log('   ✓ Colunas: id, user_id, order_id, items, subtotal, shipping_cost, total, cep, status, created_at, updated_at');
      console.log('   ✓ Índices: user_id, order_id, created_at');
      console.log('   ✓ RLS (Row Level Security) habilitado');
      console.log('   ✓ Políticas de segurança configuradas\n');
      console.log('🎉 Pronto para usar!\n');
      console.log('💡 Próximos passos:');
      console.log('   1. npm start');
      console.log('   2. Faça login');
      console.log('   3. Adicione produtos ao carrinho');
      console.log('   4. Confirme a compra');
      console.log('   5. O pedido será salvo no Supabase automaticamente!\n');

    } catch (err) {
      console.log('ℹ️  SQL RPC não disponível. Criando tabela via API REST...\n');
      
      // Tentar criar tabela usando apenas a API REST (alternativa)
      console.log('⚠️  Você precisa criar a tabela manualmente no Supabase Dashboard:\n');
      console.log('1. Acesse: https://supabase.com/dashboard');
      console.log('2. Vá para: SQL Editor');
      console.log('3. Clique em: New Query');
      console.log('4. Cole o seguinte SQL:\n');
      console.log('---SQL INÍCIO---\n');
      console.log(sql);
      console.log('\n---SQL FIM---\n');
      console.log('5. Clique em: Run (ou Ctrl+Enter)');
      console.log('6. Pronto!\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createTable();
