'use client';

import { useState } from 'react';
import { useClientDate } from '../../hooks/useClientDate';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color: string;
  category: 'create' | 'monitor' | 'system';
  description?: string;
}

interface QuickActionsProps {
  onRefresh?: () => void;
  onReport?: () => void;
  onSettings?: () => void;
  onExport?: () => void;
  onHelp?: () => void;
  onCreateProject?: () => void;
  onCreateCampaign?: () => void;
  onMonitorCampaigns?: () => void;
  onAddExpense?: () => void;
  onCreateQuote?: () => void;
}

export default function QuickActions({ 
  onRefresh, 
  onReport, 
  onSettings, 
  onExport, 
  onHelp,
  onCreateProject,
  onCreateCampaign,
  onMonitorCampaigns,
  onAddExpense,
  onCreateQuote
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'create' | 'monitor' | 'system'>('create');
  const { getCurrentTime } = useClientDate();

  const quickActions: QuickAction[] = [
    // Azioni di Creazione
    {
      id: 'create-project',
      label: 'Nuovo Progetto',
      icon: '🚀',
      action: () => onCreateProject?.(),
      color: 'blue',
      category: 'create',
      description: 'Crea un nuovo progetto'
    },
    {
      id: 'create-campaign',
      label: 'Nuova Campagna',
      icon: '📈',
      action: () => onCreateCampaign?.(),
      color: 'green',
      category: 'create',
      description: 'Lancia una nuova campagna marketing'
    },
    {
      id: 'add-expense',
      label: 'Inserisci Spesa',
      icon: '💰',
      action: () => onAddExpense?.(),
      color: 'red',
      category: 'create',
      description: 'Registra una nuova spesa'
    },
    {
      id: 'create-quote',
      label: 'Preventivo Veloce',
      icon: '📋',
      action: () => onCreateQuote?.(),
      color: 'purple',
      category: 'create',
      description: 'Crea un preventivo rapido'
    },
    
    // Azioni di Monitoraggio
    {
      id: 'monitor-campaigns',
      label: 'Monitora Campagne',
      icon: '📊',
      action: () => onMonitorCampaigns?.(),
      color: 'orange',
      category: 'monitor',
      description: 'Controlla performance campagne'
    },
    {
      id: 'report',
      label: 'Report Completo',
      icon: '📈',
      action: () => onReport?.(),
      color: 'teal',
      category: 'monitor',
      description: 'Genera report dettagliati'
    },
    
    // Azioni di Sistema
    {
      id: 'refresh',
      label: 'Aggiorna Tutto',
      icon: '🔄',
      action: () => onRefresh?.(),
      color: 'blue',
      category: 'system',
      description: 'Ricarica tutti i dati'
    },
    {
      id: 'export',
      label: 'Esporta Dati',
      icon: '📤',
      action: () => onExport?.(),
      color: 'indigo',
      category: 'system',
      description: 'Esporta dati in Excel/PDF'
    },
    {
      id: 'settings',
      label: 'Impostazioni',
      icon: '⚙️',
      action: () => onSettings?.(),
      color: 'gray',
      category: 'system',
      description: 'Configura il sistema'
    },
    {
      id: 'help',
      label: 'Aiuto',
      icon: '❓',
      action: () => onHelp?.(),
      color: 'yellow',
      category: 'system',
      description: 'Guida e supporto'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'hover:bg-blue-50 hover:text-blue-600',
      green: 'hover:bg-green-50 hover:text-green-600',
      purple: 'hover:bg-purple-50 hover:text-purple-600',
      gray: 'hover:bg-gray-50 hover:text-gray-600',
      orange: 'hover:bg-orange-50 hover:text-orange-600',
      red: 'hover:bg-red-50 hover:text-red-600',
      teal: 'hover:bg-teal-50 hover:text-teal-600',
      indigo: 'hover:bg-indigo-50 hover:text-indigo-600',
      yellow: 'hover:bg-yellow-50 hover:text-yellow-600'
    };
    return colors[color as keyof typeof colors] || 'hover:bg-gray-50 hover:text-gray-600';
  };

  const filteredActions = quickActions.filter(action => action.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'create': return '➕';
      case 'monitor': return '📊';
      case 'system': return '⚙️';
      default: return '⚡';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'create': return 'Crea';
      case 'monitor': return 'Monitora';
      case 'system': return 'Sistema';
      default: return 'Azioni';
    }
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
      >
        <span className="mr-2">⚡</span>
        Azioni Rapide
        <span className="ml-2 text-sm">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* Category Tabs */}
          <div className="flex border-b border-gray-200 mb-2">
            {(['create', 'monitor', 'system'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeCategory === category
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* Actions List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  setIsExpanded(false);
                }}
                className={`w-full flex items-start px-4 py-3 text-sm text-gray-700 transition-colors ${getColorClasses(action.color)}`}
                title={action.description}
              >
                <span className="mr-3 text-lg mt-0.5">{action.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  {action.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {action.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* System Status */}
          <div className="px-4 py-2">
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Sistema operativo
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getCurrentTime()}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
