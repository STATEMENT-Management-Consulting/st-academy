"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!email.trim() || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setError("");

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err) {
      setError("Erro ao processar pedido");
      console.error("Erro:", err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
    <section className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <h1 className="text-3xl font-light text-black mb-2">Criar Conta Admin</h1>
      <p className="text-gray-600 font-light mb-8">
        Preencha os dados abaixo para ativar sua conta de administrador.
      </p>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-start gap-3">
          <CheckCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Conta criada com sucesso!</p>
            <p className="text-sm mt-1">Redirecionando para login...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light"
            disabled={loading || success}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light"
            disabled={loading || success}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">
            Confirmar Senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-light"
            disabled={loading || success}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light mt-6"
        >
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Já tem conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </section>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
          <section className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-light text-black mb-2">Criar Conta Admin</h1>
            <p className="text-gray-600 font-light mb-8">
              Preencha os dados abaixo para ativar sua conta de administrador.
            </p>
          </section>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
