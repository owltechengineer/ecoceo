"use client";

import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectCardProps } from '@/types/project';

const SingleProject = ({ project, index }: ProjectCardProps) => {
  const { getComponent } = useSanityUIComponents();

  // Get UI components for Project section
  const projectCardComponent = getComponent('ProjectCard');
  const projectTitleComponent = getComponent('ProjectTitle');
  const projectDescriptionComponent = getComponent('ProjectDescription');

  return (
    <SanityStyledComponent
      component={projectCardComponent}
      componentName="ProjectCard"
      className="w-full"
    >
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-xl duration-500 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] hover:-translate-y-2 transition-all border border-white/20 hover:border-primary/40 h-full flex flex-col before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:via-primary/0 before:to-primary/0 hover:before:from-primary/10 hover:before:via-primary/5 hover:before:to-primary/10 before:transition-all before:duration-500 before:pointer-events-none">
          <Link href={`/projects/${project.slug?.current || project._id}`}>
            <div className="relative block aspect-[37/22] overflow-hidden">
              {project.mainImage ? (
                <Image
                  src={getImageUrl(project.mainImage)}
                  alt={getTextValue(project.title)}
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-white/60 text-sm">Nessuna immagine</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
              {project.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                  ⭐ In Evidenza
                </div>
              )}
            </div>
          </Link>
          
          <div className="p-6 flex flex-col flex-grow">
            {project.service && (
              <div className="mb-4">
                <Link
                  href={`/services/${project.service.slug?.current || project.service.slug}`}
                  className="inline-block bg-white/20 hover:bg-primary/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border border-white/20"
                >
                  {project.service.name}
                </Link>
              </div>
            )}
            
            <SanityStyledComponent
              component={projectTitleComponent}
              componentName="ProjectTitle"
              as="h3"
              className="mb-3 block text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 sm:text-2xl"
            >
              <Link href={`/projects/${project.slug?.current || project._id}`}>
                {getTextValue(project.title)}
              </Link>
            </SanityStyledComponent>
            
            <SanityStyledComponent
              component={projectDescriptionComponent}
              componentName="ProjectDescription"
              as="p"
              className="mb-6 text-base font-medium leading-relaxed text-white/80 flex-grow"
            >
              {getTextValue(project.shortDescription) || getTextValue(project.description)}
            </SanityStyledComponent>
            
            <div className="mt-auto pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                  {project.client && (
                    <div>
                      <p className="text-xs text-white/60">
                        Cliente
                      </p>
                      <p className="text-sm font-medium text-white">
                        {project.client}
                      </p>
                    </div>
                  )}
                  {project.completionDate && (
                    <div>
                      <p className="text-xs text-white/60">
                        Completato
                      </p>
                      <p className="text-sm font-medium text-white">
                        {new Date(project.completionDate).toLocaleDateString('it-IT', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-primary/30 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                      title="Visita il progetto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-primary/30 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                      title="Vedi su GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-block bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-lg text-xs font-medium border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-lg text-xs font-medium border border-white/20">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SanityStyledComponent>
  );
};

export default SingleProject;
