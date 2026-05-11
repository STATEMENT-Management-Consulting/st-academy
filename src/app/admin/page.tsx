"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit2, Plus, Users, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  uploadEventImage,
  uploadGalleryImages,
  deleteStorageImage,
} from "@/services/storage.service";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  description: string;
  duration: string;
  capacity: number;
  price: string;
  image: string;
  type: "upcoming" | "past";
  gallery?: string[];
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({ type: "upcoming" });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setEvents(data || []);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearMainImage = () => {
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const handleRemoveNewGalleryFile = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveCurrentGalleryImage = (index: number) => {
    const url = currentGallery[index];
    setRemovedGalleryUrls((prev) => [...prev, url]);
    setCurrentGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = useCallback(() => {
    galleryPreviews.forEach((p) => URL.revokeObjectURL(p));
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
    setFormData({ type: "upcoming" });
    setImageFile(null);
    setImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setCurrentGallery([]);
    setRemovedGalleryUrls([]);
    setEditingId(null);
    setShowForm(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryPreviews, imageFile, imagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        setIsUploading(false);
        return;
      }

      let imageUrl = formData.image || "";

      if (imageFile) {
        imageUrl = await uploadEventImage(imageFile);
      }

      let newGalleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        newGalleryUrls = await uploadGalleryImages(galleryFiles);
      }

      const finalGallery = [...currentGallery, ...newGalleryUrls];

      const payload = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        instructor: formData.instructor,
        description: formData.description,
        duration: formData.duration,
        capacity: formData.capacity,
        price: formData.price,
        image: imageUrl,
        type: formData.type,
        gallery: finalGallery.length > 0 ? finalGallery : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert([payload]);
        if (error) throw error;
      }

      // Eliminar do storage as fotos removidas da galeria
      await Promise.allSettled(removedGalleryUrls.map(deleteStorageImage));

      await loadEvents();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento. Verifique o console para mais detalhes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id);
    setImagePreview(event.image || null);
    setCurrentGallery(event.gallery || []);
    setImageFile(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setRemovedGalleryUrls([]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este evento?")) return;
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      await loadEvents();
    } catch {
      alert("Erro ao deletar evento.");
    }
  };

  const handleCancel = () => resetForm();

  const upcomingEvents = events.filter((e) => e.type === "upcoming");
  const pastEvents = events.filter((e) => e.type === "past");

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-light text-black">Eventos</h2>
          <div className="flex gap-4">
            <Link
              href="/admin/inscricoes"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-light tracking-widest flex items-center gap-2 transition-colors"
            >
              <Users size={20} />
              INSCRIÇÕES
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black hover:bg-gray-900 text-white px-6 py-3 font-light tracking-widest flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              NOVO EVENTO
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg p-8 mb-12 border border-gray-200">
            <h2 className="text-3xl font-light text-black mb-6">
              {editingId ? "Editar Evento" : "Criar Novo Evento"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Data</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: 15 de Abril"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Hora</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: 09:00 - 17:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Local</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: Luanda, Angola"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Instrutor</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Duração</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: 8 horas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Capacidade</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Preço</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: AOA 49.990"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">Tipo</label>
                  <select
                    name="type"
                    value={formData.type || "upcoming"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                  >
                    <option value="upcoming">Próximo</option>
                    <option value="past">Passado</option>
                  </select>
                </div>

                {/* Imagem Principal */}
                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Imagem Principal
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50 transition-colors">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500 font-light text-center px-2 truncate max-w-full">
                      {imageFile ? imageFile.name : "Clique para selecionar"}
                    </span>
                    <span className="text-xs text-gray-400 font-light mt-0.5">
                      PNG, JPG, WEBP até 10 MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative mt-2 h-36 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview da imagem principal"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleClearMainImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
                        title="Remover imagem"
                      >
                        <X size={14} className="text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm text-gray-700 font-light mb-2">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                  required
                />
              </div>

              {/* Galeria de Fotos */}
              <div>
                <label className="block text-sm text-gray-700 font-light mb-1">
                  Galeria de Fotos
                </label>
                <p className="text-xs text-gray-400 font-light mb-3">
                  Recomendado para eventos passados. Pode adicionar múltiplas fotos.
                </p>

                {/* Fotos existentes */}
                {currentGallery.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                    {currentGallery.map((url, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded overflow-hidden border border-gray-200 group"
                      >
                        <img
                          src={url}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrentGalleryImage(i)}
                          className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover foto"
                        >
                          <X size={12} className="text-gray-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload de novas fotos */}
                <label className="flex items-center justify-center gap-2 w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50 transition-colors">
                  <ImageIcon size={18} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500 font-light">
                    {galleryFiles.length > 0
                      ? `${galleryFiles.length} ficheiro(s) selecionado(s)`
                      : "Adicionar fotos à galeria"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesChange}
                    className="hidden"
                  />
                </label>

                {/* Previews das novas fotos */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                    {galleryPreviews.map((preview, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded overflow-hidden border-2 border-blue-300 group"
                      >
                        <img
                          src={preview}
                          alt={`Nova foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewGalleryFile(i)}
                          className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover foto"
                        >
                          <X size={12} className="text-gray-700" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-80 py-0.5 text-center">
                          <span className="text-xs text-white font-light">novo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 font-light tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isUploading
                    ? "A GUARDAR..."
                    : `${editingId ? "ATUALIZAR" : "CRIAR"} EVENTO`}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="border border-gray-300 hover:border-black text-black px-8 py-3 font-light tracking-widest transition-colors disabled:opacity-50"
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Eventos Próximos */}
        <div className="mb-12">
          <h2 className="text-3xl font-light text-black mb-6">
            Próximos Eventos ({upcomingEvents.length})
          </h2>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {upcomingEvents.length === 0 ? (
              <p className="p-6 text-gray-600 font-light">
                Nenhum evento próximo cadastrado
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Título</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Data</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Local</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Instrutor</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Preço</th>
                      <th className="px-6 py-3 text-center text-sm font-light text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-light text-black">{event.title}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.date}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.location}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.instructor}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.price}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Eventos Passados */}
        <div>
          <h2 className="text-3xl font-light text-black mb-6">
            Eventos Passados ({pastEvents.length})
          </h2>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {pastEvents.length === 0 ? (
              <p className="p-6 text-gray-600 font-light">
                Nenhum evento passado cadastrado
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Título</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Data</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Local</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Instrutor</th>
                      <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Preço</th>
                      <th className="px-6 py-3 text-center text-sm font-light text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-light text-black">{event.title}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.date}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.location}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.instructor}</td>
                        <td className="px-6 py-4 text-sm font-light text-gray-600">{event.price}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
