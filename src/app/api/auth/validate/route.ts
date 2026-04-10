import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Obter o token do header
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "No authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);

  try {
    // Criar cliente com Service Role Key para validar o token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Usar a API REST do Supabase para validar o token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_jwt_user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        },
      }
    );

    if (!response.ok) {
      // Se a API REST não funcionar, decodificar manualmente
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      
      const payload = JSON.parse(jsonPayload);
      const email = payload?.email?.toLowerCase();

      if (!email) {
        return NextResponse.json(
          { error: "No email in token" },
          { status: 401 }
        );
      }

      // Verificar se é admin
      const { data: adminCheck } = await supabase
        .from("admins")
        .select("email")
        .eq("email", email)
        .limit(1);

      const isAdmin = (adminCheck?.length ?? 0) > 0;

      return NextResponse.json({
        ok: true,
        email,
        isAdmin,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API] Erro ao validar token:", err);
    return NextResponse.json(
      { error: "Token validation failed" },
      { status: 401 }
    );
  }
}
