"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/contexts/ContactModalContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openContactModal } = useContactModal();

  // Não mostrar navigation em /admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={openContactModal}
              className="bg-black hover:bg-gray-900 text-white px-6 py-2 text-xs font-light tracking-widest transition-colors rounded cursor-pointer"
            >
              CONTACTE-JÁ
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 border-t border-gray-200">
            <button
              onClick={() => {
                openContactModal();
                setIsOpen(false);
              }}
              className="block w-full py-3 px-4 bg-black hover:bg-gray-900 text-white font-light text-xs tracking-widest rounded text-left"
            >
              CONTACTE-JÁ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
