"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const CalendarTablesDiagnostic = () => {
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkCalendarTables = async () => {
    setLoading(true);
    try {
      const tables = [
        'task_calendar_appointments',
        'task_calendar_tasks',
        'recurring_activities'
      ];

      const results = await Promise.all(
        tables.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            return {
              table,
              exists: !error,
              error: error?.message || null,
              columns: data ? Object.keys(data[0] || {}) : []
            };
          } catch (err) {
            return {
              table,
              exists: false,
              error: err instanceof Error ? err.message : 'Errore sconosciuto',
              columns: []
            };
          }
        })
      );

      setDiagnostic({
        tables: results,
        missingTables: results.filter(r => !r.exists),
        existingTables: results.filter(r => r.exists)
      });

    } catch (error) {
      console.error('Errore diagnostica Calendar Tables:', error);
      setDiagnostic({ error: error instanceof Error ? error.message : 'Errore sconosciuto' });
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarSQL = () => {
    const sql = `-- CALENDAR TABLES QUICK FIX
-- Esegui questo script in Supabase SQL Editor

-- 1. TASK CALENDAR APPOINTMENTS (CON COLONNE CORRETTE)
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
    recurring_interval INTEGER DEFAULT 1, -- ogni X giorni/settimane/mesi
    recurring_end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    attendees TEXT[] DEFAULT '{}',
    meeting_type TEXT, -- 'meeting', 'call', 'training', 'workshop'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TASK CALENDAR TASKS
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    assigned_to TEXT,
    project_id UUID,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RECURRING ACTIVITIES
CREATE TABLE IF NOT EXISTS recurring_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
    interval_value INTEGER DEFAULT 1,
    time_of_day TIME,
    duration_minutes INTEGER DEFAULT 60,
    days_of_week INTEGER[] DEFAULT '{}', -- 0=domenica, 1=lunedì, etc.
    day_of_month INTEGER,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
    category TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRIGGER PER UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS
DROP TRIGGER IF EXISTS update_appointments_updated_at ON task_calendar_appointments;
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON task_calendar_appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON task_calendar_tasks;
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON task_calendar_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON recurring_activities;
CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON recurring_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS POLICIES
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;

-- Policy temporanee per permettere accesso completo
DROP POLICY IF EXISTS "Tutti possono gestire appointments" ON task_calendar_appointments;
CREATE POLICY "Tutti possono gestire appointments" ON task_calendar_appointments FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire tasks" ON task_calendar_tasks;
CREATE POLICY "Tutti possono gestire tasks" ON task_calendar_tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire activities" ON recurring_activities;
CREATE POLICY "Tutti possono gestire activities" ON recurring_activities FOR ALL USING (true);

-- Verifica finale
SELECT 'Setup completato! Tabelle Calendar create con colonne corrette' as status;`;

    navigator.clipboard.writeText(sql);
    alert('✅ Script SQL copiato negli appunti!\n\n📋 ISTRUZIONI:\n1. Vai su Supabase → SQL Editor\n2. Incolla lo script\n3. Clicca "Run"\n4. Torna qui e clicca "Verifica di nuovo"');
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blur p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔍 Diagnostica Tabelle Calendar
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={checkCalendarTables}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔍 Controllando...' : '🔍 Esegui Diagnosi'}
        </button>

        {diagnostic && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Risultati Diagnosi:</h4>
            
            {diagnostic.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800">❌ Errore: {diagnostic.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-800">
                    ✅ Tabelle esistenti: {diagnostic.existingTables?.length || 0}/3
                  </p>
                </div>
                
                {diagnostic.missingTables && diagnostic.missingTables.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-yellow-800">
                      ⚠️ Tabelle mancanti: {diagnostic.missingTables.length}
                    </p>
                    <ul className="mt-2 text-sm">
                      {diagnostic.missingTables.map((table: any) => (
                        <li key={table.table} className="text-yellow-700">
                          • {table.table}: {table.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {diagnostic.missingTables && diagnostic.missingTables.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <button
                      onClick={generateCalendarSQL}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      🔧 Genera Script SQL
                    </button>
                    <p className="text-blue-800 text-sm mt-2">
                      Clicca per generare lo script SQL con le colonne corrette
                    </p>
                  </div>
                )}

                <div className="bg-white/30border border-gray-200 rounded p-3">
                  <h5 className="font-semibold text-gray-900 mb-2">📋 Colonne Trovate:</h5>
                  {diagnostic.tables?.map((table: any) => (
                    <div key={table.table} className="mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {table.exists ? '✅' : '❌'} {table.table}
                      </p>
                      {table.columns.length > 0 && (
                        <p className="text-xs text-gray-600 ml-4">
                          Colonne: {table.columns.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTablesDiagnostic;
