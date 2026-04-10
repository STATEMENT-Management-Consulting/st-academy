#!/usr/bin/env node

/**
 * Script de teste rápido da autenticação de admin
 * Use: npx ts-node src/scripts/test-admin-auth.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminAuth() {
  console.log("\n🔍 Testando Sistema de Autenticação de Admin\n");

  try {
    // 1. Testar conexão com Supabase
    console.log("1️⃣  Testando conexão com Supabase...");
    const { error: testError } = await supabase
      .from("admins")
      .select("count", { count: "exact" });

    if (testError) {
      console.error("   ❌ Erro:", testError.message);
      console.log(
        "   → Verificar se tabela 'admins' existe no Supabase\n"
      );
      return;
    }

    console.log("   ✅ Conexão OK\n");

    // 2. Listar admins
    console.log("2️⃣  Listando utilizadores admin cadastrados...");
    const { data: admins, error: adminsError } = await supabase
      .from("admins")
      .select("email, created_at");

    if (adminsError) {
      console.error("   ❌ Erro:", adminsError.message);
      return;
    }

    if (!admins || admins.length === 0) {
      console.log("   ⚠️  Nenhum admin cadastrado ainda!");
      console.log(
        "   → Use o botão 'Adicionar Como Admin' na página de login\n"
      );
    } else {
      console.log(`   ✅ Total: ${admins.length} admin(s)\n`);
      admins.forEach((admin: { email: string; created_at: string }) => {
        console.log(`   • ${admin.email}`);
      });
      console.log();
    }

    // 3. Testar verificação de admin
    const testEmail = admins?.[0]?.email;
    if (testEmail) {
      console.log(`3️⃣  Testando verificação de admin (${testEmail})...`);
      const { data: isAdmin, error: isAdminError } = await supabase
        .from("admins")
        .select("email")
        .eq("email", testEmail.toLowerCase())
        .limit(1);

      if (isAdminError) {
        console.error("   ❌ Erro:", isAdminError.message);
        return;
      }

      if (isAdmin && isAdmin.length > 0) {
        console.log(`   ✅ '${testEmail}' é admin\n`);
      } else {
        console.log(`   ❌ '${testEmail}' não é admin\n`);
      }
    }

    console.log("✅ Todos os testes passaram!\n");
    console.log("📝 Próximos passos:");
    console.log("   1. Iniciar server: npm run dev");
    console.log("   2. Ir para: http://localhost:3000/login");
    console.log("   3. Fazer login com um dos emails acima");
    console.log("   4. Deve redirecionar para /admin\n");
  } catch (err) {
    console.error("❌ Erro inesperado:", err);
  }
}

testAdminAuth().catch(console.error);
