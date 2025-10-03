import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BusinessPlanUnifiedTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const testSections = [
    {
      id: 'executive-summary',
      name: '📋 Executive Summary',
      testData: {
        content: 'Test Executive Summary Content',
        pitch: 'Test Pitch - 500 characters max',
        documents: []
      }
    },
    {
      id: 'market-analysis',
      name: '📊 Market Analysis',
      testData: {
        demographics: [
          { age: '25-34', percentage: 40, description: 'Young professionals' },
          { age: '35-44', percentage: 35, description: 'Established professionals' }
        ],
        competition: [
          { name: 'Competitor A', marketShare: 30, strength: 'Brand recognition' },
          { name: 'Competitor B', marketShare: 25, strength: 'Price advantage' }
        ],
        swot_analysis: {
          strengths: ['Innovation', 'Team expertise'],
          weaknesses: ['Limited resources', 'New market'],
          opportunities: ['Market growth', 'Technology trends'],
          threats: ['Competition', 'Economic changes']
        }
      }
    },
    {
      id: 'marketing-strategy',
      name: '🎯 Marketing Strategy',
      testData: {
        strategies: [
          { name: 'Digital Marketing', description: 'Online campaigns', budget: 10000 },
          { name: 'Content Marketing', description: 'Blog and social media', budget: 5000 }
        ],
        timeline: [
          { phase: 'Phase 1', duration: '3 months', activities: ['Setup', 'Launch'] },
          { phase: 'Phase 2', duration: '6 months', activities: ['Scale', 'Optimize'] }
        ],
        customer_journey: {
          awareness: 'Social media and ads',
          consideration: 'Website and content',
          decision: 'Free trial and demos',
          retention: 'Customer support and updates'
        }
      }
    },
    {
      id: 'operational-plan',
      name: '⚙️ Operational Plan',
      testData: {
        roles: [
          { title: 'CEO', responsibilities: ['Strategy', 'Leadership'], skills: ['Management', 'Vision'] },
          { title: 'CTO', responsibilities: ['Technology', 'Development'], skills: ['Technical', 'Innovation'] }
        ],
        milestones: [
          { name: 'MVP Launch', date: '2024-06-01', status: 'completed' },
          { name: 'Beta Release', date: '2024-08-01', status: 'in-progress' }
        ],
        flow_diagram: {
          steps: ['Planning', 'Development', 'Testing', 'Launch'],
          connections: ['Planning->Development', 'Development->Testing', 'Testing->Launch']
        }
      }
    },
    {
      id: 'financial-plan',
      name: '💰 Financial Plan',
      testData: {
        revenues: [
          { source: 'Product Sales', amount: 100000, period: 'Year 1' },
          { source: 'Subscriptions', amount: 50000, period: 'Year 1' }
        ],
        expenses: [
          { category: 'Development', amount: 60000, period: 'Year 1' },
          { category: 'Marketing', amount: 30000, period: 'Year 1' }
        ],
        forecasts: {
          year1: { revenue: 150000, expenses: 90000, profit: 60000 },
          year2: { revenue: 300000, expenses: 150000, profit: 150000 }
        }
      }
    },
    {
      id: 'business-model',
      name: '🏗️ Business Model',
      testData: {
        canvas_data: {
          value_proposition: 'Innovative solution for modern businesses',
          customer_segments: ['SMEs', 'Startups', 'Enterprises'],
          channels: ['Online', 'Partnerships', 'Direct sales'],
          customer_relationships: ['Self-service', 'Personal assistance'],
          revenue_streams: ['Product sales', 'Subscriptions', 'Services'],
          key_resources: ['Technology', 'Team', 'IP'],
          key_activities: ['Development', 'Marketing', 'Support'],
          key_partnerships: ['Technology partners', 'Distributors'],
          cost_structure: ['Development', 'Marketing', 'Operations']
        }
      }
    },
    {
      id: 'roadmap',
      name: '🗺️ Roadmap & Objectives',
      testData: {
        goals: [
          { name: 'Launch MVP', target: '2024-06-01', status: 'completed' },
          { name: 'Reach 1000 users', target: '2024-12-01', status: 'in-progress' }
        ],
        kpis: [
          { name: 'User Growth', target: 1000, current: 250, unit: 'users' },
          { name: 'Revenue', target: 100000, current: 25000, unit: 'EUR' }
        ],
        timeline: {
          q1_2024: ['Planning', 'Development start'],
          q2_2024: ['MVP launch', 'Beta testing'],
          q3_2024: ['Full launch', 'Marketing campaign'],
          q4_2024: ['Scale', 'Feature expansion']
        }
      }
    },
    {
      id: 'documentation',
      name: '📁 Documentation',
      testData: {
        files: [
          { name: 'Business Plan.pdf', type: 'pdf', size: '2.5MB', uploaded: '2024-01-15' },
          { name: 'Financial Model.xlsx', type: 'excel', size: '1.2MB', uploaded: '2024-01-20' }
        ],
        links: [
          { name: 'Company Website', url: 'https://example.com', description: 'Main company website' },
          { name: 'Product Demo', url: 'https://demo.example.com', description: 'Interactive product demo' }
        ]
      }
    }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    const results: any = {};
    
    for (const section of testSections) {
      setCurrentTest(section.name);
      
      try {
        // Test salvataggio
        const saveResult = await testSave(section.id, section.testData);
        results[section.id] = {
          ...saveResult,
          section: section.name
        };
        
        // Test caricamento
        const loadResult = await testLoad(section.id);
        results[section.id] = {
          ...results[section.id],
          ...loadResult
        };
        
      } catch (error) {
        results[section.id] = {
          section: section.name,
          saveSuccess: false,
          saveError: error instanceof Error ? error.message : 'Errore sconosciuto',
          loadSuccess: false,
          loadError: 'Test non eseguito a causa di errore di salvataggio'
        };
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
  };

  const testSave = async (sectionId: string, testData: any) => {
    try {
      let result;
      
      switch (sectionId) {
        case 'executive-summary':
          result = await supabase
            .from('business_plan_executive_summary')
            .upsert({
              user_id: 'test-user',
              content: testData.content,
              pitch: testData.pitch,
              documents: testData.documents
            }, { onConflict: 'user_id' });
          break;
          
        case 'market-analysis':
          result = await supabase
            .from('business_plan_market_analysis')
            .upsert({
              user_id: 'test-user',
              demographics: testData.demographics,
              competition: testData.competition,
              swot_analysis: testData.swot_analysis
            }, { onConflict: 'user_id' });
          break;
          
        case 'marketing-strategy':
          result = await supabase
            .from('business_plan_marketing_strategy')
            .upsert({
              user_id: 'test-user',
              strategies: testData.strategies,
              timeline: testData.timeline,
              customer_journey: testData.customer_journey
            }, { onConflict: 'user_id' });
          break;
          
        case 'operational-plan':
          result = await supabase
            .from('business_plan_operational_plan')
            .upsert({
              user_id: 'test-user',
              roles: testData.roles,
              milestones: testData.milestones,
              flow_diagram: testData.flow_diagram
            }, { onConflict: 'user_id' });
          break;
          
        case 'financial-plan':
          result = await supabase
            .from('business_plan_financial_plan')
            .upsert({
              user_id: 'test-user',
              revenues: testData.revenues,
              expenses: testData.expenses,
              forecasts: testData.forecasts
            }, { onConflict: 'user_id' });
          break;
          
        case 'business-model':
          result = await supabase
            .from('business_plan_business_model')
            .upsert({
              user_id: 'test-user',
              canvas_data: testData.canvas_data
            }, { onConflict: 'user_id' });
          break;
          
        case 'roadmap':
          result = await supabase
            .from('business_plan_roadmap')
            .upsert({
              user_id: 'test-user',
              goals: testData.goals,
              kpis: testData.kpis,
              timeline: testData.timeline
            }, { onConflict: 'user_id' });
          break;
          
        case 'documentation':
          result = await supabase
            .from('business_plan_documentation')
            .upsert({
              user_id: 'test-user',
              files: testData.files,
              links: testData.links
            }, { onConflict: 'user_id' });
          break;
          
        default:
          throw new Error(`Sezione non riconosciuta: ${sectionId}`);
      }
      
      if (result.error) {
        throw new Error(`Errore salvataggio ${sectionId}: ${result.error.message}`);
      }
      
      return {
        saveSuccess: true,
        saveMessage: '✅ Salvataggio riuscito'
      };
      
    } catch (error) {
      return {
        saveSuccess: false,
        saveError: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  };

  const testLoad = async (sectionId: string) => {
    try {
      let result;
      
      switch (sectionId) {
        case 'executive-summary':
          result = await supabase
            .from('business_plan_executive_summary')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'market-analysis':
          result = await supabase
            .from('business_plan_market_analysis')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'marketing-strategy':
          result = await supabase
            .from('business_plan_marketing_strategy')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'operational-plan':
          result = await supabase
            .from('business_plan_operational_plan')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'financial-plan':
          result = await supabase
            .from('business_plan_financial_plan')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'business-model':
          result = await supabase
            .from('business_plan_business_model')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'roadmap':
          result = await supabase
            .from('business_plan_roadmap')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        case 'documentation':
          result = await supabase
            .from('business_plan_documentation')
            .select('*')
            .eq('user_id', 'test-user')
            .single();
          break;
          
        default:
          throw new Error(`Sezione non riconosciuta: ${sectionId}`);
      }
      
      if (result.error) {
        throw new Error(`Errore caricamento ${sectionId}: ${result.error.message}`);
      }
      
      return {
        loadSuccess: true,
        loadMessage: '✅ Caricamento riuscito',
        loadedData: result.data
      };
      
    } catch (error) {
      return {
        loadSuccess: false,
        loadError: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          🧪 Test Unificato Business Plan
        </h2>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? '⏳ Test in corso...' : '🚀 Avvia Test Completo'}
        </button>
      </div>

      {currentTest && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            🔄 Testando: {currentTest}
          </p>
        </div>
      )}

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Risultati Test
          </h3>
          
          {testSections.map((section) => {
            const result = testResults[section.id];
            if (!result) return null;
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    {section.name}
                  </h4>
                  <div className="flex space-x-4">
                    <span className={`font-medium ${getStatusColor(result.saveSuccess)}`}>
                      {getStatusIcon(result.saveSuccess)} Salvataggio
                    </span>
                    <span className={`font-medium ${getStatusColor(result.loadSuccess)}`}>
                      {getStatusIcon(result.loadSuccess)} Caricamento
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Salvataggio */}
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <h5 className="font-medium text-gray-900 mb-2">💾 Salvataggio</h5>
                    {result.saveSuccess ? (
                      <p className="text-green-600 text-sm">{result.saveMessage}</p>
                    ) : (
                      <p className="text-red-600 text-sm">{result.saveError}</p>
                    )}
                  </div>
                  
                  {/* Caricamento */}
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <h5 className="font-medium text-gray-900 mb-2">📥 Caricamento</h5>
                    {result.loadSuccess ? (
                      <p className="text-green-600 text-sm">{result.loadMessage}</p>
                    ) : (
                      <p className="text-red-600 text-sm">{result.loadError}</p>
                    )}
                  </div>
                </div>
                
                {result.loadSuccess && result.loadedData && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h6 className="font-medium text-green-800 mb-2">📋 Dati Caricati</h6>
                    <pre className="text-xs text-green-700 bg-white/30 backdrop-blur/30 backdrop-blurp-2 rounded border overflow-auto max-h-32">
                      {JSON.stringify(result.loadedData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Riepilogo */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">📈 Riepilogo Test</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(testResults).filter((r: any) => r.saveSuccess).length}
                </p>
                <p className="text-sm text-gray-600">Salvataggi Riusciti</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter((r: any) => !r.saveSuccess).length}
                </p>
                <p className="text-sm text-gray-600">Salvataggi Falliti</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter((r: any) => r.loadSuccess).length}
                </p>
                <p className="text-sm text-gray-600">Caricamenti Riusciti</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {Object.values(testResults).filter((r: any) => !r.loadSuccess).length}
                </p>
                <p className="text-sm text-gray-600">Caricamenti Falliti</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
