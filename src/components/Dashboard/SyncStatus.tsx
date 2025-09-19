'use client';

import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';

export default function SyncStatus() {
  const { isOnline, isLoading, forceSync } = useDashboard();

  const handleForceSync = async () => {
    try {
      await forceSync();
      alert('Sincronizzazione completata!');
    } catch (error) {
      alert('Errore nella sincronizzazione. Riprova.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
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
              {isLoading ? 'Sincronizzazione...' : isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Force Sync Button */}
          {isOnline && !isLoading && (
            <button
              onClick={handleForceSync}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              🔄 Sincronizza
            </button>
          )}

          {/* Offline Indicator */}
          {!isOnline && (
            <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Dati salvati localmente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
