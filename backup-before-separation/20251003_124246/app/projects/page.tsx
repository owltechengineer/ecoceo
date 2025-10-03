"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Projects from "@/components/Projects";

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

      {/* Projects Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                I Nostri Progetti
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Scopri i nostri lavori realizzati per clienti soddisfatti. Ogni progetto racconta una storia di successo e innovazione.
              </p>
            </div>
            <Projects 
              projects={[]}
              title="Portfolio dei Nostri Lavori"
              subtitle="Dai un'occhiata ai progetti che abbiamo realizzato per i nostri clienti"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;
