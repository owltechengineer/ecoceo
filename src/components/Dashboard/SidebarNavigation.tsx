'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '../Auth/LogoutButton';
import HomeButton from '../Navigation/HomeButton';
import { client } from '@/sanity/lib/client';
import { useSections } from '@/hooks/useSections';

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
  const { sections, loading: sectionsLoading } = useSections();

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

  // Sezioni dinamiche basate su .env con fallback statico
  const getNavigationItems = (): NavigationItem[] => {
    const colorMap: { [key: string]: { color: string; gradient: string } } = {
      'Dashboard': { color: 'blue', gradient: 'from-blue-600 to-blue-700' },
      'Task e Calendario': { color: 'green', gradient: 'from-green-600 to-green-700' },
      'Marketing': { color: 'purple', gradient: 'from-purple-600 to-purple-700' },
      'Progetti': { color: 'orange', gradient: 'from-orange-600 to-orange-700' },
      'Magazzino': { color: 'amber', gradient: 'from-amber-600 to-amber-700' },
      'Finanziario': { color: 'emerald', gradient: 'from-emerald-600 to-emerald-700' },
      'Business Plan': { color: 'indigo', gradient: 'from-indigo-600 to-indigo-700' }
    };

    // Se non ci sono sezioni dinamiche, usa quelle statiche
    if (sections.length === 0) {
      const staticSections = [
        { name: 'Dashboard', icon: '📊', description: 'Panoramica generale' },
        { name: 'Task e Calendario', icon: '📅', description: 'Gestione attività' },
        { name: 'Marketing', icon: '📈', description: 'Gestione marketing' },
        { name: 'Progetti', icon: '🚀', description: 'Gestione progetti' },
        { name: 'Magazzino', icon: '📦', description: 'Gestione inventario' },
        { name: 'Finanziario', icon: '💰', description: 'Gestione finanziaria' },
        { name: 'Business Plan', icon: '📋', description: 'Piano aziendale' }
      ];

      return staticSections.map(section => ({
        key: section.name.toLowerCase().replace(/\s+/g, '-'),
        name: section.name,
        icon: section.icon,
        description: section.description,
        ...colorMap[section.name] || { color: 'gray', gradient: 'from-gray-600 to-gray-700' }
      }));
    }

    return sections.map(section => ({
      key: section.name.toLowerCase().replace(/\s+/g, '-'),
      name: section.name,
      icon: section.icon,
      description: section.description,
      ...colorMap[section.name] || { color: 'gray', gradient: 'from-gray-600 to-gray-700' }
    }));
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (item: NavigationItem) => {
    if (onSectionChange) {
      onSectionChange(item.key);
    }
    // Chiudi il menu mobile dopo la navigazione
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/30 backdrop-blur/20 backdrop-blur-md rounded-lg shadow-lg border border-white/30"
        >
          <span className="text-gray-600 text-lg">
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
    <div className={`transition-all duration-300 ${
        isCollapsed ? 'w-24' : 'w-72'
      } p-4 ${
        isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'
      }`}>
        {/* Navigation con Effetto Vetro */}
        <div className="bg-white/30 backdrop-blur/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 overflow-hidden h-full">
        {/* Header con Effetto Vetro */}
        <div className="bg-blue-500/20 backdrop-blur-sm p-4 border-b border-white/30">
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
              } rounded-lg bg-gray-100/50 hover:bg-gray-200/50 transition-all duration-200`}
              title={isCollapsed ? 'Espandi menu' : 'Comprimi menu'}
            >
              <span className={`text-gray-600 ${
                isCollapsed ? 'text-base' : 'text-sm'
              }`}>
                {isCollapsed ? '▶️' : '◀️'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className={`${isCollapsed ? 'p-3' : 'p-4'} space-y-3`}>
          {sectionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Caricamento sezioni...</span>
            </div>
          ) : (
            navigationItems.map((item, index) => (
            <div key={item.key}>
              {/* Barra di divisione sotto Dashboard Totale */}
              {item.key === 'tasks' && !isCollapsed && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-500 bg-white/30 backdrop-blur px-2 py-1 rounded-full border border-gray-200">
                      Gestione Operativa
                    </span>
                  </div>
                </div>
              )}
              
              {/* Barra di divisione sopra Red */}
              {item.key === 'red' && !isCollapsed && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-500 bg-white/30 backdrop-blur px-2 py-1 rounded-full border border-gray-200">
                      Identità Aziendale
                    </span>
                  </div>
                </div>
              )}
              
            <button
              onClick={() => handleNavigation(item)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'p-3 justify-center' : 'p-3'
                } rounded-lg transition-all duration-200 group ${
                activeSection === item.key
                    ? 'bg-blue-500/20 text-blue-700 border border-blue-200/50'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-800'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
                <div className={`${
                  isCollapsed ? 'p-2' : 'p-2'
                } rounded-md transition-all duration-200 ${
                activeSection === item.key
                    ? 'bg-blue-500/30'
                    : 'bg-gray-100/50 group-hover:bg-gray-200/50'
              }`}>
                  <span className={`${isCollapsed ? 'text-lg' : 'text-lg'}`}>{item.icon}</span>
              </div>
              
              {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              )}
            </button>
            </div>
          ))
          )}
        </div>

        {/* Quick Actions Semplificate */}
        {!isCollapsed && (
          <div className="px-4 pb-4 border-t border-gray-200/50 mt-4">
            <h3 className="text-xs font-medium text-gray-600 mb-3 mt-4">Azioni Rapide</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center p-2 text-xs text-gray-500 hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">🔄</span>
                Aggiorna
              </button>
              <button className="w-full flex items-center p-2 text-xs text-gray-500 hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">📊</span>
                Report
              </button>
              <button className="w-full flex items-center p-2 text-xs text-gray-500 hover:bg-gray-100/50 rounded-lg transition-all duration-200">
                <span className="mr-2 text-sm">⚙️</span>
                Impostazioni
              </button>
            </div>
          </div>
        )}

        {/* Current Section Info Semplificata */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-200/30">
              <div className="text-xs text-blue-600 mb-1 font-medium">Sezione Attiva</div>
              <div className="font-medium text-sm text-gray-800">
                {navigationItems.find(item => item.key === activeSection)?.name || 'Dashboard Totale'}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons Semplificati */}
        <div className="p-4 border-t border-gray-200/50 space-y-2">
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <HomeButton className="w-full justify-center text-blue-600 hover:bg-blue-100/50 rounded-lg p-2 transition-all duration-200 text-sm" />
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <LogoutButton className="w-full justify-center rounded-lg p-2 transition-all duration-200 text-sm" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
