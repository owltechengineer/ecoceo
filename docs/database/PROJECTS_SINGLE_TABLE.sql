-- =====================================================
-- PROGETTI - TABELLA SINGOLA COMPLETA
-- =====================================================
-- Una sola tabella per tutti i progetti con tutti i campi richiesti
-- =====================================================

-- Elimina tabelle progetti esistenti
DROP TABLE IF EXISTS project_risks CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_team CASCADE;
DROP TABLE IF EXISTS project_budget CASCADE;
DROP TABLE IF EXISTS project_objectives CASCADE;
DROP TABLE IF EXISTS projects_main CASCADE;

-- Crea tabella progetti unificata
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    
    -- 1. Titolo del progetto
    title VARCHAR(255) NOT NULL,
    
    -- 2. Obiettivo principale
    main_objective TEXT NOT NULL,
    
    -- 3. Problema che risolve
    problem_solved TEXT NOT NULL,
    
    -- 4. Descrizione dell'idea / soluzione proposta
    solution_description TEXT NOT NULL,
    
    -- 5. Target di riferimento / Clienti
    target_audience TEXT,
    target_customers TEXT,
    
    -- 6. Analisi di mercato / concorrenza
    market_analysis TEXT,
    competition_analysis TEXT,
    
    -- 7. Modello di business
    business_model TEXT,
    
    -- 8. Tecnologie utilizzate
    technologies_used TEXT,
    
    -- 9. Struttura del team / ruoli
    team_structure TEXT,
    team_roles TEXT,
    
    -- 10. Processi operativi
    operational_processes TEXT,
    
    -- 11. Piano di sviluppo / fasi del progetto
    development_plan TEXT,
    project_phases TEXT,
    
    -- 12. Budget e risorse necessarie
    budget_required DECIMAL(15,2) DEFAULT 0,
    resources_needed TEXT,
    
    -- 13. Fonti di finanziamento
    funding_sources TEXT,
    
    -- 14. Strategia di vendita / marketing
    sales_strategy TEXT,
    marketing_strategy TEXT,
    
    -- 15. Canali di distribuzione
    distribution_channels TEXT,
    
    -- 16. Previsioni economiche (ROI, break-even)
    roi_forecast DECIMAL(8,2) DEFAULT 0,
    break_even_analysis TEXT,
    economic_forecasts TEXT,
    
    -- 17. Analisi dei rischi
    risk_analysis TEXT,
    
    -- 18. Aspetti legali e normativi
    legal_aspects TEXT,
    regulatory_compliance TEXT,
    
    -- 19. Metriche di successo / KPI
    success_metrics TEXT,
    kpis TEXT,
    
    -- 20. Timeline e roadmap
    timeline TEXT,
    roadmap TEXT,
    
    -- Campi di gestione
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'planning', 'active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Note aggiuntive
    notes TEXT,
    tags TEXT[] DEFAULT '{}'
);

-- Crea indici per performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Abilita RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Crea policy
CREATE POLICY "Allow all operations for now" ON projects FOR ALL USING (true);

-- Crea trigger per updated_at
CREATE TRIGGER update_projects_updated_at 
BEFORE UPDATE ON projects 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserisci dati di esempio
INSERT INTO projects (
    user_id, title, main_objective, problem_solved, solution_description,
    target_audience, market_analysis, business_model, technologies_used,
    team_structure, operational_processes, development_plan, budget_required,
    funding_sources, sales_strategy, distribution_channels, roi_forecast,
    risk_analysis, legal_aspects, success_metrics, timeline, status, priority
) VALUES (
    'default-user',
    'App Mobile per Gestione Inventario',
    'Creare un\'applicazione mobile per la gestione intelligente dell\'inventario aziendale',
    'Le aziende hanno difficoltà nel tracciare l\'inventario in tempo reale, causando sprechi e inefficienze',
    'Sviluppo di un\'app mobile con scanner QR, AI per previsioni e integrazione con sistemi esistenti',
    'PMI e grandi aziende con gestione inventario complessa',
    'Mercato in crescita del 15% annuo, concorrenza moderata con focus su nicchie specifiche',
    'SaaS con abbonamento mensile + commissioni su transazioni',
    'React Native, Node.js, PostgreSQL, AWS, TensorFlow per AI',
    'Team di 8 persone: 3 dev, 1 designer, 1 PM, 1 AI specialist, 1 sales, 1 marketing',
    'Sviluppo agile con sprint di 2 settimane, testing continuo, deployment automatico',
    'Fase 1: MVP (3 mesi), Fase 2: AI features (2 mesi), Fase 3: Scale (3 mesi)',
    150000.00,
    'Seed funding 200k, revenue-based financing 100k',
    'Direct sales B2B, partnership con consulenti, freemium model',
    'App stores, website, partner channels, enterprise sales',
    25.5,
    'Rischi tecnici: complessità AI. Rischi business: adozione lenta. Mitigazione: pilot program',
    'GDPR compliance, certificazioni sicurezza, contratti enterprise',
    'MAU, retention rate 80%, NPS >50, revenue growth 20% mese',
    'Q1: MVP, Q2: AI beta, Q3: Launch, Q4: Scale',
    'planning',
    'high'
),
(
    'default-user',
    'Piattaforma E-learning B2B',
    'Sviluppare una piattaforma di e-learning specializzata per formazione aziendale',
    'Mancanza di soluzioni e-learning specifiche per esigenze aziendali complesse',
    'Piattaforma SaaS con contenuti personalizzabili, analytics avanzate e integrazione HR',
    'Aziende 50-5000 dipendenti, settore formazione',
    'Mercato e-learning B2B in crescita 20% annuo, competitor principali: Cornerstone, Docebo',
    'Freemium + tier enterprise, revenue sharing con content creators',
    'Vue.js, Laravel, MySQL, Redis, AWS, WebRTC per video',
    'Team di 12: 4 dev, 2 designer, 1 UX, 1 content specialist, 2 sales, 1 marketing, 1 support',
    'Scrum con release mensili, customer feedback loop, A/B testing',
    'Fase 1: Core platform (4 mesi), Fase 2: Advanced features (3 mesi), Fase 3: Enterprise (3 mesi)',
    300000.00,
    'Series A 500k, grants 50k, revenue reinvestment',
    'Inbound marketing, content marketing, partnership HR software',
    'Direct sales, partner channel, self-service, enterprise',
    18.2,
    'Rischi: competizione forte, complessità tecnica video. Mitigazione: focus su nicchia',
    'Privacy compliance, accessibility standards, enterprise security',
    'User engagement, course completion rate 85%, customer LTV, churn <5%',
    'Q1: MVP, Q2: Beta customers, Q3: Public launch, Q4: Enterprise features',
    'active',
    'medium'
);

-- Verifica creazione
SELECT 
    'Projects table created successfully' as status,
    COUNT(*) as projects_count
FROM projects;

-- =====================================================
-- PROGETTI SINGOLA TABELLA COMPLETATA
-- =====================================================
-- Una tabella unificata con tutti i 20 campi richiesti
-- =====================================================
