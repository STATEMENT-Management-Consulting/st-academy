import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Usar Service Role Key para ter acesso total
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Verificar se já é admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admins")
      .select("email")
      .eq("email", cleanEmail)
      .limit(1);

    if (checkError) {
      console.error("[API] Erro ao verificar admin existente:", checkError);
      return NextResponse.json(
        { error: "Erro ao verificar admin existente" },
        { status: 500 }
      );
    }

    if (existingAdmin && existingAdmin.length > 0) {
      return NextResponse.json(
        { error: "Este utilizador já é admin" },
        { status: 400 }
      );
    }

    // Adicionar à tabela admins
    const { error: insertError } = await supabase.from("admins").insert({
      email: cleanEmail,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("[API] Erro ao adicionar admin:", insertError);
      return NextResponse.json(
        { error: "Erro ao adicionar admin" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `${cleanEmail} foi convidado como admin`,
    });
  } catch (err) {
    console.error("[API] Erro:", err);
    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}
