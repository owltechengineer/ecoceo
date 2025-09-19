"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Blog from "@/components/Blog";

const BlogPage = () => {
  return (
    <>
      {/* Breadcrumb Section - Gradiente da grigio scuro a bianco */}
      <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Il Nostro Blog"
          description="Articoli, guide e insights dal mondo del web design e dello sviluppo digitale. Scopri le ultime novità e tendenze del settore."
        />
      </div>

      {/* Blog Content - Gradiente da bianco ad arancione intenso */}
      <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-6">
                Il Nostro Blog
              </h1>
              <p className="text-black/80 text-lg max-w-3xl mx-auto leading-relaxed">
                Articoli, guide e insights dal mondo del web design e dello sviluppo digitale. 
                Scopri le ultime novità, tendenze del settore e consigli pratici per migliorare 
                la tua presenza online.
              </p>
            </div>
            <Blog />
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;
