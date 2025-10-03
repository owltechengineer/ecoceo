'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FixResult {
  step: string;
  success: boolean;
  message: string;
  details?: any;
}

export default function DashboardDataFixer() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FixResult[]>([]);
  const [isFixed, setIsFixed] = useState(false);

  const checkTableExists = async (tableName: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      return !error || !error.message.includes('does not exist');
    } catch (err) {
      return false;
    }
  };

  const getTableCount = async (tableName: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', 'default-user');
      
      if (error) return 0;
      return count || 0;
    } catch (err) {
      return 0;
    }
  };

  const insertSampleData = async () => {
    const sampleData = {
      appointments: [
        {
          user_id: 'default-user',
          title: 'Meeting con Cliente',
          description: 'Presentazione del progetto e raccolta feedback',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          location: 'Ufficio principale',
          attendees: ['Mario Rossi', 'Giulia Bianchi', 'Cliente ABC'],
          status: 'scheduled'
        }
      ],
      tasks: [
        {
          user_id: 'default-user',
          title: 'Sviluppo Frontend App',
          description: 'Implementare l\'interfaccia utente per la nuova applicazione mobile',
          status: 'in_progress',
          priority: 'high',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'development',
          assigned_to: 'Mario Rossi'
        }
      ],
      projects: [
        {
          user_id: 'default-user',
          name: 'Sviluppo App Mobile',
          description: 'Sviluppo di un\'applicazione mobile per iOS e Android',
          status: 'active',
          priority: 'high',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          budget: 50000.00,
          spent: 15000.00,
          progress: 45
        }
      ],
      campaigns: [
        {
          user_id: 'default-user',
          name: 'Campagna Q1 2024',
          description: 'Campagna marketing per il primo trimestre 2024',
          status: 'active',
          type: 'digital',
          budget: 25000.00,
          spent_amount: 12000.00,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          campaign_manager: 'Mario Rossi',
          target_impressions: 100000,
          target_clicks: 5000,
          target_conversions: 250
        }
      ],
      leads: [
        {
          user_id: 'default-user',
          first_name: 'Marco',
          last_name: 'Rossi',
          email: 'marco.rossi@email.com',
          phone: '+39 333 123 4567',
          company: 'TechCorp SRL',
          job_title: 'CEO',
          source: 'website',
          status: 'new',
          priority: 'high',
          score: 85,
          first_contact_date: new Date().toISOString(),
          last_contact_date: new Date().toISOString(),
          notes: 'Interessato a soluzioni enterprise'
        }
      ]
    };

    const results: FixResult[] = [];

    // Inserisci appuntamenti
    try {
      const { error } = await supabase
        .from('task_calendar_appointments')
        .insert(sampleData.appointments);
      
      results.push({
        step: 'Inserimento Appuntamenti',
        success: !error,
        message: error ? `Errore: ${error.message}` : 'Appuntamenti inseriti con successo',
        details: error
      });
    } catch (err: any) {
      results.push({
        step: 'Inserimento Appuntamenti',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      });
    }

    // Inserisci task
    try {
      const { error } = await supabase
        .from('task_calendar_tasks')
        .insert(sampleData.tasks);
      
      results.push({
        step: 'Inserimento Task',
        success: !error,
        message: error ? `Errore: ${error.message}` : 'Task inseriti con successo',
        details: error
      });
    } catch (err: any) {
      results.push({
        step: 'Inserimento Task',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      });
    }

    // Inserisci progetti
    try {
      const { error } = await supabase
        .from('task_calendar_projects')
        .insert(sampleData.projects);
      
      results.push({
        step: 'Inserimento Progetti',
        success: !error,
        message: error ? `Errore: ${error.message}` : 'Progetti inseriti con successo',
        details: error
      });
    } catch (err: any) {
      results.push({
        step: 'Inserimento Progetti',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      });
    }

    // Inserisci campagne
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert(sampleData.campaigns);
      
      results.push({
        step: 'Inserimento Campagne',
        success: !error,
        message: error ? `Errore: ${error.message}` : 'Campagne inserite con successo',
        details: error
      });
    } catch (err: any) {
      results.push({
        step: 'Inserimento Campagne',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      });
    }

    // Inserisci lead
    try {
      const { error } = await supabase
        .from('leads')
        .insert(sampleData.leads);
      
      results.push({
        step: 'Inserimento Lead',
        success: !error,
        message: error ? `Errore: ${error.message}` : 'Lead inseriti con successo',
        details: error
      });
    } catch (err: any) {
      results.push({
        step: 'Inserimento Lead',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      });
    }

    return results;
  };

  const runFix = async () => {
    setIsLoading(true);
    setResults([]);
    setIsFixed(false);

    try {
      const fixResults: FixResult[] = [];

      // Step 1: Verifica tabelle
      const tablesToCheck = [
        'task_calendar_appointments',
        'task_calendar_tasks',
        'task_calendar_projects',
        'campaigns',
        'leads'
      ];

      for (const table of tablesToCheck) {
        const exists = await checkTableExists(table);
        const count = await getTableCount(table);
        
        fixResults.push({
          step: `Verifica ${table}`,
          success: exists,
          message: exists 
            ? `${count} record trovati` 
            : 'Tabella non esiste',
          details: { exists, count }
        });
      }

      // Step 2: Inserisci dati di esempio se le tabelle esistono
      const allTablesExist = fixResults.every(r => r.success);
      if (allTablesExist) {
        const insertResults = await insertSampleData();
        fixResults.push(...insertResults);
      } else {
        fixResults.push({
          step: 'Inserimento Dati',
          success: false,
          message: 'Impossibile inserire dati: alcune tabelle non esistono',
          details: null
        });
      }

      setResults(fixResults);
      setIsFixed(fixResults.every(r => r.success));

    } catch (err: any) {
      setResults([{
        step: 'Errore Generale',
        success: false,
        message: `Errore: ${err.message}`,
        details: err
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: FixResult) => {
    return result.success ? '✅' : '❌';
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🔧 Correzione Dati Dashboard</h3>
        <button
          onClick={runFix}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Correzione in corso...' : 'Correggi Dati'}
        </button>
      </div>

      {isFixed && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>✅ Correzione completata!</strong> I dati dovrebbero ora essere visibili nella dashboard.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Risultati Correzione:</h4>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm font-medium text-gray-700">
                  {result.step}
                </span>
                <div className="flex items-center space-x-2">
                  <span>{getStatusIcon(result)}</span>
                  <span className="text-sm">
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Nota:</strong> Questo strumento inserisce dati di esempio per testare la dashboard.</p>
        <p>Per dati completi, esegui lo script SQL completo.</p>
      </div>
    </div>
  );
}
