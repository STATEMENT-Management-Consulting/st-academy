"use client";

import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-light text-black mb-8">Contacte-nos</h2>

        <div className="space-y-8">
          {/* Contacto 1 */}
          <div>
            <h3 className="text-lg font-light text-black mb-3">Gil Mbala</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-light">
                <span className="block text-xs tracking-widest text-gray-500 mb-1">TELEFONE</span>
                <a href="tel:930631968" className="hover:text-black transition-colors">
                  930 631 968
                </a>
              </p>
              <p className="text-sm text-gray-600 font-light">
                <span className="block text-xs tracking-widest text-gray-500 mb-1">EMAIL</span>
                <a href="mailto:gil.mbala@statementmc.com" className="hover:text-black transition-colors break-all">
                  gil.mbala@statementmc.com
                </a>
              </p>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-200"></div>

          {/* Contacto 2 */}
          <div>
            <h3 className="text-lg font-light text-black mb-3">Divina Malando</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-light">
                <span className="block text-xs tracking-widest text-gray-500 mb-1">TELEFONE</span>
                <a href="tel:933057010" className="hover:text-black transition-colors">
                  933 057 010
                </a>
              </p>
              <p className="text-sm text-gray-600 font-light">
                <span className="block text-xs tracking-widest text-gray-500 mb-1">EMAIL</span>
                <a href="mailto:divina.malando@statementmc.com" className="hover:text-black transition-colors break-all">
                  divina.malando@statementmc.com
                </a>
              </p>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-200"></div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-light text-black mb-3">Localização</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-light">
                <span className="block text-xs tracking-widest text-gray-500 mb-1">ENDEREÇO</span>
                Rua 28 de Maio, Maianga<br />
                Edifício Kende, 7º andar Esquerda
              </p>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-200"></div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-light text-black mb-3">Links</h3>
            <div className="space-y-2">
              <p className="text-sm font-light">
                <a href="https://bit.ly/Statement_Academy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors break-all">
                  https://bit.ly/Statement_Academy
                </a>
              </p>
              <p className="text-sm font-light">
                <a href="https://bit.ly/statement_academy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors break-all">
                  https://bit.ly/statement_academy
                </a>
              </p>
              <p className="text-sm font-light">
                <a href="https://bit.ly/Statement_academy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors break-all">
                  bit.ly/Statement_academy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-8 border border-gray-300 hover:bg-gray-50 text-black px-6 py-3 text-xs font-light tracking-widest transition-colors"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
}
