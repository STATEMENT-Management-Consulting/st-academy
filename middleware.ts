import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/login", "/acesso-negado"];
const adminRoutes = ["/admin"];

interface JWTPayload {
  email?: string;
  user_id?: string;
}

function getTokenFromRequest(request: NextRequest): string | null {
  // 1. Procurar em Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // 2. Procurar em cookies do Supabase (vários nomes possíveis)
  const cookies = request.cookies;
  const accessToken =
    cookies.get("sb-access-token")?.value ||
    cookies.get("sb-auth-token")?.value ||
    cookies.get("access_token")?.value;

  return accessToken || null;
}

function getUserEmailFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded?.email?.toLowerCase() || null;
  } catch (err) {
    console.log("[Middleware] Erro ao decodificar token:", err);
    return null;
  }
}

async function isUserAdmin(
  email: string,
  supabase: ReturnType<typeof createServerClient>
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (error) {
      console.log("[Middleware] Erro ao verificar admin:", error.message);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (err) {
    console.log("[Middleware] Exceção ao verificar admin:", err);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Permitir rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Proteger rotas admin
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    let response = NextResponse.next();

    // Criar cliente Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            response = NextResponse.next();
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: Record<string, unknown>) {
            response = NextResponse.next();
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // Tentar obter email de várias formas
    let userEmail: string | null = null;

    // Log inicial: quais cookies estão disponíveis?
    const cookieHeader = request.headers.get("cookie") || "";
    const allCookies = cookieHeader.split(";").map(c => c.trim().split("=")[0]).filter(Boolean);
    console.log("[Middleware] TODOS os cookies disponíveis:", allCookies);

    // 0. Primeiro verificar se existe o cookie custom sb-user-email (setado pelo client)
    const sbUserEmailCookie = request.cookies.get("sb-user-email")?.value;
    if (sbUserEmailCookie) {
      userEmail = sbUserEmailCookie.toLowerCase();
      console.log("[Middleware] ✅ Email encontrado no cookie sb-user-email:", userEmail);
    }

    // 1. Se não encontrou, tentar com getUser() do Supabase
    if (!userEmail) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          userEmail = userData.user.email.toLowerCase();
          console.log("[Middleware] ✅ Email obtido via getUser():", userEmail);
        } else {
          console.log("[Middleware] getUser() retornou sem email");
        }
      } catch (err) {
        console.log("[Middleware] ❌ getUser() falhou:", err instanceof Error ? err.message : err);
      }
    }

    // 2. Se ainda não conseguiu, procurar nos cookies existentes
    if (!userEmail) {
      console.log("[Middleware] Procurando email nos cookies...");
      
      // Tentar decodificar qualquer cookie que pareça ser um token JWT
      for (const cookiePair of cookieHeader.split(";")) {
        const [name, value] = cookiePair.trim().split("=");
        
        if (!value || !name) continue;

        const trimmedName = name.trim();
        const trimmedValue = value.trim();

        // Tentar decodificar se parecer ser um JWT
        if (trimmedValue.includes(".")) {
          try {
            const decoded = jwtDecode<JWTPayload>(decodeURIComponent(trimmedValue));
            console.log(`[Middleware] Cookie '${trimmedName}' decodificado:`, decoded);
            
            if (decoded?.email) {
              userEmail = decoded.email.toLowerCase();
              console.log(
                `[Middleware] ✅ Email extraído do cookie '${trimmedName}':`,
                userEmail
              );
              break;
            }
          } catch (err) {
            console.log(`[Middleware] Cookie '${trimmedName}' não é JWT válido`);
          }
        }
      }
    }

    // 3. Último recurso: procurar Authorization header
    if (!userEmail) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        try {
          const decoded = jwtDecode<JWTPayload>(token);
          if (decoded?.email) {
            userEmail = decoded.email.toLowerCase();
            console.log(
              "[Middleware] Email extraído do Authorization header:",
              userEmail
            );
          }
        } catch {
          // Ignorar
        }
      }
    }

    console.log("[Middleware] User check:", { email: userEmail, pathname });

    // Se não tem sessão, redirecionar para login
    if (!userEmail) {
      console.log("[Middleware] Sem sessão, redirecionando para /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificar se é admin
    const isAdmin = await isUserAdmin(userEmail, supabase);

    console.log("[Middleware] Admin check:", {
      email: userEmail,
      isAdmin,
    });

    // Se não for admin, redirecionar para acesso negado
    if (!isAdmin) {
      console.log("[Middleware] Não é admin, fazendo logout e redirecionando");
      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL("/acesso-negado?next=/login?erro=acesso-restrito", request.url)
      );
    }

    console.log("[Middleware] Admin validado, continuando...");
    // Continuar para a rota admin
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/acesso-negado"],
};

