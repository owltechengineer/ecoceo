'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';
import ShopOrders from './ShopOrders';
import ContactRequests from './ContactRequests';
import ConversionFunnel from './ConversionFunnel';
import { useClientAnalytics } from '@/hooks/useClientAnalytics';
import { MockDataService } from '@/services/mockDataService';

export default function DashboardOverview() {
  const { state } = useDashboard();
  const { openInfo } = useInfoModal();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Calcoli essenziali
  const today = new Date();
  const todayTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === today.toDateString();
  });

  const urgentTasks = state.tasks.filter(task => 
    task.priority === 'urgent' && task.status !== 'completed'
  );

  const activeProjects = state.projects.filter(p => p.status === 'active');
  const activeCampaigns = state.campaigns.filter(c => c.status === 'active');
  
  // Statistiche progetti
  const totalProjects = state.projects.length;
  const completedProjects = state.projects.filter(p => p.status === 'completed').length;
  const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  // Statistiche campagne
  const totalLeads = state.leads.length;
  const convertedLeads = state.leads.filter(l => l.status === 'closed_won').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Dati reali dal servizio analytics
  const { analyticsService, isClient } = useClientAnalytics();
  const aggregatedStats = isClient && analyticsService ? analyticsService.getAggregatedAnalytics(selectedPeriod as 'today' | 'week' | 'month') : {
    totalVisits: 0,
    uniqueVisitors: 0,
    totalPageViews: 0,
    avgBounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    totalConversions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalContactRequests: 0,
  };
  const conversionFunnel = isClient && analyticsService ? analyticsService.getConversionFunnel(selectedPeriod as 'today' | 'week' | 'month') : {
    visits: 0,
    conversions: 0,
    orders: 0,
    revenue: 0,
    contactRequests: 0,
    funnelSteps: [],
  };

  // Task per oggi raggruppati per priorità
  const todayTasksByPriority = {
    urgent: todayTasks.filter(t => t.priority === 'urgent'),
    high: todayTasks.filter(t => t.priority === 'high'),
    medium: todayTasks.filter(t => t.priority === 'medium'),
    low: todayTasks.filter(t => t.priority === 'low'),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-white/30border-gray-200';
      default: return 'text-gray-600 bg-white/30border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'on-hold': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-white/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con filtri */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard Overview</h2>
              <p className="text-gray-600">Panoramica essenziale dell'azienda</p>
            </div>
            <InfoButton onClick={() => openInfo(dashboardInfo.overview.title, dashboardInfo.overview.content)} />
          </div>
                      <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Oggi</option>
                <option value="week">Questa Settimana</option>
                <option value="month">Questo Mese</option>
              </select>
              
              <button
                onClick={() => {
                  MockDataService.loadMockData();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                📊 Carica Dati Esempio
              </button>
            </div>
        </div>

        {/* KPI Cards Essenziali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Task Urgenti */}
          <div className="r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Task Urgenti</p>
                <p className="text-3xl font-bold text-red-900">{urgentTasks.length}</p>
                <p className="text-xs text-red-600 mt-1">Da completare oggi</p>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>

          {/* Progetti Attivi */}
          <div className="r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Progetti Attivi</p>
                <p className="text-3xl font-bold text-blue-900">{activeProjects.length}</p>
                <p className="text-xs text-blue-600 mt-1">{projectProgress.toFixed(1)}% completati</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <span className="text-2xl">🏗️</span>
              </div>
            </div>
          </div>

          {/* Campagne Attive */}
          <div className="r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Campagne Attive</p>
                <p className="text-3xl font-bold text-green-900">{activeCampaigns.length}</p>
                <p className="text-xs text-green-600 mt-1">{conversionRate.toFixed(1)}% conversione</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          {/* Visite Sito */}
          <div className="r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Visite Sito</p>
                                 <p className="text-3xl font-bold text-purple-900">{aggregatedStats.totalVisits.toLocaleString()}</p>
                 <p className="text-xs text-purple-600 mt-1">{aggregatedStats.avgBounceRate.toFixed(1)}% bounce rate</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <span className="text-2xl">🌐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Giornalieri */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">📋 Task per Oggi</h3>
          <span className="text-sm text-gray-500">{todayTasks.length} task totali</span>
        </div>
        
        {todayTasks.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(todayTasksByPriority).map(([priority, tasks]) => 
              tasks.length > 0 && (
                <div key={priority} className="border-l-4 border-gray-200 pl-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    Priorità {priority} ({tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-white/30rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).split(' ')[0]}`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-500">{task.assigned_to}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status === 'pending' ? 'Da Fare' : 
                             task.status === 'in-progress' ? 'In Corso' :
                             task.status === 'completed' ? 'Completato' : task.status}
                          </span>
                          <span className="text-sm text-gray-500">{task.estimated_hours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">✅</span>
            <p>Nessun task per oggi!</p>
          </div>
        )}
      </div>

      {/* Progresso Progetti */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🏗️ Progresso Progetti</h3>
        
        {activeProjects.length > 0 ? (
          <div className="space-y-4">
            {activeProjects.slice(0, 5).map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status === 'active' ? 'Attivo' : project.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Budget: €{project.budget.toLocaleString()}</span>
                    <span>ROI: {project.roi.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📋</span>
            <p>Nessun progetto attivo</p>
          </div>
        )}
      </div>

      {/* Statistiche Sito e Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">🌐 Statistiche Sito</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Visite</p>
                <p className="text-sm text-gray-500">{selectedPeriod === 'today' ? 'Oggi' : selectedPeriod === 'week' ? 'Questa settimana' : 'Questo mese'}</p>
              </div>
                             <p className="text-2xl font-bold text-blue-600">{aggregatedStats.totalVisits.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Visualizzazioni Pagine</p>
                <p className="text-sm text-gray-500">Totale</p>
              </div>
                             <p className="text-2xl font-bold text-green-600">{aggregatedStats.totalPageViews.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bounce Rate</p>
                <p className="text-sm text-gray-500">Percentuale</p>
              </div>
                             <p className="text-2xl font-bold text-orange-600">{aggregatedStats.avgBounceRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📊 Performance Rapida</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Lead Totali</p>
                <p className="text-sm text-gray-500">Generati</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{totalLeads}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Tasso Conversione</p>
                <p className="text-sm text-gray-500">Lead → Clienti</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{conversionRate.toFixed(1)}%</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/30rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Progetti Completati</p>
                <p className="text-sm text-gray-500">Su {totalProjects} totali</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel di Conversione */}
      <ConversionFunnel />

      {/* Ordini Shop e Richieste Contatti */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShopOrders />
        <ContactRequests />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">⚡ Azioni Rapide</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="text-center">
              <span className="text-2xl block mb-2">📋</span>
              <p className="text-sm font-medium text-blue-900">Nuovo Task</p>
            </div>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="text-center">
              <span className="text-2xl block mb-2">📅</span>
              <p className="text-sm font-medium text-green-900">Nuovo Appuntamento</p>
            </div>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="text-center">
              <span className="text-2xl block mb-2">🏗️</span>
              <p className="text-sm font-medium text-purple-900">Nuovo Progetto</p>
            </div>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div className="text-center">
              <span className="text-2xl block mb-2">📈</span>
              <p className="text-sm font-medium text-orange-900">Nuova Campagna</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
