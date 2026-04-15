"use client";

import { useContactModal } from "@/contexts/ContactModalContext";
import ContactModal from "./ContactModal";

export default function ContactModalWrapper() {
  const { isOpen, closeContactModal } = useContactModal();

  return <ContactModal isOpen={isOpen} onClose={closeContactModal} />;
}
