"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";

const AboutPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Chi Siamo"
          description="Scopri la nostra storia, i nostri valori e la passione che ci guida nel creare soluzioni digitali innovative per il tuo business."
        />
      </div>

      {/* About Section One */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <AboutSectionOne />
          </div>
        </section>
      </div>

      {/* About Section Two */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <AboutSectionTwo />
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
