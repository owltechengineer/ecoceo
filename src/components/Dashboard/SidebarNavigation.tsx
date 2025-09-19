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
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Navigazione</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-2">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item)}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-1 ${
              activeSection === item.key
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? item.name : undefined}
          >
            <div className={`p-2 rounded-lg ${
              activeSection === item.key
                ? 'bg-white bg-opacity-20'
                : `bg-gradient-to-r ${item.gradient} text-white`
            }`}>
              <span className="text-lg">{item.icon}</span>
            </div>
            
            {!isCollapsed && (
              <div className="ml-3 text-left">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Azioni Rapide</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-2">🔄</span>
              Aggiorna Tutto
            </button>
            <button className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-2">📊</span>
              Report
            </button>
            <button className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-2">⚙️</span>
              Impostazioni
            </button>
          </div>
        </div>
      )}

      {/* Current Section Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Sezione Attiva</div>
            <div className="font-medium text-sm text-gray-800">
              {navigationItems.find(item => item.key === activeSection)?.name || 'Dashboard Totale'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <HomeButton className="w-full justify-center text-blue-600 hover:bg-blue-50" />
        <LogoutButton className="w-full justify-center" />
      </div>
    </div>
  );
}
