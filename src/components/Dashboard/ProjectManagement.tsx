'use client';

import { useInfoModal } from '@/contexts/InfoModalContext';
import { InfoButton } from './InfoModal';
import { dashboardInfo } from './dashboardInfo';
import ProjectsWithCards from './ProjectsWithCards';

export default function ProjectManagement() {
  const { openInfo } = useInfoModal();

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header con info button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Gestione Progetti</h1>
          <InfoButton 
            onClick={() => openInfo(dashboardInfo.projects.title, dashboardInfo.projects.content)}
            className="text-blue-600 hover:text-blue-800"
          />
        </div>
      </div>

      {/* Componente con card */}
      <ProjectsWithCards />
    </div>
  );
}
