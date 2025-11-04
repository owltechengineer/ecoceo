"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Shop from "@/components/Shop";
import ServiceCTA from "@/components/Services/ServiceCTA";

const ShopPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Il Nostro Shop"
          description="Scopri i nostri prodotti di qualità. Ogni articolo è selezionato con cura per offrirti il meglio."
        />
      </div>

      {/* Shop Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <Shop 
            title="I Nostri Prodotti"
            subtitle="Scegli tra la nostra selezione di prodotti di alta qualità"
          />
        </section>
      </div>

      {/* Service CTA Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <ServiceCTA 
              title="Hai bisogno di servizi personalizzati?"
              subtitle="Oltre ai prodotti, offriamo servizi completi per il tuo business. Richiedi un preventivo gratuito!"
              shuffle={true}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
