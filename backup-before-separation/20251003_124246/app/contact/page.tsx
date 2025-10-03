"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Contattaci"
          description="Siamo qui per aiutarti a realizzare i tuoi progetti digitali. Contattaci per una consulenza gratuita e scopri come possiamo trasformare la tua presenza online."
        />
      </div>

      {/* Contact Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <Contact />
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
