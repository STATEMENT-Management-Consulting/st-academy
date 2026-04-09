"use client";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-light text-black mb-6">Sobre Statement Academy</h2>
          <p className="text-base text-gray-600 max-w-3xl font-light leading-relaxed">
            Somos uma instituição dedicada a preparar profissionais para os desafios do século XXI com educação de qualidade e inovação contínua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
          <div>
            <h3 className="text-3xl font-light text-black mb-6">Nossa Missão</h3>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              Transformar vidas através de educação profissional de qualidade, preparando indivíduos para carreiras bem-sucedidas e significativas na era digital.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-light text-black mb-6">Nossa Visão</h3>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              Ser reconhecida como a instituição líder em educação profissional, formando profissionais éticos, competentes e inovadores que transformam positivamente suas comunidades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="border-t border-gray-200 pt-8">
            <div className="text-3xl font-light text-black mb-2">5K+</div>
            <p className="text-sm text-gray-600 font-light">Alunos Formados</p>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <div className="text-3xl font-light text-black mb-2">98%</div>
            <p className="text-sm text-gray-600 font-light">Taxa de Satisfação</p>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <div className="text-3xl font-light text-black mb-2">50+</div>
            <p className="text-sm text-gray-600 font-light">Especialistas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
