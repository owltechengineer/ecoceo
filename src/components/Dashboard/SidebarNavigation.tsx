'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '../Auth/LogoutButton';
import HomeButton from '../Navigation/HomeButton';
import { client } from '@/sanity/lib/client';

interface NavigationItem {
  key: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

interface SidebarNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function SidebarNavigation({ activeSection = 'dashboard', onSectionChange }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  // Carica il logo da Sanity
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const query = `*[_type == "siteSettings"][0]{
          logo {
            asset->{
              url
            }
          }
        }`;
        
        const result = await client.fetch(query);
        if (result?.logo?.asset?.url) {
          setLogo(result.logo.asset.url);
        }
      } catch (error) {
        console.error('Errore nel caricamento del logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      key: 'dashboard',
      name: 'Dashboard Totale',
      icon: '📊',
      description: 'Panoramica generale',
      color: 'blue',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      key: 'tasks',
      name: 'Task e Calendario',
      icon: '📅',
      description: 'Gestione attività',
      color: 'green',
      gradient: 'from-green-600 to-green-700'
    },
    {
      key: 'marketing',
      name: 'Marketing',
      icon: '📈',
      description: 'Gestione marketing',
      color: 'purple',
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      key: 'projects',
      name: 'Progetti',
      icon: '🚀',
      description: 'Gestione progetti',
      color: 'orange',
      gradient: 'from-orange-600 to-orange-700'
    },
    {
      key: 'warehouse',
      name: 'Magazzino e Documenti',
      icon: '📦',
      description: 'Gestione inventario e preventivi',
      color: 'amber',
      gradient: 'from-amber-600 to-amber-700'
    },
    {
      key: 'management',
      name: 'Gestione',
      icon: '⚙️',
      description: 'Gestione generale',
      color: 'gray',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      key: 'red',
      name: 'Red',
      icon: '🔴',
      description: 'Sezione Red',
      color: 'red',
      gradient: 'from-red-600 to-red-700'
    },
    {
      key: 'business-plan',
      name: 'Business Plan',
      icon: '💼',
      description: 'Piano aziendale',
      color: 'indigo',
      gradient: 'from-indigo-600 to-indigo-700'
    },
    {
      key: 'ai-management',
      name: 'AI Management',
      icon: '🤖',
      description: 'Gestione AI',
      color: 'cyan',
      gradient: 'from-cyan-600 to-cyan-700'
    },
    {
      key: 'test',
      name: 'Test',
      icon: '🧪',
      description: 'Test e debug',
      color: 'yellow',
      gradient: 'from-yellow-600 to-yellow-700'
    },
    {
      key: 'threejs',
      name: 'Matematica & Robotica',
      icon: '🤖',
      description: 'Funzioni matematiche e robotica',
      color: 'purple',
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      key: 'organizational',
      name: 'Analisi Organizzativa',
      icon: '🏢',
      description: 'Cultura aziendale',
      color: 'emerald',
      gradient: 'from-emerald-600 to-emerald-700'
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    if (onSectionChange) {
      onSectionChange(item.key);
    }
    // Chiudi il menu mobile dopo la navigazione
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Improved */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-600/50 hover:bg-gray-700 transition-all duration-200"
        >
          <span className="text-white text-xl">
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay - Improved */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Optimized */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto transform translate-x-0' 
          : 'hidden lg:block transform -translate-x-full lg:translate-x-0'
      }`}>
        {/* Navigation con Effetto Vetro - Mobile Optimized */}
        <div className="bg-gray-900/95 backdrop-blur-md rounded-r-2xl lg:rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden h-screen flex flex-col">
        {/* Header con Effetto Vetro */}
        <div className="bg-blue-500/20 backdrop-blur-sm p-2 sm:p-3 border-b border-gray-600/30">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                {logo ? (
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-10 w-auto max-w-[160px] object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">L</span>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`${
                isCollapsed ? 'p-2' : 'p-1.5'
              } rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200`}
              title={isCollapsed ? 'Espandi menu' : 'Comprimi menu'}
            >
              <span className={`text-white ${
                isCollapsed ? 'text-base' : 'text-sm'
              }`}>
                {isCollapsed ? '▶️' : '◀️'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Items - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          <div className={`${isCollapsed ? 'p-2' : 'p-2 sm:p-3'} space-y-2`}>
          {navigationItems.map((item, index) => (
            <div key={item.key}>
              {/* Barra di divisione sotto Dashboard Totale */}
              {item.key === 'tasks' && !isCollapsed && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-300 bg-gray-700/30 backdrop-blur/30 backdrop-blur px-2 py-1 rounded-full border border-gray-600">
                      Gestione Operativa
                    </span>
                  </div>
                </div>
              )}
              
              {/* Barra di divisione sopra Red */}
              {item.key === 'red' && !isCollapsed && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-300 bg-gray-700/30 backdrop-blur/30 backdrop-blur px-2 py-1 rounded-full border border-gray-600">
                      Identità Aziendale
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2'
                } rounded-lg transition-all duration-200 group ${
                  activeSection === item.key
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`${
                  isCollapsed ? 'p-1.5' : 'p-1.5'
                } rounded-md transition-all duration-200 ${
                  activeSection === item.key
                    ? 'bg-blue-500/30'
                    : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                }`}>
                  <span className={`${isCollapsed ? 'text-base' : 'text-base'}`}>{item.icon}</span>
                </div>
                
                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="font-medium text-xs text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                )}
              </button>
            </div>
          ))}
          </div>
        </div>

        {/* Quick Actions Semplificate */}
        {!isCollapsed && (
          <div className="px-4 pb-4 border-t border-gray-600/50 mt-4">
            <h3 className="text-xs font-medium text-gray-300 mb-3 mt-4">Azioni Rapide</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center p-2 text-xs text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">🔄</span>
                Aggiorna
              </button>
              <button className="w-full flex items-center p-2 text-xs text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">📊</span>
                Report
              </button>
              <button className="w-full flex items-center p-2 text-xs text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">⚙️</span>
                Impostazioni
              </button>
            </div>
          </div>
        )}

        {/* Current Section Info Semplificata */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-600/50">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/30">
              <div className="text-xs text-blue-300 mb-1 font-medium">Sezione Attiva</div>
              <div className="font-medium text-sm text-white">
                {navigationItems.find(item => item.key === activeSection)?.name || 'Dashboard Totale'}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons Semplificati */}
        <div className="p-2 sm:p-3 border-t border-gray-600/50 space-y-1">
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <HomeButton className="w-full justify-center text-blue-400 hover:bg-blue-500/20 rounded-lg p-2 transition-all duration-200 text-sm" />
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <LogoutButton className="w-full justify-center text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg p-2 transition-all duration-200 text-sm" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
