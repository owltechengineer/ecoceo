'use client';

import React, { useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '@/lib/supabase';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError('');

      // Test 1: Connessione base
      const { data, error: connectionError } = await supabase
        .from('dashboard_data')
        .select('*')
        .limit(1);

      if (connectionError) {
        throw connectionError;
      }

      // Test 2: Inserimento dati di test
      const testData = {
        user_id: 'test-user',
        data_type: 'test',
        data: { message: 'Test connection successful', timestamp: new Date().toISOString() }
      };

      const { data: insertData, error: insertError } = await supabase
        .from('dashboard_data')
        .upsert(testData, { onConflict: 'user_id,data_type' })
        .select();

      if (insertError) {
        throw insertError;
      }

      // Test 3: Lettura dati
      const { data: readData, error: readError } = await supabase
        .from('dashboard_data')
        .select('*')
        .eq('user_id', 'test-user')
        .eq('data_type', 'test');

      if (readError) {
        throw readError;
      }

      setTestData(readData);
      setConnectionStatus('connected');

      // Cleanup: rimuovi dati di test
      await supabase
        .from('dashboard_data')
        .delete()
        .eq('user_id', 'test-user')
        .eq('data_type', 'test');

    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message || 'Errore sconosciuto');
    }
  };

  const testBusinessPlan = async () => {
    try {
      const testData = {
        user_id: 'test-user',
        section: 'test-section',
        data: { test: 'Business Plan test successful' }
      };

      await supabaseHelpers.saveBusinessPlanSection('test-user', 'test-section', testData.data);
      const loadedData = await supabaseHelpers.loadBusinessPlanSection('test-user', 'test-section');
      
      console.log('Business Plan test successful:', loadedData);
      alert('Business Plan test successful! Check console for details.');

      // Cleanup
      await supabase
        .from('business_plan')
        .delete()
        .eq('user_id', 'test-user')
        .eq('section', 'test-section');

    } catch (err: any) {
      alert('Business Plan test failed: ' + err.message);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test Connessione Supabase</h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' :
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {connectionStatus === 'testing' && 'Testando connessione...'}
            {connectionStatus === 'connected' && 'Connesso a Supabase ✅'}
            {connectionStatus === 'error' && 'Errore di connessione ❌'}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Errore:</strong> {error}
            </p>
          </div>
        )}

        {/* Test Data */}
        {testData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Test completato:</strong> Dati letti e scritti con successo!
            </p>
            <pre className="text-xs text-green-700 mt-2 overflow-auto">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Testa Connessione
          </button>
          
          <button
            onClick={testBusinessPlan}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📋 Test Business Plan
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">📋 Istruzioni:</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Crea il file <code>.env.local</code> con le credenziali Supabase</li>
            <li>Esegui lo schema SQL nel tuo progetto Supabase</li>
            <li>Clicca "Testa Connessione" per verificare</li>
            <li>Se tutto funziona, la dashboard sincronizzerà automaticamente</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
