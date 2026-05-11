/**
 * Cria o bucket "event-photos" no Supabase Storage.
 * Executar uma vez: npx ts-node -r tsconfig-paths/register src/scripts/setup-storage.ts
 */

import { createClient } from "@supabase/supabase-js";

// Definir antes de executar: export NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"]!;
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Erro: variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setup() {
  console.log("A configurar Supabase Storage...\n");

  const { error: bucketError } = await supabase.storage.createBucket("events", {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
  });

  if (bucketError && !bucketError.message.includes("already exists")) {
    console.error("Erro ao criar bucket:", bucketError.message);
    process.exit(1);
  }

  if (bucketError?.message.includes("already exists")) {
    console.log("✓ Bucket 'events' já existe");
  } else {
    console.log("✓ Bucket 'events' criado com sucesso");
  }

  console.log("\nConfiguração de Storage:");
  console.log("  - Bucket:          events");
  console.log("  - Acesso público:  sim (leitura livre)");
  console.log("  - Tipos aceites:   JPEG, PNG, WEBP, GIF");
  console.log("  - Tamanho máximo:  10 MB por ficheiro");
  console.log("\nNota: Para permitir uploads via anon key, adicione estas policies");
  console.log("      no dashboard Supabase > Storage > event-photos > Policies:\n");
  console.log("  INSERT policy (para admins fazerem upload):");
  console.log("    (bucket_id = 'event-photos')\n");
  console.log("  SELECT policy (leitura pública já configurada pelo bucket público)");
  console.log("\nSetup concluído!");
}

setup();
