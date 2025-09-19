'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SchemaTestResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function DatabaseSchemaTest() {
  const [results, setResults] = useState<SchemaTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSchemaTests = async () => {
    setIsRunning(true);
    setResults([]);
    const newResults: SchemaTestResult[] = [];

    try {
      // Test 1: Verifica esistenza tabella recurring_activities
      try {
        const { data, error } = await supabase
          .from('recurring_activities')
          .select('*')
          .limit(1);
        
        if (error) {
          newResults.push({
            id: 'table-recurring-activities',
            name: 'Tabella recurring_activities',
            status: 'error',
            message: `Tabella non esiste o non accessibile: ${error.message}`,
            details: error
          });
        } else {
          newResults.push({
            id: 'table-recurring-activities',
            name: 'Tabella recurring_activities',
            status: 'success',
            message: 'Tabella esiste e accessibile',
            details: data
          });
        }
      } catch (error) {
        newResults.push({
          id: 'table-recurring-activities',
          name: 'Tabella recurring_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 2: Verifica esistenza tabella weekly_templates
      try {
        const { data, error } = await supabase
          .from('weekly_templates')
          .select('*')
          .limit(1);
        
        if (error) {
          newResults.push({
            id: 'table-weekly-templates',
            name: 'Tabella weekly_templates',
            status: 'error',
            message: `Tabella non esiste o non accessibile: ${error.message}`,
            details: error
          });
        } else {
          newResults.push({
            id: 'table-weekly-templates',
            name: 'Tabella weekly_templates',
            status: 'success',
            message: 'Tabella esiste e accessibile',
            details: data
          });
        }
      } catch (error) {
        newResults.push({
          id: 'table-weekly-templates',
          name: 'Tabella weekly_templates',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 3: Verifica esistenza tabella template_activities
      try {
        const { data, error } = await supabase
          .from('template_activities')
          .select('*')
          .limit(1);
        
        if (error) {
          newResults.push({
            id: 'table-template-activities',
            name: 'Tabella template_activities',
            status: 'error',
            message: `Tabella non esiste o non accessibile: ${error.message}`,
            details: error
          });
        } else {
          newResults.push({
            id: 'table-template-activities',
            name: 'Tabella template_activities',
            status: 'success',
            message: 'Tabella esiste e accessibile',
            details: data
          });
        }
      } catch (error) {
        newResults.push({
          id: 'table-template-activities',
          name: 'Tabella template_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 3.5: Verifica relazione template_activities
      try {
        const { data, error } = await supabase
          .from('template_activities')
          .select(`
            template_id,
            activity_id,
            weekly_templates(name),
            recurring_activities(name)
          `)
          .limit(1);
        
        if (error) {
          newResults.push({
            id: 'table-template-relations',
            name: 'Relazioni template_activities',
            status: 'error',
            message: `Relazioni non funzionanti: ${error.message}`,
            details: error
          });
        } else {
          newResults.push({
            id: 'table-template-relations',
            name: 'Relazioni template_activities',
            status: 'success',
            message: 'Relazioni funzionanti correttamente',
            details: data
          });
        }
      } catch (error) {
        newResults.push({
          id: 'table-template-relations',
          name: 'Relazioni template_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 4: Verifica esistenza funzione generate_recurring_activities
      try {
        const { data, error } = await supabase
          .rpc('generate_recurring_activities', {
            p_start_date: '2025-01-01',
            p_end_date: '2025-01-07'
          });
        
        if (error) {
          newResults.push({
            id: 'function-generate-recurring',
            name: 'Funzione generate_recurring_activities',
            status: 'error',
            message: `Funzione non esiste o errore: ${error.message}`,
            details: error
          });
        } else {
          newResults.push({
            id: 'function-generate-recurring',
            name: 'Funzione generate_recurring_activities',
            status: 'success',
            message: `Funzione esiste e funziona - Generati ${data} record`,
            details: data
          });
        }
      } catch (error) {
        newResults.push({
          id: 'function-generate-recurring',
          name: 'Funzione generate_recurring_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 5: Verifica esistenza funzione generate_week_from_template
      try {
        // Prima creiamo un template di test
        const { data: templateData, error: templateError } = await supabase
          .from('weekly_templates')
          .insert([{
            name: 'Test Template',
            description: 'Template di test',
            is_active: true
          }])
          .select()
          .single();

        if (templateError) {
          newResults.push({
            id: 'function-generate-week',
            name: 'Funzione generate_week_from_template',
            status: 'error',
            message: `Impossibile creare template di test: ${templateError.message}`,
            details: templateError
          });
        } else {
          try {
            const { data, error } = await supabase
              .rpc('generate_week_from_template', {
                p_template_id: templateData.id,
                p_week_start_date: '2025-01-01'
              });
            
            if (error) {
              newResults.push({
                id: 'function-generate-week',
                name: 'Funzione generate_week_from_template',
                status: 'error',
                message: `Funzione non esiste o errore: ${error.message}`,
                details: error
              });
            } else {
              newResults.push({
                id: 'function-generate-week',
                name: 'Funzione generate_week_from_template',
                status: 'success',
                message: `Funzione esiste e funziona - Generati ${data} record`,
                details: data
              });
            }
          } catch (error) {
            newResults.push({
              id: 'function-generate-week',
              name: 'Funzione generate_week_from_template',
              status: 'error',
              message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
              details: error
            });
          }

          // Cleanup: elimina il template di test
          await supabase
            .from('weekly_templates')
            .delete()
            .eq('id', templateData.id);
        }
      } catch (error) {
        newResults.push({
          id: 'function-generate-week',
          name: 'Funzione generate_week_from_template',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: error
        });
      }

      // Test 6: Verifica struttura tabella recurring_activities
      try {
        const { data, error } = await supabase
          .from('recurring_activities')
          .select('*')
          .limit(1);
        
        if (error) {
          newResults.push({
            id: 'structure-recurring-activities',
            name: 'Struttura tabella recurring_activities',
            status: 'error',
            message: `Errore accesso: ${error.message}`,
            details: error
          });
        } else {
          // Verifica che la struttura sia corretta
          const expectedColumns = [
            'id', 'name', 'description', 'type', 'day_of_week', 'day_of_month',
            'time', 'duration', 'category', 'priority', 'is_active', 'created_at', 'updated_at'
          ];
          
          const hasCorrectStructure = data.length === 0 || 
            (data[0] && expectedColumns.every(col => col in data[0]));
          
          if (hasCorrectStructure) {
            newResults.push({
              id: 'structure-recurring-activities',
              name: 'Struttura tabella recurring_activities',
              status: 'success',
              message: 'Struttura tabella corretta',
              details: { columns: expectedColumns }
            });
          } else {
            newResults.push({
              id: 'structure-recurring-activities',
              name: 'Struttura tabella recurring_activities',
              status: 'warning',
              message: 'Struttura tabella potrebbe essere incompleta',
              details: { expected: expectedColumns, actual: data[0] ? Object.keys(data[0]) : [] }
            });
          }
        }
      } catch (error) {
        newResults.push({
          id: 'structure-recurring-activities',
          name: 'Struttura tabella recurring_activities',
          status: 'error',
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">🗄️ Test Schema Database</h2>
          <p className="text-sm text-gray-600 mt-1">
            Verifica esistenza tabelle e funzioni per attività ricorrenti
          </p>
        </div>
        <button
          onClick={runSchemaTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '⏳ Test in corso...' : '🚀 Avvia Test Schema'}
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
          <div className="text-4xl mb-4">🗄️</div>
          <p>Nessun test schema eseguito ancora</p>
          <p className="text-sm mt-1">Clicca "Avvia Test Schema" per verificare la struttura del database</p>
        </div>
      )}

      {isRunning && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Esecuzione test schema in corso...</p>
        </div>
      )}
    </div>
  );
}
