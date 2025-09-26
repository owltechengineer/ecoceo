'use client';

import React, { useState } from 'react';
import { 
  testTaskCalendarConnection, 
  saveTask, 
  loadTasks, 
  saveAppointment, 
  loadAppointments,
  saveProject,
  loadProjects,
  Task,
  Appointment,
  Project
} from '@/lib/supabase';

export default function TaskCalendarTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: any[] = [];

    try {
      // Test 1: Connessione generale
      console.log('🧪 Test 1: Connessione Task & Calendar...');
      const connectionTest = await testTaskCalendarConnection();
      results.push({
        test: 'Connessione Task & Calendar',
        success: connectionTest.success,
        message: connectionTest.message,
        data: connectionTest.data
      });

      // Test 2: Salvataggio Project
      console.log('🧪 Test 2: Salvataggio Project...');
      try {
        const testProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          name: 'Test Project',
          description: 'Progetto di test per Task & Calendar',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 10000
        };
        
        const savedProject = await saveProject(testProject);
        results.push({
          test: 'Salvataggio Project',
          success: true,
          message: `Project salvato con ID: ${savedProject.id}`,
          data: savedProject
        });

        // Test 3: Salvataggio Task
        console.log('🧪 Test 3: Salvataggio Task...');
        const testTask: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          title: 'Test Task',
          description: 'Task di test per Task & Calendar',
          status: 'pending',
          priority: 'medium',
          assigned_to: 'Test User',
          project_id: savedProject.id,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_hours: 8,
          actual_hours: 0,
          tags: ['test', 'task-calendar'],
          progress_percentage: 0,
          depends_on_tasks: [],
          category: 'development',
          notes: 'Task di test'
        };
        
        const savedTask = await saveTask(testTask);
        results.push({
          test: 'Salvataggio Task',
          success: true,
          message: `Task salvato con ID: ${savedTask.id}`,
          data: savedTask
        });

        // Test 4: Salvataggio Appointment
        console.log('🧪 Test 4: Salvataggio Appointment...');
        const testAppointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          title: 'Test Meeting',
          description: 'Meeting di test per Task & Calendar',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          location: 'Test Location',
          attendees: ['Test User 1', 'Test User 2'],
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium',
          is_recurring: false,
          reminder_minutes: 15,
          meeting_url: 'https://test-meeting.com',
          notes: 'Meeting di test'
        };
        
        const savedAppointment = await saveAppointment(testAppointment);
        results.push({
          test: 'Salvataggio Appointment',
          success: true,
          message: `Appointment salvato con ID: ${savedAppointment.id}`,
          data: savedAppointment
        });

        // Test 5: Caricamento Tasks
        console.log('🧪 Test 5: Caricamento Tasks...');
        const loadedTasks = await loadTasks();
        results.push({
          test: 'Caricamento Tasks',
          success: true,
          message: `Caricati ${loadedTasks.length} tasks`,
          data: loadedTasks.slice(0, 3) // Mostra solo i primi 3
        });

        // Test 6: Caricamento Appointments
        console.log('🧪 Test 6: Caricamento Appointments...');
        const loadedAppointments = await loadAppointments();
        results.push({
          test: 'Caricamento Appointments',
          success: true,
          message: `Caricati ${loadedAppointments.length} appointments`,
          data: loadedAppointments.slice(0, 3) // Mostra solo i primi 3
        });

        // Test 7: Caricamento Projects
        console.log('🧪 Test 7: Caricamento Projects...');
        const loadedProjects = await loadProjects();
        results.push({
          test: 'Caricamento Projects',
          success: true,
          message: `Caricati ${loadedProjects.length} projects`,
          data: loadedProjects.slice(0, 3) // Mostra solo i primi 3
        });

      } catch (error) {
        results.push({
          test: 'Errore durante i test',
          success: false,
          message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          data: null
        });
      }

    } catch (error) {
      results.push({
        test: 'Errore generale',
        success: false,
        message: `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        data: null
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🧪 Test Task & Calendar</h3>
          <p className="text-gray-600 mt-1">
            Test completo per salvataggio e caricamento dati Task & Calendar
          </p>
        </div>
        <button
          onClick={runAllTests}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? '⏳ Test in corso...' : '🚀 Avvia Test Completo'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">📊 Risultati Test</h4>
          
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getStatusIcon(result.success)}</span>
                    <h5 className={`font-medium ${getStatusColor(result.success)}`}>
                      {result.test}
                    </h5>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{result.message}</p>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                        📋 Dettagli Dati
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">📈 Riepilogo</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">
                  ✅ Test Riusciti: {testResults.filter(r => r.success).length}
                </span>
              </div>
              <div>
                <span className="text-red-600 font-medium">
                  ❌ Test Falliti: {testResults.filter(r => !r.success).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Esecuzione test in corso...</p>
        </div>
      )}
    </div>
  );
}
