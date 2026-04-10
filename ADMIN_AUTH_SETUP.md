# 🔐 Configuração da Tabela de Admins no Supabase

## Passo 1: Criar a Tabela `admins`

Acesse o console do Supabase e execute o seguinte SQL:

```sql
-- Criar tabela de admins
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Criar índice para busca rápida de email
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Desabilitar RLS (Row Level Security) para testes
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
```

## Passo 2: Adicionar Utilizadores Admins

Após criar a tabela, insira os emails dos administradores:

```sql
-- Inserir utilizadores admin
INSERT INTO public.admins (email) VALUES
  ('seu-email@empresa.com'),
  ('outro-admin@empresa.com')
ON CONFLICT (email) DO NOTHING;
```

**Substituir `seu-email@empresa.com` pelos emails dos admins reais.**

## Passo 3: Criar um Utilizador de Teste

1. **No Supabase Console:**
   - Ir em **Authentication → Users**
   - Clicar em **Add user**
   - Insira um email de teste (ex: `admin@teste.com`)
   - Insira uma senha de teste (ex: `Teste123!`)

2. **Depois no SQL Editor, execute:**
   ```sql
   INSERT INTO public.admins (email) VALUES ('admin@teste.com') ON CONFLICT (email) DO NOTHING;
   ```

## Passo 4: Testar o Fluxo

### Teste 1: Aceder a `/admin` sem estar logado
- **URL:** `http://localhost:3000/admin`
- **Esperado:** Redireciona automaticamente para `/login` (proteção middleware)

### Teste 2: Fazer login com email NÃO admin
1. Criar um utilizador de teste no Supabase (sem adicionar à tabela `admins`)
2. Ir para `http://localhost:3000/login`
3. Fazer login com esse email
4. **Esperado:**
   - Console deve mostrar: `✅ Login bem-sucedido`, `Admin status: false`
   - Vê a página de "Acesso restrito" 
   - Redireciona para `/login?erro=acesso-restrito`

### Teste 3: Fazer login com email admin ✅
1. Ir para `http://localhost:3000/login`
2. Fazer login com um email que está em `public.admins`
3. **Esperado:**
   - Console deve mostrar: `✅ Login bem-sucedido`, `Admin status: true`
   - Vê a mensagem "A entrar..."
   - Redireciona para `/admin`
   - Vê o painel de administração

## 🛠️ Ferramentas de Debug

Na página de login (`/login`) existe um componente de debug (canto inferior direito):

### Botões Disponíveis:

1. **Verificar Tabela Admins**
   - Mostra se a tabela `admins` existe
   - Lista todos os emails cadastrados como admin

2. **Verificar Sessão**
   - Mostra o email do utilizador atualmente logado
   - Verifica se esse email é admin

3. **Adicionar Utilizador Como Admin**
   - Adiciona o utilizador atualmente logado como admin
   - Útil para testar rapidamente

## 🔍 Verificar Logs no Console

Abrir **DevTools (F12 → Console)** durante o login para ver:

```
🔐 Iniciando login para: admin@teste.com
✅ Login bem-sucedido para: admin@teste.com
🔍 Verificando se é admin...
Admin status: true
✅ Utilizador é admin, redirecionando para /admin
```

## 📝 Notas Importantes

- ⚠️ RLS foi desabilitado para simplificar testes
- ✅ Em produção, ativar RLS com políticas apropriadas
- 🔐 Middleware do Next.js protege `/admin/*` no servidor
- 🛡️ Cliente-side também valida (proteção em camadas)
- 🐛 Debug component deve ser removido em produção

## 🚀 Em Produção

Remover o `AuthDebugComponent` de [src/app/login/page.tsx](./src/app/login/page.tsx):

```tsx
{/* Debug component - REMOVER EM PRODUÇÃO */}
{/* <AuthDebugComponent /> */}
```

---

**Middleware em:** [middleware.ts](./middleware.ts)  
**Autenticação em:** [src/services/auth.service.ts](./src/services/auth.service.ts)  
**Login em:** [src/app/login/page.tsx](./src/app/login/page.tsx)
