'use client';

import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Project, Service } from '@/contexts/DashboardContext';

interface ProjectsManagerProps {
  projects: Project[];
  services: Service[];
  onSave?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
}

export default function ProjectsManager({ 
  projects, 
  services, 
  onSave, 
  onDelete, 
  onView 
}: ProjectsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra progetti
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Statistiche
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    onHold: projects.filter(p => p.status === 'on-hold').length
  };

  return (
    <div className="space-y-6">
      {/* Header con statistiche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestione Progetti</h2>
            <p className="text-gray-600 mt-1">Gestisci e monitora tutti i tuoi progetti</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Nuovo Progetto
          </button>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Totale</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Attivi</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.planning}</div>
            <div className="text-sm text-gray-600">Pianificazione</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completati</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.onHold}</div>
            <div className="text-sm text-gray-600">In Pausa</div>
          </div>
        </div>
      </div>

      {/* Filtri e ricerca */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Ricerca */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca progetti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* Filtro per stato */}
          <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tutti gli stati</option>
              <option value="planning">📋 Pianificazione</option>
              <option value="active">🟢 Attivi</option>
              <option value="on-hold">⏸️ In Pausa</option>
              <option value="completed">✅ Completati</option>
              <option value="cancelled">❌ Cancellati</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista progetti */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Nessun progetto trovato' : 'Nessun progetto disponibile'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Prova a modificare i filtri di ricerca' 
                : 'Inizia creando il tuo primo progetto'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                ➕ Crea Primo Progetto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                services={services}
                onView={onView}
                onDelete={onDelete}
                onSave={onSave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form di creazione (placeholder per ora) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Form di Creazione
              </h3>
              <p className="text-gray-600 mb-4">
                Il form di creazione sarà implementato qui
              </p>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
