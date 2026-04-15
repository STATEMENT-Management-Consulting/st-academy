"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEventModal } from "@/contexts/EventModalContext";

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
  gallery?: string[];
}

export default function Team() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [selectedPastEvent, setSelectedPastEvent] = useState<Event | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { openEventModal } = useEventModal();

  // Carregar eventos do Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Carregar eventos futuros
      const { data: upcoming, error: upcomingError } = await supabase
        .from("events")
        .select("*")
        .eq("type", "upcoming")
        .order("date", { ascending: true })
        .limit(3);

      // Carregar eventos passados
      const { data: past, error: pastError } = await supabase
        .from("events")
        .select("*")
        .eq("type", "past")
        .order("date", { ascending: false })
        .limit(4);

      if (upcomingError) {
        console.error("Erro ao carregar eventos futuros:", upcomingError);
      } else {
        setUpcomingEvents(upcoming || []);
      }

      if (pastError) {
        console.error("Erro ao carregar eventos passados:", pastError);
      } else {
        setPastEvents(past || []);
      }
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPastEvent?.gallery) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? selectedPastEvent.gallery!.length - 1 : prev - 1
      );
    }
  };

  const handleNextPhoto = () => {
    if (selectedPastEvent?.gallery) {
      setCurrentPhotoIndex((prev) =>
        prev === selectedPastEvent.gallery!.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50 min-h-125 flex items-center justify-center">
        <div className="text-gray-400 font-light">Carregando...</div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Upcoming Events Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">
              Próximos Eventos
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Confira as formações que estão por vir
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => openEventModal(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm font-light">
                      {event.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-light text-black mb-3 leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 font-light text-sm mb-4">
                      Instrutor: {event.instructor}
                    </p>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-500 font-light">
                        <span className="font-medium">Data:</span> {event.date}
                      </p>
                      <p className="text-sm text-gray-500 font-light">
                        <span className="font-medium">Hora:</span> {event.time}
                      </p>
                      <p className="text-sm text-gray-500 font-light">
                        <span className="font-medium">Local:</span> {event.location}
                      </p>
                      <p className="text-sm text-gray-500 font-light">
                        <span className="font-medium">Vagas:</span> {event.capacity}
                      </p>
                    </div>

                    <button className="w-full bg-black hover:bg-gray-900 text-white py-3 font-light tracking-widest transition-colors text-sm">
                      VER DETALHES
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-light">Nenhum evento futuro no momento</p>
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">
              Eventos Anteriores
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Confira as fotos dos eventos passados
            </p>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative h-64 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                  onClick={() => {
                    setSelectedPastEvent(event);
                    setCurrentPhotoIndex(0);
                  }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-light text-lg">{event.title}</h3>
                    <p className="text-gray-200 font-light text-sm">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-light">Nenhum evento anterior no momento</p>
            </div>
          )}
        </div>

        {/* Past Event Gallery Modal */}
        {selectedPastEvent && selectedPastEvent.gallery && selectedPastEvent.gallery.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999999 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header com imagem */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={selectedPastEvent.gallery[currentPhotoIndex]}
                  alt={`Foto ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
                  <button
                    onClick={handlePrevPhoto}
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Photo counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-light">
                  {currentPhotoIndex + 1} / {selectedPastEvent.gallery.length}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedPastEvent(null)}
                  className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                  aria-label="Fechar modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-8">
                <h2 className="text-4xl font-light text-black mb-2">{selectedPastEvent.title}</h2>
                <p className="text-gray-600 font-light mb-6">Instrutor: {selectedPastEvent.instructor}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 font-light mb-1">Data</p>
                    <p className="text-lg text-black font-light">{selectedPastEvent.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-light mb-1">Local</p>
                    <p className="text-lg text-black font-light">{selectedPastEvent.location}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-500 font-light mb-2">Sobre o evento</p>
                  <p className="text-base text-gray-700 font-light leading-relaxed">{selectedPastEvent.description}</p>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-6 justify-center overflow-x-auto pb-2">
                  {selectedPastEvent.gallery.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`shrink-0 relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === currentPhotoIndex
                          ? "ring-2 ring-black"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setSelectedPastEvent(null)}
                    className="w-full border border-gray-300 hover:border-black text-black px-6 py-3 font-light tracking-widest transition-colors"
                  >
                    FECHAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
