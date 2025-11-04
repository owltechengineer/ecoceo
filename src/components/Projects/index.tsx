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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento progetti...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0)
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-white mb-4">Nessun Progetto Disponibile</h3>
          <p className="text-white/80 mb-6">Crea i tuoi progetti in Sanity Studio per iniziare.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-gradient-to-r from-primary via-primary/90 to-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 transform"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );

  return (
    <SanityStyledComponent
      component={projectsSectionComponent}
      componentName="ProjectsSection"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <SingleProject key={project._id} project={project} index={index} />
        ))}
      </div>
    </SanityStyledComponent>
  );
};

export default Projects;
