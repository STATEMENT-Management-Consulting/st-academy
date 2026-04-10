"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  const [formData, setFormData] = useState<Partial<Event>>({
    type: "upcoming",
  });

  // Carregar eventos do Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar eventos:", error);
        // Dados de fallback se houver erro
        setEvents([]);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      // Dados de fallback
      setEvents([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update({
            title: formData.title,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            instructor: formData.instructor,
            description: formData.description,
            duration: formData.duration,
            capacity: formData.capacity,
            price: formData.price,
            image: formData.image,
            type: formData.type,
          })
          .eq("id", editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("events").insert([
          {
            title: formData.title,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            instructor: formData.instructor,
            description: formData.description,
            duration: formData.duration,
            capacity: formData.capacity,
            price: formData.price,
            image: formData.image,
            type: formData.type,
          },
        ]);

        if (error) throw error;
      }

      await loadEvents();
      setFormData({ type: "upcoming" });
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento. Verifique o console para mais detalhes.");
    }
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este evento?")) {
      try {
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) throw error;
        await loadEvents();
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
        alert("Erro ao deletar evento.");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ type: "upcoming" });
  };

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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Título
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Data
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Hora
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Local
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Instrutor
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Duração
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Capacidade
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Preço
                  </label>
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
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    Tipo
                  </label>
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

                <div>
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-light mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 font-light tracking-widest transition-colors"
                >
                  {editingId ? "ATUALIZAR" : "CRIAR"} EVENTO
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-300 hover:border-black text-black px-8 py-3 font-light tracking-widest transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Eventos Próximos */}
        <div className="mb-12">
          <h2 className="text-3xl font-light text-black mb-6">Próximos Eventos ({upcomingEvents.length})</h2>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {upcomingEvents.length === 0 ? (
              <p className="p-6 text-gray-600 font-light">Nenhum evento próximo cadastrado</p>
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
          <h2 className="text-3xl font-light text-black mb-6">Eventos Passados ({pastEvents.length})</h2>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {pastEvents.length === 0 ? (
              <p className="p-6 text-gray-600 font-light">Nenhum evento passado cadastrado</p>
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
