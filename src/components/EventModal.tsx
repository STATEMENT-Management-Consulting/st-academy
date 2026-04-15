"use client";

import { useState } from "react";
import { X, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEventModal } from "@/contexts/EventModalContext";

export default function EventModal() {
  const { selectedEvent, closeEventModal } = useEventModal();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!selectedEvent) return null;

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitMessage({ type: "error", text: "Por favor, preencha todos os campos" });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("registrations")
        .insert([
          {
            event_id: selectedEvent.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        ]);

      if (error) {
        setSubmitMessage({ type: "error", text: "Erro ao registrar. Tente novamente." });
      } else {
        setSubmitMessage({ type: "success", text: "Inscrição realizada com sucesso!" });
        setFormData({ name: "", email: "", phone: "" });
        setTimeout(() => {
          closeEventModal();
          setSubmitMessage(null);
        }, 2000);
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Erro de conexão. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header com imagem */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={closeEventModal}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          <h2 className="text-4xl font-light text-black mb-2">{selectedEvent.title}</h2>
          <p className="text-gray-600 font-light mb-6">Instrutor: {selectedEvent.instructor}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Data</p>
              <p className="text-lg text-black font-light">{selectedEvent.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Horário</p>
              <p className="text-lg text-black font-light">{selectedEvent.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Local</p>
              <p className="text-lg text-black font-light">{selectedEvent.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Duração</p>
              <p className="text-lg text-black font-light">{selectedEvent.duration}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 font-light mb-2">Sobre o evento</p>
            <p className="text-base text-gray-700 font-light leading-relaxed">{selectedEvent.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 font-light">Vagas</p>
              <p className="text-lg text-black font-light">{selectedEvent.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light">Preço</p>
              <p className="text-lg text-black font-light">{selectedEvent.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light">Status</p>
              <p className="text-lg text-green-600 font-light">Disponível</p>
            </div>
          </div>

          {/* Formulário de Inscrição */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-light text-black mb-4">Inscrever-se neste evento</h3>

            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">Nome completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light focus:outline-none focus:border-black"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light focus:outline-none focus:border-black"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">Telefone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-light focus:outline-none focus:border-black"
                  placeholder="+244 930 000 000"
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg text-sm font-light ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 text-sm font-light tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    PROCESSANDO...
                  </>
                ) : (
                  "CONFIRMAR INSCRIÇÃO"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
