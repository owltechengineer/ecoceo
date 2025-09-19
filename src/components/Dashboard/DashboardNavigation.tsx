'use client';

import { useState } from 'react';

interface NavigationItem {
  key: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

interface DashboardNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function DashboardNavigation({ activeSection = 'dashboard', onSectionChange }: DashboardNavigationProps) {

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
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    if (onSectionChange) {
      onSectionChange(item.key);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Navigazione Dashboard</h2>
        <p className="text-gray-600">Scegli la sezione da visualizzare</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item)}
            className={`group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              activeSection === item.key
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                activeSection === item.key
                  ? 'bg-white bg-opacity-20'
                  : `bg-gradient-to-r ${item.gradient} text-white`
              }`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold mb-1 ${
                  activeSection === item.key ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
                <p className={`text-sm ${
                  activeSection === item.key ? 'text-white text-opacity-90' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>

            {/* Hover effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
              activeSection === item.key ? 'opacity-20' : ''
            }`} />
          </button>
        ))}
      </div>

      {/* Current Section Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <span className="text-blue-600 text-lg">ℹ️</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Sezione Attiva</h4>
            <p className="text-sm text-gray-600">
              {navigationItems.find(item => item.key === activeSection)?.name || 'Dashboard Totale'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
