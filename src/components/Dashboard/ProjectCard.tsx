'use client';

import React, { useState } from 'react';
import { Project } from '@/contexts/DashboardContext';
import ProjectDetailsModal from './ProjectDetailsModal';

interface ProjectCardProps {
  project: Project;
  services: any[];
  onView?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onSave?: (project: Project) => void;
}

export default function ProjectCard({ project, services, onView, onDelete, onSave }: ProjectCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢 Attivo';
      case 'planning':
        return '📋 Pianificazione';
      case 'on-hold':
        return '⏸️ In Pausa';
      case 'completed':
        return '✅ Completato';
      case 'cancelled':
        return '❌ Cancellato';
      default:
        return '❓ Sconosciuto';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header con stato e progresso */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {project.description || 'Nessuna descrizione disponibile'}
            </p>
          </div>
          <div className="ml-4 flex flex-col items-end space-y-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-gray-900">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Informazioni principali */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cliente</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {project.client || 'Non specificato'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Budget</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(project.budget || 0)}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Inizio</p>
            <p className="text-sm font-medium text-gray-900">
              {project.startDate ? formatDate(project.startDate) : 'Non specificato'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fine</p>
            <p className="text-sm font-medium text-gray-900">
              {project.endDate ? formatDate(project.endDate) : 'Non specificato'}
            </p>
          </div>
        </div>

        {/* Metriche finanziarie */}
        {(project.actualCost || project.actualRevenue) && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Costo Effettivo</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(project.actualCost || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Ricavi</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(project.actualRevenue || 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tag */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  #{tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer con azioni */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                console.log('Opening modal for project:', project.name);
                setShowDetailsModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
            >
              <span>👁️</span>
              Visualizza
            </button>
          </div>
          
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
            >
              <span>🗑️</span>
              Elimina
            </button>
          )}
        </div>
      </div>

      {/* Modal di dettagli */}
      <ProjectDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        project={project}
        services={services}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
}