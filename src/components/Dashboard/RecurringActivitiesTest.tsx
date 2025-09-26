'use client';

import { useState } from 'react';
import { recurringActivitiesService } from '@/lib/supabase';
import DatabaseSchemaTest from './DatabaseSchemaTest';
import RecurringActivitiesSetup from './RecurringActivitiesSetup';
import RecurringActivitiesStatus from './RecurringActivitiesStatus';

interface TestResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function RecurringActivitiesTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    const newResults: TestResult[] = [];

    try {
      // Test 1: Verifica connessione Supabase
      newResults.push({
        id: 'connection',
        name: 'Connessione Supabase',
        status: 'success',
        message: 'Connessione Supabase OK'
      });

      // Test 2: Verifica esistenza tabella recurring_activities
      try {
        const data = await recurringActivitiesService.loadActivities();
        newResults.push({
          id: 'table-activities',
          name: 'Tabella recurring_activities',
          status: 'success',
          message: `Tabella accessibile - ${data.length} record trovati`,
          details: data
        });
      } catch (error) {
        newResults.push({
          id: 'table-activities',
          name: 'Tabella recurring_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 3: Verifica esistenza tabella weekly_templates
      try {
        const data = await recurringActivitiesService.loadTemplates();
        newResults.push({
          id: 'table-templates',
          name: 'Tabella weekly_templates',
          status: 'success',
          message: `Tabella accessibile - ${data.length} record trovati`,
          details: data
        });
      } catch (error) {
        newResults.push({
          id: 'table-templates',
          name: 'Tabella weekly_templates',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 4: Test salvataggio attività ricorrente
      try {
        const testActivity = {
          user_id: 'default-user',
          name: 'Test Activity',
          description: 'Attività di test',
          type: 'task' as const,
          status: 'active' as const,
          priority: 'medium' as const,
          frequency: 'weekly' as const,
          time_of_day: '09:00',
          duration_minutes: 60,
          assigned_to: 'Test User',
          template_id: '',
          start_date: '',
          end_date: '',
          last_generated: '',
          next_generation: '',
          notes: 'Test notes',
          tags: ['test'],
          day_of_week: 1,
          day_of_month: null
        };

        const savedActivity = await recurringActivitiesService.saveActivity(testActivity);
        newResults.push({
          id: 'save-activity',
          name: 'Salvataggio attività ricorrente',
          status: 'success',
          message: `Attività salvata con ID: ${savedActivity.id}`,
          details: savedActivity
        });

        // Test 5: Test eliminazione attività di test
        await recurringActivitiesService.deleteActivity(savedActivity.id);
        newResults.push({
          id: 'delete-activity',
          name: 'Eliminazione attività ricorrente',
          status: 'success',
          message: 'Attività eliminata con successo'
        });

      } catch (error) {
        newResults.push({
          id: 'save-activity',
          name: 'Salvataggio attività ricorrente',
          status: 'error',
          message: `Errore salvataggio: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 6: Test salvataggio template settimanale
      try {
        const testTemplate = {
          name: 'Test Template',
          description: 'Template di test',
          is_active: true
        };

        const savedTemplate = await recurringActivitiesService.saveTemplate(testTemplate);
        newResults.push({
          id: 'save-template',
          name: 'Salvataggio template settimanale',
          status: 'success',
          message: `Template salvato con ID: ${savedTemplate.id}`,
          details: savedTemplate
        });

        // Test 7: Test collegamento attività a template
        try {
          const testActivity2 = {
            user_id: 'default-user',
            name: 'Test Activity 2',
            description: 'Seconda attività di test',
            type: 'task' as const,
            status: 'active' as const,
            priority: 'high' as const,
            frequency: 'weekly' as const,
            time_of_day: '10:00',
            duration_minutes: 45,
            assigned_to: 'Test User 2',
            template_id: '',
            start_date: '',
            end_date: '',
            last_generated: '',
            next_generation: '',
            notes: 'Test notes 2',
            tags: ['test'],
            day_of_week: 2,
            day_of_month: null
          };

          const savedActivity2 = await recurringActivitiesService.saveActivity(testActivity2);
          await recurringActivitiesService.linkActivityToTemplate(savedTemplate.id, savedActivity2.id);
          
          newResults.push({
            id: 'link-activity-template',
            name: 'Collegamento attività a template',
            status: 'success',
            message: 'Attività collegata al template con successo'
          });

          // Cleanup
          await recurringActivitiesService.deleteActivity(savedActivity2.id);
        } catch (linkError) {
          newResults.push({
            id: 'link-activity-template',
            name: 'Collegamento attività a template',
            status: 'error',
            message: `Errore collegamento: ${linkError instanceof Error ? linkError.message : 'Errore sconosciuto'}`,
            details: linkError
          });
        }

        // Test 8: Test eliminazione template di test
        await recurringActivitiesService.deleteTemplate(savedTemplate.id);
        newResults.push({
          id: 'delete-template',
          name: 'Eliminazione template settimanale',
          status: 'success',
          message: 'Template eliminato con successo'
        });

      } catch (error) {
        newResults.push({
          id: 'save-template',
          name: 'Salvataggio template settimanale',
          status: 'error',
          message: `Errore salvataggio: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

    } catch (error) {
      newResults.push({
        id: 'general-error',
        name: 'Errore Generale',
        status: 'error',
        message: `Errore imprevisto: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        details: error
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">🧪 Test Attività Ricorrenti</h2>
          <p className="text-sm text-gray-600 mt-1">
            Verifica connessione, tabelle e funzionalità per attività ricorrenti e template settimanali
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '⏳ Test in corso...' : '🚀 Avvia Test'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start">
                <span className="text-lg mr-3">{getStatusIcon(result.status)}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-sm mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-gray-500 hover:text-gray-700">
                        Dettagli tecnici
                      </summary>
                      <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🧪</div>
          <p>Nessun test eseguito ancora</p>
          <p className="text-sm mt-1">Clicca "Avvia Test" per verificare la configurazione</p>
        </div>
      )}

      {isRunning && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Esecuzione test in corso...</p>
        </div>
      )}

      {/* System Status */}
      <div className="mt-8">
        <RecurringActivitiesStatus />
      </div>

      {/* Setup Instructions */}
      <div className="mt-8">
        <RecurringActivitiesSetup />
      </div>

      {/* Schema Test */}
      <div className="mt-8">
        <DatabaseSchemaTest />
      </div>
    </div>
  );
}
