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
        description: 'Servizio di test',
        category: 'development' as const,
        status: 'active' as const,
        priority: 'medium' as const,
        base_price: 100,
        currency: 'EUR',
        pricing_model: 'hourly' as const,
        delivery_time_days: 5,
        delivery_method: 'remote' as const,
        service_manager: 'Test Manager',
        team_members: ['Dev1', 'Dev2'],
        requirements: ['Requirement 1'],
        deliverables: ['Deliverable 1'],
        notes: 'Test service notes',
        tags: ['test', 'service']
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
        user_id: 'default-user',
        title: 'Test Task',
        description: 'Descrizione del task di test',
        status: 'pending' as const,
        priority: 'medium' as const,
        assigned_to: 'Test User',
        assigned_by: 'Test Manager',
        due_date: new Date().toISOString(),
        start_date: new Date().toISOString(),
        estimated_hours: 5,
        actual_hours: 0,
        progress_percentage: 0,
        depends_on_tasks: [],
        category: 'development' as const,
        tags: ['test', 'demo'],
        notes: 'Test task notes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
        user_id: 'default-user',
        name: 'Test Campaign',
        description: 'Test campaign description',
        type: 'email' as const,
        status: 'active' as const,
        priority: 'medium' as const,
        budget: 1000,
        spent_amount: 0,
        currency: 'EUR',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        campaign_manager: 'Test Manager',
        creative_director: 'Test Creative',
        account_manager: 'Test Account',
        target_impressions: 10000,
        target_clicks: 500,
        target_conversions: 50,
        actual_impressions: 0,
        actual_clicks: 0,
        actual_conversions: 0,
        notes: 'Test campaign notes',
        tags: ['test', 'email'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        user_id: 'default-user',
        first_name: 'Test',
        last_name: 'Lead',
        email: 'test@example.com',
        phone: '+39 123 456 789',
        company: 'Test Company',
        job_title: 'Test Manager',
        source: 'website' as const,
        status: 'new' as const,
        priority: 'medium' as const,
        score: 75,
        campaign_id: '',
        country: 'Italia',
        city: 'Milano',
        address: 'Via Test 123',
        notes: 'Test lead notes',
        tags: ['test', 'website'],
        first_contact_date: new Date().toISOString(),
        last_contact_date: '',
        next_followup_date: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
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
        <div className="bg-blue-500/20 border border-gray-200 rounded-lg p-4">
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
