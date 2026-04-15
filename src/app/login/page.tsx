"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";

const getFriendlyError = (message: string) => {
  const text = message.toLowerCase();

  if (text.includes("invalid login credentials")) {
    return "Email ou senha inválidos.";
  }

  if (text.includes("email not confirmed")) {
    return "Confirme o email antes de entrar.";
  }

  return "Não foi possível fazer login. Tente novamente.";
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deniedMessage = useMemo(() => {
    return searchParams.get("erro") === "acesso-restrito"
      ? "Acesso restrito"
      : "";
  }, [searchParams]);

  const registeredMessage = useMemo(() => {
    return searchParams.get("registered") === "true"
      ? "Conta criada com sucesso! Agora o seu faça login."
      : "";
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Iniciando login para:", email);
      
      const signInData = await authService.signInWithEmailPassword(email, password);
      const userEmail = signInData.user?.email;

      console.log("✅ Login bem-sucedido para:", userEmail);

      if (!userEmail) {
        console.log("❌ Email não encontrado após login");
        await authService.signOut();
        setError("Utilizador não encontrado.");
        setLoading(false);
        return;
      }

      console.log("🔍 Verificando se é admin...");
      const isAdmin = await authService.isEmailAdmin(userEmail);
      console.log("Admin status:", isAdmin);

      if (!isAdmin) {
        console.log("❌ Utilizador não é admin");
        await authService.signOut();
        setError("Sem permissão de admin");
        setLoading(false);
        // Aguardar um pouco antes de redirecionar
        await new Promise(resolve => setTimeout(resolve, 500));
        router.replace("/acesso-negado?next=/login?erro=acesso-restrito");
        return;
      }

      console.log("✅ Utilizador é admin, redirecionando para /admin");
      
      // Guardar o token num cookie explicitamente para o middleware conseguir ler
      if (signInData?.session?.access_token) {
        // Usar document.cookie para garantir que o cookie é setado
        const maxAge = 86400 * 7; // 7 dias
        document.cookie = `sb-access-token=${signInData.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `sb-user-email=${userEmail}; path=/; max-age=${maxAge}; SameSite=Lax`;
        console.log("[Login] 🍪 Cookies setados manualmente para o middleware");
      }
      
      // Usar router.push() em vez de window.location para preservar a sessão
      // Isto garante que o Next.js mantém a sessão durante a navegação
      // Pequeno delay para garantir que os cookies foram setados
      await new Promise(resolve => setTimeout(resolve, 200));
      router.push("/admin");
    } catch (err) {
      console.error("❌ Erro no login:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(getFriendlyError(message));
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <h1 className="text-3xl font-light text-black mb-2">Login Admin</h1>
      <p className="text-gray-600 font-light mb-8">
        Acesso apenas para utilizadores convidados.
      </p>

      {deniedMessage && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          {deniedMessage}
        </div>
      )}

      {registeredMessage && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
          {registeredMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700 font-light mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-light"
            placeholder="admin@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-light mb-2" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-light"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-lg font-light tracking-widest transition-colors"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>
          Foi convidado e não tem conta?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <Suspense
        fallback={
          <section className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-light text-black mb-2">Login Admin</h1>
            <p className="text-gray-600 font-light mb-8">
              Acesso apenas para utilizadores convidados.
            </p>
          </section>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
