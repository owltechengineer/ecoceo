'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SectionConfig {
  name: string;
  enabled: boolean;
  description: string;
  tables: string[];
}

interface DatabaseStatus {
  connected: boolean;
  tables: string[];
  errors: string[];
  lastCheck: string;
}

export default function GodPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    tables: [],
    errors: [],
    lastCheck: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verifica password
  const handleLogin = () => {
    if (password === 'admin123') {
      setAuthenticated(true);
      loadSections();
      checkDatabase();
    } else {
      alert('Password errata');
    }
  };

  // Carica sezioni da .env
  const loadSections = async () => {
    const sectionConfigs: SectionConfig[] = [
      {
        name: 'Dashboard',
        enabled: process.env.NEXT_PUBLIC_ENABLE_DASHBOARD === 'true',
        description: 'Panoramica generale del sistema',
        tables: ['dashboard_data', 'quick_tasks', 'recurring_activities']
      },
      {
        name: 'Task e Calendario',
        enabled: process.env.NEXT_PUBLIC_ENABLE_TASKS === 'true',
        description: 'Gestione attività e calendario',
        tables: ['task_calendar_tasks', 'task_calendar_appointments', 'quick_tasks']
      },
      {
        name: 'Marketing',
        enabled: process.env.NEXT_PUBLIC_ENABLE_MARKETING === 'true',
        description: 'Gestione marketing e campagne',
        tables: ['marketing_campaigns', 'marketing_leads', 'marketing_budgets']
      },
      {
        name: 'Progetti',
        enabled: process.env.NEXT_PUBLIC_ENABLE_PROJECTS === 'true',
        description: 'Gestione progetti unificata',
        tables: ['projects']
      },
      {
        name: 'Magazzino',
        enabled: process.env.NEXT_PUBLIC_ENABLE_WAREHOUSE === 'true',
        description: 'Gestione inventario e preventivi',
        tables: ['warehouse_items', 'quotes', 'quote_items']
      },
      {
        name: 'Finanziario',
        enabled: process.env.NEXT_PUBLIC_ENABLE_FINANCIAL === 'true',
        description: 'Gestione finanziaria',
        tables: ['financial_revenues', 'financial_fixed_costs', 'financial_variable_costs']
      },
      {
        name: 'Business Plan',
        enabled: process.env.NEXT_PUBLIC_ENABLE_BUSINESS_PLAN === 'true',
        description: 'Piano aziendale',
        tables: ['business_plan_executive_summary', 'business_plan_market_analysis']
      }
    ];
    
    setSections(sectionConfigs);
  };

  // Controlla stato database
  const checkDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/god/database-status');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      setDbStatus({
        connected: false,
        tables: [],
        errors: [`Errore connessione: ${error}`],
        lastCheck: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  // Crea tabelle mancanti
  const createMissingTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/god/create-tables', {
        method: 'POST'
      });
      const data = await response.json();
      alert(data.message);
      checkDatabase();
    } catch (error) {
      alert(`Errore: ${error}`);
    }
    setLoading(false);
  };

  // Test salvataggio per sezione
  const testSectionSave = async (sectionName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/god/test-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sectionName })
      });
      const data = await response.json();
      alert(`${sectionName}: ${data.message}`);
    } catch (error) {
      alert(`Errore test ${sectionName}: ${error}`);
    }
    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔐 Accesso Admin</h1>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Accedi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚡ God Mode</h1>
          <p className="text-gray-300">Controllo completo del sistema e database</p>
        </div>

        {/* Database Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🗄️ Database Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Connessione:</p>
              <p className={`text-lg ${dbStatus.connected ? 'text-green-400' : 'text-red-400'}`}>
                {dbStatus.connected ? '✅ Connesso' : '❌ Disconnesso'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Tabelle trovate:</p>
              <p className="text-lg text-blue-400">{dbStatus.tables.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Ultimo controllo:</p>
              <p className="text-sm text-gray-300">{dbStatus.lastCheck}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Errori:</p>
              <p className="text-sm text-red-400">{dbStatus.errors.length}</p>
            </div>
          </div>
          
          {dbStatus.errors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-red-400 mb-2">Errori rilevati:</p>
              <ul className="text-sm text-red-300">
                {dbStatus.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={checkDatabase}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              🔄 Ricontrolla
            </button>
            <button
              onClick={createMissingTables}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              🏗️ Crea Tabelle Mancanti
            </button>
          </div>
        </div>

        {/* Sezioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{section.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  section.enabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {section.enabled ? 'Abilitata' : 'Disabilitata'}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{section.description}</p>
              
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Tabelle:</p>
                <div className="flex flex-wrap gap-1">
                  {section.tables.map((table, tableIndex) => (
                    <span key={tableIndex} className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {table}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => testSectionSave(section.name)}
                  disabled={loading || !section.enabled}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  🧪 Test Salvataggio
                </button>
                <button
                  onClick={() => router.push(`/dashboard?section=${section.name.toLowerCase()}`)}
                  disabled={!section.enabled}
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  👁️ Vedi Sezione
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🐛 Debug Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Environment:</p>
              <p className="text-white">{process.env.NODE_ENV}</p>
            </div>
            <div>
              <p className="text-gray-400">Debug Mode:</p>
              <p className="text-white">{process.env.NEXT_PUBLIC_ENABLE_DEBUG ? 'ON' : 'OFF'}</p>
            </div>
            <div>
              <p className="text-gray-400">God Mode:</p>
              <p className="text-white">{process.env.NEXT_PUBLIC_ENABLE_GOD_MODE ? 'ON' : 'OFF'}</p>
            </div>
            <div>
              <p className="text-gray-400">Database Debug:</p>
              <p className="text-white">{process.env.NEXT_PUBLIC_DEBUG_DATABASE ? 'ON' : 'OFF'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
