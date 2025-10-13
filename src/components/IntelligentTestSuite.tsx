'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { marketingService } from '@/services/marketingService';
import { 
  saveProjectMain, loadProjectsMain,
  saveTask, loadTasks,
  saveAppointment, loadAppointments,
  financialService
} from '@/lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
  data?: any;
}

interface TestSuite {
  name: string;
  icon: string;
  description: string;
  tests: TestFunction[];
}

interface TestFunction {
  name: string;
  description: string;
  fn: () => Promise<any>;
  category: 'crud' | 'database' | 'ui' | 'integration';
}

export default function IntelligentTestSuite() {
  const [results, setResults] = useState<{ [key: string]: TestResult[] }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    running: 0
  });

  const updateResult = useCallback((suiteId: string, testIndex: number, result: Partial<TestResult>) => {
    setResults(prev => {
      const suiteResults = prev[suiteId] || [];
      const newResults = [...suiteResults];
      newResults[testIndex] = { ...newResults[testIndex], ...result };
      return { ...prev, [suiteId]: newResults };
    });
  }, []);

  const testSuites: { [key: string]: TestSuite } = {
    marketing: {
      name: 'Sistema Marketing',
      icon: '📈',
      description: 'Test completi per campagne e lead marketing',
      tests: [
        {
          name: 'Connessione Database Marketing',
          description: 'Verifica connessione alle tabelle campaigns e leads',
          category: 'database',
          fn: async () => {
            const campaignsTest = await supabase.from('campaigns').select('count').single();
            const leadsTest = await supabase.from('leads').select('count').single();
            return { campaigns: campaignsTest, leads: leadsTest };
          }
        },
        {
          name: 'Caricamento Campagne',
          description: 'Test caricamento dati campagne esistenti',
          category: 'crud',
          fn: async () => {
            const campaigns = await marketingService.getCampaigns();
            return { count: campaigns.length, campaigns: campaigns.slice(0, 3) };
          }
        },
        {
          name: 'Creazione Campagna Test',
          description: 'Test creazione nuova campagna',
          category: 'crud',
          fn: async () => {
            const testCampaign = {
              user_id: 'test-suite',
              name: `Test Campaign ${Date.now()}`,
              description: 'Campagna creata dal test suite',
              type: 'digital' as const,
              status: 'planning' as const,
              priority: 'medium' as const,
              budget: 1000,
              spent_amount: 0,
              currency: 'EUR',
              start_date: new Date().toISOString(),
              campaign_manager: 'Test Suite',
              target_impressions: 10000,
              target_clicks: 500,
              target_conversions: 50,
              actual_impressions: 0,
              actual_clicks: 0,
              actual_conversions: 0,
              notes: 'Test campaign per validazione sistema',
              tags: ['test', 'automated']
            };
            
            const result = await marketingService.createCampaign(testCampaign);
            
            // Cleanup - rimuovi la campagna test
            setTimeout(async () => {
              try {
                await marketingService.deleteCampaign(result.id);
              } catch (e) {
                console.log('Cleanup campaign:', e);
              }
            }, 5000);
            
            return result;
          }
        },
        {
          name: 'Creazione Lead Test',
          description: 'Test creazione nuovo lead',
          category: 'crud',
          fn: async () => {
            const testLead = {
              user_id: 'test-suite',
              first_name: 'Test',
              last_name: 'Lead',
              email: `test-${Date.now()}@example.com`,
              phone: '+39 123 456 7890',
              company: 'Test Company',
              source: 'website' as const,
              status: 'new' as const,
              priority: 'medium' as const,
              score: 75,
              first_contact_date: new Date().toISOString(),
              notes: 'Lead creato dal test suite',
              tags: ['test', 'automated']
            };
            
            const result = await marketingService.createLead(testLead);
            
            // Cleanup - rimuovi il lead test
            setTimeout(async () => {
              try {
                await marketingService.deleteLead(result.id);
              } catch (e) {
                console.log('Cleanup lead:', e);
              }
            }, 5000);
            
            return result;
          }
        },
        {
          name: 'Statistiche Marketing',
          description: 'Test calcolo statistiche e analytics',
          category: 'integration',
          fn: async () => {
            return await marketingService.getMarketingStats();
          }
        }
      ]
    },
    projects: {
      name: 'Gestione Progetti',
      icon: '🚀',
      description: 'Test per progetti e task management',
      tests: [
        {
          name: 'Caricamento Progetti',
          description: 'Test caricamento progetti esistenti',
          category: 'crud',
          fn: async () => {
            const projects = await loadProjectsMain();
            return { count: projects.length, projects: projects.slice(0, 3) };
          }
        },
        {
          name: 'Creazione Progetto Test',
          description: 'Test creazione nuovo progetto',
          category: 'crud',
          fn: async () => {
            const testProject = {
              user_id: 'test-suite',
              name: `Test Project ${Date.now()}`,
              description: 'Progetto creato dal test suite',
              status: 'planning' as const,
              priority: 'medium' as const,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              budget: 5000,
              actual_cost: 0,
              currency: 'EUR',
              project_manager: 'Test Suite',
              team_members: ['test1', 'test2'],
              progress: 0,
              completion_percentage: 0,
              tags: ['test', 'automated'],
              notes: 'Progetto test per validazione sistema'
            };
            
            const result = await saveProjectMain(testProject);
            return result;
          }
        },
        {
          name: 'Caricamento Tasks',
          description: 'Test caricamento task esistenti',
          category: 'crud',
          fn: async () => {
            const tasks = await loadTasks();
            return { count: tasks.length, tasks: tasks.slice(0, 3) };
          }
        }
      ]
    },
    financial: {
      name: 'Gestione Finanziaria',
      icon: '💰',
      description: 'Test per budget, ricavi e costi',
      tests: [
        {
          name: 'Caricamento Budget',
          description: 'Test caricamento budget esistenti',
          category: 'crud',
          fn: async () => {
            const budgets = await financialService.loadBudgets();
            return { count: budgets.length, budgets: budgets.slice(0, 3) };
          }
        },
        {
          name: 'Caricamento Ricavi',
          description: 'Test caricamento ricavi esistenti',
          category: 'crud',
          fn: async () => {
            const revenues = await financialService.loadRevenues();
            return { count: revenues.length, revenues: revenues.slice(0, 3) };
          }
        },
        {
          name: 'Caricamento Costi Variabili',
          description: 'Test caricamento costi variabili',
          category: 'crud',
          fn: async () => {
            const costs = await financialService.loadVariableCosts();
            return { count: costs.length, costs: costs.slice(0, 3) };
          }
        },
        {
          name: 'Creazione Budget Test',
          description: 'Test creazione nuovo budget',
          category: 'crud',
          fn: async () => {
            const testBudget = {
              user_id: 'test-suite',
              name: `Test Budget ${Date.now()}`,
              description: 'Budget creato dal test suite',
              amount: 10000,
              category: 'marketing' as const,
              period_start: new Date().toISOString().split('T')[0],
              period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              is_active: true,
              currency: 'EUR'
            };
            
            const result = await financialService.saveBudget(testBudget);
            return result;
          }
        }
      ]
    },
    database: {
      name: 'Database Connectivity',
      icon: '🗄️',
      description: 'Test connessione e stato database',
      tests: [
        {
          name: 'Test Connessione Supabase',
          description: 'Verifica connessione base al database',
          category: 'database',
          fn: async () => {
            const { data, error } = await supabase.from('campaigns').select('count').limit(1);
            if (error) throw error;
            return { status: 'connected', timestamp: new Date().toISOString() };
          }
        },
        {
          name: 'Verifica Tabelle Principali',
          description: 'Controlla esistenza tabelle core',
          category: 'database',
          fn: async () => {
            const tables = ['campaigns', 'leads', 'projects_main', 'task_calendar_tasks', 'financial_budgets'];
            const results = {};
            
            for (const table of tables) {
              try {
                const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
                results[table] = { exists: !error, count: count || 0 };
              } catch (e) {
                results[table] = { exists: false, error: e.message };
              }
            }
            
            return results;
          }
        },
        {
          name: 'Performance Test',
          description: 'Test velocità query database',
          category: 'database',
          fn: async () => {
            const start = Date.now();
            await supabase.from('campaigns').select('*').limit(10);
            const duration = Date.now() - start;
            
            return { 
              duration: `${duration}ms`, 
              performance: duration < 200 ? 'excellent' : duration < 500 ? 'good' : 'needs_optimization' 
            };
          }
        }
      ]
    }
  };

  const runTest = async (suiteId: string, testIndex: number) => {
    const suite = testSuites[suiteId];
    const test = suite.tests[testIndex];
    
    setRunningTests(prev => new Set([...prev, `${suiteId}-${testIndex}`]));
    
    updateResult(suiteId, testIndex, { 
      name: test.name, 
      status: 'running', 
      message: 'Esecuzione in corso...' 
    });

    const startTime = Date.now();
    
    try {
      const result = await test.fn();
      const duration = Date.now() - startTime;
      
      updateResult(suiteId, testIndex, {
        status: 'success',
        message: 'Test completato con successo',
        duration,
        data: result
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      updateResult(suiteId, testIndex, {
        status: 'error',
        message: error instanceof Error ? error.message : 'Errore sconosciuto',
        duration
      });
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${suiteId}-${testIndex}`);
        return newSet;
      });
    }
  };

  const runAllTestsInSuite = async (suiteId: string) => {
    const suite = testSuites[suiteId];
    
    // Inizializza tutti i test come pending
    const initialResults = suite.tests.map((test, index) => ({
      name: test.name,
      status: 'pending' as const,
      message: 'In attesa di esecuzione'
    }));
    
    setResults(prev => ({ ...prev, [suiteId]: initialResults }));
    
    // Esegui tutti i test in sequenza
    for (let i = 0; i < suite.tests.length; i++) {
      await runTest(suiteId, i);
      // Piccola pausa tra i test
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const runAllTests = async () => {
    const suiteIds = Object.keys(testSuites);
    
    for (const suiteId of suiteIds) {
      await runAllTestsInSuite(suiteId);
      // Pausa tra le suite
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      case 'pending': return '⏸️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🧪 Suite Test Intelligente</h1>
            <p className="text-gray-600 mt-1">Test completi e automatizzati per tutte le funzionalità del dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={runAllTests}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
            >
              🚀 Esegui Tutti i Test
            </button>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(testSuites).map(([suiteId, suite]) => {
          const suiteResults = results[suiteId] || [];
          const passed = suiteResults.filter(r => r.status === 'success').length;
          const failed = suiteResults.filter(r => r.status === 'error').length;
          const running = suiteResults.filter(r => r.status === 'running').length;
          const total = suite.tests.length;
          
          return (
            <div key={suiteId} className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{suite.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{suite.name}</h3>
                    <p className="text-sm text-gray-500">{total} test</p>
                  </div>
                </div>
                <button
                  onClick={() => runAllTestsInSuite(suiteId)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Esegui
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>{passed} Passati</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">❌</span>
                  <span>{failed} Falliti</span>
                </div>
                {running > 0 && (
                  <div className="flex items-center col-span-2">
                    <span className="text-blue-600 mr-2">⏳</span>
                    <span>{running} In esecuzione</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Tabs */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {Object.entries(testSuites).map(([suiteId, suite]) => (
              <button
                key={suiteId}
                onClick={() => setActiveTab(suiteId)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === suiteId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{suite.icon}</span>
                {suite.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab && testSuites[activeTab] && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">{testSuites[activeTab].name}</h3>
                <p className="text-gray-600">{testSuites[activeTab].description}</p>
              </div>

              <div className="space-y-4">
                {testSuites[activeTab].tests.map((test, index) => {
                  const result = results[activeTab]?.[index];
                  const isRunning = runningTests.has(`${activeTab}-${index}`);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{getStatusIcon(result?.status || 'pending')}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{test.name}</h4>
                            <p className="text-sm text-gray-500">{test.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result?.status || 'pending')}`}>
                            {result?.status || 'pending'}
                          </span>
                          <button
                            onClick={() => runTest(activeTab, index)}
                            disabled={isRunning}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
                          >
                            {isRunning ? 'Running...' : 'Run'}
                          </button>
                        </div>
                      </div>
                      
                      {result && (
                        <div className="mt-3 p-3 bg-blue-500/20 rounded">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{result.message}</span>
                            {result.duration && (
                              <span className="text-gray-500">{result.duration}ms</span>
                            )}
                          </div>
                          
                          {result.data && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                Vedi dati risultato
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
