'use client';

import { useState, useEffect } from 'react';
import { sanityDataService, SanityProject, SanityService } from '@/services/sanityDataService';
import ProjectCard from './ProjectCard';
import { useDashboard, Project, Service } from '@/contexts/DashboardContext';

// Funzione per convertire SanityProject in Project
const convertSanityProjectToProject = (sanityProject: SanityProject): Project => {
  return {
    id: sanityProject._id,
    name: sanityProject.name,
    client: 'Cliente non specificato',
    startDate: sanityProject.startDate || new Date().toISOString().split('T')[0],
    endDate: sanityProject.endDate || new Date().toISOString().split('T')[0],
    budget: sanityProject.plannedBudget || 0,
    actualCost: sanityProject.actualBudget || 0,
    expectedRevenue: sanityProject.plannedBudget || 0,
    actualRevenue: sanityProject.actualBudget || 0,
    status: sanityProject.status as 'active' | 'completed' | 'on-hold' | 'cancelled' || 'active',
    progress: sanityProject.progress || 0,
    roi: 0,
    margin: 0,
    variance: 0,
    plannedCost: sanityProject.plannedBudget || 0,
    plannedRevenue: sanityProject.plannedBudget || 0,
    plannedProgress: sanityProject.progress || 0
  };
};

// Funzione per convertire SanityService in Service
const convertSanityServiceToService = (sanityService: SanityService): Service => {
  return {
    id: sanityService._id,
    name: sanityService.title || 'Service Name',
    description: sanityService.description || 'Service description',
    category: 'consulting',
    status: 'active',
    priority: 'medium',
    base_price: sanityService.price || 0,
    currency: 'EUR',
    pricing_model: 'hourly',
    delivery_time_days: 7,
    delivery_method: 'remote',
    service_manager: 'Manager',
    team_members: [],
    requirements: [],
    deliverables: [],
    notes: '',
    tags: []
  };
};

export default function ProjectsWithCards() {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [services, setServices] = useState<SanityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { addProject, updateProject, deleteProject } = useDashboard();

  useEffect(() => {
    loadData();
  }, [showPrivate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { projects: sanityProjects, services: sanityServices } = 
        await sanityDataService.getProjectsAndServices(showPrivate);
      
      setProjects(sanityProjects);
      setServices(sanityServices);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei dati da Sanity');
      console.error('Errore nel caricamento:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (project: SanityProject) => {
    try {
      const success = await sanityDataService.updateProject(project._id, project);
      if (success) {
        await loadData(); // Ricarica i dati
        // updateProject(project); // Type mismatch: SanityProject vs Project
      } else {
        setError('Errore nell\'aggiornamento del progetto');
      }
    } catch (err) {
      setError('Errore nell\'aggiornamento del progetto');
      console.error('Errore nell\'aggiornamento:', err);
    }
  };

  // Wrapper per gestire la conversione Project -> SanityProject
  const handleEditProjectWrapper = async (project: Project) => {
    // Trova il progetto Sanity corrispondente
    const sanityProject = projects.find(p => p._id === project.id);
    if (sanityProject) {
      await handleEditProject(sanityProject);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) return;
    
    try {
      const success = await sanityDataService.deleteProject(id);
      if (success) {
        await loadData(); // Ricarica i dati
        deleteProject(id);
      } else {
        setError('Errore nell\'eliminazione del progetto');
      }
    } catch (err) {
      setError('Errore nell\'eliminazione del progetto');
      console.error('Errore nell\'eliminazione:', err);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Caricamento progetti...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="text-red-600 mr-2">⚠️</span>
          <span className="text-red-800">{error}</span>
          <button
            onClick={loadData}
            className="ml-auto text-red-600 hover:text-red-800 underline"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e controlli */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progetti</h2>
          <p className="text-gray-600">
            {filteredProjects.length} di {projects.length} progetti
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/studio/desk/project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Crea su Sanity
          </a>
          
          <button
            onClick={() => setShowPrivate(!showPrivate)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showPrivate 
                ? 'bg-gray-100 border-gray-300 text-gray-700' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showPrivate ? '🔒 Solo Pubblici' : '🔓 Tutti'}
          </button>
        </div>
      </div>

      {/* Filtri e ricerca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cerca progetti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivo</option>
          <option value="completed">Completato</option>
          <option value="on-hold">In Pausa</option>
          <option value="cancelled">Cancellato</option>
        </select>
      </div>

      {/* Grid delle card */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun progetto trovato
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Crea il tuo primo progetto su Sanity Studio'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <a
              href="/studio/desk/project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">➕</span>
              Crea Progetto
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              project={convertSanityProjectToProject(project)}
              services={services.map(convertSanityServiceToService)}
              onEdit={handleEditProjectWrapper}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Pulsante di ricarica */}
      <div className="text-center">
        <button
          onClick={loadData}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">🔄</span>
          Ricarica Dati
        </button>
      </div>
    </div>
  );
}

