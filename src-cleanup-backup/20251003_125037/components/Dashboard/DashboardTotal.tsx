'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';

export default function DashboardTotal() {
  const { openInfo } = useInfoModal();
  const { state } = useDashboard();

  // Funzione per formattare le date in modo consistente
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  const { 
    projects, 
    services, 
    budgets, 
    investments, 
    rdProjects, 
    campaigns, 
    leads, 
    tasks, 
    appointments 
  } = state;

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalServices: 0,
    totalBudget: 0,
    totalInvestments: 0,
    totalRDProjects: 0,
    totalCampaigns: 0,
    totalLeads: 0,
    totalTasks: 0,
    totalAppointments: 0,
    completedTasks: 0,
    activeCampaigns: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Calcola le statistiche
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.plannedAmount, 0);
    const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
    const totalRevenue = services.reduce((sum, service) => sum + service.base_price, 0);

    setStats({
      totalProjects: projects.length,
      totalServices: services.length,
      totalBudget,
      totalInvestments,
      totalRDProjects: rdProjects.length,
      totalCampaigns: campaigns.length,
      totalLeads: leads.length,
      totalTasks: tasks.length,
      totalAppointments: appointments.length,
      completedTasks,
      activeCampaigns,
      totalRevenue
    });
  }, [state]);

  const statCards = [
    {
      title: 'Progetti Attivi',
      value: stats.totalProjects,
      icon: '🚀',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Servizi',
      value: stats.totalServices,
      icon: '🛠️',
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Budget Totale',
      value: `€${stats.totalBudget.toLocaleString()}`,
      icon: '💰',
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Investimenti',
      value: `€${stats.totalInvestments.toLocaleString()}`,
      icon: '💼',
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Progetti R&D',
      value: stats.totalRDProjects,
      icon: '🔬',
      color: 'bg-red-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Campagne Attive',
      value: stats.activeCampaigns,
      icon: '📈',
      color: 'bg-indigo-500',
      change: '+20%',
      changeType: 'positive'
    },
    {
      title: 'Lead Totali',
      value: stats.totalLeads,
      icon: '👥',
      color: 'bg-pink-500',
      change: '+25%',
      changeType: 'positive'
    },
    {
      title: 'Task Completati',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: '✅',
      color: 'bg-emerald-500',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Appuntamenti',
      value: stats.totalAppointments,
      icon: '📅',
      color: 'bg-orange-500',
      change: '+7%',
      changeType: 'positive'
    },
    {
      title: 'Ricavi Totali',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: '💵',
      color: 'bg-teal-500',
      change: '+22%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    ...tasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      description: `Task ${task.status}`,
      time: formatDate(task.updated_at),
      icon: '📋',
      color: 'text-blue-600'
    })),
    ...appointments.slice(0, 3).map(appointment => ({
      id: `appointment-${appointment.id}`,
      type: 'appointment',
      title: appointment.title,
      description: `Appuntamento ${appointment.type}`,
      time: formatDate(appointment.startDate),
      icon: '📅',
      color: 'text-green-600'
    })),
    ...campaigns.slice(0, 2).map(campaign => ({
      id: `campaign-${campaign.id}`,
      type: 'campaign',
      title: campaign.name,
      description: `Campagna ${campaign.status}`,
      time: formatDate(campaign.start_date),
      icon: '📈',
      color: 'text-purple-600'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  const quickActions = [
    {
      title: 'Nuovo Progetto',
      description: 'Crea un nuovo progetto',
      icon: '🚀',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => console.log('Nuovo progetto')
    },
    {
      title: 'Nuovo Task',
      description: 'Aggiungi un nuovo task',
      icon: '📋',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => console.log('Nuovo task')
    },
    {
      title: 'Nuovo Appuntamento',
      description: 'Programma un appuntamento',
      icon: '📅',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => console.log('Nuovo appuntamento')
    },
    {
      title: 'Nuova Campagna',
      description: 'Lancia una nuova campagna',
      icon: '📈',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => console.log('Nuova campagna')
    },
    {
      title: 'Business Plan',
      description: 'Gestisci il business plan',
      icon: '📋',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => console.log('Business plan')
    },
    {
      title: 'AI Management',
      description: 'Generazione contenuti e AI',
      icon: '🤖',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      action: () => console.log('AI Management')
    },
    {
      title: 'Test Sistema',
      description: 'Esegui test di sistema',
      icon: '🧪',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => console.log('Test sistema')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <InfoButton onClick={() => openInfo('Dashboard Totale', 'Panoramica completa di tutti i dati e attività aziendali con statistiche in tempo reale.')} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} dal mese scorso
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl text-white">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Attività Recenti</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-blue-500/20 rounded-lg transition-colors">
                <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center`}>
                  <span className={`text-lg ${activity.color}`}>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nessuna attività recente</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Azioni Rapide</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full ${action.color} text-white p-3 rounded-lg transition-colors text-left`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{action.icon}</span>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Chart */}
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Stato Task</h3>
          <div className="space-y-4">
            {['pending', 'in-progress', 'on-hold', 'completed', 'cancelled'].map((status) => {
              const count = tasks.filter(task => task.status === status).length;
              const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
              const colors = {
                'pending': 'bg-blue-500/200',
                'in-progress': 'bg-blue-500',
                'on-hold': 'bg-yellow-500',
                'completed': 'bg-green-500',
                'cancelled': 'bg-red-500'
              };
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[status as keyof typeof colors]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Ricavi per Servizio</h3>
          <div className="space-y-4">
            {services.slice(0, 5).map((service, index) => {
              const revenue = service.base_price;
              const maxRevenue = Math.max(...services.map(s => s.base_price));
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{service.name}</span>
                    <span>€{revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {services.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nessun servizio disponibile</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Stato Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Database</p>
              <p className="text-sm text-gray-600">Connesso</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Sincronizzazione</p>
              <p className="text-sm text-gray-600">Attiva</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Backup</p>
              <p className="text-sm text-gray-600">Aggiornato</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
