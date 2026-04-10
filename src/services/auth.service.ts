import { supabase } from "@/lib/supabase";

type AuthStatus =
  | { ok: true }
  | { ok: false; reason: "no-session" | "not-admin" | "auth-error" };

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const authService = {
  async signInWithEmailPassword(email: string, password: string) {
    const cleanEmail = normalizeEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      throw error;
    }

    // Guardar o token num cookie para que o middleware consiga ler
    if (data?.session?.access_token) {
      // Salvar no localStorage temporariamente para garantir que está disponível
      if (typeof window !== "undefined") {
        localStorage.setItem("supabase_access_token", data.session.access_token);
        localStorage.setItem("supabase_user_email", cleanEmail);
        
        // Garantir que o cookie foi setado fazendo um pequeno delay
        console.log("[Auth Service] Token e email guardados no localStorage");
      }
    }

    return data;
  },

  async signOut() {
    // Limpar localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("supabase_access_token");
      localStorage.removeItem("supabase_user_email");
    }
    
    await supabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user;
  },

  async isEmailAdmin(email: string) {
    const cleanEmail = normalizeEmail(email);

    const { data, error } = await supabase
      .from("admins")
      .select("email")
      .eq("email", cleanEmail)
      .limit(1);

    if (error) {
      throw error;
    }

    return (data?.length ?? 0) > 0;
  },

  async validateAdminSession(): Promise<AuthStatus> {
    try {
      const user = await this.getCurrentUser();

      if (!user?.email) {
        return { ok: false, reason: "no-session" };
      }

      const isAdmin = await this.isEmailAdmin(user.email);

      if (!isAdmin) {
        await this.signOut();
        return { ok: false, reason: "not-admin" };
      }

      return { ok: true };
    } catch {
      return { ok: false, reason: "auth-error" };
    }
  },
};

