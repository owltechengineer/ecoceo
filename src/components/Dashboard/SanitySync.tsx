'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { syncSanityData } from '@/services/sanitySync';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

export default function SanitySync() {
  const { openInfo } = useInfoModal();
  const { dispatch } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSync = async () => {
    setIsLoading(true);
    setSyncStatus('Sincronizzazione in corso...');

    try {
      const { services, projects, stats } = await syncSanityData();
      
      // Aggiorna il context con i dati di Sanity
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          projects: projects,
          services: services,
          budgets: [], // Mantieni i budget esistenti
          investments: [], // Mantieni gli investimenti esistenti
          rdProjects: [], // Mantieni i progetti R&D esistenti
          campaigns: [], // Mantieni le campagne esistenti
          leads: [], // Mantieni i lead esistenti
        },
      });

      setLastSync(new Date());
      setSyncStatus(`✅ Sincronizzazione completata! Caricati ${services.length} servizi e ${projects.length} progetti da Sanity.`);
      
      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => setSyncStatus(''), 5000);
    } catch (error) {
      console.error('Errore durante la sincronizzazione:', error);
      setSyncStatus('❌ Errore durante la sincronizzazione. Controlla la console per i dettagli.');
      
      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => setSyncStatus(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🔄 Sincronizzazione Sanity</h3>
            <p className="text-sm text-gray-600">
              Carica servizi e progetti da Sanity CMS nella dashboard
            </p>
          </div>
          <InfoButton onClick={() => openInfo(dashboardInfo.sanitySync.title, dashboardInfo.sanitySync.content)} />
        </div>
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sincronizzando...</span>
            </>
          ) : (
            <>
              <span>🔄 Sincronizza</span>
            </>
          )}
        </button>
      </div>

      {syncStatus && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${
          syncStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {syncStatus}
        </div>
      )}

      {lastSync && (
        <div className="text-sm text-gray-500">
          Ultima sincronizzazione: {lastSync.toLocaleString('it-IT')}
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">📋 Cosa viene sincronizzato:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Servizi</strong>: Nome, prezzo, costi, ore vendute, ricavi, margini</li>
          <li>• <strong>Progetti</strong>: Titolo, cliente, budget, costi, ricavi, progresso, stato</li>
          <li>• <strong>Statistiche</strong>: Conteggi e totali automatici</li>
        </ul>
        
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Nota:</strong> I dati esistenti nella dashboard (budget, investimenti, R&D, marketing) 
            non verranno sovrascritti. Solo servizi e progetti verranno aggiornati da Sanity.
          </p>
        </div>
      </div>
    </div>
  );
}
