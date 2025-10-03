"use client";

import { safeFetch } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SingleProject from './SingleProject';
import { useState, useEffect } from 'react';
import { Project, ProjectGridProps } from '@/types/project';

const Projects = ({ projects: initialProjects, title, subtitle }: ProjectGridProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!initialProjects) {
        try {
          const projectsData = await safeFetch(projectsQuery);
          setProjects(projectsData || []);
        } catch (error) {
          console.error('Error fetching projects data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [initialProjects]);

  // Get UI components for Projects section
  const projectsSectionComponent = getComponent('ProjectsSection');
  const projectsTitleComponent = getComponent('ProjectsTitle');
  const projectsSubtitleComponent = getComponent('ProjectsSubtitle');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento progetti...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sezione Progetti</h3>
        <p className="text-gray-600 mb-6">Crea i tuoi progetti in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <SanityStyledComponent
      component={projectsSectionComponent}
      componentName="ProjectsSection"
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <SanityStyledComponent
                component={projectsTitleComponent}
                componentName="ProjectsTitle"
                as="h2"
                className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4"
              >
                {title}
              </SanityStyledComponent>
            )}
            {subtitle && (
              <SanityStyledComponent
                component={projectsSubtitleComponent}
                componentName="ProjectsSubtitle"
                as="p"
                className="text-black/80 text-lg max-w-2xl mx-auto"
              >
                {subtitle}
              </SanityStyledComponent>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <SingleProject key={project._id} project={project} index={index} />
          ))}
        </div>
      </div>
    </SanityStyledComponent>
  );
};

export default Projects;
