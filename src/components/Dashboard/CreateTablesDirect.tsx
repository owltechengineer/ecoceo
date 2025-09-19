'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateTablesDirect() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createTablesDirect = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      const results: any = {
        timestamp: new Date().toISOString(),
        operations: {}
      };

      // Test 1: Verifica se le tabelle esistono già
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('count')
          .limit(1);

        results.operations.campaignsCheck = {
          success: !campaignsError,
          exists: !campaignsError,
          error: campaignsError?.message || null
        };
      } catch (err) {
        results.operations.campaignsCheck = {
          success: false,
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('count')
          .limit(1);

        results.operations.leadsCheck = {
          success: !leadsError,
          exists: !leadsError,
          error: leadsError?.message || null
        };
      } catch (err) {
        results.operations.leadsCheck = {
          success: false,
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      // Se le tabelle non esistono, proviamo a crearle usando query dirette
      if (!results.operations.campaignsCheck.exists) {
        try {
          // Prova a creare la tabella campaigns usando una query diretta
          const { data, error } = await supabase
            .rpc('create_campaigns_table');

          results.operations.createCampaigns = {
            success: !error,
            error: error?.message || null,
            method: 'rpc'
          };
        } catch (err) {
          results.operations.createCampaigns = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            method: 'rpc'
          };
        }
      }

      if (!results.operations.leadsCheck.exists) {
        try {
          // Prova a creare la tabella leads usando una query diretta
          const { data, error } = await supabase
            .rpc('create_leads_table');

          results.operations.createLeads = {
            success: !error,
            error: error?.message || null,
            method: 'rpc'
          };
        } catch (err) {
          results.operations.createLeads = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            method: 'rpc'
          };
        }
      }

      // Test finale: verifica se le tabelle sono ora accessibili
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .limit(1);

        results.operations.campaignsFinal = {
          success: !campaignsError,
          error: campaignsError?.message || null,
          data: campaignsData
        };
      } catch (err) {
        results.operations.campaignsFinal = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .limit(1);

        results.operations.leadsFinal = {
          success: !leadsError,
          error: leadsError?.message || null,
          data: leadsData
        };
      } catch (err) {
        results.operations.leadsFinal = {
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <span className="text-xl">🔧</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Crea Tabelle Direttamente</h3>
        </div>
        <button
          onClick={createTablesDirect}
          disabled={isCreating}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Creazione in corso...
            </span>
          ) : (
            '🔧 Crea Tabelle'
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {result.timestamp}</h4>
            {result.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {result.error}
              </div>
            )}
          </div>

          {result.operations && (
            <div className="space-y-3">
              {Object.entries(result.operations).map(([operation, data]: [string, any]) => (
                <div key={operation} className={`p-4 rounded-lg border ${
                  data.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    data.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {operation === 'campaignsCheck' && '📊 Verifica Campaigns'}
                    {operation === 'leadsCheck' && '👥 Verifica Leads'}
                    {operation === 'createCampaigns' && '🏗️ Crea Campaigns'}
                    {operation === 'createLeads' && '🏗️ Crea Leads'}
                    {operation === 'campaignsFinal' && '✅ Test Finale Campaigns'}
                    {operation === 'leadsFinal' && '✅ Test Finale Leads'}
                    {data.success ? ' ✅' : ' ❌'}
                  </h4>
                  {data.error && (
                    <div className="p-2 bg-red-100 rounded text-red-700 text-sm">
                      <strong>Errore:</strong> {data.error}
                    </div>
                  )}
                  {data.exists !== undefined && (
                    <div className="p-2 bg-blue-100 rounded text-blue-700 text-sm">
                      <strong>Esiste:</strong> {data.exists ? 'Sì' : 'No'}
                    </div>
                  )}
                  {data.method && (
                    <div className="p-2 bg-purple-100 rounded text-purple-700 text-sm">
                      <strong>Metodo:</strong> {data.method}
                    </div>
                  )}
                  {data.data && (
                    <div className="p-2 bg-green-100 rounded text-green-700 text-sm">
                      <strong>Dati:</strong> {JSON.stringify(data.data, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Creazione Diretta</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Verifica se le tabelle esistono già</li>
          <li>• Prova a crearle usando RPC functions</li>
          <li>• Testa l'accesso finale alle tabelle</li>
          <li>• Mostra risultati dettagliati per ogni operazione</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-800 mb-2">🚨 Soluzione Manuale</h4>
        <p className="text-sm text-red-700 mb-2">
          Se la creazione automatica fallisce, devi creare le tabelle manualmente nel Supabase SQL Editor:
        </p>
        <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
          <pre>{`-- Copia e incolla questo SQL nel Supabase SQL Editor:

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

-- Abilita RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Crea policy
CREATE POLICY "Enable all operations for all users" ON campaigns
FOR ALL USING (true);

CREATE POLICY "Enable all operations for all users" ON leads
FOR ALL USING (true);`}</pre>
        </div>
      </div>
    </div>
  );
}
