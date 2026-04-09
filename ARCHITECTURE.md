# 🔗 Diagrama da Integração Supabase

## Arquitetura Completa

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                     ST ACADEMY WEBSITE                          ┃
┃                    (Next.js + React 19)                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
        ┌─────────────────────────────────────────────┐
        │         Frontend Components                 │
        ├─────────────────────────────────────────────┤
        │                                             │
        │  ┌──────────────────────────────────────┐  │
        │  │ Hero.tsx                             │  │
        │  │ • Carrossel de eventos               │  │
        │  │ • Modal on click                     │  │
        │  │ • useEffect + useState               │  │
        │  └──────────────────────────────────────┘  │
        │                    ↓                        │
        │  ┌──────────────────────────────────────┐  │
        │  │ Team.tsx                             │  │
        │  │ • Próximos eventos (upcoming)        │  │
        │  │ • Eventos passados (past) + galeria  │  │
        │  │ • Modais interativos                 │  │
        │  └──────────────────────────────────────┘  │
        │                    ↓                        │
        │  ┌──────────────────────────────────────┐  │
        │  │ Admin Pages                          │  │
        │  │ • /admin - CRUD eventos              │  │
        │  │ • /admin/inscricoes - Registrations  │  │
        │  └──────────────────────────────────────┘  │
        │                                             │
        └─────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────┐
         │    Supabase JavaScript Client              │
         │   (@supabase/supabase-js v3.x)             │
         │                                            │
         │  createClient(URL, ANON_KEY)               │
         │  supabase.from("table").select(...)        │
         │  supabase.from("table").insert(...)        │
         │  supabase.from("table").update(...)        │
         │  supabase.from("table").delete(...)        │
         └────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────┐
         │    HTTP/REST API (HTTPS)                   │
         │  https://amwkkqxjqdxxqcalxuar.supabase.co  │
         │                                            │
         │  • Authentificação com ANON_KEY            │
         │  • Criptografia end-to-end                 │
         │  • Rate limiting automático                │
         └────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────┐
         │      Supabase Cloud Infrastructure         │
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │  PostgreSQL Database Instance        │  │
         │  │                                      │  │
         │  │  ┌────────────────────────────────┐  │  │
         │  │  │ Table: events                  │  │  │
         │  │  │ • id, title, date, time...     │  │  │
         │  │  │ • Índices: type, date          │  │  │
         │  │  │ • Registros: upcoming + past   │  │  │
         │  │  └────────────────────────────────┘  │  │
         │  │                                      │  │
         │  │  ┌────────────────────────────────┐  │  │
         │  │  │ Table: registrations           │  │  │
         │  │  │ • id, event_id, name, email... │  │  │
         │  │  │ • Índices: event_id, email     │  │  │
         │  │  │ • Foreign Key: events(id)      │  │  │
         │  │  └────────────────────────────────┘  │  │
         │  │                                      │  │
         │  │  ┌────────────────────────────────┐  │  │
         │  │  │ Row Level Security (RLS)       │  │  │
         │  │  │ ⚠️ Desabilitado por enquanto   │  │  │
         │  │  │ ✅ Ativar em produção          │  │  │
         │  │  └────────────────────────────────┘  │  │
         │  │                                      │  │
         │  └──────────────────────────────────────┘  │
         │                                            │
         │  • Backups automáticos                     │
         │  • Replicação para HA                      │
         │  • Monitoring & Logs                       │
         └────────────────────────────────────────────┘
```

## Fluxo de Dados - Exemplo Hero Component

```
1. INICIALIZAÇÃO
   ├─ Hero.tsx monta
   ├─ useEffect chamado
   └─ loadEvents() executado

2. BUSCAR DADOS
   ├─ supabase.from("events").select(*)
   ├─ .eq("type", "upcoming")
   ├─ .order("date", { ascending: true })
   └─ HTTP GET para Supabase

3. RESPOSTA DO SERVIDOR
   ├─ Supabase processa query
   ├─ PostgreSQL busca registros
   ├─ Retorna JSON com eventos
   └─ Clente recebe array de eventos

4. ATUALIZAR ESTADO
   ├─ setEVENTS(data)
   ├─ Component re-renderiza
   └─ Carrossel mostra eventos

5. INTERAÇÃO DO USUÁRIO
   ├─ Clica em evento
   ├─ setSelectedEvent(event)
   └─ Modal abre com detalhes

TEMPO TOTAL: ~500-1000ms (dependendo da rede)
```

## Fluxo de Dados - Exemplo Admin CRUD

```
CREATE EVENTO:
┌─────────────────────────────────────────────────┐
│ 1. User preenche form e clica "NOVO EVENTO"     │
├─────────────────────────────────────────────────┤
│ 2. handleSubmit() captura dados do form         │
├─────────────────────────────────────────────────┤
│ 3. supabase.from("events").insert([formData])   │
├─────────────────────────────────────────────────┤
│ 4. Supabase valida dados e insere no PostgreSQL │
├─────────────────────────────────────────────────┤
│ 5. Retorna novo evento com ID gerado            │
├─────────────────────────────────────────────────┤
│ 6. loadEvents() recarrega a lista               │
├─────────────────────────────────────────────────┤
│ 7. Tabela atualiza com novo evento              │
└─────────────────────────────────────────────────┘

UPDATE EVENTO:
┌─────────────────────────────────────────────────┐
│ 1. User clica "EDITAR" em um evento             │
├─────────────────────────────────────────────────┤
│ 2. Form pre-filled com dados do evento          │
├─────────────────────────────────────────────────┤
│ 3. User modifica campos                         │
├─────────────────────────────────────────────────┤
│ 4. handleSubmit() envia supabase.update()       │
├─────────────────────────────────────────────────┤
│ 5. Supabase encontra registro por ID            │
├─────────────────────────────────────────────────┤
│ 6. Atualiza campos na base de dados             │
├─────────────────────────────────────────────────┤
│ 7. loadEvents() recarrega                       │
├─────────────────────────────────────────────────┤
│ 8. Tabela reflete mudanças                      │
└─────────────────────────────────────────────────┘

DELETE EVENTO:
┌─────────────────────────────────────────────────┐
│ 1. User clica "DELETAR" em um evento            │
├─────────────────────────────────────────────────┤
│ 2. Confirmação: "Tem certeza?"                  │
├─────────────────────────────────────────────────┤
│ 3. handleDelete() chama supabase.delete()       │
├─────────────────────────────────────────────────┤
│ 4. Supabase encontra evento por ID              │
├─────────────────────────────────────────────────┤
│ 5. Evento e registrações associadas removidas   │
│    (cascata: ON DELETE CASCADE)                 │
├─────────────────────────────────────────────────┤
│ 6. loadEvents() recarrega                       │
├─────────────────────────────────────────────────┤
│ 7. Tabela atualiza - evento desaparece          │
└─────────────────────────────────────────────────┘
```

## Ciclo de Vida - Event Registration (Futuro)

```
USUÁRIO FINAL:
┌─────────────────────────┐
│ 1. Visitante vê evento  │
│    no Hero/Team         │
├─────────────────────────┤
│ 2. Clica "INSCREVER-SE" │
├─────────────────────────┤
│ 3. Preenche form:       │
│    - Nome               │
│    - Email              │
│    - Telefone           │
├─────────────────────────┤
│ 4. Clica "CONFIRMAR"    │
│                         │
└─────────────────────────┘
         ↓
SUPABASE PROCESSA:
┌─────────────────────────────────────────┐
│ 1. Insert em registrations:             │
│    event_id = ID do evento              │
│    name = dados do form                 │
│    email = dados do form                │
│    phone = dados do form                │
│    registered_at = agora                │
│                                         │
│ 2. PostgreSQL gera novo UUID            │
│ 3. Dados salvos permanentemente         │
│ 4. Supabase retorna sucesso             │
│                                         │
└─────────────────────────────────────────┘
         ↓
ADMIN VÊ:
┌─────────────────────────────────────────┐
│ 1. Acessa /admin/inscricoes             │
│                                         │
│ 2. Vê nova inscrição na lista:          │
│    • Nome: João Silva                   │
│    • Email: joao@email.com              │
│    • Telefone: +244 923 456 789         │
│    • Evento: Workshop React             │
│    • Data: 20/03/2026                   │
│                                         │
│ 3. Pode filtrar, buscar ou exportar     │
│                                         │
└─────────────────────────────────────────┘
```

## Arquivos & Caminhos

```
st-academy/
│
├── 📄 .env.local
│   └─ NEXT_PUBLIC_SUPABASE_URL
│   └─ NEXT_PUBLIC_SUPABASE_ANON_KEY
│
├── 📁 src/
│   │
│   ├── 📁 lib/
│   │   └── 📄 supabase.ts (Cliente Supabase)
│   │
│   ├── 📁 components/
│   │   ├── 📄 Hero.tsx (✅ Integrado)
│   │   ├── 📄 Team.tsx (✅ Integrado)
│   │   └── ... outros
│   │
│   └── 📁 app/
│       ├── 📁 admin/
│       │   ├── 📄 page.tsx (✅ Integrado)
│       │   └── 📁 inscricoes/
│       │       └── 📄 page.tsx (✅ Integrado)
│       └── ... outras páginas
│
├── 📄 SUPABASE_SETUP.md (Guia SQL)
├── 📄 INTEGRATION_SUMMARY.md (Resumo técnico)
├── 📄 README_SUPABASE.md (Este arquivo)
└── 📄 package.json (com @supabase/supabase-js)
```

## Estados & Hooks

```
┌─────────────────────────────────────────────────────┐
│  HERO COMPONENT                                     │
├─────────────────────────────────────────────────────┤
│ useState:                                           │
│  • EVENTS: Event[] (array de eventos)               │
│  • currentSlide: number (índice carrossel)          │
│  • autoPlay: boolean (auto-play ativo?)             │
│  • selectedEvent: Event | null (modal aberto?)      │
│  • loading: boolean (carregando?)                   │
│                                                     │
│ useEffect:                                          │
│  • Executado 1x ao montar → chama loadEvents()      │
│  • Auto-play a cada 5 segundos (se ativo)           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TEAM COMPONENT                                     │
├─────────────────────────────────────────────────────┤
│ useState:                                           │
│  • upcomingEvents: Event[]                          │
│  • pastEvents: Event[]                              │
│  • selectedEvent: Event | null                      │
│  • selectedPastEvent: Event | null                  │
│  • currentPhotoIndex: number (galeria)              │
│  • loading: boolean                                 │
│                                                     │
│ useEffect:                                          │
│  • Executado 1x ao montar → chama loadEvents()      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ADMIN COMPONENT                                    │
├─────────────────────────────────────────────────────┤
│ useState:                                           │
│  • events: Event[]                                  │
│  • showForm: boolean (form visível?)                │
│  • editingId: string | null (editando qual?)        │
│  • formData: Partial<Event> (dados do form)         │
│                                                     │
│ useEffect:                                          │
│  • Executado 1x ao montar → chama loadEvents()      │
└─────────────────────────────────────────────────────┘
```

## Endpoints Supabase Utilizados

```
MÉTODO              TABELA          OPERAÇÃO
────────────────────────────────────────────────
SELECT (READ)       events          Buscar todos/alguns
SELECT (READ)       registrations   Buscar todos/alguns
INSERT (CREATE)     events          Criar novo evento
UPDATE (UPDATE)     events          Editar evento
DELETE (DELETE)     events          Remover evento
DELETE (DELETE)     registrations   Remover inscrição

FILTROS APLICADOS:
├─ type = 'upcoming' (Hero, Team)
├─ type = 'past' (Team)
├─ order by date (eventos)
├─ order by created_at (admin)
├─ order by registered_at (inscrições)
└─ Cascata delete: registrations ao deletar events
```

## Performance & Otimizações

```
ÍNDICES CRIADOS:
├─ events.type (buscar por upcoming/past)
├─ events.date (ordenação e filtro)
├─ registrations.event_id (foreign key)
└─ registrations.email (busca)

CACHE:
├─ React state (useState)
├─ Browser local storage (futuro)
└─ Supabase Realtime (futuro)

LAZY LOADING:
├─ Componentes carregam dados ao montar
├─ Modais carregam sob demanda
└─ Paginação (futuro)

CONEXÃO:
├─ HTTPS certificado
├─ Connection pooling automático
├─ Retry automático em falhas
└─ Timeout: 30s padrão
```

---

**Diagrama mantido sincronizado com código atual** ✅
