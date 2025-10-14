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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu Sidebar */}
      <div className={`transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto transform translate-x-0' 
          : 'hidden lg:block transform -translate-x-full lg:translate-x-0'
      } w-64 lg:w-72`}>
        <div className="bg-gray-900/95 backdrop-blur-md rounded-r-2xl lg:rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden h-screen flex flex-col">
          
          {/* Header */}
          <div className="bg-blue-500/20 backdrop-blur-sm p-2 sm:p-3 border-b border-gray-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">🏠</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Area Clienti</h1>
                  <p className="text-gray-300 text-xs">Contenuti esclusivi</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          </div>

          {/* Collapse Button */}
          <div className="p-2 sm:p-3 border-b border-gray-600/30">
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

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'p-2 justify-center' : 'p-2'
                  } rounded-lg transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className={`${
                    isCollapsed ? 'p-1.5' : 'p-1.5'
                  } rounded-md transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-500/30'
                      : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                  }`}>
                    <span className={`${isCollapsed ? 'text-base' : 'text-base'}`}>{item.icon}</span>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="ml-3 text-left">
                      <div className="font-medium text-xs text-white">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                      {item.count > 0 && (
                        <div className="text-xs text-blue-400 mt-1">
                          {item.count} elementi
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-2 sm:p-3 border-t border-gray-600/50 space-y-1">
            <Link
              href="/"
              className="w-full flex items-center justify-center p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🏠</span>
              {!isCollapsed && 'Torna al Sito'}
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-2 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🚪</span>
              {!isCollapsed && 'Esci'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAreaMenu;
