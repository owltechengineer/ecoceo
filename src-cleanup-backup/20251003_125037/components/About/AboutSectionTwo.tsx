import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
      <div className="wow fadeInUp" data-wow-delay=".2s">
        <div className="relative mx-auto max-w-[500px] lg:mr-0">
          <Image
            src="/images/about/about-image-2.svg"
            alt="about-image"
            width={500}
            height={400}
            className="mx-auto max-w-full lg:mr-0"
          />
        </div>
      </div>
      
      <div className="wow fadeInUp" data-wow-delay=".4s">
        <div className="mb-9">
          <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            La Nostra Missione
          </h3>
          <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
            La nostra missione è quella di aiutare le aziende a crescere nel mondo digitale attraverso soluzioni innovative e personalizzate. Crediamo che ogni business abbia un potenziale unico che può essere espresso attraverso la tecnologia.
          </p>
        </div>
        
        <div className="mb-9">
          <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            I Nostri Valori
          </h3>
          <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
            L'innovazione, la qualità e la trasparenza sono i pilastri su cui fondiamo il nostro lavoro. Ogni progetto è un'opportunità per superare le aspettative e creare valore duraturo per i nostri clienti.
          </p>
        </div>
        
        <div className="mb-1">
          <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            Il Nostro Team
          </h3>
          <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
            Siamo un team di professionisti esperti e appassionati, uniti dalla passione per la tecnologia e dall'obiettivo comune di creare soluzioni digitali che facciano la differenza.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionTwo;
