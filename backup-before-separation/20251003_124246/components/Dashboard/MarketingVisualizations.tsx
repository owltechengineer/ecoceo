'use client';

import { useState } from 'react';
import MarketingStatsOverview from './MarketingStatsOverview';
import MarketingTablesViewer from './MarketingTablesViewer';
import MarketingChartsViewer from './MarketingChartsViewer';

export default function MarketingVisualizations() {
  const [activeView, setActiveView] = useState('stats');

  const views = [
    { key: 'stats', name: 'Statistiche', icon: '📈', description: 'Panoramica generale' },
    { key: 'tables', name: 'Tabelle', icon: '📊', description: 'Visualizza dati tabellari' },
    { key: 'charts', name: 'Grafici', icon: '📊', description: 'Visualizzazioni grafiche' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg mr-3">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visualizzazioni Marketing</h1>
              <p className="text-gray-600">Esplora tutti i dati delle tabelle marketing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            {views.map((view) => (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeView === view.key
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2 text-lg">{view.icon}</span>
                  <div className="text-center">
                    <div className="font-semibold">{view.name}</div>
                    <div className="text-xs opacity-75">{view.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeView === 'stats' && <MarketingStatsOverview />}
          {activeView === 'tables' && <MarketingTablesViewer />}
          {activeView === 'charts' && <MarketingChartsViewer />}
        </div>
      </div>
    </div>
  );
}
