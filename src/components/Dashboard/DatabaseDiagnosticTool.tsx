'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DiagnosticResult {
  table: string;
  status: 'success' | 'missing' | 'error' | 'permission_denied';
  error?: string;
  columns?: string[];
  rowCount?: number;
}

export default function DatabaseDiagnosticTool() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    missing: number;
    errors: number;
    permissionDenied: number;
  } | null>(null);

  // Lista completa delle tabelle che dovrebbero esistere
  const requiredTables = [
    // Dashboard
    'dashboard_data',
    
    // Financial
    'financial_departments',
    'financial_fixed_costs',
    'financial_variable_costs',
    'financial_revenues',
    'financial_budgets',
    
    // Marketing
    'campaigns',
    'leads',
    
    // Projects
    'projects_projects',
    'projects_services',
    
    // Tasks & Calendar
    'task_calendar_projects',
    'task_calendar_tasks',
    'task_calendar_appointments',
    'recurring_activities',
    
    // Business Plan
    'business_plan_executive_summary',
    'business_plan_market_analysis',
    'business_plan_marketing_strategy',
    'business_plan_operational_plan',
    'business_plan_financial_plan',
    'business_plan_business_model',
    'business_plan_roadmap',
    'business_plan_documentation',
    
    // Quick Tasks
    'quick_tasks',
    
    // Quotes
    'quotes',
    'quote_items'
  ];

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    const diagnosticResults: DiagnosticResult[] = [];
    let successCount = 0;
    let missingCount = 0;
    let errorCount = 0;
    let permissionDeniedCount = 0;

    for (const table of requiredTables) {
      try {
        // Test 1: Verifica se la tabella esiste e è accessibile
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          if (error.message.includes('relation') && error.message.includes('does not exist')) {
            diagnosticResults.push({
              table,
              status: 'missing',
              error: 'Tabella non esiste'
            });
            missingCount++;
          } else if (error.message.includes('permission denied') || error.message.includes('insufficient_privilege')) {
            diagnosticResults.push({
              table,
              status: 'permission_denied',
              error: error.message
            });
            permissionDeniedCount++;
          } else {
            diagnosticResults.push({
              table,
              status: 'error',
              error: error.message
            });
            errorCount++;
          }
        } else {
          // Test 2: Ottieni informazioni sulla struttura
          try {
            const { data: columnsData, error: columnsError } = await supabase
              .rpc('get_table_columns', { table_name: table })
              .limit(1);

            // Test 3: Conta le righe
            const { count, error: countError } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });

            diagnosticResults.push({
              table,
              status: 'success',
              columns: columnsData ? Object.keys(columnsData[0] || {}) : [],
              rowCount: count || 0
            });
            successCount++;
          } catch (structureError) {
            // Se non riusciamo a ottenere la struttura, ma la tabella esiste
            diagnosticResults.push({
              table,
              status: 'success',
              rowCount: 0
            });
            successCount++;
          }
        }
      } catch (err: any) {
        diagnosticResults.push({
          table,
          status: 'error',
          error: err.message
        });
        errorCount++;
      }
    }

    setResults(diagnosticResults);
    setSummary({
      total: requiredTables.length,
      success: successCount,
      missing: missingCount,
      errors: errorCount,
      permissionDenied: permissionDeniedCount
    });
    setIsRunning(false);
  };

  const generateFixScript = () => {
    const missingTables = results.filter(r => r.status === 'missing').map(r => r.table);
    
    if (missingTables.length === 0) {
      return '-- Nessuna tabella mancante da creare';
    }

    return `-- Script per creare le tabelle mancanti
-- Esegui questo script nel Supabase SQL Editor

${missingTables.map(table => {
  switch (table) {
    case 'dashboard_data':
      return `-- Dashboard Data
CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);`;

    case 'financial_departments':
      return `-- Financial Departments
CREATE TABLE IF NOT EXISTS financial_departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget_limit DECIMAL(12,2),
  manager TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for now" ON financial_departments FOR ALL USING (true);`;

    case 'campaigns':
      return `-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(12,2) NOT NULL,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  cac DECIMAL(8,2) NOT NULL DEFAULT 0,
  ltv DECIMAL(8,2) NOT NULL DEFAULT 0,
  ltv_cac_ratio DECIMAL(8,2) NOT NULL DEFAULT 0,
  planned_leads INTEGER NOT NULL DEFAULT 0,
  planned_conversions INTEGER NOT NULL DEFAULT 0,
  planned_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_leads INTEGER NOT NULL DEFAULT 0,
  actual_conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for now" ON campaigns FOR ALL USING (true);`;

    case 'leads':
      return `-- Marketing Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  roi DECIMAL(8,2) NOT NULL DEFAULT 0,
  planned_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for now" ON leads FOR ALL USING (true);`;

    default:
      return `-- ${table} (script personalizzato necessario)`;
  }
}).join('\n\n')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Script copiato negli appunti!');
  };

  return (
    <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🔍 Diagnostica Database</h2>
          <p className="text-gray-600">
            Verifica lo stato di tutte le tabelle del database e genera script di riparazione
          </p>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '🔄 Analizzando...' : '🚀 Avvia Diagnostica'}
        </button>
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Riepilogo Risultati</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
              <div className="text-sm text-gray-600">Totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.success}</div>
              <div className="text-sm text-gray-600">✅ OK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.missing}</div>
              <div className="text-sm text-gray-600">❌ Mancanti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.errors}</div>
              <div className="text-sm text-gray-600">⚠️ Errori</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.permissionDenied}</div>
              <div className="text-sm text-gray-600">🔒 Permessi</div>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">📋 Dettaglio Tabelle</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' :
                  result.status === 'missing' ? 'bg-red-50 border-red-200' :
                  result.status === 'permission_denied' ? 'bg-orange-50 border-orange-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {result.status === 'success' ? '✅' :
                       result.status === 'missing' ? '❌' :
                       result.status === 'permission_denied' ? '🔒' : '⚠️'}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{result.table}</div>
                      {result.error && (
                        <div className="text-sm text-red-600">{result.error}</div>
                      )}
                      {result.rowCount !== undefined && (
                        <div className="text-sm text-gray-600">
                          {result.rowCount} righe
                          {result.columns && result.columns.length > 0 && (
                            <span> • {result.columns.length} colonne</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">🔧 Script di Riparazione</h3>
          <p className="text-sm text-blue-700 mb-3">
            Copia e incolla questo script nel Supabase SQL Editor per creare le tabelle mancanti:
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs">{generateFixScript()}</pre>
          </div>
          <button
            onClick={() => copyToClipboard(generateFixScript())}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📋 Copia Script
          </button>
        </div>
      )}
    </div>
  );
}
