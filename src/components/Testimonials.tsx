"use client";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Felipe Martins",
      role: "Desenvolvedor em Google",
      text: "A Statement Academy transformou completamente minha carreira. O currículo é prático, os instrutores são incríveis e consegui meu emprego em 2 meses após formação.",
    },
    {
      name: "Isabella Gomes",
      role: "Data Scientist na Conta Azul",
      text: "Melhor investimento que já fiz em educação. O programa de Data Science é extenso, com projetos reais e suporte excepcional.",
    },
    {
      name: "Gabriel Pires",
      role: "Designer Senior na Nubank",
      text: "Excelente programa de UI/UX. Saí com um portfólio forte e pronto para trabalhar em empresas top.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto">
        <h2 className="text-5xl md:text-6xl font-light text-black mb-16">O que dizem nossos alunos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 p-8">
              <p className="text-base text-gray-700 font-light mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-light text-black mb-1">{testimonial.name}</p>
                <p className="text-xs text-gray-600 font-light">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
