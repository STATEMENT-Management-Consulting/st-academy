"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h2 className="text-5xl md:text-6xl font-light text-black mb-8">Fale Conosco</h2>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs font-light tracking-widest text-gray-700 mb-2">EMAIL</p>
              <p className="text-base font-light text-gray-600">contato@statementacademy.com</p>
            </div>
            
            <div>
              <p className="text-xs font-light tracking-widest text-gray-700 mb-2">TELEFONE</p>
              <p className="text-base font-light text-gray-600">+244 920000000</p>
            </div>
            
            <div>
              <p className="text-xs font-light tracking-widest text-gray-700 mb-2">ENDEREÇO</p>
              <p className="text-base font-light text-gray-600">Angola, Luanda, Rua 28 de maio, Edificio Kende</p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-light tracking-widest text-gray-700 mb-3">NOME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-black outline-none transition-colors font-light text-base"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-xs font-light tracking-widest text-gray-700 mb-3">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-black outline-none transition-colors font-light text-base"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-light tracking-widest text-gray-700 mb-3">MENSAGEM</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-0 py-3 bg-transparent border-b border-gray-300 focus:border-black outline-none transition-colors font-light text-base resize-none"
                placeholder="Sua mensagem"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white px-10 py-4 text-xs font-light tracking-widest transition-colors mt-8"
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
