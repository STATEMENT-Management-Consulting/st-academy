"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

interface EventModalContextType {
  selectedEvent: Event | null;
  openEventModal: (event: Event) => void;
  closeEventModal: () => void;
}

const EventModalContext = createContext<EventModalContextType | undefined>(undefined);

export function EventModalProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const openEventModal = (event: Event) => setSelectedEvent(event);
  const closeEventModal = () => setSelectedEvent(null);

  return (
    <EventModalContext.Provider value={{ selectedEvent, openEventModal, closeEventModal }}>
      {children}
    </EventModalContext.Provider>
  );
}

export function useEventModal() {
  const context = useContext(EventModalContext);
  if (context === undefined) {
    throw new Error("useEventModal must be used within EventModalProvider");
  }
  return context;
}
