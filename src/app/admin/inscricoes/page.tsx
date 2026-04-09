"use client";

import { useState, useEffect } from "react";
import { Trash2, Download, Loader } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Registration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  registered_at: string;
}

interface Event {
  id: string;
  title: string;
}

export default function InscricoesPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar dados ao montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("id, title")
        .order("title");

      if (eventsError) {
        console.error("Erro ao carregar eventos:", eventsError);
      } else {
        setEvents(eventsData || []);
      }

      // Carregar registros
      const { data: regsData, error: regsError } = await supabase
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      if (regsError) {
        console.error("Erro ao carregar inscrições:", regsError);
      } else {
        setRegistrations(regsData || []);
      }
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      setRegistrations([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta inscrição?")) {
      try {
        const { error } = await supabase
          .from("registrations")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Erro ao deletar inscrição:", error);
          alert("Erro ao deletar inscrição.");
        } else {
          setRegistrations(registrations.filter((r) => r.id !== id));
          alert("Inscrição deletada com sucesso!");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao deletar inscrição.");
      }
    }
  };

  const handleExportCSV = () => {
    const filtered = getFilteredRegistrations();

    if (filtered.length === 0) {
      alert("Nenhum registro para exportar.");
      return;
    }

    // Headers
    const headers = ["ID", "Nome", "Email", "Telefone", "Evento", "Data de Inscrição"];

    // Rows
    const rows = filtered.map((reg) => {
      const eventName =
        events.find((e) => e.id === reg.event_id)?.title || "Evento não encontrado";
      return [
        reg.id,
        reg.name,
        reg.email,
        reg.phone,
        eventName,
        new Date(reg.registered_at).toLocaleDateString("pt-BR"),
      ];
    });

    // Create CSV
    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Export
    const eventFilter = selectedEvent === "all" ? "todas" : selectedEvent;
    const date = new Date().toISOString().split("T")[0];
    const fileName = `inscricoes_${eventFilter}_${date}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const getFilteredRegistrations = () => {
    return registrations.filter((reg) => {
      const matchEvent = selectedEvent === "all" || reg.event_id === selectedEvent;
      const matchSearch =
        searchTerm === "" ||
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEvent && matchSearch;
    });
  };

  const filteredRegistrations = getFilteredRegistrations();
  const eventRegistrationCounts = events.map((event) => ({
    eventId: event.id,
    eventTitle: event.title,
    count: registrations.filter((r) => r.event_id === event.id).length,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Loader className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-black mb-2">
              Gerenciar Inscrições
            </h1>
            <p className="text-gray-600 font-light">
              Total de inscrições: {registrations.length}
            </p>
          </div>
          <Link
            href="/admin"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 font-light transition-colors"
          >
            VOLTAR AO ADMIN
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {eventRegistrationCounts.map((stat) => (
            <div key={stat.eventId} className="bg-white p-6 rounded-lg">
              <p className="text-sm text-gray-500 font-light mb-2">
                {stat.eventTitle}
              </p>
              <p className="text-3xl font-light text-black">{stat.count}</p>
              <p className="text-xs text-gray-400 font-light mt-2">inscrições</p>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Filtrar por evento
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 font-light text-sm bg-white"
              >
                <option value="all">Todos os eventos</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Pesquisar
              </label>
              <input
                type="text"
                placeholder="Nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 font-light text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExportCSV}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-light transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                EXPORTAR CSV
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-light">
            Mostrando {filteredRegistrations.length} de {registrations.length} inscrições
          </p>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          {filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Evento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Data de Inscrição
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((registration, index) => (
                    <tr
                      key={registration.id}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-light">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-light break-all">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-light">
                        {registration.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-light">
                        {events.find((e) => e.id === registration.event_id)?.title ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-light">
                        {new Date(registration.registered_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteRegistration(registration.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Deletar inscrição"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 font-light">
                Nenhuma inscrição encontrada
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
