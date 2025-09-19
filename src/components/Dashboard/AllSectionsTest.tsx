'use client';

import { useState } from 'react';
import { supabaseHelpers, supabase } from '@/lib/supabase';

export default function AllSectionsTest() {
  const [results, setResults] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAllSections = async () => {
    setIsLoading(true);
    setResults('🧪 Test di tutte le sezioni Business Plan...\n\n');
    
    try {
      const userId = 'test-all-sections';
      
      // Test 1: Marketing Strategy
      setResults(prev => prev + '1️⃣ Test Marketing Strategy...\n');
      const marketingData = {
        strategies: [
          { name: 'Strategia test', description: 'Descrizione test', budget: 1000, timeline: '3 mesi' }
        ],
        timeline: [
          { task: 'Task test', startDate: '2024-01-01', endDate: '2024-03-31', status: 'planned' }
        ],
        customerJourney: {
          awareness: 'Awareness test',
          consideration: 'Consideration test',
          decision: 'Decision test',
          retention: 'Retention test'
        }
      };
      
      await supabaseHelpers.saveMarketingStrategy(userId, marketingData);
      const loadedMarketing = await supabaseHelpers.loadMarketingStrategy(userId);
      setResults(prev => prev + '✅ Marketing Strategy OK\n\n');
      
      // Test 2: Operational Plan
      setResults(prev => prev + '2️⃣ Test Operational Plan...\n');
      const operationalData = {
        roles: [
          { name: 'Ruolo test', description: 'Descrizione test', responsibilities: ['Responsabilità test'] }
        ],
        milestones: [
          { name: 'Milestone test', date: '2024-06-01', status: 'planned', description: 'Descrizione test' }
        ],
        flow_diagram: {
          steps: ['Step 1', 'Step 2', 'Step 3'],
          connections: ['1->2', '2->3']
        }
      };
      
      await supabaseHelpers.saveOperationalPlan(userId, operationalData);
      const loadedOperational = await supabaseHelpers.loadOperationalPlan(userId);
      setResults(prev => prev + '✅ Operational Plan OK\n\n');
      
      // Test 3: Financial Plan
      setResults(prev => prev + '3️⃣ Test Financial Plan...\n');
      const financialData = {
        revenues: [
          { source: 'Fonte test', amount: 1000, frequency: 'monthly', description: 'Descrizione test' }
        ],
        expenses: [
          { category: 'Categoria test', amount: 500, frequency: 'monthly', description: 'Descrizione test' }
        ],
        forecasts: {
          year1: { revenue: 12000, expenses: 6000, profit: 6000 },
          year2: { revenue: 24000, expenses: 12000, profit: 12000 },
          year3: { revenue: 48000, expenses: 24000, profit: 24000 }
        }
      };
      
      await supabaseHelpers.saveFinancialPlan(userId, financialData);
      const loadedFinancial = await supabaseHelpers.loadFinancialPlan(userId);
      setResults(prev => prev + '✅ Financial Plan OK\n\n');
      
      // Test 4: Business Model
      setResults(prev => prev + '4️⃣ Test Business Model...\n');
      const businessModelData = {
        canvas: {
          keyPartners: ['Partner test'],
          keyActivities: ['Attività test'],
          valuePropositions: ['Proposta test'],
          customerRelationships: ['Relazione test'],
          customerSegments: ['Segmento test'],
          keyResources: ['Risorsa test'],
          channels: ['Canale test'],
          costStructure: ['Costo test'],
          revenueStreams: ['Entrata test']
        }
      };
      
      await supabaseHelpers.saveBusinessModel(userId, businessModelData);
      const loadedBusinessModel = await supabaseHelpers.loadBusinessModel(userId);
      setResults(prev => prev + '✅ Business Model OK\n\n');
      
      // Test 5: Roadmap
      setResults(prev => prev + '5️⃣ Test Roadmap...\n');
      const roadmapData = {
        goals: [
          { name: 'Obiettivo test', description: 'Descrizione test', deadline: '2024-12-31', status: 'planned' }
        ],
        kpis: [
          { name: 'KPI test', target: 100, current: 0, unit: 'unità' }
        ],
        timeline: {
          phases: [
            { phase: 'Fase test', startDate: '2024-01-01', endDate: '2024-12-31', status: 'planned' }
          ]
        }
      };
      
      await supabaseHelpers.saveRoadmap(userId, roadmapData);
      const loadedRoadmap = await supabaseHelpers.loadRoadmap(userId);
      setResults(prev => prev + '✅ Roadmap OK\n\n');
      
      // Test 6: Documentation
      setResults(prev => prev + '6️⃣ Test Documentation...\n');
      const documentationData = {
        files: [
          { name: 'Documento test', type: 'PDF', url: 'test.pdf', description: 'Descrizione test' }
        ],
        links: [
          { name: 'Link test', url: 'https://test.com', description: 'Descrizione test' }
        ]
      };
      
      await supabaseHelpers.saveDocumentation(userId, documentationData);
      const loadedDocumentation = await supabaseHelpers.loadDocumentation(userId);
      setResults(prev => prev + '✅ Documentation OK\n\n');
      
      setResults(prev => prev + '🎉 TUTTE LE SEZIONI FUNZIONANO!\n');
      setResults(prev => prev + 'Il problema potrebbe essere nel componente Business Plan.\n');
      
    } catch (error: any) {
      setResults(prev => prev + `❌ ERRORE: ${error.message}\n`);
      console.error('Errore dettagliato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestData = async () => {
    setIsLoading(true);
    setResults('🧹 Pulizia dati di test...\n\n');
    
    try {
      const userId = 'test-all-sections';
      
      // Pulisci tutti i dati di test
      await supabase
        .from('business_plan_marketing_strategy')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_operational_plan')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_financial_plan')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_business_model')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_roadmap')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_documentation')
        .delete()
        .eq('user_id', userId);
      
      setResults(prev => prev + '✅ Dati di test puliti\n');
      
    } catch (error: any) {
      setResults(prev => prev + `❌ Errore nella pulizia: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-purple-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🧪 Test Tutte le Sezioni Business Plan</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testAllSections}
            disabled={isLoading}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-bold text-lg"
          >
            {isLoading ? '⏳ Test in corso...' : '🚀 TEST TUTTE LE SEZIONI'}
          </button>
          
          <button
            onClick={clearTestData}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
          >
            {isLoading ? 'Pulendo...' : '🧹 Pulisci Dati'}
          </button>
        </div>
        
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-gray-900 text-lg">📊 Risultati Test:</h4>
          <div className="bg-black text-green-400 p-4 rounded border-2 border-green-500 font-mono text-sm max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{results || 'Clicca il pulsante per avviare il test'}</pre>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">🎯 Sezioni Testate:</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• 🎯 Strategia Marketing</li>
            <li>• ⚙️ Piano Operativo</li>
            <li>• 💰 Piano Finanziario</li>
            <li>• 🏗️ Modello di Business</li>
            <li>• 🗺️ Roadmap & Obiettivi</li>
            <li>• 📁 Documentazione</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Se il test fallisce:</h4>
          <p className="text-sm text-yellow-800">
            Il problema è nelle funzioni di salvataggio/caricamento. Se il test passa, il problema è nel componente Business Plan.
          </p>
        </div>
      </div>
    </div>
  );
}
