# ✅ Checklist: Configurar e Testar Autenticação Admin

## 1️⃣ Preparar Tabela no Supabase

**Acesse:** https://app.supabase.com → Seu Projeto → SQL Editor

**Execute este SQL:**

```sql
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
```

## 2️⃣ Criar Utilizador de Teste

**No Supabase Console:**
- Authentication → Users
- Add user
- Email: `admin@teste.com`
- Password: `Teste123!`

**Depois execute no SQL Editor:**

```sql
INSERT INTO public.admins (email) VALUES ('admin@teste.com');
```

## 3️⃣ Iniciar Servidor e Testar

**Terminal:**
```bash
npm run dev
```

**Testes de Acesso:**

### ❌ Teste 1: Sem Login
- Abrir: `http://localhost:3000/admin`
- **Esperado:** Redireciona para `/login`

### ❌ Teste 2: Login com Email NÃO Admin
1. Ir para: `http://localhost:3000/login`
2. Criar um utilizador no Supabase (sem adicionar em `admins`)
3. Fazer login
4. **Esperado:** Mensagem "Acesso restrito" → volta para `/login`

### ✅ Teste 3: Login com Email Admin (deve funcionar!)
1. Ir para: `http://localhost:3000/login`
2. Email: `admin@teste.com`
3. Password: `Teste123!`
4. **Esperado:** Redireciona para `/admin` e vê o painel

## 4️⃣ Verificar Logs (DevTools)

Abrir **F12 → Console** durante o login para ver:

```
🔐 Iniciando login para: admin@teste.com
✅ Login bem-sucedido para: admin@teste.com
🔍 Verificando se é admin...
Admin status: true
✅ Utilizador é admin, redirecionando para /admin
```

## 5️⃣ Debug Component (Canto Inferior Direito)

Na página `/login` existem 3 botões para debug:
- **Verificar Tabela Admins** → lista emails cadastrados
- **Verificar Sessão** → mostra utilizador atual
- **Adicionar Como Admin** → adiciona rápido para teste

## 🎉 Pronto!

Se tudo passou nos testes ✅ → Fluxo completo funcionando!

---

**Documentação:** Ver [ADMIN_AUTH_SETUP.md](./ADMIN_AUTH_SETUP.md)
