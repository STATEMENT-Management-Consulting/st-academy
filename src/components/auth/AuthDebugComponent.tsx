"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Componente de teste para verificar status da autenticação e tabela de admins
 * Use em desenvolvimento apenas
 */
export default function AuthDebugComponent() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const checkAdminsTable = async () => {
    setLoading(true);
    try {
      console.log("Verificando tabela admins...");
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .limit(10);

      if (error) {
        setResult(`❌ Erro: ${error.message}`);
      } else {
        setResult(`✅ Tabela existe! Registos: ${data?.length || 0}\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setResult(`❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  const checkCurrentSession = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setResult("❌ Sem sessão ativa");
      } else {
        setResult(`✅ Sessão ativa: ${user.email}`);

        // Verificar se é admin
        if (user.email) {
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("email")
            .eq("email", user.email.toLowerCase())
            .limit(1);

          if (adminError) {
            setResult(`${result}\n❌ Erro ao verificar admin: ${adminError.message}`);
          } else if (adminData && adminData.length > 0) {
            setResult(`${result}\n✅ É admin!`);
          } else {
            setResult(`${result}\n❌ Não é admin`);
          }
        }
      }
    } catch (err) {
      setResult(`❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  const addTestAdmin = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setResult("❌ Sem sessão ativa");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("admins").insert([
        {
          email: user.email.toLowerCase(),
        },
      ]);

      if (error) {
        setResult(`❌ Erro ao adicionar: ${error.message}`);
      } else {
        setResult(`✅ Admin '${user.email}' adicionado!`);
      }
    } catch (err) {
      setResult(`❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-auto text-xs font-mono">
      <h3 className="font-bold mb-2">🔧 Debug Auth</h3>

      <div className="space-y-2 mb-4">
        <button
          onClick={checkAdminsTable}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs"
        >
          Verificar Tabela Admins
        </button>
        <button
          onClick={checkCurrentSession}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs"
        >
          Verificar Sessão
        </button>
        <button
          onClick={addTestAdmin}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-xs"
        >
          Adicionar Utilizador Como Admin
        </button>
      </div>

      {result && (
        <pre className="bg-gray-900 p-2 rounded text-green-400 whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
