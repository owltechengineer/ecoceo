"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Shop from "@/components/Shop";

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
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                Il Nostro Shop
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Scopri i nostri prodotti di qualità. Ogni articolo è selezionato con cura per offrirti il meglio.
              </p>
            </div>
            <Shop 
              title="I Nostri Prodotti"
              subtitle="Scegli tra la nostra selezione di prodotti di alta qualità"
              products={[]}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
