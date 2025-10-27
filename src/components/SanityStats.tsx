'use client';

import { useState, useEffect } from 'react';
import { fetchDashboardStats, DashboardStats } from '@/services/sanitySync';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

export default function SanityStats() {
  const { openInfo } = useInfoModal();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      const sanityStats = await fetchDashboardStats();
      setStats(sanityStats);
    } catch (err) {
      console.error('Errore nel caricamento delle statistiche:', err);
      setError('Errore nel caricamento delle statistiche di Sanity. Verifica che Sanity sia configurato correttamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistiche Sanity</h3>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Caricamento statistiche...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistiche Sanity</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={loadStats}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const totalProfit = stats.totalRevenue - stats.totalCost;
  const profitMargin = stats.totalRevenue > 0 ? (totalProfit / stats.totalRevenue) * 100 : 0;

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📊 Statistiche Sanity</h3>
            <p className="text-sm text-gray-600">
              Dati aggregati da Sanity CMS
            </p>
          </div>
          <InfoButton onClick={() => openInfo(dashboardInfo.sanityStats.title, dashboardInfo.sanityStats.content)} />
        </div>
        <button
          onClick={loadStats}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Aggiorna
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{stats.totalServices}</div>
          <div className="text-sm text-blue-600">Servizi</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-900">{stats.totalProjects}</div>
          <div className="text-sm text-green-600">Progetti</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-900">{stats.activeProjects}</div>
          <div className="text-sm text-purple-600">Attivi</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-900">{stats.completedProjects}</div>
          <div className="text-sm text-orange-600">Completati</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/30rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Budget Totale</div>
          <div className="text-xl font-bold text-gray-900">€{stats.totalBudget.toLocaleString()}</div>
        </div>
        
        <div className="p-4 bg-white/30rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Ricavi Totali</div>
          <div className="text-xl font-bold text-green-600">€{stats.totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="p-4 bg-white/30rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Profitto</div>
          <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            €{totalProfit.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Margine: {profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Suggerimento:</strong> Queste statistiche mostrano i dati direttamente da Sanity CMS. 
          Usa il pulsante "Sincronizza" per aggiornare la dashboard con questi dati.
        </p>
      </div>
    </div>
  );
}
