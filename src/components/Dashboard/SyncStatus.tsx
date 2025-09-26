'use client';

import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';

export default function SyncStatus() {
  const { isOnline, isLoading } = useDashboard();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {/* Status Icon */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            ) : isOnline ? (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            ) : (
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {isLoading ? 'Caricamento...' : isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Info Message */}
          <div className="text-xs text-gray-600">
            {isOnline ? 'Dati sincronizzati automaticamente' : 'Modalità offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
