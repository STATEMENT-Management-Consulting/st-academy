"use client";

import Image from "next/image";

export default function Partners() {
  const partners = [
    {
      name: "INEFOP",
      description: "A STATEMENT Academy é parceira certificada pelo INEFOP (Instituto Nacional de Emprego e Formação Profissional) sob a LICENÇA Nº 538.01/LDA./2021, o que torna o nosso certificado um reconhecimento Nacional. ",
      logo: "/logos/inefop2.jpeg",
    },
    {
      name: "ANPG",
      description: "A STATEMENT Academy é parceira certificada pela ANPG (Agencia Nacional de Petroleo e Gas), sob a LICENÇA Nº- 5000771287/CL-ANPG/2022 para a prestação de serviços as empresas petrolíferas presentes em Angola, isto dentro do Conteúdo Local. ",
      logo: "/logos/anpg.jpg",
    },
    {
      name: "CENFFOR",
      description: "A STATEMENT Academy é parceira certificada pelo CENFFOR (Centro Nacional de Formação de Formadores), para o curso de Formação de formadores.",
      logo: "/logos/cenffor.jpg",
    },
  ];

  return (
    <section id="partners" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-full mx-auto">
        <h2 className="text-5xl md:text-6xl font-light text-black mb-16">Porquê a STAC-Academy</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Logo */}
              <div className="w-40 h-40 bg-gray-200 rounded-lg mb-6 flex items-center justify-center border border-gray-300 relative">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={160}
                    className="rounded-lg object-contain p-4"
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <p className="font-light text-sm">{partner.name}</p>
                    <p className="text-xs text-gray-400 mt-2">Logo</p>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-light text-black mb-2">{partner.name}</h3>
              <p className="text-sm font-light text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
