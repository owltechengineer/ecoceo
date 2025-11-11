"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Blog from "@/components/Blog";
import ServiceCTA from "@/components/Services/ServiceCTA";

const BlogPage = () => {
  return (
    <>
      {/* Breadcrumb Section - Sfondo standard */}
      <div>
        <Breadcrumb
          pageName="Il Nostro Blog"
          description="Articoli, guide e insights dal mondo del web design e dello sviluppo digitale. Scopri le ultime novità e tendenze del settore."
        />
      </div>

      {/* Blog Content - Sfondo standard */}
      <div>
        <section className="py-16 lg:py-20">
          <div className="container">
            <Blog />
          </div>
        </section>
      </div>

      {/* Service CTA Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <ServiceCTA shuffle={true} />
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;
