"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MechanicalDivider from "@/components/Common/MechanicalDivider";
import ServiceCTA from "@/components/Services/ServiceCTA";
import { safeFetch } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";
import { getImageUrl, getTextValue } from "@/sanity/lib/image";

const introParagraphs = [
  "Siamo un partner tech per lo sviluppo verticale integrato “end-to-end” di progetti e concept innovativi, trasformandoli in prodotti finiti.",
  "In un mercato dove l’innovazione hardware risulta complessa e costosa da gestire internamente, forniamo ai nostri clienti competenze ingegneristiche e tecnologie avanzate per ridurre i tempi di sviluppo e i rischi di progetto.",
];

const developmentSteps = [
  "Il ciclo di sviluppo del prodotto parte da una consulenza dalla quale si ottiene una valutazione del progetto.",
  "Dopodiché arriviamo alla produzione di un modello concettuale e di un modello tecnico.",
  "Con il modello finale si procede alla fase di produzione, test e sperimentazione.",
  "I processi e le lavorazioni verranno spiegate in seguito.",
];

const targetClients = ["PMI", "Microimprese", "Startup", "Innovatori"];

const processesProduzione = [
  "Consulenza",
  "Servizio",
  "Sviluppo",
  "Produzione",
  "Prototipazione",
  "Intero processo",
];

const processesInterni = [
  "Metriche KPI",
  "Gestione costi operativi",
  "Controllo qualità",
  "Manutenzione e gestione macchinari e programmi",
  "Piani di business continuity",
  "Gestione progetti e timeline",
];

const operativeAreas = [
  {
    title: "Macchinari (Hardware)",
    description:
      "Infrastrutture e attrezzature dedicate alla produzione, alla prototipazione e ai test funzionali.",
  },
  {
    title: "Programmi (Software)",
    description:
      "Suite di strumenti digitali per progettazione, automazione, simulazione e controllo di processo.",
  },
  {
    title: "Area di lavoro",
    description:
      "Spazi organizzati per garantire efficienza, sicurezza e continuità produttiva in ogni fase operativa.",
  },
  {
    title: "Materiali (Materie prime)",
    description:
      "Componenti e forniture selezionate per assicurare prestazioni, affidabilità e scalabilità del prodotto finale.",
  },
];

const AboutPage = () => {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutData = await safeFetch(aboutQuery);
        setAbout(aboutData);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p className="text-white/80 text-lg">Caricamento...</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-white">
        <Breadcrumb pageName="Il nostro studio" description="Conosci le persone e la visione che guidano ogni progetto." />
      </div>

      <MechanicalDivider />

      <section className="py-16 lg:py-20 text-white">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-start">
          <div className="space-y-6">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-white/90 text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Rendiamo semplice un processo aziendale che internamente richiederebbe spazi, macchinari, personale, tempo e risorse.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            {about?.image ? (
              <Image
                src={getImageUrl(about.image)}
                alt={about?.title ? getTextValue(about.title) : "OWLTech"}
                width={900}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
            ) : (
              <div className="p-10">
                <h3 className="text-2xl font-semibold mb-4">OWLTech</h3>
                <p className="text-white/80 leading-relaxed">
                  Strutturiamo servizi e prodotti personalizzati sul profilo del cliente, con l’obiettivo di diventare il partner privilegiato per l’innovazione hardware.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <MechanicalDivider />

      <section className="py-16 lg:py-20 text-white">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Il ciclo di sviluppo</h2>
            <ul className="space-y-4 text-white/90">
              {developmentSteps.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Il nostro obiettivo</h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              Diventare il referente privilegiato per l’innovazione hardware, strutturando servizi e prodotti sul profilo del cliente.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {targetClients.map((client) => (
                <div
                  key={client}
                  className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white/80"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MechanicalDivider />

      <section className="py-16 lg:py-20 text-white">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Mission</h2>
            <p className="text-white/90 leading-relaxed">
              Diventare parte integrante dei processi aziendali dei nostri clienti target, offrendo un servizio professionale e strutturato in un ambito fondamentale per la crescita di realtà durature.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Vision</h2>
            <p className="text-white/90 leading-relaxed">
              Offrire competenze ingegneristiche avanzate e capacità di prototipazione per trasformare concetti complessi in soluzioni tecnologiche tangibili. Supportiamo un tessuto di realtà con grande potenziale e puntiamo a valorizzarlo.
            </p>
          </div>
        </div>
      </section>

      <MechanicalDivider />

      <section className="py-16 lg:py-20 text-white">
        <div className="container space-y-12">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">OWLTech · Piano operativo, produzione & tecnologie</h2>
            <p className="text-white/80 leading-relaxed">
              Nel nostro piano operativo utilizziamo approcci rinomati per l’efficienza di produzione, come il metodo LEAN, creando un binario solido per la gestione delle attività e delle risorse.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {operativeAreas.map((area) => (
              <div key={area.title} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h3 className="text-2xl font-semibold mb-4">Processi di produzione</h3>
              <ul className="space-y-3 text-white/90">
                {processesProduzione.map((process) => (
                  <li key={process} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <span>{process}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h3 className="text-2xl font-semibold mb-4">Processi interni</h3>
              <ul className="space-y-3 text-white/90">
                {processesInterni.map((process) => (
                  <li key={process} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <span>{process}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <MechanicalDivider />

      <section className="py-16 lg:py-20 text-white">
        <div className="container">
          <ServiceCTA shuffle />
        </div>
      </section>
    </>
  );
};

export default AboutPage;
