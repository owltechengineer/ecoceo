'use client';

import { useState, useEffect } from 'react';
import { recurringActivitiesService } from '@/lib/supabase';

interface SystemStatus {
  tablesExist: boolean;
  functionsExist: boolean;
  dataLoaded: boolean;
  error: string | null;
  activitiesCount: number;
  templatesCount: number;
}

export default function RecurringActivitiesStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    tablesExist: false,
    functionsExist: false,
    dataLoaded: false,
    error: null,
    activitiesCount: 0,
    templatesCount: 0
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemStatus = async () => {
    setIsChecking(true);
    setStatus({
      tablesExist: false,
      functionsExist: false,
      dataLoaded: false,
      error: null,
      activitiesCount: 0,
      templatesCount: 0
    });

    try {
      // Test 1: Verifica esistenza tabelle
      try {
        await recurringActivitiesService.loadActivities();
        await recurringActivitiesService.loadTemplates();
        setStatus(prev => ({ ...prev, tablesExist: true }));
      } catch (error) {
        setStatus(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Errore sconosciuto'
        }));
        return;
      }

      // Test 2: Verifica funzioni PL/pgSQL
      try {
        await recurringActivitiesService.generateRecurringActivities('2025-01-01', '2025-01-07');
        setStatus(prev => ({ ...prev, functionsExist: true }));
      } catch (error) {
        // Le funzioni potrebbero non esistere, ma le tabelle sì
        console.warn('Funzioni PL/pgSQL non disponibili:', error);
      }

      // Test 3: Carica dati
      try {
        const activities = await recurringActivitiesService.loadActivities();
        const templates = await recurringActivitiesService.loadTemplates();
        
        // Verifica che i template abbiano le attività caricate correttamente
        const templatesWithActivities = templates.filter(t => t.activities && t.activities.length > 0);
        
        setStatus(prev => ({ 
          ...prev, 
          dataLoaded: true,
          activitiesCount: activities.length,
          templatesCount: templates.length
        }));
        
        console.log(`✅ Dati caricati: ${activities.length} attività, ${templates.length} template (${templatesWithActivities.length} con attività)`);
      } catch (error) {
        setStatus(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Errore caricamento dati'
        }));
      }

    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Errore imprevisto'
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const getStatusIcon = (condition: boolean) => {
    return condition ? '✅' : '❌';
  };

  const getStatusColor = (condition: boolean) => {
    return condition ? 'text-green-600' : 'text-red-600';
  };

  const getOverallStatus = () => {
    if (status.error) return { icon: '❌', color: 'text-red-600', text: 'Errore' };
    if (status.tablesExist && status.dataLoaded) return { icon: '✅', color: 'text-green-600', text: 'Operativo' };
    if (status.tablesExist) return { icon: '⚠️', color: 'text-yellow-600', text: 'Parziale' };
    return { icon: '❌', color: 'text-red-600', text: 'Non Configurato' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">📊 Stato Sistema</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitoraggio dello stato delle attività ricorrenti
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`text-2xl ${overallStatus.color}`}>
            {overallStatus.icon}
          </div>
          <div className="text-right">
            <div className={`font-semibold ${overallStatus.color}`}>
              {overallStatus.text}
            </div>
            <div className="text-xs text-gray-500">
              Sistema Attività Ricorrenti
            </div>
          </div>
        </div>
      </div>

      {isChecking && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Verifica stato in corso...</p>
        </div>
      )}

      {!isChecking && (
        <div className="space-y-4">
          {/* Status Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/30rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">{getStatusIcon(status.tablesExist)}</span>
                <div>
                  <div className="font-medium text-gray-900">Tabelle Database</div>
                  <div className="text-sm text-gray-600">recurring_activities, weekly_templates</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${getStatusColor(status.tablesExist)}`}>
                {status.tablesExist ? 'Esistenti' : 'Mancanti'}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/30rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">{getStatusIcon(status.functionsExist)}</span>
                <div>
                  <div className="font-medium text-gray-900">Funzioni PL/pgSQL</div>
                  <div className="text-sm text-gray-600">generate_recurring_activities</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${getStatusColor(status.functionsExist)}`}>
                {status.functionsExist ? 'Disponibili' : 'Mancanti'}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/30rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">{getStatusIcon(status.dataLoaded)}</span>
                <div>
                  <div className="font-medium text-gray-900">Dati Caricati</div>
                  <div className="text-sm text-gray-600">Attività e template</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${getStatusColor(status.dataLoaded)}`}>
                {status.dataLoaded ? 'OK' : 'Errore'}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/30rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">📊</span>
                <div>
                  <div className="font-medium text-gray-900">Contenuto</div>
                  <div className="text-sm text-gray-600">Record disponibili</div>
                </div>
              </div>
              <div className="text-sm font-medium text-blue-600">
                {status.activitiesCount} attività, {status.templatesCount} template
              </div>
            </div>
          </div>

          {/* Error Display */}
          {status.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-red-600 text-lg mr-3">❌</span>
                <div>
                  <h3 className="font-medium text-red-900">Errore Rilevato</h3>
                  <p className="text-sm text-red-800 mt-1">{status.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Ultima verifica: {new Date().toLocaleTimeString('it-IT')}
            </div>
            <button
              onClick={checkSystemStatus}
              disabled={isChecking}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isChecking ? '⏳ Verifica...' : '🔄 Ricontrolla'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
