-- =====================================================
-- TUTTI I DATI DI TEST CORRETTI - VERSIONE FINALE
-- =====================================================
-- Questo file contiene tutti i dati di test con nomi di tabelle e campi corretti
-- Basato su COMPLETE_DATABASE_ALL_TABLES.sql e CREATE_PROJECT_TABLES.sql
-- =====================================================

-- =====================================================
-- PROGETTI DI TEST (TASK_CALENDAR_PROJECTS)
-- =====================================================

INSERT INTO task_calendar_projects (
    id, user_id, name, description, status, priority, start_date, end_date, 
    budget, spent, progress
) VALUES 
(
    'aae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Sviluppo App Mobile', 
    'Sviluppo di un''applicazione mobile per iOS e Android', 
    'active', 
    'high', 
    '2024-02-01T00:00:00Z', 
    '2024-06-30T23:59:59Z', 
    50000.00, 
    15000.00, 
    30
),
(
    'bae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Sistema CRM', 
    'Implementazione di un sistema CRM personalizzato', 
    'active', 
    'medium', 
    '2024-03-01T00:00:00Z', 
    '2024-08-31T23:59:59Z', 
    75000.00, 
    25000.00, 
    45
),
(
    'cae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Sito Web Aziendale', 
    'Redesign completo del sito web aziendale', 
    'completed', 
    'low', 
    '2024-01-01T00:00:00Z', 
    '2024-02-28T23:59:59Z', 
    25000.00, 
    25000.00, 
    100
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PROGETTI DI TEST (PROJECTS)
-- =====================================================

INSERT INTO projects (
    id, user_id, name, description, status, priority, start_date, end_date, 
    budget, project_manager, team_members, tags, notes
) VALUES 
(
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Progetto Alpha', 
    'Progetto di sviluppo software per clienti enterprise', 
    'active', 
    'high', 
    '2024-02-01', 
    '2024-12-31', 
    100000.00, 
    'Mario Rossi', 
    '{"Giulia Bianchi", "Luca Verdi"}', 
    '{"enterprise", "software", "development"}', 
    'Progetto prioritario per il Q1 2024'
),
(
    'eae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Progetto Beta', 
    'Progetto di ricerca e sviluppo per nuove tecnologie', 
    'planning', 
    'medium', 
    '2024-03-01', 
    '2024-09-30', 
    75000.00, 
    'Anna Neri', 
    '{"Marco Blu", "Sara Verde"}', 
    '{"research", "innovation", "technology"}', 
    'Progetto di innovazione per il futuro'
),
(
    'fae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user', 
    'Progetto Gamma', 
    'Progetto di migrazione cloud per infrastruttura IT', 
    'completed', 
    'low', 
    '2024-01-01', 
    '2024-02-29', 
    50000.00, 
    'Paolo Gialli', 
    '{"Roberto Rossi", "Elena Bianchi"}', 
    '{"cloud", "migration", "infrastructure"}', 
    'Progetto completato con successo'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TASK DI TEST (TASK_CALENDAR_TASKS)
-- =====================================================

INSERT INTO task_calendar_tasks (
    id, user_id, title, description, status, priority, 
    assigned_to, due_date, category, project_id
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440201', 
    'default-user', 
    'Analisi Requisiti', 
    'Analisi dettagliata dei requisiti per l''app mobile', 
    'in_progress', 
    'high', 
    'Mario Rossi', 
    '2024-02-15T23:59:59Z', 
    'analysis', 
    'aae04797-b80a-408e-9017-11dc2aa459ed'
),
(
    '550e8400-e29b-41d4-a716-446655440202', 
    'default-user', 
    'Design UI/UX', 
    'Creazione del design dell''interfaccia utente', 
    'pending', 
    'medium', 
    'Giulia Bianchi', 
    '2024-02-28T23:59:59Z', 
    'design', 
    'aae04797-b80a-408e-9017-11dc2aa459ed'
),
(
    '550e8400-e29b-41d4-a716-446655440203', 
    'default-user', 
    'Setup Database', 
    'Configurazione del database per il sistema CRM', 
    'in_progress', 
    'high', 
    'Luca Verdi', 
    '2024-03-10T23:59:59Z', 
    'development', 
    'bae04797-b80a-408e-9017-11dc2aa459ed'
),
(
    '550e8400-e29b-41d4-a716-446655440204', 
    'default-user', 
    'Implementazione API', 
    'Sviluppo delle API REST per il CRM', 
    'pending', 
    'medium', 
    'Anna Neri', 
    '2024-03-20T23:59:59Z', 
    'development', 
    'bae04797-b80a-408e-9017-11dc2aa459ed'
),
(
    '550e8400-e29b-41d4-a716-446655440205', 
    'default-user', 
    'Test Finali', 
    'Test di accettazione del sito web', 
    'completed', 
    'low', 
    'Paolo Gialli', 
    '2024-02-25T23:59:59Z', 
    'testing', 
    'cae04797-b80a-408e-9017-11dc2aa459ed'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- APPOINTMENTS DI TEST (TASK_CALENDAR_APPOINTMENTS)
-- =====================================================

INSERT INTO task_calendar_appointments (
    id, user_id, title, description, start_time, end_time, location, 
    attendees, status
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440301', 
    'default-user', 
    'Meeting Progetto Alpha', 
    'Riunione settimanale per il progetto Alpha', 
    '2024-02-15T10:00:00Z', 
    '2024-02-15T11:00:00Z', 
    'Sala Riunioni A', 
    '{"Mario Rossi", "Giulia Bianchi", "Luca Verdi"}', 
    'scheduled'
),
(
    '550e8400-e29b-41d4-a716-446655440302', 
    'default-user', 
    'Demo Clienti', 
    'Presentazione del sistema CRM ai clienti', 
    '2024-02-20T14:00:00Z', 
    '2024-02-20T16:00:00Z', 
    'Sala Conferenze', 
    '{"Anna Neri", "Marco Blu", "Clienti"}', 
    'scheduled'
),
(
    '550e8400-e29b-41d4-a716-446655440303', 
    'default-user', 
    'Training Team', 
    'Formazione del team su nuove tecnologie', 
    '2024-02-25T09:00:00Z', 
    '2024-02-25T17:00:00Z', 
    'Aula Formazione', 
    '{"Tutto il team"}', 
    'scheduled'
),
(
    '550e8400-e29b-41d4-a716-446655440304', 
    'default-user', 
    'Review Codice', 
    'Review del codice per il progetto Beta', 
    '2024-03-01T15:00:00Z', 
    '2024-03-01T17:00:00Z', 
    'Sala Sviluppo', 
    '{"Sara Verde", "Roberto Rossi"}', 
    'scheduled'
),
(
    '550e8400-e29b-41d4-a716-446655440305', 
    'default-user', 
    'Meeting Clienti', 
    'Incontro con i clienti per feedback', 
    '2024-03-05T11:00:00Z', 
    '2024-03-05T12:30:00Z', 
    'Ufficio Clienti', 
    '{"Paolo Gialli", "Elena Bianchi", "Clienti"}', 
    'scheduled'
),
(
    '550e8400-e29b-41d4-a716-446655440306', 
    'default-user', 
    'Planning Sprint', 
    'Pianificazione del prossimo sprint', 
    '2024-03-10T09:00:00Z', 
    '2024-03-10T10:30:00Z', 
    'Sala Agile', 
    '{"Tutto il team"}', 
    'scheduled'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ATTIVITÀ RICORRENTI DI TEST (RECURRING_ACTIVITIES)
-- =====================================================

INSERT INTO recurring_activities (
    id, user_id, name, description, frequency, start_date, end_date, 
    status, assigned_to
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440401', 
    'default-user', 
    'Backup Database', 
    'Backup automatico del database di produzione', 
    'daily', 
    '2024-02-01T02:00:00Z', 
    '2024-12-31T23:59:59Z', 
    'active', 
    'Anna Neri'
),
(
    '550e8400-e29b-41d4-a716-446655440402', 
    'default-user', 
    'Review Codice', 
    'Review settimanale del codice del team', 
    'weekly', 
    '2024-02-01T16:00:00Z', 
    '2024-12-31T23:59:59Z', 
    'active', 
    'Luca Verdi'
),
(
    '550e8400-e29b-41d4-a716-446655440403', 
    'default-user', 
    'Report Mensile', 
    'Generazione report mensile per la direzione', 
    'monthly', 
    '2024-02-01T09:00:00Z', 
    '2024-12-31T23:59:59Z', 
    'active', 
    'Mario Rossi'
),
(
    '550e8400-e29b-41d4-a716-446655440404', 
    'default-user', 
    'Sicurezza IT', 
    'Controllo sicurezza e aggiornamenti sistema', 
    'weekly', 
    '2024-02-01T10:00:00Z', 
    '2024-12-31T23:59:59Z', 
    'active', 
    'Paolo Gialli'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- QUICK TASKS DI TEST (QUICK_TASKS)
-- =====================================================

INSERT INTO quick_tasks (
    id, user_id, type, title, description, stakeholder, priority, status, due_date
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440501', 
    'default-user', 
    'document', 
    'Aggiornare documentazione', 
    'Aggiornare la documentazione del progetto', 
    'Mario Rossi',
    'medium', 
    'pending', 
    '2024-02-18T23:59:59Z'
),
(
    '550e8400-e29b-41d4-a716-446655440502', 
    'default-user', 
    'reminder', 
    'Eseguire test unitari', 
    'Eseguire tutti i test unitari per il modulo CRM', 
    'Giulia Bianchi',
    'high', 
    'pending', 
    '2024-02-20T23:59:59Z'
),
(
    '550e8400-e29b-41d4-a716-446655440503', 
    'default-user', 
    'document', 
    'Code review', 
    'Review del codice per il modulo mobile', 
    'Luca Verdi',
    'medium', 
    'pending', 
    '2024-02-22T23:59:59Z'
),
(
    '550e8400-e29b-41d4-a716-446655440504', 
    'default-user', 
    'order', 
    'Deploy in produzione', 
    'Deploy della versione 1.2 in produzione', 
    'Anna Neri',
    'high', 
    'pending', 
    '2024-02-25T23:59:59Z'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CAMPAGNE MARKETING DI TEST (CAMPAIGNS)
-- =====================================================

INSERT INTO campaigns (
    id, user_id, name, description, type, status, priority, budget, spent_amount, 
    currency, start_date, end_date, campaign_manager, target_impressions, 
    target_clicks, target_conversions
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440601', 
    'default-user', 
    'Campagna Q1 2024', 
    'Campagna marketing per il primo trimestre 2024', 
    'digital', 
    'active', 
    'high', 
    50000.00, 
    25000.00, 
    'EUR', 
    '2024-01-01T00:00:00Z', 
    '2024-03-31T23:59:59Z', 
    'Mario Rossi', 
    100000, 
    5000, 
    250
),
(
    '550e8400-e29b-41d4-a716-446655440602', 
    'default-user', 
    'Lancio App Mobile', 
    'Campagna per il lancio della nuova app mobile', 
    'social', 
    'active', 
    'high', 
    30000.00, 
    15000.00, 
    'EUR', 
    '2024-02-01T00:00:00Z', 
    '2024-04-30T23:59:59Z', 
    'Giulia Bianchi', 
    50000, 
    3000, 
    150
),
(
    '550e8400-e29b-41d4-a716-446655440603', 
    'default-user', 
    'Retargeting E-commerce', 
    'Campagna di retargeting per utenti e-commerce', 
    'other', 
    'paused', 
    'medium', 
    15000.00, 
    8000.00, 
    'EUR', 
    '2024-01-15T00:00:00Z', 
    '2024-02-28T23:59:59Z', 
    'Luca Verdi', 
    25000, 
    1500, 
    75
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LEAD DI TEST (LEADS)
-- =====================================================

INSERT INTO leads (
    id, user_id, first_name, last_name, email, phone, company, job_title, 
    source, status, priority, score, first_contact_date, last_contact_date, notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440701', 
    'default-user', 
    'Marco', 
    'Rossi', 
    'marco.rossi@email.com', 
    '+39 333 123 4567', 
    'TechCorp SRL', 
    'CEO', 
    'website', 
    'new', 
    'high', 
    85, 
    '2024-02-01T10:30:00Z', 
    '2024-02-01T10:30:00Z', 
    'Interessato a soluzioni enterprise'
),
(
    '550e8400-e29b-41d4-a716-446655440702', 
    'default-user', 
    'Anna', 
    'Neri', 
    'anna.neri@email.com', 
    '+39 333 888 9999', 
    'Corporation ABC', 
    'IT Director', 
    'email', 
    'qualified', 
    'medium', 
    60, 
    '2024-02-08T11:15:00Z', 
    '2024-02-08T11:15:00Z', 
    'In fase di valutazione'
),
(
    '550e8400-e29b-41d4-a716-446655440703', 
    'default-user', 
    'Luca', 
    'Verdi', 
    'luca.verdi@email.com', 
    '+39 333 555 7777', 
    'StartupXYZ', 
    'CTO', 
    'social', 
    'contacted', 
    'high', 
    75, 
    '2024-02-10T14:20:00Z', 
    '2024-02-10T14:20:00Z', 
    'Interessato a soluzioni cloud'
),
(
    '550e8400-e29b-41d4-a716-446655440704', 
    'default-user', 
    'Sara', 
    'Bianchi', 
    'sara.bianchi@email.com', 
    '+39 333 444 6666', 
    'Enterprise Ltd', 
    'Project Manager', 
    'referral', 
    'qualified', 
    'medium', 
    70, 
    '2024-02-12T09:45:00Z', 
    '2024-02-12T09:45:00Z', 
    'Raccomandato da cliente esistente'
),
(
    '550e8400-e29b-41d4-a716-446655440705', 
    'default-user', 
    'Paolo', 
    'Gialli', 
    'paolo.gialli@email.com', 
    '+39 333 222 3333', 
    'TechStart SRL', 
    'Founder', 
    'website', 
    'closed_won', 
    'high', 
    90, 
    '2024-02-15T16:30:00Z', 
    '2024-02-15T16:30:00Z', 
    'Cliente convertito con successo'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- OBIETTIVI PROGETTO DI TEST (PROJECT_OBJECTIVES)
-- =====================================================

INSERT INTO project_objectives (
    id, project_id, user_id, title, description, objective_type, priority, status, 
    target_date, progress_percentage, responsible_person, notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440801', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Completare Sviluppo Backend', 
    'Sviluppare completamente il backend del sistema', 
    'milestone',
    'high', 
    'in-progress', 
    '2024-04-30', 
    60, 
    'Luca Verdi',
    'Backend in fase di sviluppo'
),
(
    '550e8400-e29b-41d4-a716-446655440802', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Implementare Frontend', 
    'Creare l''interfaccia utente del sistema', 
    'milestone',
    'medium', 
    'pending', 
    '2024-06-30', 
    0, 
    'Giulia Bianchi',
    'Frontend da implementare'
),
(
    '550e8400-e29b-41d4-a716-446655440803', 
    'eae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Ricerca Tecnologie', 
    'Ricerca e valutazione di nuove tecnologie', 
    'goal',
    'low', 
    'pending', 
    '2024-05-31', 
    0, 
    'Anna Neri',
    'Ricerca in fase di pianificazione'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BUDGET PROGETTO DI TEST (PROJECT_BUDGET)
-- =====================================================

INSERT INTO project_budget (
    id, project_id, user_id, category, item_name, description, estimated_cost, actual_cost, 
    currency, status, payment_status
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440901', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'personnel', 
    'Costi Personale', 
    'Costi per risorse umane del progetto', 
    60000.00, 
    25000.00, 
    'EUR',
    'in-progress',
    'pending'
),
(
    '550e8400-e29b-41d4-a716-446655440902', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'software', 
    'Licenze Software', 
    'Licenze software e strumenti di sviluppo', 
    10000.00, 
    5000.00, 
    'EUR',
    'completed',
    'paid'
),
(
    '550e8400-e29b-41d4-a716-446655440903', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'equipment', 
    'Attrezzature Hardware', 
    'Hardware e attrezzature per il progetto', 
    15000.00, 
    8000.00, 
    'EUR',
    'in-progress',
    'pending'
),
(
    '550e8400-e29b-41d4-a716-446655440904', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'marketing', 
    'Costi Marketing', 
    'Costi di marketing e promozione', 
    5000.00, 
    2000.00, 
    'EUR',
    'planned',
    'pending'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TEAM PROGETTO DI TEST (PROJECT_TEAM)
-- =====================================================

INSERT INTO project_team (
    id, project_id, user_id, member_name, role, email, start_date, end_date, 
    allocation_percentage, hourly_rate, currency, status, notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655441001', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Mario Rossi', 
    'Project Manager', 
    'mario.rossi@company.com', 
    '2024-02-01', 
    '2024-12-31', 
    100, 
    50.00, 
    'EUR',
    'active', 
    'Project Manager esperto'
),
(
    '550e8400-e29b-41d4-a716-446655441002', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Giulia Bianchi', 
    'Frontend Developer', 
    'giulia.bianchi@company.com', 
    '2024-02-01', 
    '2024-12-31', 
    80, 
    45.00, 
    'EUR',
    'active', 
    'Sviluppatrice frontend'
),
(
    '550e8400-e29b-41d4-a716-446655441003', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Luca Verdi', 
    'Backend Developer', 
    'luca.verdi@company.com', 
    '2024-02-01', 
    '2024-12-31', 
    90, 
    45.00, 
    'EUR',
    'active', 
    'Sviluppatore backend'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MILESTONE PROGETTO DI TEST (PROJECT_MILESTONES)
-- =====================================================

INSERT INTO project_milestones (
    id, project_id, user_id, title, description, milestone_type, planned_date, actual_date, 
    status, responsible_person, notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655441101', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Completamento Backend', 
    'Completamento dello sviluppo del backend', 
    'milestone',
    '2024-04-30', 
    NULL, 
    'pending', 
    'Luca Verdi',
    'Milestone critica per il progetto'
),
(
    '550e8400-e29b-41d4-a716-446655441102', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Completamento Frontend', 
    'Completamento dello sviluppo del frontend', 
    'milestone',
    '2024-06-30', 
    NULL, 
    'pending', 
    'Giulia Bianchi',
    'Milestone per l''interfaccia utente'
),
(
    '550e8400-e29b-41d4-a716-446655441103', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Test di Integrazione', 
    'Completamento dei test di integrazione', 
    'milestone',
    '2024-08-31', 
    NULL, 
    'pending', 
    'Mario Rossi',
    'Milestone per i test'
),
(
    '550e8400-e29b-41d4-a716-446655441104', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Deploy Produzione', 
    'Deploy del sistema in produzione', 
    'milestone',
    '2024-10-31', 
    NULL, 
    'pending', 
    'Mario Rossi',
    'Milestone finale per il deploy'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RISCHI PROGETTO DI TEST (PROJECT_RISKS)
-- =====================================================

INSERT INTO project_risks (
    id, project_id, user_id, title, description, risk_type, probability, impact, risk_level, 
    mitigation_strategy, owner, status, notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655441201', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Ritardo Sviluppo', 
    'Rischio di ritardo nello sviluppo del progetto', 
    'schedule',
    'medium', 
    'high', 
    'high', 
    'Aumentare le risorse e ottimizzare i processi', 
    'Mario Rossi',
    'identified', 
    'Rischio critico da monitorare'
),
(
    '550e8400-e29b-41d4-a716-446655441202', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Problemi Tecnici', 
    'Rischio di problemi tecnici durante lo sviluppo', 
    'technical',
    'low', 
    'medium', 
    'medium', 
    'Formazione del team e supporto tecnico', 
    'Luca Verdi',
    'identified', 
    'Rischio tecnico da gestire'
),
(
    '550e8400-e29b-41d4-a716-446655441203', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Budget Insufficiente', 
    'Rischio di superamento del budget del progetto', 
    'financial',
    'low', 
    'high', 
    'medium', 
    'Controllo costi e ottimizzazione risorse', 
    'Mario Rossi',
    'monitored', 
    'Rischio finanziario da controllare'
),
(
    '550e8400-e29b-41d4-a716-446655441204', 
    'dae04797-b80a-408e-9017-11dc2aa459ed', 
    'default-user',
    'Cambiamenti Requisiti', 
    'Rischio di cambiamenti nei requisiti del progetto', 
    'operational',
    'medium', 
    'medium', 
    'medium', 
    'Gestione cambiamenti e comunicazione', 
    'Giulia Bianchi',
    'identified', 
    'Rischio di scope creep'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATI MAGAZZINO DI TEST
-- =====================================================

-- Categorie Magazzino
INSERT INTO warehouse_categories (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Elettronica', 'Componenti elettronici e dispositivi'),
('550e8400-e29b-41d4-a716-446655440002', 'Accessori', 'Accessori e componenti di supporto'),
('550e8400-e29b-41d4-a716-446655440003', 'Software', 'Licenze software e servizi digitali'),
('550e8400-e29b-41d4-a716-446655440004', 'Servizi', 'Servizi professionali e consulenza')
ON CONFLICT (id) DO NOTHING;

-- Posizioni Magazzino
INSERT INTO warehouse_locations (id, name, description, capacity) VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'Magazzino A', 'Magazzino principale', 1000),
('550e8400-e29b-41d4-a716-446655440102', 'Magazzino B', 'Magazzino secondario', 500),
('550e8400-e29b-41d4-a716-446655440103', 'Ufficio', 'Deposito ufficio', 100)
ON CONFLICT (id) DO NOTHING;

-- Articoli Magazzino
INSERT INTO warehouse_items (
    id, user_id, name, category, quantity, unit, price, description, 
    sku, location, min_stock, max_stock
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655441001', 
    'default-user', 
    'Laptop Dell XPS 13', 
    'Elettronica', 
    5, 
    'pz', 
    1200.00, 
    'Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB', 
    'DELL-XPS13-001', 
    'Magazzino A', 
    2, 
    10
),
(
    '550e8400-e29b-41d4-a716-446655441002', 
    'default-user', 
    'Mouse Wireless Logitech', 
    'Accessori', 
    25, 
    'pz', 
    25.00, 
    'Mouse wireless ergonomico con batteria ricaricabile', 
    'LOG-MOUSE-001', 
    'Magazzino A', 
    10, 
    50
),
(
    '550e8400-e29b-41d4-a716-446655441003', 
    'default-user', 
    'Licenza Microsoft Office 365', 
    'Software', 
    10, 
    'lic', 
    150.00, 
    'Licenza annuale Office 365 Business', 
    'MS-OFFICE-365', 
    'Ufficio', 
    5, 
    20
),
(
    '550e8400-e29b-41d4-a716-446655441004', 
    'default-user', 
    'Monitor 27" 4K', 
    'Elettronica', 
    8, 
    'pz', 
    400.00, 
    'Monitor 27 pollici 4K IPS con USB-C', 
    'MON-27-4K-001', 
    'Magazzino B', 
    3, 
    15
),
(
    '550e8400-e29b-41d4-a716-446655441005', 
    'default-user', 
    'Servizio Consulenza IT', 
    'Servizi', 
    100, 
    'ore', 
    80.00, 
    'Consulenza tecnica specializzata', 
    'SERV-CONS-IT', 
    'Ufficio', 
    0, 
    0
)
ON CONFLICT (id) DO NOTHING;

-- Transazioni Magazzino
INSERT INTO warehouse_transactions (
    item_id, transaction_type, quantity, reason, user_id
) VALUES 
('550e8400-e29b-41d4-a716-446655441001', 'in', 5, 'Acquisto iniziale stock', 'default-user'),
('550e8400-e29b-41d4-a716-446655441002', 'in', 25, 'Acquisto stock accessori', 'default-user'),
('550e8400-e29b-41d4-a716-446655441003', 'in', 10, 'Acquisto licenze software', 'default-user'),
('550e8400-e29b-41d4-a716-446655441004', 'in', 8, 'Acquisto monitor', 'default-user'),
('550e8400-e29b-41d4-a716-446655441005', 'in', 100, 'Disponibilità servizi', 'default-user')
ON CONFLICT (id) DO NOTHING;

-- Preventivi
INSERT INTO quotes (
    id, user_id, client_name, client_email, client_address, 
    language, subtotal, tax, total, valid_until, notes, status
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655442001', 
    'default-user', 
    'TechCorp SRL', 
    'info@techcorp.it', 
    'Via Roma 123, Milano', 
    'it', 
    2500.00, 
    550.00, 
    3050.00, 
    '2024-03-15T23:59:59Z', 
    'Preventivo per attrezzature ufficio', 
    'sent'
),
(
    '550e8400-e29b-41d4-a716-446655442002', 
    'default-user', 
    'StartupXYZ', 
    'admin@startupxyz.com', 
    'Corso Italia 456, Torino', 
    'it', 
    1200.00, 
    264.00, 
    1464.00, 
    '2024-03-20T23:59:59Z', 
    'Preventivo per licenze software', 
    'draft'
)
ON CONFLICT (id) DO NOTHING;

-- Articoli Preventivo
INSERT INTO quote_items (
    quote_id, item_id, name, description, quantity, unit_price, total
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655442001', 
    '550e8400-e29b-41d4-a716-446655441001', 
    'Laptop Dell XPS 13', 
    'Laptop ultrabook con processore Intel i7', 
    2, 
    1200.00, 
    2400.00
),
(
    '550e8400-e29b-41d4-a716-446655442001', 
    '550e8400-e29b-41d4-a716-446655441002', 
    'Mouse Wireless Logitech', 
    'Mouse wireless ergonomico', 
    4, 
    25.00, 
    100.00
),
(
    '550e8400-e29b-41d4-a716-446655442002', 
    '550e8400-e29b-41d4-a716-446655441003', 
    'Licenza Microsoft Office 365', 
    'Licenza annuale Office 365 Business', 
    8, 
    150.00, 
    1200.00
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RIEPILOGO DATI INSERITI
-- =====================================================
-- ✅ 3 Progetti (task_calendar_projects) - 1 attivo, 1 attivo, 1 completato
-- ✅ 3 Progetti (projects) - 1 attivo, 1 pianificazione, 1 completato
-- ✅ 5 Task (2 in corso, 2 in attesa, 1 completato)
-- ✅ 6 Appointments (tutti programmati)
-- ✅ 4 Task Ricorrenti (backup, review, report, sicurezza)
-- ✅ 4 Quick Tasks (documentazione, test, code review, deploy)
-- ✅ 3 Campagne Marketing (Q1 2024, Lancio App, Retargeting)
-- ✅ 5 Lead (nuovi, contattati, qualificati, nurturing, convertiti)
-- ✅ 3 Obiettivi (1 in corso, 2 in attesa)
-- ✅ 4 Voci Budget (personale, software, attrezzature, marketing)
-- ✅ 3 Membri Team (tutti attivi)
-- ✅ 4 Milestone (1 completato, 3 in attesa)
-- ✅ 4 Rischi (2 alti, 1 medio, 1 monitorato)
-- ✅ 4 Categorie Magazzino (Elettronica, Accessori, Software, Servizi)
-- ✅ 3 Posizioni Magazzino (Magazzino A, B, Ufficio)
-- ✅ 5 Articoli Magazzino (Laptop, Mouse, Licenze, Monitor, Servizi)
-- ✅ 5 Transazioni Magazzino (entrate iniziali)
-- ✅ 2 Preventivi (1 inviato, 1 bozza)
-- ✅ 3 Articoli Preventivo (collegati ai preventivi)
-- =====================================================
