"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { safeFetch } from '@/sanity/lib/client';
import { projectBySlugQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';

const ProjectDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await safeFetch(projectBySlugQuery, { slug });
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Get UI components for Project details section
  const projectDetailsTitleComponent = getComponent('ProjectDetailsTitle');
  const projectDetailsContentComponent = getComponent('ProjectDetailsContent');
  const projectDetailsMetaComponent = getComponent('ProjectDetailsMeta');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento progetto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Progetto non trovato</h3>
        <p className="text-gray-600 mb-6">Il progetto che stai cercando non esiste.</p>
        <Link
          href="/projects"
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Torna ai Progetti
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName={getTextValue(project.name) || getTextValue(project.title)}
          description={getTextValue(project.description) || getTextValue(project.shortDescription) || "Dettagli del progetto"}
        />
      </div>

      {/* Project Details Content */}
      <div className="text-white">
        <section className="pt-[150px] pb-[120px]">
          <div className="container max-w-7xl">
            <div className="-mx-4 flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div>
                  {/* Titolo su una riga sola */}
                  <SanityStyledComponent
                    component={projectDetailsTitleComponent}
                    componentName="ProjectDetailsTitle"
                    as="h1"
                    className="mb-8 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl sm:leading-tight line-clamp-1"
                  >
                    {getTextValue(project.name) || getTextValue(project.title)}
                  </SanityStyledComponent>
                  
                  <SanityStyledComponent
                    component={projectDetailsMetaComponent}
                    componentName="ProjectDetailsMeta"
                    className="border-body-color/10 mb-10 flex flex-wrap items-center justify-between border-b pb-4 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-center">
                      {project.service && project.service.slug && (
                      <div className="mr-10 mb-5 flex items-center">
                        <Link
                            href={`/services/${project.service.slug.current || project.service.slug}`}
                            className="inline-block bg-white/20 hover:bg-primary/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/20"
                        >
                          {getTextValue(project.service.name)}
                        </Link>
                      </div>
                      )}
                      {project.client && (
                        <div className="mr-10 mb-5 flex items-center">
                          <div className="w-full">
                            <span className="text-body-color mb-1 text-base font-medium">
                              Cliente: <span className="font-semibold">{project.client}</span>
                            </span>
                          </div>
                        </div>
                      )}
                      {project.completionDate && (
                        <div className="mb-5 flex items-center">
                          <p className="text-body-color mr-5 flex items-center text-base font-medium">
                            <span className="mr-3">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                className="fill-current"
                              >
                                <path d="M3.89531 8.67529H3.10666C2.96327 8.67529 2.86768 8.77089 2.86768 8.91428V9.67904C2.86768 9.82243 2.96327 9.91802 3.10666 9.91802H3.89531C4.03871 9.91802 4.1343 9.82243 4.1343 9.67904V8.91428C4.1343 8.77089 4.03871 8.67529 3.89531 8.67529Z" />
                                <path d="M6.429 8.67529H5.64035C5.49696 8.67529 5.40137 8.77089 5.40137 8.91428V9.67904C5.40137 9.82243 5.49696 9.91802 5.64035 9.91802H6.429C6.57239 9.91802 6.66799 9.82243 6.66799 9.67904V8.91428C6.66799 8.77089 6.5485 8.67529 6.429 8.67529Z" />
                                <path d="M8.93828 8.67529H8.14963C8.00624 8.67529 7.91064 8.77089 7.91064 8.91428V9.67904C7.91064 9.82243 8.00624 9.91802 8.14963 9.91802H8.93828C9.08167 9.91802 9.17727 9.82243 9.17727 9.67904V8.91428C9.17727 8.77089 9.08167 8.67529 8.93828 8.67529Z" />
                                <path d="M11.4715 8.67529H10.6828C10.5394 8.67529 10.4438 8.77089 10.4438 8.91428V9.67904C10.4438 9.82243 10.5394 9.91802 10.6828 9.91802H11.4715C11.6149 9.91802 11.7105 9.82243 11.7105 9.67904V8.91428C11.7105 8.77089 11.591 8.67529 11.4715 8.67529Z" />
                                <path d="M3.89531 11.1606H3.10666C2.96327 11.1606 2.86768 11.2562 2.86768 11.3996V12.1644C2.86768 12.3078 2.96327 12.4034 3.10666 12.4034H3.89531C4.03871 12.4034 4.1343 12.3078 4.1343 12.1644V11.3996C4.1343 11.2562 4.03871 11.1606 3.89531 11.1606Z" />
                                <path d="M6.429 11.1606H5.64035C5.49696 11.1606 5.40137 11.2562 5.40137 11.3996V12.1644C5.40137 12.3078 5.49696 12.4034 5.64035 12.4034H6.429C6.57239 12.4034 6.66799 12.3078 6.66799 12.1644V11.3996C6.66799 11.2562 6.5485 11.1606 6.429 11.1606Z" />
                                <path d="M8.93828 11.1606H8.14963C8.00624 11.1606 7.91064 11.2562 7.91064 11.3996V12.1644C7.91064 12.3078 8.00624 12.4034 8.14963 12.4034H8.93828C9.08167 12.4034 9.17727 12.3078 9.17727 12.1644V11.3996C9.17727 11.2562 9.08167 11.1606 8.93828 11.1606Z" />
                                <path d="M11.4715 11.1606H10.6828C10.5394 11.1606 10.4438 11.2562 10.4438 11.3996V12.1644C10.4438 12.3078 10.5394 12.4034 10.6828 12.4034H11.4715C11.6149 12.4034 11.7105 12.3078 11.7105 12.1644V11.3996C11.7105 11.2562 11.591 11.1606 11.4715 11.1606Z" />
                                <path d="M13.2637 3.3697H7.64754V2.58105C8.19721 2.43765 8.62738 1.91189 8.62738 1.31442C8.62738 0.597464 8.02992 0 7.28906 0C6.54821 0 5.95074 0.597464 5.95074 1.31442C5.95074 1.91189 6.35702 2.41376 6.93058 2.58105V3.3697H1.31442C0.597464 3.3697 0 3.96716 0 4.68412V13.2637C0 13.9807 0.597464 14.5781 1.31442 14.5781H13.2637C13.9807 14.5781 14.5781 13.9807 14.5781 13.2637V4.68412C14.5781 3.96716 13.9807 3.3697 13.2637 3.3697ZM6.6677 1.31442C6.6677 0.979841 6.93058 0.716957 7.28906 0.716957C7.62364 0.716957 7.91042 0.979841 7.91042 1.31442C7.91042 1.649 7.64754 1.91189 7.28906 1.91189C6.95448 1.91189 6.6677 1.6251 6.6677 1.31442ZM1.31442 4.08665H13.2637C13.5983 4.08665 13.8612 4.34954 13.8612 4.68412V6.45261H0.716957V4.68412C0.716957 4.34954 0.979841 4.08665 1.31442 4.08665ZM13.2637 13.8612H1.31442C0.979841 13.8612 0.716957 13.5983 0.716957 13.2637V7.16957H13.8612V13.2637C13.8612 13.5983 13.5983 13.8612 13.2637 13.8612Z" />
                              </svg>
                            </span>
                            Completato: {new Date(project.completionDate).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      {project.featured && (
                        <span className="bg-orange-500 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white">
                          In Evidenza
                        </span>
                      )}
                    </div>
                  </SanityStyledComponent>
                  
                  <SanityStyledComponent
                    component={projectDetailsContentComponent}
                    componentName="ProjectDetailsContent"
                  >
                    {/* Immagine principale più grande */}
                    {project.mainImage && (
                      <div className="mb-12 w-full overflow-hidden rounded-xl shadow-2xl">
                        <div className="relative w-full aspect-video">
                          <Image
                          src={getImageUrl(project.mainImage)}
                            alt={getTextValue(project.name) || getTextValue(project.title)}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Descrizione breve */}
                    {(project.description || project.shortDescription) && (
                      <div className="mb-12">
                        <p className="text-xl text-white/90 leading-relaxed font-medium">
                          {getTextValue(project.description) || getTextValue(project.shortDescription)}
                        </p>
                      </div>
                    )}
                    
                    {/* Sezioni Contenuto Personalizzate */}
                    {project.sections && project.sections.length > 0 ? (
                      <div className="mb-12 space-y-16 w-full">
                        {project.sections.map((section, index) => (
                          <div key={index} className="border-t border-white/10 pt-12 w-full">
                            {/* Titolo sezione */}
                            {section.title && (
                              <h2 className="text-3xl font-bold text-white mb-8">
                                {section.title}
                              </h2>
                            )}
                            
                            {/* Layout: Testo sopra, Immagini sotto */}
                            {section.layout === 'text-top' && (
                              <>
                                {section.content && (
                                  <div className="mb-8 prose prose-invert prose-lg max-w-none w-full">
                                    <div className="text-white/80 leading-relaxed">
                                      <PortableText value={section.content} />
                                    </div>
                                  </div>
                                )}
                                {section.images && section.images.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    {section.images.map((img, imgIndex) => (
                                      <div 
                                        key={imgIndex} 
                                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                      >
                                        <div className="relative w-full aspect-square">
                                          <Image
                                            src={getImageUrl(img)}
                                            alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                          />
                                        </div>
                                        {img.caption && (
                                          <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                            
                            {/* Layout: Immagini sopra, Testo sotto */}
                            {section.layout === 'images-top' && (
                              <>
                                {section.images && section.images.length > 0 && (
                                  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    {section.images.map((img, imgIndex) => (
                                      <div 
                                        key={imgIndex} 
                                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                      >
                                        <div className="relative w-full aspect-square">
                                          <Image
                                            src={getImageUrl(img)}
                                            alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                          />
                                        </div>
                                        {img.caption && (
                                          <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {section.content && (
                                  <div className="prose prose-invert prose-lg max-w-none w-full">
                                    <div className="text-white/80 leading-relaxed">
                                      <PortableText value={section.content} />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {/* Layout: Testo e Immagini Separate (side by side) */}
                            {section.layout === 'separate' && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                                {section.content && (
                                  <div className="prose prose-invert prose-lg max-w-none w-full">
                                    <div className="text-white/80 leading-relaxed">
                                      <PortableText value={section.content} />
                                    </div>
                                  </div>
                                )}
                                {section.images && section.images.length > 0 && (
                                  <div className="grid grid-cols-1 gap-6 w-full">
                                    {section.images.map((img, imgIndex) => (
                                      <div 
                                        key={imgIndex} 
                                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
                                      >
                                        <div className="relative w-full aspect-video">
                                          <Image
                                            src={getImageUrl(img)}
                                            alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                          />
                                        </div>
                                        {img.caption && (
                                          <p className="mt-2 text-sm text-white/60">{img.caption}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Layout: Solo Testo */}
                            {section.layout === 'text-only' && section.content && (
                              <div className="prose prose-invert prose-lg max-w-none w-full">
                                <div className="text-white/80 leading-relaxed">
                                  <PortableText value={section.content} />
                                </div>
                              </div>
                            )}
                            
                            {/* Layout: Solo Immagini */}
                            {section.layout === 'images-only' && section.images && section.images.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {section.images.map((img, imgIndex) => (
                                  <div 
                                    key={imgIndex} 
                                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                  >
                                    <div className="relative w-full aspect-square">
                                      <Image
                                        src={getImageUrl(img)}
                                        alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                    {img.caption && (
                                      <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Fallback: Descrizione completa legacy e galleria */
                      <>
                        {project.fullDescription && (
                          <div className="mb-12 prose prose-invert prose-lg max-w-none">
                            <div className="text-white/80 leading-relaxed">
                              <PortableText value={project.fullDescription} />
                            </div>
                          </div>
                        )}
                        
                        {project.descriptionSections && project.descriptionSections.length > 0 && (
                          <div className="mb-12 space-y-12">
                            {project.descriptionSections.map((section, index) => (
                              <div key={index} className="border-t border-white/10 pt-8">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                  {section.title}
                                </h2>
                                <div className="prose prose-invert prose-lg max-w-none">
                                  <div className="text-white/80 leading-relaxed">
                                    <PortableText value={section.content} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                      )}
                    
                    {project.gallery && project.gallery.length > 0 && (
                          <div className="mb-12">
                            <h3 className="text-2xl font-bold text-white mb-8">Galleria Immagini</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {project.gallery.map((image, index) => (
                                <div 
                                  key={index} 
                                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                >
                                  <div className="relative w-full aspect-square">
                                    <Image
                                src={getImageUrl(image)}
                                      alt={`${getTextValue(project.name) || getTextValue(project.title)} - Immagine ${index + 1}`}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                        )}
                      </>
                    )}
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-xl font-bold mb-6">Tecnologie Utilizzate</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </SanityStyledComponent>
                  
                  <div className="items-center justify-between sm:flex">
                    <div className="mb-5">
                      <h4 className="text-body-color mb-3 text-sm font-medium">
                        Link Utili:
                      </h4>
                      <div className="flex items-center space-x-4">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visita il Progetto
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Vedi su GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    {project.service && project.service.slug && (
                    <div className="mb-5">
                      <Link
                          href={`/services/${project.service.slug.current || project.service.slug}/projects`}
                          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Altri progetti di {getTextValue(project.service.name)}
                      </Link>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
