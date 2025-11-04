"use client";

import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
  description?: string;
}

const Breadcrumb = ({ pageName, description }: BreadcrumbProps) => {
  return (
    <>
      <section className="relative z-10 overflow-hidden pt-28 lg:pt-32">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="mb-8 max-w-4xl mx-auto text-center">
                <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  {pageName}
                </h1>
                {description && (
                  <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                    {description}
                  </p>
                )}
              </div>
              <div className="text-center">
                <ul className="inline-flex items-center">
                  <li className="flex items-center">
                    <Link
                      href="/"
                      className="pr-1 text-base font-medium text-white/80 hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                    <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-white/60"></span>
                  </li>
                  <li className="text-base font-medium text-white">
                    {pageName}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
