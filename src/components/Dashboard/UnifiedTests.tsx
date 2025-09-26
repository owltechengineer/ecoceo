'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { FormField } from './FormModal';

export default function UnifiedTests() {
  const { addService, addTask, addAppointment, addCampaign, addLead, addRDProject } = useDashboard();
  
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [inputTestResults, setInputTestResults] = useState<string[]>([]);
  const [visibilityTestResults, setVisibilityTestResults] = useState<string[]>([]);

  // Stati per i test di visibilità input
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const addTestResult = (message: string, type: 'connection' | 'input' | 'visibility' = 'connection') => {
    const timestamp = new Date().toLocaleTimeString();
    const result = `${timestamp}: ${message}`;
    
    switch (type) {
      case 'connection':
        setTestResults(prev => [...prev, result]);
        break;
      case 'input':
        setInputTestResults(prev => [...prev, result]);
        break;
      case 'visibility':
        setVisibilityTestResults(prev => [...prev, result]);
        break;
    }
  };

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
      addTestResult('✅ Connessione Supabase riuscita');

      // Cleanup: rimuovi dati di test
      await supabase
        .from('dashboard_data')
        .delete()
        .eq('user_id', 'test-user')
        .eq('data_type', 'test');

    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message || 'Errore sconosciuto');
      addTestResult('❌ Errore connessione Supabase: ' + err.message);
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
      addTestResult('✅ Test Business Plan riuscito');

      // Cleanup
      await supabase
        .from('business_plan')
        .delete()
        .eq('user_id', 'test-user')
        .eq('section', 'test-section');

    } catch (err: any) {
      addTestResult('❌ Test Business Plan fallito: ' + err.message);
    }
  };

  const testServiceInput = async () => {
    try {
      const testService = {
        name: 'Test Service',
        price: 100,
        cost: 50,
        hoursSold: 10,
        revenue: 1000,
        margin: 50,
        variance: 0,
        plannedHours: 10,
        plannedRevenue: 1000,
        actualHours: 10
      };
      
      addService(testService as any);
      addTestResult('✅ Servizio aggiunto con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del servizio', 'input');
    }
  };

  const testTaskInput = async () => {
    try {
      const testTask = {
        title: 'Test Task',
        description: 'Descrizione del task di test',
        status: 'pending' as const,
        priority: 'medium' as const,
        assignee: 'Test User',
        dueDate: new Date().toISOString(),
        estimatedHours: 5,
        tags: ['test', 'demo'],
        actualHours: 0,
        plannedHours: 5,
        plannedCompletion: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addTask(testTask as any);
      addTestResult('✅ Task aggiunto con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del task', 'input');
    }
  };

  const testAppointmentInput = async () => {
    try {
      const testAppointment = {
        title: 'Test Appointment',
        description: 'Descrizione dell\'appuntamento di test',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        type: 'meeting' as const,
        status: 'scheduled' as const,
        attendees: ['Test User'],
        location: 'Test Location',
        notes: 'Note di test',
        reminder: true,
        reminderTime: 15,
      };
      
      addAppointment(testAppointment);
      addTestResult('✅ Appuntamento aggiunto con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta dell\'appuntamento', 'input');
    }
  };

  const testCampaignInput = async () => {
    try {
      const testCampaign = {
        name: 'Test Campaign',
        channel: 'email',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        budget: 1000,
        spent: 0,
        leads: 0,
        conversions: 0,
        revenue: 0,
        status: 'active' as const,
        cac: 0,
        ltv: 0,
        ltvCacRatio: 0,
        plannedLeads: 100,
        plannedConversions: 10,
        plannedRevenue: 1000,
        actualLeads: 0,
        actualConversions: 0
      };
      
      addCampaign(testCampaign as any);
      addTestResult('✅ Campagna aggiunta con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta della campagna', 'input');
    }
  };

  const testLeadInput = async () => {
    try {
      const testLead = {
        name: 'Test Lead',
        email: 'test@example.com',
        source: 'website',
        campaign: 'Test Campaign',
        status: 'new' as const,
        value: 1000,
        date: new Date().toISOString(),
        roi: 0,
        plannedValue: 1000,
        actualValue: 0
      };
      
      addLead(testLead as any);
      addTestResult('✅ Lead aggiunto con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del lead', 'input');
    }
  };

  const testRDProjectInput = async () => {
    try {
      const testRDProject = {
        name: 'Test R&D Project',
        description: 'Descrizione del progetto R&D di test',
        trl: 3,
        hours: 100,
        cost: 50000,
        expectedReturn: 100000,
        actualReturn: 0,
        status: 'research' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2592000000).toISOString(),
        team: ['Test User 1', 'Test User 2'],
        progress: 0,
        roi: 0,
        plannedCost: 50000,
        plannedReturn: 100000,
        plannedProgress: 0,
        actualProgress: 0
      };
      
      addRDProject(testRDProject);
      addTestResult('✅ Progetto R&D aggiunto con successo', 'input');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del progetto R&D', 'input');
    }
  };

  const testVisibilityInputs = () => {
    setVisibilityTestResults([]);
    addTestResult('🧪 Inizio test visibilità input', 'visibility');
    
    // Test riempimento automatico
    setTimeout(() => {
      setTextValue('Testo di esempio');
      setNumberValue(123);
      setEmailValue('test@example.com');
      setDateValue('2024-01-15');
      setSelectValue('option2');
      setTextareaValue('Questo è un testo di esempio per il textarea.\nPuò contenere più righe.');
      addTestResult('✅ Campi riempiti automaticamente', 'visibility');
    }, 500);

    // Test pulizia
    setTimeout(() => {
      setTextValue('');
      setNumberValue(0);
      setEmailValue('');
      setDateValue('');
      setSelectValue('');
      setTextareaValue('');
      addTestResult('✅ Campi puliti', 'visibility');
    }, 2000);
  };

  const clearResults = (type: 'connection' | 'input' | 'visibility' | 'all' = 'all') => {
    switch (type) {
      case 'connection':
        setTestResults([]);
        break;
      case 'input':
        setInputTestResults([]);
        break;
      case 'visibility':
        setVisibilityTestResults([]);
        break;
      case 'all':
        setTestResults([]);
        setInputTestResults([]);
        setVisibilityTestResults([]);
        break;
    }
  };

  return (
    <div className="space-y-8 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => clearResults('all')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🗑️ Pulisci Tutto
            </button>
          </div>
        </div>
      </div>

      {/* Connection Tests */}
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Test Connessione Supabase</h3>
        
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

          {/* Results */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Risultati Test Connessione:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-sm text-gray-500">Nessun test eseguito ancora</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => clearResults('connection')}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Pulisci risultati
            </button>
          </div>
        </div>
      </div>

      {/* Input Tests */}
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⌨️ Test Campi di Input</h3>
        
        <div className="space-y-4">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={testServiceInput}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🛠️ Test Servizio
            </button>
            
            <button
              onClick={testTaskInput}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📋 Test Task
            </button>
            
            <button
              onClick={testAppointmentInput}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📅 Test Appuntamento
            </button>
            
            <button
              onClick={testCampaignInput}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              📈 Test Campagna
            </button>
            
            <button
              onClick={testLeadInput}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              👥 Test Lead
            </button>
            
            <button
              onClick={testRDProjectInput}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔬 Test R&D
            </button>
          </div>

          {/* Results */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Risultati Test Input:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {inputTestResults.length === 0 ? (
                <p className="text-sm text-gray-500">Nessun test eseguito ancora</p>
              ) : (
                inputTestResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => clearResults('input')}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Pulisci risultati
            </button>
          </div>
        </div>
      </div>

      {/* Visibility Tests */}
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Test Visibilità Input</h3>
        
        <div className="space-y-4">
          {/* Test Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={testVisibilityInputs}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🧪 Test Visibilità
            </button>
          </div>

          {/* Test Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Testo</h4>
              <FormField
                label="Campo Testo"
                name="text"
                type="text"
                value={textValue}
                onChange={(value) => setTextValue(value as string)}
                placeholder="Inserisci del testo..."
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{textValue}</code>
              </div>
            </div>

            {/* Number Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Numero</h4>
              <FormField
                label="Campo Numero"
                name="number"
                type="number"
                value={numberValue}
                onChange={(value) => setNumberValue(value as number)}
                placeholder="Inserisci un numero..."
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{numberValue}</code>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Email</h4>
              <FormField
                label="Campo Email"
                name="email"
                type="email"
                value={emailValue}
                onChange={(value) => setEmailValue(value as string)}
                placeholder="Inserisci un'email..."
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{emailValue}</code>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Data</h4>
              <FormField
                label="Campo Data"
                name="date"
                type="date"
                value={dateValue}
                onChange={(value) => setDateValue(value as string)}
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{dateValue}</code>
              </div>
            </div>

            {/* Select Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Select</h4>
              <FormField
                label="Campo Select"
                name="select"
                type="select"
                value={selectValue}
                onChange={(value) => setSelectValue(value as string)}
                options={[
                  { value: 'option1', label: 'Opzione 1' },
                  { value: 'option2', label: 'Opzione 2' },
                  { value: 'option3', label: 'Opzione 3' }
                ]}
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{selectValue}</code>
              </div>
            </div>

            {/* Textarea Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Textarea</h4>
              <FormField
                label="Campo Textarea"
                name="textarea"
                type="textarea"
                value={textareaValue}
                onChange={(value) => setTextareaValue(value as string)}
                placeholder="Inserisci del testo lungo..."
                rows={3}
              />
              <div className="text-xs text-gray-500">
                Valore: <code className="bg-gray-100 px-1 rounded">{textareaValue}</code>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Risultati Test Visibilità:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {visibilityTestResults.length === 0 ? (
                <p className="text-sm text-gray-500">Nessun test eseguito ancora</p>
              ) : (
                visibilityTestResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => clearResults('visibility')}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Pulisci risultati
            </button>
          </div>

          {/* Current State */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Stato Attuale:</h4>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify({
                textValue,
                numberValue,
                emailValue,
                dateValue,
                selectValue,
                textareaValue
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Istruzioni:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li><strong>Test Connessione:</strong> Verifica la connessione a Supabase e Business Plan</li>
          <li><strong>Test Input:</strong> Testa l'aggiunta di dati in tutti i componenti</li>
          <li><strong>Test Visibilità:</strong> Verifica che i campi mostrino il testo digitato</li>
          <li><strong>Monitoraggio:</strong> Controlla i risultati in tempo reale</li>
          <li><strong>Debug:</strong> Usa la console per log dettagliati</li>
        </ol>
      </div>
    </div>
  );
}
