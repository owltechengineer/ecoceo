'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateTablesButton() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createTables = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      const results: any = {
        timestamp: new Date().toISOString(),
        operations: {}
      };

      // SQL per creare la tabella campaigns
      const campaignsSQL = `
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
      `;

      // SQL per creare la tabella leads
      const leadsSQL = `
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
      `;

      // SQL per abilitare RLS
      const rlsSQL = `
        ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
        ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
      `;

      // SQL per creare le policy
      const policySQL = `
        CREATE POLICY IF NOT EXISTS "Enable all operations for all users" ON campaigns
        FOR ALL USING (true);
        
        CREATE POLICY IF NOT EXISTS "Enable all operations for all users" ON leads
        FOR ALL USING (true);
      `;

      // Esegui le operazioni
      try {
        const { error: campaignsError } = await supabase.rpc('exec_sql', { sql: campaignsSQL });
        results.operations.campaigns = {
          success: !campaignsError,
          error: campaignsError?.message || null
        };
      } catch (err) {
        results.operations.campaigns = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { error: leadsError } = await supabase.rpc('exec_sql', { sql: leadsSQL });
        results.operations.leads = {
          success: !leadsError,
          error: leadsError?.message || null
        };
      } catch (err) {
        results.operations.leads = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
        results.operations.rls = {
          success: !rlsError,
          error: rlsError?.message || null
        };
      } catch (err) {
        results.operations.rls = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySQL });
        results.operations.policies = {
          success: !policyError,
          error: policyError?.message || null
        };
      } catch (err) {
        results.operations.policies = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      setResult(results);
    } catch (error) {
      setResult({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <span className="text-xl">🔧</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Crea Tabelle Database</h3>
        </div>
        <button
          onClick={createTables}
          disabled={isCreating}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Creazione in corso...
            </span>
          ) : (
            '🏗️ Crea Tabelle'
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/20 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {result.timestamp}</h4>
            {result.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {result.error}
              </div>
            )}
          </div>

          {result.operations && (
            <div className="space-y-4">
              {Object.entries(result.operations).map(([operation, data]: [string, any]) => (
                <div key={operation} className={`p-4 rounded-lg border ${
                  data.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    data.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {operation === 'campaigns' && '📊 Tabella Campaigns'}
                    {operation === 'leads' && '👥 Tabella Leads'}
                    {operation === 'rls' && '🔒 Row Level Security'}
                    {operation === 'policies' && '📋 Policy di Accesso'}
                    {data.success ? ' ✅' : ' ❌'}
                  </h4>
                  {data.error && (
                    <div className="p-2 bg-red-100 rounded text-red-700 text-sm">
                      <strong>Errore:</strong> {data.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Attenzione</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Questa operazione crea le tabelle se non esistono</li>
          <li>• Richiede permessi di amministratore nel database</li>
          <li>• Le tabelle esistenti non verranno modificate</li>
          <li>• Verifica i log per eventuali errori</li>
        </ul>
      </div>
    </div>
  );
}
