'use client';

import React, { useState, useEffect } from 'react';
import { getGlobalProjectStats, getActiveProjectsWithDetails } from '@/lib/supabase';

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

export default function QuickProjectsCard() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
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
      
      setStats(globalStats);
      setActiveProjects(activeProjectsData.slice(0, 3)); // Solo i primi 3 per la dashboard
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Progetti Attivi</h3>
            <p className="text-sm text-gray-500">Panoramica rapida</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
          <div className="text-sm text-gray-500">di {stats.totalProjects} totali</div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{stats.completedProjects}</div>
          <div className="text-xs text-gray-500">Completati</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-600">{stats.onHoldProjects}</div>
          <div className="text-xs text-gray-500">In Pausa</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{stats.averageProgress}%</div>
          <div className="text-xs text-gray-500">Progresso</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-red-600">{stats.criticalRisks}</div>
          <div className="text-xs text-gray-500">Rischi</div>
        </div>
      </div>

      {/* Budget rapido */}
      <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Budget</span>
          <span className="font-semibold text-gray-900">{formatCurrency(stats.totalBudget)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Speso</span>
          <span className="font-semibold text-blue-600">{formatCurrency(stats.totalSpent)}</span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.totalSpent / stats.totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Progetti attivi rapidi */}
      {activeProjects.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Progetti in Corso</h4>
          <div className="space-y-2">
            {activeProjects.map((item) => (
              <div key={item.project.id} className="border rounded-lg p-2 hover:bg-blue-500/20 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900 text-sm truncate">{item.project.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.project.status)}`}>
                    {item.project.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Progresso: {item.project.progress_percentage || 0}%</span>
                  {item.criticalRisks > 0 && (
                    <span className="text-red-600">⚠️ {item.criticalRisks}</span>
                  )}
                </div>

                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${item.project.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert rapidi */}
      {stats.overdueMilestones > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
          <div className="flex items-center">
            <span className="text-red-600 mr-1">⚠️</span>
            <span className="text-xs text-red-800">
              {stats.overdueMilestones} milestone in ritardo
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Team: {stats.teamUtilization}%</span>
          <span>{new Date().toLocaleTimeString('it-IT')}</span>
        </div>
      </div>
    </div>
  );
}
