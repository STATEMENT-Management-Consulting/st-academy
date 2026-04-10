"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AcessoNegadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/login?erro=acesso-restrito";

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(nextPath);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [nextPath, router]);

  return (
    <section className="w-full max-w-lg bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
      <h1 className="text-3xl font-light text-red-700 mb-3">Acesso restrito</h1>
      <p className="text-gray-700 font-light mb-6">
        A sua conta não possui permissão para acessar o painel de administração.
      </p>

      <Link
        href={nextPath}
        className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-light tracking-widest transition-colors"
      >
        VOLTAR PARA LOGIN
      </Link>
    </section>
  );
}

export default function AcessoNegadoPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <Suspense
        fallback={
          <section className="w-full max-w-lg bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
            <h1 className="text-3xl font-light text-red-700 mb-3">Acesso restrito</h1>
            <p className="text-gray-700 font-light mb-6">
              A sua conta não possui permissão para acessar o painel de administração.
            </p>
          </section>
        }
      >
        <AcessoNegadoContent />
      </Suspense>
    </main>
  );
}
