# 🔧 Diagnóstico: Fluxo de Login para Admin

## Problema Identificado

O middleware + client-side guard estavam criando conflito. **Solução**: Confiar apenas no middleware (servidor) que é mais confiável.

## Alterações Feitas

1. ✅ **Middleware melhorado** (`middleware.ts`):
   - Logs detalhados para debug
   - Tratamento correto de cookies
   - Validação de admin no servidor

2. ✅ **Fluxo de login corrigido** (`src/app/login/page.tsx`):
   - `await` correto no setTimeout
   - Não limpar loading state durante redirecionamento
   - Esperar 300ms antes de redirecionar

3. ✅ **Admin layout simplificado** (`src/app/admin/layout.tsx`):
   - Removido client-side `AdminGuard` redundante
   - Confiando no middleware (servidor) para validação

## Como Testar Agora

### 1️⃣ Verificar Tabela no Supabase

```sql
-- Verificar se tabela existe e tem dados
SELECT * FROM public.admins;

-- Se vazia, inserir um teste
INSERT INTO public.admins (email) VALUES ('admin@teste.com');
```

### 2️⃣ Criar Utilizador de Teste

- Supabase Console → Authentication → Users
- Add user: `admin@teste.com` / `Teste123!`

### 3️⃣ Iniciar Servidor

```bash
npm run dev
```

### 4️⃣ Testes

**Teste A: Sem credenciais**
```
1. Abrir: http://localhost:3000/admin
2. Esperado: Redireciona para /login (middleware bloqueia)
```

**Teste B: Login bem-sucedido (admin)**
```
1. Ir para: http://localhost:3000/login
2. Email: admin@teste.com
3. Password: Teste123!
4. Clicá em "Entrar"
5. Console mostra:
   🔐 Iniciando login para: admin@teste.com
   ✅ Login bem-sucedido para: admin@teste.com
   🔍 Verificando se é admin...
   Admin status: true
   ✅ Utilizador é admin, redirecionando para /admin
6. ✅ Esperado: Redireciona para /admin e vê o painel
```

**Teste C: Email não admin**
```
1. Criar novo utilizador no Supabase (ex: user@teste.com)
2. NÃO adicionar à tabela admins
3. Fazer login
4. Console mostra: Admin status: false
5. ✅ Esperado: Vê "Acesso restrito" → volta para /login
```

## 🐛 Debug Component

Na página `/login` (canto inferior direito) tem 3 botões:

1. **Verificar Tabela Admins** → Lista emails admin
2. **Verificar Sessão** → Mostra user atual + se é admin
3. **Adicionar Como Admin** → Adiciona rápido para teste

## 📊 Logs no Servidor

Abrir terminal onde roda `npm run dev` e procurar por:

```
[Middleware] User check: { email: 'admin@teste.com', pathname: '/admin' }
[Middleware] Admin check: { email: 'admin@teste.com', isAdmin: true, error: null }
[Middleware] Admin validado, continuando...
```

## ✅ Se Funcionar

- ✅ Sem credenciais: Bloqueado no middleware
- ✅ Admin válido: Redireciona para /admin
- ✅ Não admin: Vê mensagem de acesso restrito
- ✅ Console mostra logs detalhados

## ❌ Se Não Funcionar

1. **Verificar tabela `admins` existe**:
   - Supabase Console → Table Editor
   - Deve ver a tabela `admins`

2. **Verificar email está na tabela**:
   - Clicar em `admins` → Procurar o email
   - Se não está: usar botão "Adicionar Como Admin"

3. **Verificar logs no terminal** (onde roda `npm run dev`):
   - Procurar por `[Middleware]` messages
   - Se vir `error:` → há problema na query

4. **Verificar console do navegador** (F12):
   - Procurar por `🔐 Iniciando login`
   - Se vir `Admin status: false` → email não está em admins

---

**Documentos relacionados:**
- [ADMIN_LOGIN_CHECKLIST.md](./ADMIN_LOGIN_CHECKLIST.md)
- [ADMIN_AUTH_SETUP.md](./ADMIN_AUTH_SETUP.md)
