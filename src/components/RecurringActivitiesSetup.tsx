'use client';

import { useState } from 'react';

export default function RecurringActivitiesSetup() {
  const [showInstructions, setShowInstructions] = useState(false);

  const sqlScript = `-- Script per creare le tabelle delle attività ricorrenti
-- Esegui questo script nel SQL Editor di Supabase

-- 1. Crea tabella recurring_activities
CREATE TABLE IF NOT EXISTS recurring_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('weekly', 'monthly')),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    time TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crea tabella weekly_templates
CREATE TABLE IF NOT EXISTS weekly_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crea tabella template_activities
CREATE TABLE IF NOT EXISTS template_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES weekly_templates(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES recurring_activities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Abilita Row Level Security
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_activities ENABLE ROW LEVEL SECURITY;

-- 5. Crea policy per accesso pubblico (per ora)
CREATE POLICY "Enable all access for all users" ON recurring_activities FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON weekly_templates FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON template_activities FOR ALL USING (true);

-- 6. Crea funzioni PL/pgSQL
CREATE OR REPLACE FUNCTION generate_recurring_activities(
    p_start_date DATE,
    p_end_date DATE
) RETURNS INTEGER AS $$
DECLARE
    loop_date DATE;
    activity_record RECORD;
    generated_count INTEGER := 0;
BEGIN
    loop_date := p_start_date;
    
    WHILE loop_date <= p_end_date LOOP
        FOR activity_record IN 
            SELECT * FROM recurring_activities 
            WHERE is_active = true 
            AND (
                (type = 'weekly' AND day_of_week = EXTRACT(DOW FROM loop_date))
                OR 
                (type = 'monthly' AND day_of_month = EXTRACT(DAY FROM loop_date))
            )
        LOOP
            -- Qui potresti inserire le attività generate in una tabella di calendario
            -- Per ora, incrementiamo solo il contatore
            generated_count := generated_count + 1;
        END LOOP;
        
        loop_date := loop_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN generated_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_week_from_template(
    p_template_id UUID,
    p_week_start_date DATE
) RETURNS INTEGER AS $$
DECLARE
    activity_record RECORD;
    generated_count INTEGER := 0;
BEGIN
    FOR activity_record IN 
        SELECT ra.* FROM recurring_activities ra
        JOIN template_activities ta ON ra.id = ta.activity_id
        WHERE ta.template_id = p_template_id
        AND ra.is_active = true
    LOOP
        -- Qui potresti inserire le attività generate in una tabella di calendario
        -- Per ora, incrementiamo solo il contatore
        generated_count := generated_count + 1;
    END LOOP;
    
    RETURN generated_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Inserisci dati di esempio
INSERT INTO recurring_activities (name, description, type, day_of_week, day_of_month, time, duration, category, priority) VALUES
('Standup Meeting', 'Riunione giornaliera del team', 'weekly', 1, NULL, '09:00', 30, 'Lavoro', 'high'),
('Review Code', 'Revisione del codice', 'weekly', 3, NULL, '14:00', 60, 'Lavoro', 'medium'),
('Bollette', 'Pagamento bollette mensili', 'monthly', NULL, 15, '10:00', 30, 'Personale', 'medium'),
('Palestra', 'Allenamento settimanale', 'weekly', 5, NULL, '18:00', 90, 'Salute', 'high'),
('Lettura', 'Lettura di libri tecnici', 'weekly', 0, NULL, '20:00', 60, 'Formazione', 'low');

INSERT INTO weekly_templates (name, description, is_active) VALUES
('Settimana Lavorativa', 'Template per la settimana lavorativa standard', true),
('Settimana Personale', 'Template per attività personali', true),
('Settimana Formazione', 'Template per attività di formazione', true);

-- 8. Collega attività ai template
INSERT INTO template_activities (template_id, activity_id) 
SELECT wt.id, ra.id 
FROM weekly_templates wt, recurring_activities ra 
WHERE wt.name = 'Settimana Lavorativa' 
AND ra.name IN ('Standup Meeting', 'Review Code');

INSERT INTO template_activities (template_id, activity_id) 
SELECT wt.id, ra.id 
FROM weekly_templates wt, recurring_activities ra 
WHERE wt.name = 'Settimana Personale' 
AND ra.name IN ('Bollette', 'Palestra');

INSERT INTO template_activities (template_id, activity_id) 
SELECT wt.id, ra.id 
FROM weekly_templates wt, recurring_activities ra 
WHERE wt.name = 'Settimana Formazione' 
AND ra.name = 'Lettura';`;

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm border border-gray-200 p-6" data-setup-instructions>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">⚙️ Setup Attività Ricorrenti</h2>
          <p className="text-sm text-gray-600 mt-1">
            Istruzioni per configurare le tabelle e funzioni necessarie
          </p>
        </div>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showInstructions ? '📖 Nascondi Istruzioni' : '📖 Mostra Istruzioni'}
        </button>
      </div>

      {showInstructions && (
        <div className="space-y-6">
          {/* Istruzioni */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Istruzioni di Setup</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Apri il <strong>Supabase Dashboard</strong></li>
              <li>Vai alla sezione <strong>SQL Editor</strong></li>
              <li>Copia e incolla lo script SQL qui sotto</li>
              <li>Clicca <strong>Run</strong> per eseguire lo script</li>
              <li>Verifica che non ci siano errori</li>
              <li>Torna qui e esegui i test per verificare la configurazione</li>
            </ol>
          </div>

          {/* Script SQL */}
          <div className="bg-white/30rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">💾 Script SQL Completo</h3>
              <button
                onClick={() => navigator.clipboard.writeText(sqlScript)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                📋 Copia Script
              </button>
            </div>
            <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-96">
              {sqlScript}
            </pre>
          </div>

          {/* Note importanti */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Note Importanti</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              <li>Lo script crea <strong>3 tabelle</strong> principali</li>
              <li>Abilita <strong>Row Level Security</strong> per sicurezza</li>
              <li>Crea <strong>2 funzioni PL/pgSQL</strong> per generazione automatica</li>
              <li>Inserisce <strong>dati di esempio</strong> per test</li>
              <li>Le policy sono configurate per <strong>accesso pubblico</strong> (da modificare in produzione)</li>
            </ul>
          </div>

          {/* Verifica */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">✅ Verifica Setup</h3>
            <p className="text-sm text-green-800 mb-3">
              Dopo aver eseguito lo script, usa i test qui sotto per verificare che tutto funzioni correttamente.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-800">Tabelle create</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-800">Funzioni PL/pgSQL create</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-800">Dati di esempio inseriti</span>
            </div>
          </div>
        </div>
      )}

      {!showInstructions && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">⚙️</div>
          <p>Istruzioni di setup nascoste</p>
          <p className="text-sm mt-1">Clicca "Mostra Istruzioni" per vedere come configurare il database</p>
        </div>
      )}
    </div>
  );
}
