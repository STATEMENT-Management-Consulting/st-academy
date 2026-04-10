import { supabase } from "@/lib/supabase";

/**
 * Script para verificar e criar a tabela de admins se não existir
 * Execute com: npx ts-node src/scripts/setup-admins-table.ts
 */
async function setupAdminsTable() {
  try {
    console.log("🔍 Verificando tabela 'admins'...");

    // Tentar fazer uma query simples para verificar se a tabela existe
    const { data, error } = await supabase
      .from("admins")
      .select("email")
      .limit(1);

    if (error) {
      console.error("❌ Erro ao acessar tabela 'admins':", error.message);
      console.log("\n📝 Você precisa criar a tabela manualmente no Supabase:");
      console.log(`
-- Copie e execute este SQL no Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Depois insira os emails dos admins:
INSERT INTO public.admins (email) VALUES
  ('seu-email@empresa.com')
ON CONFLICT (email) DO NOTHING;
      `);
      return;
    }

    console.log("✅ Tabela 'admins' existe e está acessível!");
    console.log(`   Registos atuais: ${data?.length || 0}`);

    if (data && data.length > 0) {
      console.log("\n📧 Emails cadastrados como admin:");
      data.forEach((record: { email: string }) => {
        console.log(`   - ${record.email}`);
      });
    } else {
      console.log("\n⚠️  Nenhum email cadastrado como admin ainda!");
      console.log("   Execute o INSERT acima para adicionar admins.");
    }
  } catch (err) {
    console.error("❌ Erro inesperado:", err);
  }
}

setupAdminsTable().catch(console.error);
