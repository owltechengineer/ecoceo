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
import WarehouseManagement from './WarehouseManagement';
import WarehouseTest from './WarehouseTest';
import QuotesTest from './QuotesTest';
import QuickQuoteModal from './QuickQuoteModal';
import QuickCreateModal from './QuickCreateModal';
import DatabaseConnectionTest from './DatabaseConnectionTest';
import EnvironmentSetup from './EnvironmentSetup';
import DashboardDataTest from './DashboardDataTest';
import DashboardDataFixer from './DashboardDataFixer';
import MathRoboticsDemo from '../ThreeJS/MathRoboticsDemo';

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
    'data-test': {
      component: DashboardDataTest,
      title: 'Test Dati Dashboard',
      icon: '📊',
      description: 'Test dati appuntamenti e gestione'
    },
    'data-fixer': {
      component: DashboardDataFixer,
      title: 'Correzione Dati',
      icon: '🔧',
      description: 'Correzione automatica dati mancanti'
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
    },
    warehouse: {
      component: WarehouseManagement,
      title: 'Magazzino e Documenti',
      icon: '📦',
      description: 'Gestione inventario e creazione preventivi'
    },
    'warehouse-test': {
      component: WarehouseTest,
      title: 'Test Magazzino',
      icon: '🧪',
      description: 'Test funzionalità magazzino'
    },
    'quotes-test': {
      component: QuotesTest,
      title: 'Test Preventivi',
      icon: '📋',
      description: 'Test sistema preventivi'
    },
    threejs: {
      component: MathRoboticsDemo,
      title: 'Matematica & Robotica',
      icon: '🤖',
      description: 'Funzioni matematiche e applicazioni robotiche'
    }
  };

  const currentSection = sections[activeSection as keyof typeof sections];
  const CurrentComponent = currentSection?.component;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex dashboard-page">
        {/* Sidebar Navigation - Fixed height with independent scroll */}
        <div className="h-screen overflow-y-auto">
          <SidebarNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="flex-1 flex flex-col p-1 sm:p-2 lg:p-3 h-screen overflow-hidden">
          {/* Top Bar con Effetto Vetro - Mobile Optimized */}
          <div className="bg-white/30 backdrop-blur/30 backdrop-blur/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 mb-2 sm:mb-4">
            <div className="bg-white/30backdrop-blur-sm rounded-t-xl px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="p-1.5 bg-white/30rounded-lg">
                    <span className="text-base sm:text-lg">{currentSection?.icon || '📊'}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {currentSection?.title || 'Dashboard Totale'}
                    </h1>
                    <p className="text-gray-600 text-xs truncate">
                      {currentSection?.description || 'Panoramica generale del sistema'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-3">
                  {/* Status - Hidden on mobile */}
                  <div className="hidden lg:flex items-center space-x-2 bg-green-500/20 rounded-lg px-3 py-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-xs font-medium text-green-700">Sistema Attivo</div>
                  </div>
                  
                  {/* Date - Responsive */}
                  <div className="text-xs text-gray-600 bg-gray-100/50 rounded-lg px-1.5 sm:px-2 py-1 hidden sm:block">
                    {getCurrentDate()}
                  </div>
                  
                  {/* Mobile Date */}
                  <div className="text-xs text-gray-600 bg-gray-100/50 rounded-lg px-1.5 py-1 sm:hidden">
                    {new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                  </div>
                  
                  {/* Tasto Sito - Hidden on mobile */}
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:block text-xs text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-lg px-3 py-1.5 transition-all duration-200"
                  >
                    🌐 Sito
                  </a>
                  
                  {/* Azioni Rapide - Mobile Optimized */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-lg px-1.5 sm:px-2 py-1 transition-all duration-200"
                      title="Aggiorna"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => console.log('Report clicked')}
                      className="hidden sm:block text-xs text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-lg px-2 py-1 transition-all duration-200"
                      title="Report"
                    >
                      📊
                    </button>
                    <button
                      onClick={() => console.log('Settings clicked')}
                      className="hidden sm:block text-xs text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 rounded-lg px-2 py-1 transition-all duration-200"
                      title="Impostazioni"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-1">
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
