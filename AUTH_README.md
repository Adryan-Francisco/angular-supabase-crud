# Sistema de Autenticação - Angular + Supabase

## ✅ Implementação Completa

Sistema de autenticação adicionado ao projeto conforme roteiro de aula do dia 20/10.

### 🔐 Funcionalidades Implementadas

1. **Login com Email e Senha**

   - Tela de login moderna com Material Design
   - Validação de campos
   - Feedback de loading
   - Mensagens de erro

2. **Proteção de Rotas**

   - AuthGuard implementado
   - Rotas protegidas: `/` (Home) e `/products`
   - Redirecionamento automático para login

3. **Logout**

   - Botão de logout na Home e na tela de Produtos
   - Limpeza de sessão
   - Redirecionamento para tela de login

4. **Gerenciamento de Sessão**
   - Usuário mantido logado entre recarregamentos
   - Observador de mudanças de autenticação
   - Signal reativo para usuário logado

### 📁 Arquivos Criados/Modificados

#### Criados:

- `src/app/auth/login/login.component.ts`
- `src/app/auth/login/login.component.html`
- `src/app/auth/login/login.component.css`
- `src/app/guards/auth.guard.ts`
- `AUTH_README.md` (este arquivo)

#### Modificados:

- `src/app/services/supabase.service.ts` - Adicionado login/logout
- `src/app/app.routes.ts` - Adicionado rota de login e guards
- `src/app/home/home.component.ts` - Adicionado logout
- `src/app/home/home.component.html` - Adicionado header com info do usuário
- `src/app/home/home.component.css` - Estilos do header
- `src/app/products/products.component.ts` - Adicionado logout
- `src/app/products/products.component.html` - Adicionado botão logout
- `src/app/products/products.component.css` - Estilos do botão logout

### 🚀 Como Testar

#### 1. Criar Usuário no Supabase

Primeiro, você precisa criar um usuário no Supabase:

**Opção A: Via Dashboard do Supabase**

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em `Authentication` → `Users`
3. Clique em `Add User`
4. Preencha email e senha
5. Clique em `Create User`

**Opção B: Via SQL (com email de confirmação desabilitado)**

```sql
-- No SQL Editor do Supabase
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'seu@email.com',
  crypt('suasenha', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

#### 2. Executar o Projeto

```powershell
npm install
npm start
```

#### 3. Testar o Fluxo

1. **Acesse** `http://localhost:4200`

   - Deve redirecionar automaticamente para `/login`

2. **Faça Login**

   - Use o email e senha criados no Supabase
   - Clique em "Entrar"
   - Deve redirecionar para a Home

3. **Verifique a Home**

   - Deve mostrar seu email no canto superior esquerdo
   - Botão "Sair" no canto superior direito
   - Todas as funcionalidades normais

4. **Acesse Produtos**

   - Clique em "Ver Produtos" ou nos cards
   - Deve funcionar normalmente
   - Botão "Sair" também disponível

5. **Teste Logout**

   - Clique no botão "Sair"
   - Deve redirecionar para `/login`
   - Sessão encerrada

6. **Teste Proteção de Rotas**

   - Após logout, tente acessar `http://localhost:4200/`
   - Deve redirecionar para `/login`
   - Mesmo para `http://localhost:4200/products`

7. **Teste Persistência de Sessão**
   - Faça login
   - Recarregue a página (F5)
   - Deve permanecer logado

### 🔧 Configuração do Supabase

Certifique-se de que seu arquivo `environment.ts` está correto:

```typescript
export const environment = {
  production: false,
  supabaseUrl: "SUA_URL_DO_SUPABASE",
  supabaseKey: "SUA_CHAVE_PUBLICA_DO_SUPABASE",
};
```

### 🎨 Visual

- **Tela de Login**: Design moderno com glassmorphism, gradientes azuis e animações
- **Botão Logout**: Presente na Home e na tela de Produtos
- **Info do Usuário**: Email exibido na Home
- **Feedback Visual**: Loading spinner durante login

### ⚠️ Observações Importantes

1. **Row Level Security (RLS)**: Se estiver usando RLS no Supabase, configure as políticas para permitir acesso aos produtos após autenticação

2. **Políticas Recomendadas** para tabela `products`:

```sql
-- Permitir SELECT para usuários autenticados
CREATE POLICY "Allow authenticated users to read products"
ON products FOR SELECT
TO authenticated
USING (true);

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Allow authenticated users to insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Allow authenticated users to update products"
ON products FOR UPDATE
TO authenticated
USING (true);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Allow authenticated users to delete products"
ON products FOR DELETE
TO authenticated
USING (true);
```

3. **Email de Confirmação**: Por padrão, o Supabase pode exigir confirmação de email. Para desenvolvimento, desabilite em:
   - Dashboard → Authentication → Settings → Email Auth → Disable "Enable email confirmations"

### 🐛 Troubleshooting

**Problema**: Erro "Invalid login credentials"

- Verifique se o usuário foi criado corretamente no Supabase
- Confirme que o email foi confirmado (ou desabilite confirmação)
- Verifique as credenciais

**Problema**: Redirecionamento infinito para login

- Limpe o localStorage do navegador
- Verifique se `supabaseUrl` e `supabaseKey` estão corretos

**Problema**: Produtos não carregam após login

- Verifique as políticas RLS no Supabase
- Confirme que o usuário está autenticado (console do navegador)

### 📚 Próximos Passos (Opcional)

- [ ] Adicionar tela de registro de novos usuários
- [ ] Implementar recuperação de senha
- [ ] Adicionar perfis de usuário
- [ ] Implementar roles/permissões diferentes
- [ ] Adicionar autenticação social (Google, GitHub, etc.)

---

**Desenvolvido seguindo o roteiro de aula do dia 20/10** ✅
