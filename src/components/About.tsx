"use client";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-light text-black mb-6">Sobre S.T.A.C ACADEMY</h2>
          <p className="text-base text-gray-600 max-w-3xl font-light leading-relaxed">
            Com mais de cinco anos de solidez no sector educacional angolano, a S.T.A.C ACADEMY consolida-se como uma referência em formação técnica de alta performance, comprometida em entregar um ensino de excelência que une rigor técnico e agilidade.
          </p>
          <p className="text-base text-gray-600 max-w-3xl font-light leading-relaxed mt-4">
            Sob a visão estratégica do nosso gerente, o Sr. Aristides Chalo, a academia nasceu com a missão clara de preencher a lacuna entre a teoria acadêmica e as exigências reais do mercado de trabalho. Oferecemos uma alternativa viável, prática e acelerada à formação universitária tradicional.
          </p>
          <p className="text-base text-gray-600 max-w-3xl font-light leading-relaxed mt-4">
            A nossa metodologia foca na imersão total. Ao escolher a S.T.A.C ACADEMY, o formando mergulha em centenas de horas de prática intensiva, dominando as técnicas mais avançadas da sua área.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-light text-black mb-4">Diagnóstico Estratégico de Competências</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Serviço de consultoria técnica de imersão na cultura e nos processos das instituições/empresas. O objectivo não é apenas identificar "o que os colaboradores querem aprender", mas sim descobrir quais lacunas técnicas e comportamentais estão impedindo as instituições de atingir metas previamente definidas.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light text-black mb-4">Formação</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Processo estratégico e contínuo de desenvolvimento de competências (conhecimentos, habilidades e atitudes) alinhado aos objectivos de negócio de uma organização.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light text-black mb-4">Programa de Avaliação de Competências</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Processo estruturado utilizado para medir o gap entre as capacidades atuais de um colaborador e as exigências do cargo ou os objetivos estratégicos da empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
