import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Criar cliente com Service Role Key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // 1. Verificar se o email está na tabela admins (convidado)
    const { data: adminRecord, error: checkError } = await supabase
      .from("admins")
      .select("email, created_at")
      .eq("email", cleanEmail)
      .limit(1);

    if (checkError) {
      console.error("[API] Erro ao verificar convite:", checkError);
      return NextResponse.json(
        { error: "Erro ao verificar convite" },
        { status: 500 }
      );
    }

    if (!adminRecord || adminRecord.length === 0) {
      return NextResponse.json(
        { error: "Este email não foi convidado como admin" },
        { status: 403 }
      );
    }

    // 2. Criar utilizador no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true, // Confirmar email automaticamente
    });

    if (authError) {
      console.error("[API] Erro ao criar utilizador:", authError);
      
      // Se o utilizador já existe
      if (authError.message.includes("User already registered")) {
        return NextResponse.json(
          { error: "Este email já tem uma conta criada" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "Erro ao criar conta" },
        { status: 500 }
      );
    }

    // 3. Atualizar record na tabela admins para marcar como registado
    const { error: updateError } = await supabase
      .from("admins")
      .update({
        user_id: authData.user?.id,
        registered_at: new Date().toISOString(),
      })
      .eq("email", cleanEmail);

    if (updateError) {
      console.error("[API] Erro ao atualizar admin:", updateError);
      // Não falhar aqui, o utilizador foi criado com sucesso
    }

    return NextResponse.json({
      ok: true,
      message: "Conta criada com sucesso",
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
      },
    });
  } catch (err) {
    console.error("[API] Erro:", err);
    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}
