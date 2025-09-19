'use client';

import { useState } from 'react';
import { Project, Service } from '@/contexts/DashboardContext';

interface ProjectCardProps {
  project: Project;
  services: Service[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, services, onEdit, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Priority function removed - not available in current Project type

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Note: assignedServices not available in current Project type

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header della card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status === 'active' ? 'Attivo' : 
                 project.status === 'completed' ? 'Completato' :
                 project.status === 'on-hold' ? 'In Pausa' :
                 project.status === 'cancelled' ? 'Cancellato' : project.status}
              </span>
              {/* Priority not available in current Project type */}
            </div>
            
            {/* Description not available in current Project type */}
            
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenuto espandibile */}
      {isExpanded && (
        <div className="p-6 space-y-4">
          {/* Dettagli del progetto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📅 Date</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Inizio: {new Date(project.startDate).toLocaleDateString('it-IT')}</div>
                <div>Fine: {new Date(project.endDate).toLocaleDateString('it-IT')}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">💰 Budget</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Budget: €{project.budget?.toLocaleString()}</div>
                <div>Costo Effettivo: €{project.actualCost?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Servizi assegnati - Not available in current Project type */}

          {/* Team, Technologies, Notes not available in current Project type */}
        </div>
      )}
    </div>
  );
}



