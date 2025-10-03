"use client";

import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Link from 'next/link';
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
        <div className="group relative overflow-hidden rounded-sm bg-white/30 backdrop-blur/30 backdrop-blurshadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
          <Link href={`/projects/${project.slug?.current || project._id}`}>
            <div className="relative block aspect-[37/22] overflow-hidden">
              {project.mainImage ? (
                <img
                  src={getImageUrl(project.mainImage)}
                  alt={getTextValue(project.title)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              {project.featured && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  In Evidenza
                </div>
              )}
            </div>
          </Link>
          
          <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
            <div className="mb-4">
              <Link
                href={`/services/${project.service.slug.current}`}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {project.service.name}
              </Link>
            </div>
            
            <SanityStyledComponent
              component={projectTitleComponent}
              componentName="ProjectTitle"
              as="h3"
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              <Link href={`/projects/${project.slug?.current || project._id}`}>
                {getTextValue(project.title)}
              </Link>
            </SanityStyledComponent>
            
            <SanityStyledComponent
              component={projectDescriptionComponent}
              componentName="ProjectDescription"
              as="p"
              className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-body-color-dark"
            >
              {getTextValue(project.shortDescription)}
            </SanityStyledComponent>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {project.client && (
                  <div className="mr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cliente: <span className="font-medium">{project.client}</span>
                    </p>
                  </div>
                )}
                {project.completionDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completato: <span className="font-medium">
                        {new Date(project.completionDate).toLocaleDateString('it-IT')}
                      </span>
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
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Visita il progetto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
                    title="Vedi su GitHub"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SanityStyledComponent>
  );
};

export default SingleProject;
