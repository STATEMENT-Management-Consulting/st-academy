"use client";

import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Empresa */}
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              Transformando vidas através de educação profissional de qualidade e inovação contínua.
            </p>
          </div>

          {/* Programas */}
          <div>
            <h4 className="text-xs font-light tracking-widest text-black mb-6">PROGRAMAS</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Full Stack Development</a></li>
              <li><a href="#" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Data Science & IA</a></li>
              <li><a href="#" className="text-sm font-light text-gray-600 hover:text-black transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="text-sm font-light text-gray-600 hover:text-black transition-colors">DevOps & Cloud</a></li>
            </ul>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-xs font-light tracking-widest text-black mb-6">LINKS RÁPIDOS</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Sobre</a></li>
              <li><a href="#team" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Instrutores</a></li>
              <li><a href="#contact" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Contato</a></li>
              <li><a href="#" className="text-sm font-light text-gray-600 hover:text-black transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-light tracking-widest text-black mb-6">NEWSLETTER</h4>
            <p className="text-sm font-light text-gray-600 mb-4">Receba novidades e ofertas exclusivas.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-0 py-2 bg-transparent border-b border-gray-300 focus:border-black outline-none font-light text-sm"
              />
              <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 text-xs font-light tracking-widest transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-light text-gray-600">
            <div>© {currentYear} Statement Academy. Todos os direitos reservados.</div>
            <div className="flex justify-center gap-8">
              <a href="#" className="hover:text-black transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-black transition-colors">Termos de Serviço</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
