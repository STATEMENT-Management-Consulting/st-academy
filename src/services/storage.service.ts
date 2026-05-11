import { supabase } from "@/lib/supabase";

const BUCKET = "events";

export async function uploadEventImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `main/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadGalleryImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw new Error(`Erro ao fazer upload de foto da galeria: ${error.message}`);

    urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  return urls;
}

export async function deleteStorageImage(publicUrl: string): Promise<void> {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx < 0) return;

    const filePath = url.pathname.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([filePath]);
  } catch {
    // URL externa ou inválida — ignorar
  }
}
