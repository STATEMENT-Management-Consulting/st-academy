"use client";

export default function Programs() {
  const programs = [
    {
      title: "Desenvolvimento Web Full Stack",
      duration: "12 semanas",
      level: "Iniciante a Avançado",
      students: "500+",
      description: "Aprenda a criar aplicações web modernas com React, Node.js e banco de dados.",
      price: "R$ 2.499",
    },
    {
      title: "Data Science & IA",
      duration: "16 semanas",
      level: "Intermediário",
      students: "320+",
      description: "Domine Python, Machine Learning e análise de dados com casos reais.",
      price: "R$ 3.299",
    },
    {
      title: "UI/UX Design Moderno",
      duration: "10 semanas",
      level: "Iniciante",
      students: "450+",
      description: "Crie interfaces intuitivas e experiências de usuário excecionais.",
      price: "R$ 1.999",
    },
    {
      title: "DevOps & Cloud Computing",
      duration: "14 semanas",
      level: "Intermediário a Avançado",
      students: "280+",
      description: "Especialize-se em cloud, containers e infraestrutura moderna.",
      price: "R$ 2.999",
    },
    {
      title: "Mobile App Development",
      duration: "12 semanas",
      level: "Intermediário",
      students: "380+",
      description: "Desenvolva aplicativos iOS e Android com React Native.",
      price: "R$ 2.499",
    },
    {
      title: "Segurança da Informação",
      duration: "15 semanas",
      level: "Avançado",
      students: "210+",
      description: "Proteja sistemas e dados com conhecimento em segurança cibernética.",
      price: "R$ 3.499",
    }
  ];

  return (
    <section id="programs" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto">
        <h2 className="text-5xl md:text-6xl font-light text-black mb-4">Descubra nossos programas</h2>
        <p className="text-base text-gray-600 mb-16 max-w-2xl font-light">Programas especializados desenvolvidos por especialistas da indústria</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-white border border-gray-200 p-8 hover:border-black transition-colors">
              <h3 className="text-xl font-light text-black mb-3">{program.title}</h3>
              <p className="text-sm text-gray-600 mb-6 font-light">{program.description}</p>
              
              <div className="space-y-2 mb-6 text-xs text-gray-600 font-light">
                <p>Duração: {program.duration}</p>
                <p>Nível: {program.level}</p>
                <p>Alunos: {program.students}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-lg font-light text-black">{program.price}</span>
                <button className="bg-black hover:bg-gray-900 text-white px-6 py-2 text-xs font-light tracking-widest transition-colors">
                  SAIBA MAIS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
