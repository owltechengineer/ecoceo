'use client';

import { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';
import QuickActions from './QuickActions';
import { useClientDate } from '../../hooks/useClientDate';
import ProtectedRoute from '../Auth/ProtectedRoute';
import HomeButton from '../Navigation/HomeButton';
import DashboardTotale from './DashboardTotale';
import UnifiedTaskCalendarNew from './UnifiedTaskCalendarNew';
import MarketingView from './MarketingView';
import BusinessPlanManagement from './BusinessPlanManagement';
import AIManagement from './AIManagement';
import ProjectsView from './ProjectsView';
import FinancialManagement from './FinancialManagement';
import RDManagement from './RDManagement';
import UnifiedSectionTests from './UnifiedSectionTests';
import IntelligentTestSuite from './IntelligentTestSuite';
import OrganizationalAnalysis from './OrganizationalAnalysis';
import QuickQuoteModal from './QuickQuoteModal';
import QuickCreateModal from './QuickCreateModal';
import DatabaseConnectionTest from './DatabaseConnectionTest';
import EnvironmentSetup from './EnvironmentSetup';

export default function MainDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'project' | 'campaign' | 'expense'>('project');
  const { getCurrentDate } = useClientDate();

  // Handler per le azioni rapide
  const handleCreateProject = () => {
    setCreateModalType('project');
    setIsCreateModalOpen(true);
  };

  const handleCreateCampaign = () => {
    setCreateModalType('campaign');
    setIsCreateModalOpen(true);
  };

  const handleMonitorCampaigns = () => {
    setActiveSection('marketing');
    console.log('Monitoraggio campagne');
  };

  const handleAddExpense = () => {
    setCreateModalType('expense');
    setIsCreateModalOpen(true);
  };

  const handleCreateQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const sections = {
    dashboard: {
      component: DashboardTotale,
      title: 'Dashboard Totale',
      icon: '📊',
      description: 'Panoramica generale del sistema'
    },
    tasks: {
      component: UnifiedTaskCalendarNew,
      title: 'Task e Calendario',
      icon: '📅',
      description: 'Gestione attività e pianificazione'
    },
    marketing: {
      component: MarketingView,
      title: 'Marketing',
      icon: '📈',
      description: 'Gestione campagne e lead'
    },
    projects: {
      component: ProjectsView,
      title: 'Progetti',
      icon: '🚀',
      description: 'Gestione progetti e timeline'
    },
    management: {
      component: FinancialManagement,
      title: 'Gestione',
      icon: '⚙️',
      description: 'Gestione finanziaria e generale'
    },
    red: {
      component: RDManagement,
      title: 'Red',
      icon: '🔴',
      description: 'Ricerca e sviluppo'
    },
    'business-plan': {
      component: BusinessPlanManagement,
      title: 'Business Plan',
      icon: '💼',
      description: 'Piano aziendale e strategie'
    },
    'ai-management': {
      component: AIManagement,
      title: 'AI Management',
      icon: '🤖',
      description: 'Gestione intelligenza artificiale'
    },
    test: {
      component: IntelligentTestSuite,
      title: 'Test Intelligenti',
      icon: '🧪',
      description: 'Suite completa di test automatizzati'
    },
    'legacy-tests': {
      component: UnifiedSectionTests,
      title: 'Test Legacy',
      icon: '🔧',
      description: 'Test legacy per compatibilità'
    },
    'database-test': {
      component: DatabaseConnectionTest,
      title: 'Test Database',
      icon: '🔧',
      description: 'Test connessione e configurazione database'
    },
    'environment-setup': {
      component: EnvironmentSetup,
      title: 'Configurazione',
      icon: '⚙️',
      description: 'Configurazione variabili d\'ambiente e database'
    },
    organizational: {
      component: OrganizationalAnalysis,
      title: 'Analisi Organizzativa',
      icon: '🏢',
      description: 'Valutazione cultura e dinamiche aziendali'
    }
  };

  const currentSection = sections[activeSection as keyof typeof sections];
  const CurrentComponent = currentSection?.component;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex dashboard-page">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Top Bar Semplificato */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 mb-4">
            <div className="bg-blue-500/10 rounded-t-xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <span className="text-xl">{currentSection?.icon || '📊'}</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {currentSection?.title || 'Dashboard Totale'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {currentSection?.description || 'Panoramica generale del sistema'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="hidden lg:flex items-center space-x-2 bg-green-500/20 rounded-lg px-3 py-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-xs font-medium text-green-700">Sistema Attivo</div>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-100/50 rounded-lg px-3 py-1.5">
                    {getCurrentDate()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Bar Semplificata */}
            <div className="px-6 py-3 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HomeButton variant="compact" className="bg-blue-100/50 text-blue-600 hover:bg-blue-200/50 rounded-lg px-3 py-1.5 transition-all duration-200 text-sm" />
                </div>
                
                <div className="flex items-center">
                  <QuickActions 
                    onRefresh={() => window.location.reload()}
                    onReport={() => console.log('Report clicked')}
                    onSettings={() => console.log('Settings clicked')}
                    onExport={() => console.log('Export clicked')}
                    onHelp={() => console.log('Help clicked')}
                    onCreateProject={handleCreateProject}
                    onCreateCampaign={handleCreateCampaign}
                    onMonitorCampaigns={handleMonitorCampaigns}
                    onAddExpense={handleAddExpense}
                    onCreateQuote={handleCreateQuote}
                  />
                </div>
              </div>
            </div>
            
            {/* Breadcrumb/Info */}
            <div className="px-6 py-3 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>🏠</span>
                  <span>Dashboard</span>
                  <span>→</span>
                  <span className="font-medium text-gray-800">{currentSection?.title || 'Totale'}</span>
                </div>
                <div className="text-gray-500">
                  Ultimo aggiornamento: {getCurrentDate()}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {CurrentComponent && <CurrentComponent />}
          </div>

        </div>
      </div>

      {/* Quick Quote Modal */}
      <QuickQuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Quick Create Modal */}
      <QuickCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        type={createModalType}
      />
    </ProtectedRoute>
  );
}
