'use client';

import { useState } from 'react';
import LogoutButton from '../Auth/LogoutButton';
import HomeButton from '../Navigation/HomeButton';

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
  };

  return (
    <div className={`transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-72'
    } p-4`}>
      {/* Card Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <img 
                  src="/images/logo/logo-2.svg" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              title={isCollapsed ? 'Espandi menu' : 'Comprimi menu'}
            >
              <span className="text-white text-lg">
                {isCollapsed ? '📋' : '📌'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <div key={item.key}>
              {/* Barra di divisione sotto Dashboard Totale */}
              {item.key === 'tasks' && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                      Gestione Operativa
                    </span>
                  </div>
                </div>
              )}
              
              {/* Barra di divisione sopra Red */}
              {item.key === 'red' && (
                <div className="my-4 mx-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                      Identità Aziendale
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group ${
                  activeSection === item.key
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-[1.02]`
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`p-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.key
                    ? 'bg-white bg-opacity-25 shadow-lg'
                    : `bg-gradient-to-br ${item.gradient} text-white shadow-md group-hover:shadow-lg`
                }`}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                
                {!isCollapsed && (
                  <div className="ml-4 text-left">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-sm opacity-80">{item.description}</div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-4 pb-4 border-t border-gray-100 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-4">Azioni Rapide</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm">
                <span className="mr-3 text-lg">🔄</span>
                Aggiorna Tutto
              </button>
              <button className="w-full flex items-center p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm">
                <span className="mr-3 text-lg">📊</span>
                Report
              </button>
              <button className="w-full flex items-center p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm">
                <span className="mr-3 text-lg">⚙️</span>
                Impostazioni
              </button>
            </div>
          </div>
        )}

        {/* Current Section Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="text-xs text-blue-600 mb-1 font-medium">🎯 SEZIONE ATTIVA</div>
              <div className="font-bold text-sm text-gray-800">
                {navigationItems.find(item => item.key === activeSection)?.name || 'Dashboard Totale'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {navigationItems.find(item => item.key === activeSection)?.description || 'Panoramica generale'}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <HomeButton className="w-full justify-center text-blue-600 hover:bg-blue-50 rounded-xl p-3 transition-all duration-200 hover:shadow-sm" />
          <LogoutButton className="w-full justify-center rounded-xl p-3 transition-all duration-200 hover:shadow-sm" />
        </div>
      </div>
    </div>
  );
}
