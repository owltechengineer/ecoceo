'use client';

import React, { useState, useEffect } from 'react';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { 
  loadProjectsMain, 
  saveProjectMain, 
  updateProjectMain, 
  deleteProjectMain,
  loadProjectObjectives,
  loadProjectBudget,
  loadProjectTeam,
  loadProjectMilestones,
  loadProjectRisks,
  getProjectStats,
  getGlobalProjectStats,
  getActiveProjectsWithDetails,
  ProjectMain,
  ProjectObjective,
  ProjectBudget,
  ProjectTeam,
  ProjectMilestone,
  ProjectRisk
} from '@/lib/supabase';
import ActiveProjectsCard from './ActiveProjectsCard';

export default function ProjectsView() {
  const { openInfo } = useInfoModal();
  const [projects, setProjects] = useState<ProjectMain[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectMain | null>(null);
  const [projectDetails, setProjectDetails] = useState<{
    objectives: ProjectObjective[];
    budget: ProjectBudget[];
    team: ProjectTeam[];
    milestones: ProjectMilestone[];
    risks: ProjectRisk[];
  }>({
    objectives: [],
    budget: [],
    team: [],
    milestones: [],
    risks: []
  });
  const [projectStats, setProjectStats] = useState<Record<string, any>>({});
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'budget' | 'team' | 'milestones' | 'risks'>('overview');
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectMain>>({});
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  // Form per nuovo progetto
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    start_date: '',
    end_date: '',
    budget: 0,
    project_manager: '',
    team_members: '',
    tags: '',
    notes: ''
  });

  // Form per dettagli aggiuntivi
  const [newProjectDetails, setNewProjectDetails] = useState({
    objectives: [] as Array<{title: string, description: string, target_date: string}>,
    budgetItems: [] as Array<{category: string, item_name: string, estimated_cost: number}>,
    teamMembers: [] as Array<{member_name: string, role: string, allocation_percentage: number}>,
    milestones: [] as Array<{title: string, description: string, planned_date: string}>,
    risks: [] as Array<{title: string, description: string, risk_level: string}>
  });

  // Caricamento progetti dal database
  useEffect(() => {
    loadProjectsFromDB();
  }, []);

  const loadProjectsFromDB = async () => {
    setLoading(true);
    try {
      const [loadedProjects, globalStatsData] = await Promise.all([
        loadProjectsMain(),
        getGlobalProjectStats()
      ]);
      
      setProjects(loadedProjects);
      setGlobalStats(globalStatsData);
      
      // Carica statistiche per ogni progetto
      const statsPromises = loadedProjects.map(async (project) => {
        try {
          const stats = await getProjectStats(project.id);
          return { projectId: project.id, stats };
        } catch (error) {
          console.error(`Errore nel caricamento statistiche per progetto ${project.id}:`, error);
          return { projectId: project.id, stats: null };
        }
      });
      
      const statsResults = await Promise.all(statsPromises);
      const statsMap = statsResults.reduce((acc, { projectId, stats }) => {
        if (stats) {
          acc[projectId] = stats;
        }
        return acc;
      }, {} as Record<string, any>);
      
      setProjectStats(statsMap);
    } catch (error) {
      console.error('Errore nel caricamento projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      const [objectives, budget, team, milestones, risks] = await Promise.all([
        loadProjectObjectives(projectId),
        loadProjectBudget(projectId),
        loadProjectTeam(projectId),
        loadProjectMilestones(projectId),
        loadProjectRisks(projectId)
      ]);

      setProjectDetails({
        objectives,
        budget,
        team,
        milestones,
        risks
      });
    } catch (error) {
      console.error('Errore nel caricamento dettagli progetto:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter.status !== 'all' && project.status !== filter.status) return false;
    if (filter.priority !== 'all' && project.priority !== filter.priority) return false;
    if (filter.search && !project.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'on-hold': return '⏸️';
      case 'cancelled': return '❌';
      case 'planning': return '📋';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const handleSaveProject = async () => {
    if (!newProject.name) {
      alert('Inserisci un nome per il progetto');
      return;
    }

    try {
      const projectData = {
        user_id: 'default-user',
        name: newProject.name,
        description: newProject.description || undefined,
        status: newProject.status,
        priority: newProject.priority,
        start_date: newProject.start_date || undefined,
        end_date: newProject.end_date || undefined,
        budget: newProject.budget || undefined,
        actual_cost: 0,
        currency: 'EUR',
        project_manager: newProject.project_manager || undefined,
        team_members: newProject.team_members.split(',').map(t => t.trim()).filter(t => t),
        progress: 0,
        completion_percentage: 0,
        tags: newProject.tags.split(',').map(t => t.trim()).filter(t => t),
        notes: newProject.notes || undefined
      };

      const savedProject = await saveProjectMain(projectData);
      setProjects(prev => [...prev, savedProject]);
      setShowNewProject(false);
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        start_date: '',
        end_date: '',
        budget: 0,
        project_manager: '',
        team_members: '',
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Errore nel salvataggio progetto:', error);
      alert('Errore nel salvataggio del progetto. Riprova.');
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: ProjectMain['status']) => {
    try {
      await updateProjectMain(projectId, { status: newStatus });
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, status: newStatus, updated_at: new Date().toISOString() }
          : project
      ));
    } catch (error) {
      console.error('Errore nell\'aggiornamento status:', error);
      alert('Errore nell\'aggiornamento del progetto. Riprova.');
    }
  };

  const deleteProject = async (projectId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      try {
        await deleteProjectMain(projectId);
        setProjects(prev => prev.filter(project => project.id !== projectId));
        if (selectedProject?.id === projectId) {
          setSelectedProject(null);
        }
      } catch (error) {
        console.error('Errore nell\'eliminazione progetto:', error);
        alert('Errore nell\'eliminazione del progetto. Riprova.');
      }
    }
  };

  const startEditing = (project: ProjectMain) => {
    setEditingProject(project.id);
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget,
      project_manager: project.project_manager,
      team_members: project.team_members,
      tags: project.tags,
      notes: project.notes,
      progress: project.progress
    });
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditForm({});
  };

  const saveEditing = async (projectId: string) => {
    try {
      const updatedProject = await updateProjectMain(projectId, editForm);
      setProjects(prev => prev.map(project => 
        project.id === projectId ? updatedProject : project
      ));
      setEditingProject(null);
      setEditForm({});
    } catch (error) {
      console.error('Errore nel salvataggio modifiche:', error);
      alert('Errore nel salvataggio delle modifiche. Riprova.');
    }
  };

  const handleEditFormChange = (field: keyof ProjectMain, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };


  const getUniqueManagers = () => {
    const managers = projects.map(project => project.project_manager).filter(Boolean);
    return [...new Set(managers)];
  };

  return (
    <div className="space-y-6 min-h-full p-6">

      {/* Card Dettagliata Progetti */}
      <div className="mb-6">
        <ActiveProjectsCard />
      </div>

      {/* Filters and Actions */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca progetti..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
            >
              <option value="all">Tutti gli stati</option>
              <option value="planning">📋 Pianificazione</option>
              <option value="active">🟢 Attivo</option>
              <option value="completed">✅ Completato</option>
              <option value="on-hold">⏸️ In pausa</option>
              <option value="cancelled">❌ Cancellato</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
            >
              <option value="all">Tutte le priorità</option>
              <option value="urgent">🚨 Urgente</option>
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Media</option>
              <option value="low">🟢 Bassa</option>
            </select>

          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewProject(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Nuovo Progetto
            </button>
          </div>
        </div>
      </div>

      {/* Test Component */}

      {/* Projects List - Una card per riga */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Caricamento progetti...</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const stats = projectStats[project.id];
            return (
              <div key={project.id} className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => handleEditFormChange('name', e.target.value)}
                          className="text-xl font-bold text-gray-900 mb-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/30 backdrop-blur/30 backdrop-blur"
                        />
                      ) : (
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                      )}
                      <div className="flex items-center space-x-2 mb-3">
                        {editingProject === project.id ? (
                          <>
                            <select
                              value={editForm.status || project.status}
                              onChange={(e) => handleEditFormChange('status', e.target.value)}
                              className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/30 backdrop-blur/30 backdrop-blur"
                            >
                              <option value="planning">📋 Pianificazione</option>
                              <option value="active">🟢 Attivo</option>
                              <option value="on-hold">⏸️ In pausa</option>
                              <option value="completed">✅ Completato</option>
                              <option value="cancelled">❌ Cancellato</option>
                            </select>
                            <select
                              value={editForm.priority || project.priority}
                              onChange={(e) => handleEditFormChange('priority', e.target.value)}
                              className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/30 backdrop-blur/30 backdrop-blur"
                            >
                              <option value="low">🟢 Bassa</option>
                              <option value="medium">🟡 Media</option>
                              <option value="high">🔴 Alta</option>
                              <option value="urgent">🚨 Urgente</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)} {project.status}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                              {getPriorityIcon(project.priority)} {project.priority}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {editingProject === project.id ? (
                        <>
                          <button
                            onClick={() => saveEditing(project.id)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Salva"
                          >
                            ✅
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Annulla"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              loadProjectDetails(project.id);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Dettagli"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => startEditing(project)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifica"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Elimina"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingProject === project.id ? (
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm mb-4"
                      rows={2}
                      placeholder="Descrizione del progetto"
                    />
                  ) : (
                    project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progresso:</span>
                      {editingProject === project.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editForm.progress || project.progress}
                            onChange={(e) => handleEditFormChange('progress', parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span className="font-semibold text-gray-900 w-12">
                            {editForm.progress || project.progress}%
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">{project.progress}%</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${editingProject === project.id ? (editForm.progress || project.progress) : project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Obiettivi */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-600 text-sm font-medium">🎯 Obiettivi</span>
                        <span className="text-blue-800 font-bold">
                          {stats?.objectives?.completed || 0}/{stats?.objectives?.total || 0}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600">
                        {stats?.objectives?.inProgress || 0} in corso
                      </div>
                    </div>

                    {/* Team */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-600 text-sm font-medium">👥 Team</span>
                        <span className="text-green-800 font-bold">
                          {stats?.team?.activeMembers || 0}/{stats?.team?.totalMembers || 0}
                        </span>
                      </div>
                      <div className="text-xs text-green-600">
                        {stats?.team?.totalAllocation || 0}% allocazione
                      </div>
                    </div>

                    {/* Milestone */}
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-600 text-sm font-medium">🏁 Milestone</span>
                        <span className="text-purple-800 font-bold">
                          {stats?.milestones?.completed || 0}/{stats?.milestones?.total || 0}
                        </span>
                      </div>
                      <div className="text-xs text-purple-600">
                        {stats?.milestones?.upcoming || 0} prossime
                      </div>
                    </div>

                    {/* Rischi */}
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-600 text-sm font-medium">⚠️ Rischi</span>
                        <span className="text-red-800 font-bold">
                          {stats?.risks?.critical || 0 + stats?.risks?.high || 0}
                        </span>
                      </div>
                      <div className="text-xs text-red-600">
                        {stats?.risks?.total || 0} totali
                      </div>
                    </div>
                  </div>

                  {/* Budget Info */}
                  {project.budget && (
                    <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-yellow-600 text-sm font-medium">💰 Budget</span>
                        <span className="text-yellow-800 font-bold">
                          {formatCurrency(project.budget, project.currency)}
                        </span>
                      </div>
                      {stats?.budget && (
                        <div className="text-xs text-yellow-600">
                          Speso: {formatCurrency(stats.budget.totalActual, project.currency)} | 
                          Rimanente: {formatCurrency(stats.budget.remaining, project.currency)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="space-y-2 text-sm">
                    {editingProject === project.id ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">👨‍💼 Manager:</span>
                          <input
                            type="text"
                            value={editForm.project_manager || ''}
                            onChange={(e) => handleEditFormChange('project_manager', e.target.value)}
                            className="w-32 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm"
                            placeholder="Manager"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">📅 Inizio:</span>
                          <input
                            type="date"
                            value={editForm.start_date || ''}
                            onChange={(e) => handleEditFormChange('start_date', e.target.value)}
                            className="w-32 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">🏁 Fine:</span>
                          <input
                            type="date"
                            value={editForm.end_date || ''}
                            onChange={(e) => handleEditFormChange('end_date', e.target.value)}
                            className="w-32 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">💰 Budget:</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.budget || ''}
                            onChange={(e) => handleEditFormChange('budget', parseFloat(e.target.value) || 0)}
                            className="w-32 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {project.project_manager && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">👨‍💼 Manager:</span>
                            <span className="font-medium text-gray-900">{project.project_manager}</span>
                          </div>
                        )}
                        {project.start_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">📅 Inizio:</span>
                            <span className="font-medium text-gray-900">{formatDate(project.start_date)}</span>
                          </div>
                        )}
                        {project.end_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">🏁 Fine:</span>
                            <span className="font-medium text-gray-900">{formatDate(project.end_date)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {editingProject === project.id ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tag (separati da virgola):</label>
                        <input
                          type="text"
                          value={editForm.tags?.join(', ') || ''}
                          onChange={(e) => handleEditFormChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur text-sm"
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    ) : (
                      project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 4 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +{project.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nessun progetto trovato</p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedProject.name}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
              {[
                { id: 'overview', label: '📊 Panoramica', icon: '📊' },
                { id: 'objectives', label: '🎯 Obiettivi', icon: '🎯' },
                { id: 'budget', label: '💰 Budget', icon: '💰' },
                { id: 'team', label: '👥 Team', icon: '👥' },
                { id: 'milestones', label: '🏁 Milestone', icon: '🏁' },
                { id: 'risks', label: '⚠️ Rischi', icon: '⚠️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Informazioni Base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Descrizione</label>
                        <p className="text-gray-900 mt-1">{selectedProject.description || 'Nessuna descrizione'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Stato</label>
                        <p className="text-gray-900 mt-1">{getStatusIcon(selectedProject.status)} {selectedProject.status}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Priorità</label>
                        <p className="text-gray-900 mt-1">{getPriorityIcon(selectedProject.priority)} {selectedProject.priority}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {selectedProject.budget && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Budget Totale</label>
                          <p className="text-gray-900 mt-1">{formatCurrency(selectedProject.budget, selectedProject.currency)}</p>
                        </div>
                      )}
                      {selectedProject.project_manager && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Project Manager</label>
                          <p className="text-gray-900 mt-1">{selectedProject.project_manager}</p>
                        </div>
                      )}
                      {selectedProject.start_date && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Data Inizio</label>
                          <p className="text-gray-900 mt-1">{formatDate(selectedProject.start_date)}</p>
                        </div>
                      )}
                      {selectedProject.end_date && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Data Fine</label>
                          <p className="text-gray-900 mt-1">{formatDate(selectedProject.end_date)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistiche Complete dalle Tabelle */}
                  {projectStats[selectedProject.id] && (
                    <div className="bg-blue-500/20 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">📊 Statistiche Complete</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Obiettivi */}
                        <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">🎯</span>
                            <span className="font-medium text-gray-900">Obiettivi</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {projectDetails.objectives.filter(obj => obj.status === 'completed').length}/{projectDetails.objectives.length} completati
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {projectDetails.objectives.filter(obj => obj.status === 'in-progress').length} in corso
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">💰</span>
                            <span className="font-medium text-gray-900">Budget</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {projectDetails.budget.length} voci
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatCurrency(projectDetails.budget.reduce((sum, b) => sum + b.actual_cost, 0))} speso
                          </div>
                        </div>

                        {/* Team */}
                        <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">👥</span>
                            <span className="font-medium text-gray-900">Team</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {projectDetails.team.filter(member => member.status === 'active').length} membri attivi
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {projectDetails.team.reduce((sum, member) => sum + member.allocation_percentage, 0)}% allocazione
                          </div>
                        </div>

                        {/* Milestone */}
                        <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">📅</span>
                            <span className="font-medium text-gray-900">Milestone</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {projectDetails.milestones.filter(m => m.status === 'completed').length}/{projectDetails.milestones.length} completati
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {projectDetails.milestones.filter(m => m.status === 'pending').length} in attesa
                          </div>
                        </div>
                      </div>

                      {/* Rischi */}
                      {projectDetails.risks.length > 0 && (
                        <div className="mt-4 bg-white/30 backdrop-blur rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-lg mr-2">⚠️</span>
                            <span className="font-medium text-gray-900">Rischi</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="text-red-600">
                              {projectDetails.risks.filter(r => r.risk_level === 'critical').length} critici
                            </div>
                            <div className="text-orange-600">
                              {projectDetails.risks.filter(r => r.risk_level === 'high').length} alti
                            </div>
                            <div className="text-yellow-600">
                              {projectDetails.risks.filter(r => r.risk_level === 'medium').length} medi
                            </div>
                            <div className="text-green-600">
                              {projectDetails.risks.filter(r => r.risk_level === 'low').length} bassi
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'objectives' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Obiettivi del Progetto</h4>
                  {projectDetails.objectives.length > 0 ? (
                    <div className="space-y-3">
                      {projectDetails.objectives.map((objective) => (
                        <div key={objective.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{objective.title}</h5>
                              {objective.description && (
                                <p className="text-gray-600 text-sm mt-1">{objective.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Tipo: {objective.objective_type}</span>
                                <span>Priorità: {objective.priority}</span>
                                <span>Stato: {objective.status}</span>
                                {objective.target_date && (
                                  <span>Target: {formatDate(objective.target_date)}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{objective.progress_percentage}%</div>
                              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${objective.progress_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nessun obiettivo definito</p>
                  )}
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Budget del Progetto</h4>
                  {projectDetails.budget.length > 0 ? (
                    <div className="space-y-3">
                      {projectDetails.budget.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.item_name}</h5>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Stato: {item.status}</span>
                                {item.vendor && <span>Fornitore: {item.vendor}</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {formatCurrency(item.actual_cost, item.currency)} / {formatCurrency(item.estimated_cost, item.currency)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.payment_status}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nessun elemento di budget definito</p>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Team del Progetto</h4>
                  {projectDetails.team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projectDetails.team.map((member) => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{member.member_name}</h5>
                              <p className="text-gray-600 text-sm">{member.role}</p>
                              {member.department && (
                                <p className="text-gray-500 text-xs">{member.department}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Allocazione: {member.allocation_percentage}%</span>
                                {member.hourly_rate && (
                                  <span>Tariffa: {formatCurrency(member.hourly_rate, member.currency)}/h</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {member.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nessun membro del team definito</p>
                  )}
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Milestone del Progetto</h4>
                  {projectDetails.milestones.length > 0 ? (
                    <div className="space-y-3">
                      {projectDetails.milestones.map((milestone) => (
                        <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                              {milestone.description && (
                                <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Tipo: {milestone.milestone_type}</span>
                                <span>Pianificato: {formatDate(milestone.planned_date)}</span>
                                {milestone.actual_date && (
                                  <span>Effettivo: {formatDate(milestone.actual_date)}</span>
                                )}
                                {milestone.responsible_person && (
                                  <span>Responsabile: {milestone.responsible_person}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nessuna milestone definita</p>
                  )}
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Rischi del Progetto</h4>
                  {projectDetails.risks.length > 0 ? (
                    <div className="space-y-3">
                      {projectDetails.risks.map((risk) => (
                        <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{risk.title}</h5>
                              {risk.description && (
                                <p className="text-gray-600 text-sm mt-1">{risk.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Tipo: {risk.risk_type}</span>
                                <span>Probabilità: {risk.probability}</span>
                                <span>Impatto: {risk.impact}</span>
                                {risk.owner && <span>Owner: {risk.owner}</span>}
                              </div>
                              {risk.mitigation_strategy && (
                                <div className="mt-2">
                                  <label className="text-xs font-medium text-gray-500">Strategia di Mitigazione:</label>
                                  <p className="text-gray-700 text-sm">{risk.mitigation_strategy}</p>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                risk.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                                risk.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                                risk.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {risk.risk_level}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nessun rischio identificato</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Chiudi
              </button>
              <button
                onClick={() => deleteProject(selectedProject.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Elimina Progetto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuovo Progetto</h3>
              <button
                onClick={() => setShowNewProject(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Tabs per sezioni */}
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
              {[
                { id: 'basic', label: '📋 Base', icon: '📋' },
                { id: 'objectives', label: '🎯 Obiettivi', icon: '🎯' },
                { id: 'budget', label: '💰 Budget', icon: '💰' },
                { id: 'team', label: '👥 Team', icon: '👥' },
                { id: 'milestones', label: '📅 Milestone', icon: '📅' },
                { id: 'risks', label: '⚠️ Rischi', icon: '⚠️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Contenuto delle tabs */}
            <div className="space-y-4">
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                      placeholder="Nome del progetto"
                    />
                  </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  rows={3}
                  placeholder="Descrizione del progetto"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  >
                    <option value="planning">📋 Pianificazione</option>
                    <option value="active">🟢 Attivo</option>
                    <option value="on-hold">⏸️ In pausa</option>
                    <option value="completed">✅ Completato</option>
                    <option value="cancelled">❌ Cancellato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  >
                    <option value="low">🟢 Bassa</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                    <option value="urgent">🚨 Urgente</option>
                  </select>
                </div>
              </div>
              
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Totale (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Manager</label>
                <input
                  type="text"
                  value={newProject.project_manager}
                  onChange={(e) => setNewProject(prev => ({ ...prev, project_manager: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  placeholder="Nome del project manager"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <input
                  type="text"
                  value={newProject.team_members}
                  onChange={(e) => setNewProject(prev => ({ ...prev, team_members: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  placeholder="member1, member2, member3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  value={newProject.notes}
                  onChange={(e) => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                  rows={2}
                  placeholder="Note aggiuntive"
                />
              </div>
                </div>
              )}

              {activeTab === 'objectives' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">🎯 Obiettivi del Progetto</h4>
                  <p className="text-sm text-gray-600">Definisci gli obiettivi principali del progetto</p>
                  <div className="space-y-3">
                    {newProjectDetails.objectives.map((objective, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                            <input
                              type="text"
                              value={objective.title}
                              onChange={(e) => {
                                const newObjectives = [...newProjectDetails.objectives];
                                newObjectives[index].title = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, objectives: newObjectives }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Titolo obiettivo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                            <input
                              type="text"
                              value={objective.description}
                              onChange={(e) => {
                                const newObjectives = [...newProjectDetails.objectives];
                                newObjectives[index].description = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, objectives: newObjectives }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Descrizione obiettivo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Target</label>
                            <input
                              type="date"
                              value={objective.target_date}
                              onChange={(e) => {
                                const newObjectives = [...newProjectDetails.objectives];
                                newObjectives[index].target_date = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, objectives: newObjectives }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newObjectives = newProjectDetails.objectives.filter((_, i) => i !== index);
                            setNewProjectDetails(prev => ({ ...prev, objectives: newObjectives }));
                          }}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌ Rimuovi obiettivo
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewProjectDetails(prev => ({
                          ...prev,
                          objectives: [...prev.objectives, { title: '', description: '', target_date: '' }]
                        }));
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      ➕ Aggiungi Obiettivo
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">💰 Budget del Progetto</h4>
                  <p className="text-sm text-gray-600">Definisci le voci di budget per il progetto</p>
                  <div className="space-y-3">
                    {newProjectDetails.budgetItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                              value={item.category}
                              onChange={(e) => {
                                const newItems = [...newProjectDetails.budgetItems];
                                newItems[index].category = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, budgetItems: newItems }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            >
                              <option value="personnel">👥 Personale</option>
                              <option value="equipment">🖥️ Attrezzature</option>
                              <option value="software">💻 Software</option>
                              <option value="marketing">📈 Marketing</option>
                              <option value="travel">✈️ Viaggi</option>
                              <option value="materials">📦 Materiali</option>
                              <option value="external">🏢 Esterni</option>
                              <option value="other">📋 Altro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Voce</label>
                            <input
                              type="text"
                              value={item.item_name}
                              onChange={(e) => {
                                const newItems = [...newProjectDetails.budgetItems];
                                newItems[index].item_name = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, budgetItems: newItems }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Nome della voce"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Costo Stimato (€)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.estimated_cost}
                              onChange={(e) => {
                                const newItems = [...newProjectDetails.budgetItems];
                                newItems[index].estimated_cost = parseFloat(e.target.value) || 0;
                                setNewProjectDetails(prev => ({ ...prev, budgetItems: newItems }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newItems = newProjectDetails.budgetItems.filter((_, i) => i !== index);
                            setNewProjectDetails(prev => ({ ...prev, budgetItems: newItems }));
                          }}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌ Rimuovi voce
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewProjectDetails(prev => ({
                          ...prev,
                          budgetItems: [...prev.budgetItems, { category: 'other', item_name: '', estimated_cost: 0 }]
                        }));
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      ➕ Aggiungi Voce Budget
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">👥 Team del Progetto</h4>
                  <p className="text-sm text-gray-600">Definisci i membri del team e la loro allocazione</p>
                  <div className="space-y-3">
                    {newProjectDetails.teamMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input
                              type="text"
                              value={member.member_name}
                              onChange={(e) => {
                                const newMembers = [...newProjectDetails.teamMembers];
                                newMembers[index].member_name = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, teamMembers: newMembers }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Nome membro"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => {
                                const newMembers = [...newProjectDetails.teamMembers];
                                newMembers[index].role = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, teamMembers: newMembers }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Ruolo nel progetto"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Allocazione (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={member.allocation_percentage}
                              onChange={(e) => {
                                const newMembers = [...newProjectDetails.teamMembers];
                                newMembers[index].allocation_percentage = parseInt(e.target.value) || 0;
                                setNewProjectDetails(prev => ({ ...prev, teamMembers: newMembers }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newMembers = newProjectDetails.teamMembers.filter((_, i) => i !== index);
                            setNewProjectDetails(prev => ({ ...prev, teamMembers: newMembers }));
                          }}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌ Rimuovi membro
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewProjectDetails(prev => ({
                          ...prev,
                          teamMembers: [...prev.teamMembers, { member_name: '', role: '', allocation_percentage: 0 }]
                        }));
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      ➕ Aggiungi Membro Team
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">📅 Milestone del Progetto</h4>
                  <p className="text-sm text-gray-600">Definisci i milestone principali del progetto</p>
                  <div className="space-y-3">
                    {newProjectDetails.milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) => {
                                const newMilestones = [...newProjectDetails.milestones];
                                newMilestones[index].title = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, milestones: newMilestones }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Titolo milestone"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Pianificata</label>
                            <input
                              type="date"
                              value={milestone.planned_date}
                              onChange={(e) => {
                                const newMilestones = [...newProjectDetails.milestones];
                                newMilestones[index].planned_date = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, milestones: newMilestones }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => {
                              const newMilestones = [...newProjectDetails.milestones];
                              newMilestones[index].description = e.target.value;
                              setNewProjectDetails(prev => ({ ...prev, milestones: newMilestones }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            rows={2}
                            placeholder="Descrizione milestone"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newMilestones = newProjectDetails.milestones.filter((_, i) => i !== index);
                            setNewProjectDetails(prev => ({ ...prev, milestones: newMilestones }));
                          }}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌ Rimuovi milestone
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewProjectDetails(prev => ({
                          ...prev,
                          milestones: [...prev.milestones, { title: '', description: '', planned_date: '' }]
                        }));
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      ➕ Aggiungi Milestone
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">⚠️ Rischi del Progetto</h4>
                  <p className="text-sm text-gray-600">Identifica i potenziali rischi del progetto</p>
                  <div className="space-y-3">
                    {newProjectDetails.risks.map((risk, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                            <input
                              type="text"
                              value={risk.title}
                              onChange={(e) => {
                                const newRisks = [...newProjectDetails.risks];
                                newRisks[index].title = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, risks: newRisks }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                              placeholder="Titolo rischio"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Livello</label>
                            <select
                              value={risk.risk_level}
                              onChange={(e) => {
                                const newRisks = [...newProjectDetails.risks];
                                newRisks[index].risk_level = e.target.value;
                                setNewProjectDetails(prev => ({ ...prev, risks: newRisks }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            >
                              <option value="low">🟢 Basso</option>
                              <option value="medium">🟡 Medio</option>
                              <option value="high">🟠 Alto</option>
                              <option value="critical">🔴 Critico</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                          <textarea
                            value={risk.description}
                            onChange={(e) => {
                              const newRisks = [...newProjectDetails.risks];
                              newRisks[index].description = e.target.value;
                              setNewProjectDetails(prev => ({ ...prev, risks: newRisks }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blur"
                            rows={2}
                            placeholder="Descrizione del rischio"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newRisks = newProjectDetails.risks.filter((_, i) => i !== index);
                            setNewProjectDetails(prev => ({ ...prev, risks: newRisks }));
                          }}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          ❌ Rimuovi rischio
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewProjectDetails(prev => ({
                          ...prev,
                          risks: [...prev.risks, { title: '', description: '', risk_level: 'medium' }]
                        }));
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      ➕ Aggiungi Rischio
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewProject(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveProject}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
