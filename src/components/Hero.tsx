"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Loader } from "lucide-react";
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
  type: string;
}

export default function Hero() {
  const [EVENTS, setEVENTS] = useState<Event[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carregar eventos do Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("type", "upcoming")
        .order("date", { ascending: true });

      if (error) {
        console.error("Erro ao carregar eventos:", error);
        setEVENTS([]);
      } else {
        setEVENTS(data || []);
      }
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      setEVENTS([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || EVENTS.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, EVENTS.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
    setAutoPlay(false);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !formData.name || !formData.email || !formData.phone) {
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
        console.error("Erro ao salvar inscrição:", error);
        setSubmitMessage({ type: "error", text: "Erro ao salvar inscrição. Tente novamente." });
      } else {
        setSubmitMessage({ type: "success", text: "Inscrição realizada com sucesso! 🎉" });
        setFormData({ name: "", email: "", phone: "" });
        setTimeout(() => {
          setSelectedEvent(null);
          setSubmitMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro:", error);
      setSubmitMessage({ type: "error", text: "Erro ao conectar com o servidor." });
    } finally {
      setSubmitting(false);
    }
  };

  // Se carregando ou sem eventos, mostrar placeholder
  if (loading) {
    return (
      <section className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white overflow-hidden min-h-125 flex items-center justify-center">
        <Loader className="animate-spin text-gray-400" size={32} />
      </section>
    );
  }

  if (EVENTS.length === 0) {
    return (
      <section className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white overflow-hidden">
        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-8 leading-tight tracking-tight max-w-2xl">
                Transforme sua carreira com qualidade
              </h1>
              
              <p className="text-lg text-gray-600 mb-12 leading-relaxed font-light max-w-lg">
                Aprenda com os melhores profissionais da indústria. Programas práticos e atualizados que preparam você para os desafios do mercado moderno.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-black hover:bg-gray-900 text-white px-10 py-4 text-xs font-light tracking-widest transition-colors">
                  COMEÇAR AGORA
                </button>
                <button className="border border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-black px-10 py-4 text-xs font-light tracking-widest transition-colors">
                  VER PROGRAMAS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentEvent = EVENTS[currentSlide];

  return (
    <section className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8f8f8" />
              <stop offset="100%" stopColor="#e8e8e8" />
            </linearGradient>
            <pattern id="dots" x="40" y="40" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" fill="#d0d0d0" opacity="0.4" />
            </pattern>
          </defs>
          
          <rect width="1200" height="800" fill="url(#bgGradient)" />
          <rect width="1200" height="800" fill="url(#dots)" />
          
          <circle cx="900" cy="150" r="200" fill="#ffffff" opacity="0.15" />
          <circle cx="1050" cy="600" r="150" fill="#000000" opacity="0.05" />
          <rect x="100" y="500" width="300" height="2" fill="#000000" opacity="0.1" />
          <rect x="50" y="650" width="400" height="1" fill="#000000" opacity="0.08" />
          
          <path
            d="M 0 200 Q 300 150 600 200 T 1200 200"
            fill="none"
            stroke="#000000"
            strokeWidth="0.5"
            opacity="0.05"
          />
          <path
            d="M 0 400 Q 300 350 600 400 T 1200 400"
            fill="none"
            stroke="#000000"
            strokeWidth="0.5"
            opacity="0.05"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-8 leading-tight tracking-tight max-w-2xl">
              Transforme sua carreira com qualidade
            </h1>
            
            <p className="text-lg text-gray-600 mb-12 leading-relaxed font-light max-w-lg">
              Aprenda com os melhores profissionais da indústria. Programas práticos e atualizados que preparam você para os desafios do mercado moderno.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-black hover:bg-gray-900 text-white px-10 py-4 text-xs font-light tracking-widest transition-colors">
                COMEÇAR AGORA
              </button>
              <button className="border border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-black px-10 py-4 text-xs font-light tracking-widest transition-colors">
                VER PROGRAMAS
              </button>
            </div>
          </div>

          {/* Carousel - Second column */}
          <div className="hidden lg:block relative h-96">
            {/* Carousel */}
            <div className="relative h-full">
              <div className="overflow-hidden rounded-lg h-full">
                <div className="relative w-full h-full">
                  {/* Main carousel image - background style */}
                  <div 
                    className="relative w-full h-full overflow-hidden bg-cover bg-center transition-all duration-500 cursor-pointer"
                    style={{
                      backgroundImage: `url(${currentEvent.image})`,
                    }}
                    onClick={() => setSelectedEvent(currentEvent)}
                  >
                    {/* Overlay with event info */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8 sm:p-12">
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 leading-tight">
                        {currentEvent.title}
                      </h3>
                      <p className="text-lg sm:text-xl text-gray-200 font-light">
                        {currentEvent.date}
                      </p>
                    </div>

                    {/* Loading indicator */}
                    <div className="absolute top-4 right-4 text-white text-sm font-light">
                      {currentSlide + 1} / {EVENTS.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200"
                  aria-label="Evento anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200"
                  aria-label="Próximo evento"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Dots indicators */}
              <div className="flex gap-2 mt-4 justify-center absolute bottom-4 left-0 right-0">
                {EVENTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setAutoPlay(false);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? "bg-white w-8 h-2"
                        : "bg-white/50 w-2 h-2 hover:bg-white/75"
                    }`}
                    aria-label={`Ir para evento ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="hidden lg:flex gap-3 mt-8 justify-center overflow-x-auto pb-2">
          {EVENTS.map((event, index) => (
            <button
              key={event.id}
              onClick={() => {
                setCurrentSlide(index);
                setAutoPlay(false);
              }}
              className={`shrink-0 relative w-24 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentSlide ? "ring-2 ring-black" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999999 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header com imagem */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedEvent(null)}
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
                      <label className="block text-sm font-light text-gray-600 mb-2">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome"
                        className="w-full px-4 py-2 border border-gray-300 rounded font-light text-sm focus:outline-none focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-600 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded font-light text-sm focus:outline-none focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-600 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+244 923 456 789"
                        className="w-full px-4 py-2 border border-gray-300 rounded font-light text-sm focus:outline-none focus:border-black"
                        required
                      />
                    </div>

                    {submitMessage && (
                      <div
                        className={`p-3 rounded text-sm font-light ${
                          submitMessage.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {submitMessage.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white px-6 py-3 font-light tracking-widest transition-colors"
                    >
                      {submitting ? "Processando..." : "CONFIRMAR INSCRIÇÃO"}
                    </button>
                  </form>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full border border-gray-300 hover:border-black text-black px-6 py-3 font-light tracking-widest transition-colors"
                >
                  FECHAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
