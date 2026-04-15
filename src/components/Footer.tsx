"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-20">
        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-light text-gray-600">
            <div>© {currentYear} S.T.A.C ACADEMY. Todos os direitos reservados.</div>
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
