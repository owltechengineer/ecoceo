'use client';

import ProjectsManager from './ProjectsManager';
import { useDashboard } from '@/contexts/DashboardContext';

export default function ProjectManagement() {
  const { projects, services, saveProject, deleteProject } = useDashboard();

  const handleSaveProject = (project: any) => {
    if (saveProject) {
      saveProject(project);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (deleteProject) {
      deleteProject(projectId);
    }
  };

  const handleViewProject = (project: any) => {
    // Implementare visualizzazione dettagliata
    console.log('Visualizza progetto:', project);
  };

  return (
    <ProjectsManager
      projects={projects}
      services={services}
      onSave={handleSaveProject}
      onDelete={handleDeleteProject}
      onView={handleViewProject}
    />
  );
}
