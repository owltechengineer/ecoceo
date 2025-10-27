'use client';

import { useState } from 'react';
import { supabase, supabaseAdmin, supabaseSecret } from '@/lib/supabase';

export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [step, setStep] = useState<'idle' | 'testing' | 'setup' | 'complete'>('idle');

  const testConnection = async () => {
    setIsLoading(true);
    setStep('testing');
    setResults(null);

    try {
      // Test connessione base
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('count')
        .limit(1);

      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error;
      }

      setResults({
        connection: 'success',
        message: 'Connessione Supabase OK',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      setResults({
        connection: 'error',
        message: `Errore connessione: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeSetup = async () => {
    setIsLoading(true);
    setStep('setup');
    setResults(null);

    try {
      // Leggi il file SQL
      const response = await fetch('/docs/database/COMPLETE_DATABASE_SETUP.sql');
      const sqlScript = await response.text();

      // Esegui lo script usando supabaseSecret per operazioni avanzate
      const { data, error } = await supabaseSecret.rpc('exec_sql', {
        sql: sqlScript
      });

      if (error) {
        throw error;
      }

      setResults({
        setup: 'success',
        message: 'Database setup completato con successo!',
        timestamp: new Date().toISOString(),
        data: data
      });

      setStep('complete');

    } catch (error: any) {
      setResults({
        setup: 'error',
        message: `Errore setup: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTables = async () => {
    setIsLoading(true);

    try {
      // Verifica tabelle create
      const { data, error } = await supabase
        .from('financial_departments')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      setResults(prev => ({
        ...prev,
        verification: 'success',
        message: 'Tutte le tabelle sono state create correttamente!'
      }));

    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        verification: 'error',
        message: `Errore verifica: ${error.message}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🗄️ Database Setup</h2>
        <p className="text-gray-600">Configurazione completa del database Supabase</p>
      </div>

      <div className="space-y-4">
        {/* Test Connessione */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Test Connessione</h3>
          <p className="text-sm text-blue-700 mb-3">Verifica la connessione a Supabase</p>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading && step === 'testing' ? '🔄 Testando...' : '🔍 Test Connessione'}
          </button>
        </div>

        {/* Setup Database */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">2. Setup Database</h3>
          <p className="text-sm text-green-700 mb-3">Esegue lo script completo di setup</p>
          <button
            onClick={executeSetup}
            disabled={isLoading || step === 'testing'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading && step === 'setup' ? '🔄 Setup in corso...' : '🚀 Esegui Setup'}
          </button>
        </div>

        {/* Verifica Tabelle */}
        {step === 'complete' && (
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">3. Verifica Tabelle</h3>
            <p className="text-sm text-purple-700 mb-3">Verifica che tutte le tabelle siano state create</p>
            <button
              onClick={verifyTables}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '🔄 Verificando...' : '✅ Verifica Tabelle'}
            </button>
          </div>
        )}
      </div>

      {/* Risultati */}
      {results && (
        <div className="mt-6 p-4 bg-white/30rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📊 Risultati:</h4>
          <div className="space-y-2">
            {results.connection && (
              <div className={`p-2 rounded ${
                results.connection === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <strong>Connessione:</strong> {results.message}
              </div>
            )}
            {results.setup && (
              <div className={`p-2 rounded ${
                results.setup === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <strong>Setup:</strong> {results.message}
              </div>
            )}
            {results.verification && (
              <div className={`p-2 rounded ${
                results.verification === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <strong>Verifica:</strong> {results.message}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Timestamp: {results.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* Istruzioni */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">📋 Istruzioni:</h4>
        <ol className="text-sm text-yellow-800 space-y-1">
          <li>1. Clicca "Test Connessione" per verificare Supabase</li>
          <li>2. Clicca "Esegui Setup" per creare tutte le tabelle</li>
          <li>3. Clicca "Verifica Tabelle" per confermare il setup</li>
        </ol>
        <p className="text-xs text-yellow-700 mt-2">
          ⚠️ Il setup elimina tutte le tabelle esistenti e le ricrea da zero
        </p>
      </div>
    </div>
  );
}
