"use client";

import { useState } from 'react';

const CalendarQuickFix = () => {
  const [copied, setCopied] = useState(false);

  const generateSQL = () => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ ERRORE CALENDAR: Colonne mancanti
          </h3>
          <p className="text-red-700 text-sm">
            Le tabelle del calendario non hanno le colonne corrette. 
            Clicca il pulsante per generare lo script SQL di correzione.
          </p>
        </div>
        <button
          onClick={generateSQL}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {copied ? '✅ Copiato!' : '🔧 Genera Script SQL'}
        </button>
      </div>
      
      {copied && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 text-sm">
            ✅ <strong>Script copiato negli appunti!</strong><br/>
            📋 <strong>ISTRUZIONI:</strong><br/>
            1. Vai su Supabase → SQL Editor<br/>
            2. Incolla lo script (Ctrl+V)<br/>
            3. Clicca "Run"<br/>
            4. Ricarica la pagina
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarQuickFix;
