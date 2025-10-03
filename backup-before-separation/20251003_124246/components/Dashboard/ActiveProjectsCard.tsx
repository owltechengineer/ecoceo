'use client';

import React, { useState, useEffect } from 'react';
import { 
  getGlobalProjectStats, 
  getActiveProjectsWithDetails,
  loadProjectObjectives,
  loadProjectBudget,
  loadProjectTeam,
  loadProjectMilestones,
  loadProjectRisks
} from '@/lib/supabase';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  totalBudget: number;
  totalSpent: number;
  averageProgress: number;
  criticalRisks: number;
  overdueMilestones: number;
  teamUtilization: number;
}

interface ProjectObjective {
  id: string;
  title: string;
  status: string;
  progress_percentage: number;
  target_date?: string;
}

interface ProjectBudget {
  id: string;
  category: string;
  item_name: string;
  estimated_cost: number;
  actual_cost: number;
  status: string;
}

interface ProjectTeam {
  id: string;
  member_name: string;
  role: string;
  allocation_percentage: number;
  status: string;
}

interface ProjectMilestone {
  id: string;
  title: string;
  status: string;
  planned_date: string;
  actual_date?: string;
}

interface ProjectRisk {
  id: string;
  title: string;
  risk_level: string;
  status: string;
}

interface ActiveProject {
  project: any;
  stats: any;
  nextMilestone?: any;
  criticalRisks: number;
  objectives: ProjectObjective[];
  budget: ProjectBudget[];
  team: ProjectTeam[];
  milestones: ProjectMilestone[];
  risks: ProjectRisk[];
}

export default function ActiveProjectsCard() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [globalStats, activeProjectsData] = await Promise.all([
        getGlobalProjectStats(),
        getActiveProjectsWithDetails()
      ]);
      
      // Carica dettagli completi per ogni progetto attivo
      const projectsWithFullDetails = await Promise.all(
        activeProjectsData.map(async (projectData) => {
          try {
            const [objectives, budget, team, milestones, risks] = await Promise.all([
              loadProjectObjectives(projectData.project.id),
              loadProjectBudget(projectData.project.id),
              loadProjectTeam(projectData.project.id),
              loadProjectMilestones(projectData.project.id),
              loadProjectRisks(projectData.project.id)
            ]);

            return {
              ...projectData,
              objectives,
              budget,
              team,
              milestones,
              risks
            };
          } catch (error) {
            console.error(`Errore caricamento dettagli progetto ${projectData.project.id}:`, error);
            return {
              ...projectData,
              objectives: [],
              budget: [],
              team: [],
              milestones: [],
              risks: []
            };
          }
        })
      );
      
      setStats(globalStats);
      setActiveProjects(projectsWithFullDetails);
      setError(null);
    } catch (err) {
      console.error('Errore caricamento dati progetti:', err);
      setError('Errore nel caricamento dei dati progetti');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'on-hold': return 'text-yellow-600 bg-yellow-100';
      case 'planning': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center">
          <p>❌ {error}</p>
          <button 
            onClick={loadProjectData}
            className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white/30 backdrop-blur rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Progetti Attivi</h3>
            <p className="text-sm text-gray-500">Panoramica progetti in corso</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
          <div className="text-sm text-gray-500">di {stats.totalProjects} totali</div>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
          <div className="text-xs text-gray-500">Completati</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.onHoldProjects}</div>
          <div className="text-xs text-gray-500">In Pausa</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</div>
          <div className="text-xs text-gray-500">Progresso Medio</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.criticalRisks}</div>
          <div className="text-xs text-gray-500">Rischi Critici</div>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Budget Progetti</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Budget Totale</div>
            <div className="text-lg font-semibold text-green-600">{formatCurrency(stats.totalBudget)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Speso</div>
            <div className="text-lg font-semibold text-blue-600">{formatCurrency(stats.totalSpent)}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Utilizzo Budget</span>
            <span>{Math.round((stats.totalSpent / stats.totalBudget) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.totalSpent / stats.totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Progetti attivi */}
      {activeProjects.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Progetti in Corso</h4>
          <div className="space-y-4">
            {activeProjects.slice(0, 3).map((item) => (
              <div key={item.project.id} className="border rounded-lg p-4 hover:bg-blue-500/20 transition-colors">
                {/* Header Progetto */}
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 truncate">{item.project.name}</h5>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.project.status)}`}>
                      {item.project.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.project.priority)}`}>
                      {item.project.priority}
                    </span>
                  </div>
                </div>
                
                {/* Progresso e Budget */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <span>Progresso: {item.project.progress_percentage || 0}%</span>
                    {item.criticalRisks > 0 && (
                      <span className="text-red-600">⚠️ {item.criticalRisks} rischi</span>
                    )}
                  </div>
                  <div className="text-right">
                    {item.project.budget && (
                      <div>{formatCurrency(item.project.budget)}</div>
                    )}
                  </div>
                </div>

                {/* Barra di progresso */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.project.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dettagli dalle tabelle */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {/* Obiettivi */}
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="font-medium text-blue-800">🎯 Obiettivi</div>
                    <div className="text-blue-600">
                      {item.objectives.filter(obj => obj.status === 'completed').length}/{item.objectives.length} completati
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="font-medium text-green-800">💰 Budget</div>
                    <div className="text-green-600">
                      {item.budget.length} voci • {formatCurrency(item.budget.reduce((sum, b) => sum + b.actual_cost, 0))} speso
                    </div>
                  </div>

                  {/* Team */}
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="font-medium text-purple-800">👥 Team</div>
                    <div className="text-purple-600">
                      {item.team.filter(member => member.status === 'active').length} membri attivi
                    </div>
                  </div>

                  {/* Milestone */}
                  <div className="bg-orange-50 rounded-lg p-2">
                    <div className="font-medium text-orange-800">📅 Milestone</div>
                    <div className="text-orange-600">
                      {item.milestones.filter(m => m.status === 'completed').length}/{item.milestones.length} completati
                    </div>
                  </div>
                </div>

                {/* Prossimo milestone */}
                {item.nextMilestone && (
                  <div className="mt-3 text-xs text-gray-500 bg-blue-500/20 rounded p-2">
                    📅 <strong>Prossimo:</strong> {item.nextMilestone.title} - {new Date(item.nextMilestone.planned_date).toLocaleDateString('it-IT')}
                  </div>
                )}

                {/* Rischi critici */}
                {item.risks.filter(r => r.risk_level === 'critical').length > 0 && (
                  <div className="mt-3 text-xs text-red-600 bg-red-50 rounded p-2">
                    ⚠️ <strong>Rischi critici:</strong> {item.risks.filter(r => r.risk_level === 'critical').map(r => r.title).join(', ')}
                  </div>
                )}

                {/* Team members attivi */}
                {item.team.filter(member => member.status === 'active').length > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Team:</strong> {item.team.filter(member => member.status === 'active').map(member => member.member_name).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {activeProjects.length > 3 && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-500">
                +{activeProjects.length - 3} altri progetti attivi
              </span>
            </div>
          )}
        </div>
      )}

      {/* Riepilogo Dettagliato delle Tabelle */}
      {activeProjects.length > 0 && (
        <div className="mt-6 bg-blue-500/20 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">📊 Riepilogo Dettagliato</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Obiettivi */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">🎯</span>
                <span className="font-medium text-gray-900">Obiettivi</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeProjects.reduce((sum, p) => sum + p.objectives.length, 0)} totali • {' '}
                {activeProjects.reduce((sum, p) => sum + p.objectives.filter(obj => obj.status === 'completed').length, 0)} completati
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💰</span>
                <span className="font-medium text-gray-900">Budget</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeProjects.reduce((sum, p) => sum + p.budget.length, 0)} voci • {' '}
                {formatCurrency(activeProjects.reduce((sum, p) => sum + p.budget.reduce((s, b) => s + b.actual_cost, 0), 0))} speso
              </div>
            </div>

            {/* Team */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">👥</span>
                <span className="font-medium text-gray-900">Team</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeProjects.reduce((sum, p) => sum + p.team.length, 0)} membri • {' '}
                {activeProjects.reduce((sum, p) => sum + p.team.filter(member => member.status === 'active').length, 0)} attivi
              </div>
            </div>

            {/* Milestone */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">📅</span>
                <span className="font-medium text-gray-900">Milestone</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeProjects.reduce((sum, p) => sum + p.milestones.length, 0)} totali • {' '}
                {activeProjects.reduce((sum, p) => sum + p.milestones.filter(m => m.status === 'completed').length, 0)} completati
              </div>
            </div>

            {/* Rischi */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">⚠️</span>
                <span className="font-medium text-gray-900">Rischi</span>
              </div>
              <div className="text-sm text-gray-600">
                {activeProjects.reduce((sum, p) => sum + p.risks.length, 0)} totali • {' '}
                {activeProjects.reduce((sum, p) => sum + p.risks.filter(r => r.risk_level === 'critical').length, 0)} critici
              </div>
            </div>

            {/* Progresso Medio */}
            <div className="bg-white/30 backdrop-blur rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">📈</span>
                <span className="font-medium text-gray-900">Progresso</span>
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(activeProjects.reduce((sum, p) => sum + (p.project.progress_percentage || 0), 0) / activeProjects.length)}% medio
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert per milestone in ritardo */}
      {stats.overdueMilestones > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-sm text-red-800">
              {stats.overdueMilestones} milestone in ritardo
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Utilizzo Team: {stats.teamUtilization}%</span>
          <span>Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}</span>
        </div>
      </div>
    </div>
  );
}
