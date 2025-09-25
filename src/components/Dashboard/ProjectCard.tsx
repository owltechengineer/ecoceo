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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 mb-6">
      {/* Header principale */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {project.status === 'active' ? '🟢 Attivo' : 
                   project.status === 'completed' ? '✅ Completato' :
                   project.status === 'on-hold' ? '⏸️ In Pausa' :
                   project.status === 'cancelled' ? '❌ Cancellato' : project.status}
                </span>
                <span className="text-gray-500 text-sm">
                  Cliente: {project.client || 'Non specificato'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              {isExpanded ? '🔼 Meno dettagli' : '🔽 Più dettagli'}
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                ✏️ Modifica
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                🗑️ Elimina
              </button>
            )}
          </div>
        </div>

        {/* Progress bar migliorata */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-900">Progresso del Progetto</span>
            <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className={`h-4 rounded-full transition-all duration-500 shadow-sm ${getProgressColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Statistiche principali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-xl font-bold text-gray-900">€{project.budget?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durata</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} giorni
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-xl font-bold text-gray-900">{project.roi?.toFixed(1) || '0'}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenuto espandibile migliorato */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dettagli temporali */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📅</span> Timeline del Progetto
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data di Inizio</span>
                  <span className="font-semibold text-gray-900">{new Date(project.startDate).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data di Fine</span>
                  <span className="font-semibold text-gray-900">{new Date(project.endDate).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Giorni Rimanenti</span>
                  <span className="font-semibold text-gray-900">
                    {Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Dettagli finanziari */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💰</span> Analisi Finanziaria
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Budget Pianificato</span>
                  <span className="font-semibold text-gray-900">€{project.budget?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Costo Effettivo</span>
                  <span className="font-semibold text-gray-900">€{project.actualCost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ricavi Attesi</span>
                  <span className="font-semibold text-gray-900">€{project.expectedRevenue?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Ricavi Effettivi</span>
                  <span className="font-semibold text-gray-900">€{project.actualRevenue?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



