"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';
import { client } from '@/sanity/lib/client';

interface ClientAreaMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

const ClientAreaMenu: React.FC<ClientAreaMenuProps> = ({ activeTab = 'overview', onTabChange }) => {
  const { logout } = useClientAreaAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Carica le sezioni e le statistiche da Sanity
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Carica le statistiche
        const statsQuery = `
          {
            "totalVideos": count(*[_type == "clientVideo" && isActive == true]),
            "totalDocuments": count(*[_type == "clientDocument" && isActive == true]),
            "totalKnowledge": count(*[_type == "clientKnowledge" && isActive == true]),
            "activePromotions": count(*[_type == "clientPromotion" && isActive == true && endDate > now()]),
            "totalMath": count(*[_type == "clientMath" && isActive == true])
          }
        `;
        
        const statsData = await client.fetch(statsQuery);
        setStats(statsData);

        // Definisci le sezioni del menu
        const items: MenuItem[] = [
          {
            id: 'overview',
            name: 'Panoramica',
            icon: '📊',
            description: 'Statistiche e riepilogo',
            count: Object.values(statsData).reduce((a: number, b: number) => a + b, 0)
          },
          {
            id: 'documents',
            name: 'Documenti',
            icon: '📄',
            description: 'Documenti e risorse',
            count: statsData.totalDocuments || 0
          },
          {
            id: 'knowledge',
            name: 'Conoscenza',
            icon: '🧠',
            description: 'Base di conoscenza',
            count: statsData.totalKnowledge || 0
          },
          {
            id: 'promotions',
            name: 'Promozioni',
            icon: '🎯',
            description: 'Offerte speciali',
            count: statsData.activePromotions || 0
          },
          {
            id: 'videos',
            name: 'Video',
            icon: '🎥',
            description: 'Tutorial e guide',
            count: statsData.totalVideos || 0
          },
          {
            id: 'math',
            name: 'Matematica & Robotica',
            icon: '🤖',
            description: 'Funzioni matematiche e robotica',
            count: statsData.totalMath || 0
          }
        ];

        setMenuItems(items);
      } catch (error) {
        console.error('Errore nel caricamento dei dati del menu:', error);
        // Fallback con menu di base
        setMenuItems([
          {
            id: 'overview',
            name: 'Panoramica',
            icon: '📊',
            description: 'Statistiche e riepilogo',
            count: 0
          },
          {
            id: 'documents',
            name: 'Documenti',
            icon: '📄',
            description: 'Documenti e risorse',
            count: 0
          },
          {
            id: 'knowledge',
            name: 'Conoscenza',
            icon: '🧠',
            description: 'Base di conoscenza',
            count: 0
          },
          {
            id: 'promotions',
            name: 'Promozioni',
            icon: '🎯',
            description: 'Offerte speciali',
            count: 0
          },
          {
            id: 'videos',
            name: 'Video',
            icon: '🎥',
            description: 'Tutorial e guide',
            count: 0
          },
          {
            id: 'math',
            name: 'Matematica & Robotica',
            icon: '🤖',
            description: 'Funzioni matematiche e robotica',
            count: 0
          }
        ]);
      }
    };

    fetchMenuData();
  }, []);

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        <span className="text-white text-xl">
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu Sidebar */}
      <aside className={`transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto transform translate-x-0' 
          : 'hidden lg:block transform -translate-x-full lg:translate-x-0'
      } w-64 lg:w-72`}>
        <nav className="bg-white/10 backdrop-blur-md rounded-r-2xl lg:rounded-xl border border-white/20 overflow-hidden h-screen flex flex-col">
          
          {/* Header */}
          <header className="p-4 lg:p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">🏠</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Area Clienti</h1>
                  <p className="text-white/70 text-xs">Contenuti esclusivi</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          </header>

          {/* Collapse Button */}
          <div className="p-4 border-b border-white/20">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              title={isCollapsed ? 'Espandi menu' : 'Comprimi menu'}
            >
              <span className="text-white text-sm">
                {isCollapsed ? '▶️' : '◀️'}
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'p-3 justify-center' : 'p-3'
                    } rounded-lg transition-all duration-200 group ${
                      activeTab === item.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className={`p-2 rounded-md transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-blue-500/30'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    
                    {!isCollapsed && (
                      <div className="ml-3 text-left flex-1 min-w-0">
                        <div className="font-medium text-sm text-white truncate">{item.name}</div>
                        <div className="text-xs text-white/60 truncate">{item.description}</div>
                        {item.count > 0 && (
                          <div className="text-xs text-blue-400 mt-1">
                            {item.count} elementi
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <footer className="p-4 border-t border-white/20 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center p-3 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🏠</span>
              {!isCollapsed && 'Torna al Sito'}
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🚪</span>
              {!isCollapsed && 'Esci'}
            </button>
          </footer>
        </nav>
      </aside>
    </>
  );
};

export default ClientAreaMenu;
