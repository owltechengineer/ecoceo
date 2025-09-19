'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';

export default function InputTest() {
  const { addService, addTask, addAppointment, addCampaign, addLead, addRDProject } = useDashboard();
  
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
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
      
      addService(testService);
      addTestResult('✅ Servizio aggiunto con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del servizio');
    }
  };

  const testTaskInput = async () => {
    try {
      const testTask = {
        title: 'Test Task',
        description: 'Descrizione del task di test',
        status: 'todo' as const,
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
      
      addTask(testTask);
      addTestResult('✅ Task aggiunto con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del task');
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
      addTestResult('✅ Appuntamento aggiunto con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta dell\'appuntamento');
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
        plannedLeads: 0,
        plannedConversions: 0,
        plannedRevenue: 0,
        actualLeads: 0,
        actualConversions: 0
      };
      
      addCampaign(testCampaign);
      addTestResult('✅ Campagna aggiunta con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta della campagna');
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
        actualValue: 1000
      };
      
      addLead(testLead);
      addTestResult('✅ Lead aggiunto con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del lead');
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
      addTestResult('✅ Progetto R&D aggiunto con successo');
    } catch (error) {
      addTestResult('❌ Errore nell\'aggiunta del progetto R&D');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test Campi di Input Dashboard</h3>
      
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

        {/* Clear Button */}
        <div className="flex justify-end">
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🗑️ Pulisci Risultati
          </button>
        </div>

        {/* Results */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Risultati Test:</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
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
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Istruzioni:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Clicca sui pulsanti per testare l'aggiunta di dati</li>
            <li>Verifica che i dati vengano salvati correttamente</li>
            <li>Controlla la console per i log di debug</li>
            <li>Verifica la sincronizzazione con Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
