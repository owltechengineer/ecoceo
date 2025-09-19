'use client';

import { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';
import QuickActions from './QuickActions';
import { useClientDate } from '../../hooks/useClientDate';
import ProtectedRoute from '../Auth/ProtectedRoute';
import HomeButton from '../Navigation/HomeButton';
import DashboardTotale from './DashboardTotale';
import UnifiedTaskCalendarNew from './UnifiedTaskCalendarNew';
import MarketingManagement from './MarketingManagement';
import BusinessPlanManagement from './BusinessPlanManagement';
import AIManagement from './AIManagement';
import ProjectsView from './ProjectsView';
import FinancialManagement from './FinancialManagement';
import RDManagement from './RDManagement';
import UnifiedSectionTests from './UnifiedSectionTests';
import OrganizationalAnalysis from './OrganizationalAnalysis';
import QuickQuoteModal from './QuickQuoteModal';
import QuickCreateModal from './QuickCreateModal';
import DatabaseConnectionTest from './DatabaseConnectionTest';
import EnvironmentSetup from './EnvironmentSetup';
import SanityDiagnostics from './SanityDiagnostics';

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
      component: MarketingManagement,
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
      component: UnifiedSectionTests,
      title: 'Test',
      icon: '🧪',
      description: 'Test unificati per tutte le sezioni'
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
    'sanity-diagnostics': {
      component: SanityDiagnostics,
      title: 'Diagnostica Sanity',
      icon: '🔍',
      description: 'Diagnostica problemi con Sanity CMS'
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
      <div className="min-h-screen flex">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentSection?.title || 'Dashboard Totale'}
                </h1>
                <p className="text-gray-600">
                  {currentSection?.icon} {currentSection?.description || 'Panoramica generale del sistema'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <HomeButton variant="compact" />
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
                <div className="text-sm text-gray-500">
                  {getCurrentDate()}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
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
