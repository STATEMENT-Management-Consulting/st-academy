"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useContactModal } from "@/contexts/ContactModalContext";
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
}

export default function Hero() {
  const [EVENTS, setEVENTS] = useState<Event[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const { openContactModal } = useContactModal();
  const { openEventModal } = useEventModal();

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

  // Se carregando ou sem eventos, mostrar placeholder
  if (loading) {
    return (
      <section className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white overflow-hidden min-h-125 flex items-center justify-center">
        <div className="animate-spin text-gray-400">Carregando...</div>
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
                <button onClick={openContactModal} className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-xs font-light tracking-widest transition-colors text-center cursor-pointer">
                  CONTACTE-JÁ
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
              <button onClick={openContactModal} className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-xs font-light tracking-widest transition-colors text-center cursor-pointer">
                CONTACTE-JÁ
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
                    onClick={() => openEventModal(currentEvent)}
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
      </div>
    </section>
  );
}
