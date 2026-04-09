"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-16">
            <a href="#programs" className="text-gray-700 hover:text-black transition-colors font-light text-xs tracking-widest">
              PROGRAMAS
            </a>
            <a href="#about" className="text-gray-700 hover:text-black transition-colors font-light text-xs tracking-widest">
              SOBRE
            </a>
            <a href="#team" className="text-gray-700 hover:text-black transition-colors font-light text-xs tracking-widest">
              INSTRUTORES
            </a>
            <a href="#contact" className="text-gray-700 hover:text-black transition-colors font-light text-xs tracking-widest">
              CONTATO
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 border-t border-gray-200">
            <a href="#programs" className="block py-3 text-gray-700 hover:text-black font-light text-xs tracking-widest">
              PROGRAMAS
            </a>
            <a href="#about" className="block py-3 text-gray-700 hover:text-black font-light text-xs tracking-widest">
              SOBRE
            </a>
            <a href="#team" className="block py-3 text-gray-700 hover:text-black font-light text-xs tracking-widest">
              INSTRUTORES
            </a>
            <a href="#contact" className="block py-3 text-gray-700 hover:text-black font-light text-xs tracking-widest">
              CONTATO
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
