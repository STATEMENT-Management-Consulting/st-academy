# 🎬 GUIA FINAL: Testar Autenticação Admin

## ⚡ TL;DR (5 minutos)

```bash
# 1. No terminal
npm run dev

# 2. No Supabase SQL Editor (https://app.supabase.com)
CREATE TABLE public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
INSERT INTO public.admins (email) VALUES ('seu-email@teste.com');

# 3. Na UI (http://localhost:3000/login)
Email: seu-email@teste.com
Password: sua-senha
Clica "Entrar"

# ✅ Resultado esperado: Redireciona para /admin
```

---

## 📝 Passo a Passo Detalhado

### PARTE 1️⃣: Setup do Supabase (3 min)

#### A. Criar Tabela `admins`

1. Abrir: https://app.supabase.com
2. Seleccionar projeto "ST Academy"
3. Lado esquerdo: **SQL Editor**
4. Novo query
5. **Cole este SQL:**

```sql
-- Criar tabela admins
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Desabilitar RLS (segurança simplificada para testes)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
```

6. Clicar **Execute**
7. ✅ Deve aparecer: "Success. No rows returned."

#### B. Criar Utilizador de Teste

1. Lado esquerdo: **Authentication**
2. Ir em: **Users**
3. Clique: **Add user**
4. **Email**: `admin@teste.com`
5. **Password**: `Teste123!` (ou qualquer senha segura)
6. Clique: **Create user**
7. ✅ Utilizador criado

#### C. Adicionar Email à Tabela `admins`

1. Voltar a **SQL Editor**
2. Novo query
3. Cole:

```sql
INSERT INTO public.admins (email) 
VALUES ('admin@teste.com')
ON CONFLICT (email) DO NOTHING;
```

4. Clique **Execute**
5. ✅ Deve aparecer: "Success. No rows returned."

---

### PARTE 2️⃣: Iniciar Servidor (1 min)

```bash
cd /Users/itechzoneao/Documents/st-academy
npm run dev
```

✅ Quando vir: `- local: http://localhost:3000` → pronto!

---

### PARTE 3️⃣: Testar Login (1 min)

#### Teste A: Acesso sem credenciais

1. Abrir: `http://localhost:3000/admin`
2. **Esperado**: Redireciona automaticamente para `/login`
3. ✅ **Passou**: Middleware está a proteger

#### Teste B: Login com email admin ✅

1. Abrir: `http://localhost:3000/login`
2. **Email**: `admin@teste.com`
3. **Password**: `Teste123!`
4. Clique: **Entrar**

**Verificar Console (F12):**
```
🔐 Iniciando login para: admin@teste.com
✅ Login bem-sucedido para: admin@teste.com
🔍 Verificando se é admin...
Admin status: true
✅ Utilizador é admin, redirecionando para /admin
```

**Resultado final:**
- Vê "A entrar..." por um instante
- Redireciona para `/admin`
- Vê o painel de administração com eventos

✅ **Passou**: Fluxo completo funcionando!

---

## 🛠️ Debug Tools (Se algo não funcionar)

### Na página `/login` (canto inferior direito)

Você verá 3 botões pretos:

**1️⃣ Verificar Tabela Admins**
- Mostra se a tabela existe
- Lista todos os emails admin
- Deve mostrar: `admin@teste.com`

**2️⃣ Verificar Sessão**
- Se não está logado: `Sem sessão ativa`
- Se está logado:
  - ✅ Mostra o email
  - Diz se é admin ou não

**3️⃣ Adicionar Utilizador Como Admin**
- Se estiver logado, adiciona ele próprio como admin
- Útil para testes rápidos

---

## 🔍 Se Não Funcionar

### Sintoma: Fica na página `/login` após entrar

**Causa provável**: Email não está na tabela `admins`

**Solução**:
1. Na página `/login`, clicar botão **"Verificar Sessão"**
2. Ver se mostra `✅ É admin!` ou `❌ Não é admin`
3. Se não é admin:
   - Opção A: Clicar **"Adicionar Como Admin"**
   - Opção B: Ir para Supabase e executar:
     ```sql
     INSERT INTO public.admins (email) 
     VALUES ('seu-email@teste.com');
     ```

### Sintoma: Erro "Email ou senha inválidos"

**Causa provável**: Utilizador não foi criado no Supabase

**Solução**:
1. Ir para Supabase Authentication → Users
2. Verificar se o email existe
3. Se não existe, criar novo utilizador

### Sintoma: Tabela não existe

**Solução**:
1. Ir para Supabase SQL Editor
2. Executar o script SQL da PARTE 1️⃣
3. Pronto!

---

## 📊 Resumo Final

| Teste | Esperado | Status |
|-------|----------|--------|
| Acesso /admin sem login | Redireciona para /login | ✅ |
| Login com email admin | Redireciona para /admin | ✅ |
| Login com email não-admin | Vê "Acesso restrito" | ✅ |
| Logout automático | Removido de admin se não autorizado | ✅ |

---

## 🎉 Pronto!

Se passou em todos os testes:

✅ **Fluxo completo de autenticação funcionando!**

Agora pode:
- Adicionar mais admins
- Criar eventos no `/admin`
- Ver inscrições em `/admin/inscricoes`

---

**Dúvidas? Ver:**
- [FLUXO_AUTENTICACAO_ADMIN.md](./FLUXO_AUTENTICACAO_ADMIN.md) - Explicação técnica
- [DEBUG_LOGIN_FLOW.md](./DEBUG_LOGIN_FLOW.md) - Guia de debug avançado
