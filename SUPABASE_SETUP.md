# 🚀 Guia de Configuração Supabase - ST Academy

## Resumo da Integração Realizada

A aplicação foi totalmente integrada com Supabase! Agora todos os componentes da aplicação conectam com um banco de dados real:

- ✅ **Hero (Carrossel)** - Busca eventos futuros (upcoming)
- ✅ **Team (Seção de Eventos)** - Busca eventos futuros e passados  
- ✅ **Admin Panel** - CRUD completo de eventos
- ✅ **Admin/Inscrições** - Gerenciar registrations dos usuários

## ⚙️ Passo-a-Passo: Criar Schema no Supabase

### 1️⃣ Acessar o SQL Editor

1. Vá para [app.supabase.com](https://app.supabase.com)
2. Faça login com suas credenciais
3. Selecione seu projeto
4. No menu lateral, clique em **SQL Editor**

### 2️⃣ Criar a Tabela de Eventos

Cole este SQL no editor e clique em **Run**:

```sql
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date text not null,
  time text not null,
  location text not null,
  instructor text not null,
  description text not null,
  duration text not null,
  capacity integer not null,
  price text not null,
  image text not null,
  type text not null check (type in ('upcoming', 'past')),
  gallery text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para melhor performance
create index idx_events_type on events(type);
create index idx_events_date on events(date);
```

### 3️⃣ Criar a Tabela de Registrations (Inscrições)

```sql
create table if not exists registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices
create index idx_registrations_event_id on registrations(event_id);
create index idx_registrations_email on registrations(email);
```

### 4️⃣ Desabilitar RLS (Row Level Security)

⚠️ **IMPORTANTE**: Como solicitado, RLS não está habilitado. Para usar em produção, você precisará ativar RLS depois.

**Para cada tabela:**

1. No menu lateral, vá para **Authentication** > **Policies**
2. Selecione a tabela `events`
3. Se houver uma badge "RLS Enabled", clique em **Disable RLS**
4. Repita para a tabela `registrations`

### 5️⃣ Inserir Dados de Exemplo (Opcional)

Para testar a aplicação com dados reais, execute:

```sql
-- Inserir eventos futuros
insert into events (title, date, time, location, instructor, description, duration, capacity, price, image, type, gallery)
values
  (
    'Workshop de React Avançado',
    '15 de Abril',
    '09:00 - 17:00',
    'Luanda, Angola',
    'Carlos Dev',
    'Aprenda técnicas avançadas de React incluindo hooks customizados, state management com Context API e otimizações de performance.',
    '8 horas',
    30,
    'AOA 49.990',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    'upcoming',
    array['https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop']
  ),
  (
    'Bootcamp Full Stack',
    '29 de Abril',
    '09:00 - 17:00',
    'Luanda, Angola',
    'Pedro Tech',
    'Um programa intensivo cobrindo frontend com React, backend com Node.js e deployment na nuvem. Saia com um projeto completo.',
    '40 horas',
    20,
    'AOA 149.990',
    'https://images.unsplash.com/photo-1522202176988-696a6db3c923?w=500&h=400&fit=crop',
    'upcoming',
    array['https://images.unsplash.com/photo-1522202176988-696a6db3c923?w=500&h=400&fit=crop']
  ),
  (
    'Masterclass de UI/UX',
    '6 de Maio',
    '14:00 - 18:00',
    'Online',
    'João Design',
    'Mergulhe nos princípios de design moderno, user research e prototipagem. Trabalharemos com Figma em casos de uso reais.',
    '4 horas',
    25,
    'AOA 29.990',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    'upcoming',
    array[]
  );

-- Inserir eventos passados (com galerias)
insert into events (title, date, time, location, instructor, description, duration, capacity, price, image, type, gallery)
values
  (
    'Conferência de Tecnologia 2024',
    '10 de Março',
    '09:00 - 17:00',
    'Luanda, Angola',
    'Equipe ST Academy',
    'Uma conferência abrangente com palestrantes internacionais, apresentando as tendências mais recentes em tecnologia.',
    '8 horas',
    200,
    'Gratuito',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    'past',
    array[
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-696a6db3c923?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop'
    ]
  );

-- Inserir algumas inscrições de exemplo
insert into registrations (event_id, name, email, phone)
select id, 'João Silva', 'joao@example.com', '+244 923 456 789'
from events where title = 'Workshop de React Avançado'
limit 1;

insert into registrations (event_id, name, email, phone)
select id, 'Maria Santos', 'maria@example.com', '+244 924 567 890'
from events where title = 'Workshop de React Avançado'
limit 1;

insert into registrations (event_id, name, email, phone)
select id, 'Pedro Oliveira', 'pedro@example.com', '+244 925 678 901'
from events where title = 'Bootcamp Full Stack'
limit 1;
```

## 🎯 Estrutura de Dados

### Tabela: `events`

```
Coluna          | Tipo        | Descrição
----------------|-------------|---------------------------------------------
id              | UUID        | Identificador único
title           | TEXT        | Título do evento
date            | TEXT        | Data formatada (ex: "15 de Abril")
time            | TEXT        | Horário (ex: "09:00 - 17:00")
location        | TEXT        | Local do evento
instructor      | TEXT        | Nome do instrutor
description     | TEXT        | Descrição completa
duration        | TEXT        | Duração (ex: "8 horas")
capacity        | INTEGER     | Número de vagas
price           | TEXT        | Preço formatado (ex: "AOA 49.990")
image           | TEXT        | URL da imagem principal
type            | TEXT        | 'upcoming' ou 'past'
gallery         | TEXT[]      | Array de URLs das fotos da galeria
created_at      | TIMESTAMP   | Data de criação
```

### Tabela: `registrations`

```
Coluna          | Tipo        | Descrição
----------------|-------------|---------------------------------------------
id              | UUID        | Identificador único
event_id        | UUID        | Referência à tabela events (FK)
name            | TEXT        | Nome do participante
email           | TEXT        | Email do participante
phone           | TEXT        | Telefone do participante
registered_at   | TIMESTAMP   | Data da inscrição
```

## 🔌 Como a Aplicação Funciona

### 1. Hero Component (`/src/components/Hero.tsx`)

```typescript
// Busca eventos futuros para o carrossel
const { data } = await supabase
  .from("events")
  .select("*")
  .eq("type", "upcoming")
  .order("date", { ascending: true })
```

- Mostra um carrossel com eventos futuros
- Auto-play a cada 5 segundos
- Modal ao clicar na imagem

### 2. Team Component (`/src/components/Team.tsx`)

```typescript
// Seção de próximos eventos
const { data: upcoming } = await supabase
  .from("events")
  .select("*")
  .eq("type", "upcoming")

// Seção de eventos anteriores com galeria
const { data: past } = await supabase
  .from("events")
  .select("*")
  .eq("type", "past")
```

- Mostra 3 eventos futuros em cards
- Mostra 4 eventos passados com galeriat
- Galeria interativa ao clicar

### 3. Admin Panel (`/src/app/admin/page.tsx`)

- **Criar**: Insere novo evento
- **Atualizar**: Edita evento existente
- **Deletar**: Remove evento do banco

### 4. Registrations Page (`/src/app/admin/inscricoes/page.tsx`)

- Lista todas as inscrições
- Filtrar por evento
- Buscar por nome/email/telefone
- Exportar para CSV
- Deletar inscrições

## 📝 Variáveis de Ambiente

O arquivo `.env.local` já contém:

```
NEXT_PUBLIC_SUPABASE_URL=https://amwkkqxjqdxxqcalxuar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Essas variáveis permitem que a aplicação conecte ao seu projeto Supabase.

## ✅ Checklist de Configuração

- [ ] Acessei [app.supabase.com](https://app.supabase.com)
- [ ] Selecionei meu projeto
- [ ] Executei o SQL para criar tabela `events`
- [ ] Executei o SQL para criar tabela `registrations`
- [ ] Desabilitei RLS em ambas as tabelas
- [ ] (Opcional) Inseri dados de exemplo
- [ ] Testei a aplicação - ela deve buscar dados do Supabase

## 🧪 Como Testar

1. **Página Inicial** (`http://localhost:3000`):
   - O Hero deve mostrar um carrossel com eventos futuros
   - A seção Team deve mostrar eventos futuros e passados

2. **Admin Panel** (`http://localhost:3000/admin`):
   - Clique em "NOVO EVENTO" para criar um
   - Clique em "EDITAR" para modificar
   - Clique em "DELETAR" para remover

3. **Admin/Inscrições** (`http://localhost:3000/admin/inscricoes`):
   - Deve listar inscrições do banco de dados
   - Pode filtrar por evento
   - Pode exportar para CSV

## 🚨 Troubleshooting

### "Nenhum evento para exibir"
- Verifique se a tabela `events` foi criada
- Verifique se inseriu dados de exemplo
- Verifique se RLS está desabilitado

### Erro de conexão ao Supabase
- Verifique `.env.local` contém as credenciais corretas
- Copie novamente as credenciais do projeto Supabase

### Imagens não carregam
- Use URLs públicas (https://)
- Teste a URL no navegador

## 📚 Próximos Passos

1. **Autenticação**: Adicionar login para o admin panel
2. **Upload de Imagens**: Integrar com Supabase Storage
3. **RLS**: Ativar Row Level Security em produção
4. **Validações**: Adicionar mais validações de dados
5. **Notificações**: Sistema de email para inscrições

---

**Pronto!** 🎉 A aplicação está 100% integrada com Supabase!
