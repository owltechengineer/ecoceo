"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Projects from "@/components/Projects";
import ServiceCTA from "@/components/Services/ServiceCTA";
import MechanicalDivider from "@/components/Common/MechanicalDivider";

const ProjectsPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="I Nostri Progetti"
          description="Scopri i nostri lavori realizzati per clienti soddisfatti. Ogni progetto racconta una storia di successo e innovazione."
        />
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Projects Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                I Nostri Progetti
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Scopri i nostri lavori realizzati per clienti soddisfatti. Ogni progetto racconta una storia di successo e innovazione nel mondo digitale.
              </p>
            </div>
            <Projects />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Service CTA Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Hai un Progetto in Mente?
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Contattaci per discutere del tuo progetto e scopri come possiamo trasformare le tue idee in realtà.
              </p>
            </div>
            <ServiceCTA shuffle={true} />
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;
