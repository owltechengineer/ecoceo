# 📊 ANALISI COMPLETA DATABASE - TUTTE LE SEZIONI

## **📊 DASHBOARD TOTALE - Panoramica generale**

### **Tabelle Utilizzate:**
- **`campaigns`** - Campagne marketing
- **`leads`** - Lead e contatti
- **`task_calendar_projects`** - Progetti
- **`task_calendar_tasks`** - Task
- **`task_calendar_appointments`** - Appuntamenti
- **`financial_fixed_costs`** - Costi fissi
- **`financial_variable_costs`** - Costi variabili
- **`financial_revenues`** - Entrate
- **`recurring_activities`** - Attività ricorrenti
- **`quick_tasks`** - Task veloci

### **Richieste Database:**
```sql
-- Marketing
SELECT * FROM campaigns
SELECT * FROM leads

-- Progetti e Task
SELECT * FROM task_calendar_projects
SELECT * FROM task_calendar_tasks
SELECT * FROM task_calendar_appointments

-- Finanziario
SELECT * FROM financial_fixed_costs
SELECT * FROM financial_variable_costs
SELECT * FROM financial_revenues

-- Attività
SELECT * FROM recurring_activities
SELECT * FROM quick_tasks
```

### **Dati Utilizzati:**
- **Statistiche marketing**: campagne, lead, budget, spese
- **Statistiche progetti**: progetti totali, task completati/pendenti
- **Statistiche finanziarie**: entrate, costi fissi/variabili, break-even
- **Attività giornaliere**: task, pagamenti, campagne, progetti
- **Quick tasks**: task veloci con tipologia e stakeholder

---

## **📅 TASK E CALENDARIO - Gestione attività**

### **Tabelle Utilizzate:**
- **`task_calendar_tasks`** - Task principali
- **`task_calendar_appointments`** - Appuntamenti
- **`task_calendar_projects`** - Progetti collegati
- **`recurring_activities`** - Attività ricorrenti
- **`quick_tasks`** - Task veloci
- **`marketing_seo_tasks`** - Task SEO (legacy)

### **Richieste Database:**
```sql
-- Task principali
SELECT * FROM task_calendar_tasks
INSERT INTO task_calendar_tasks (title, description, status, priority, due_date, assigned_to, category)
UPDATE task_calendar_tasks SET status = 'completed' WHERE id = ?
DELETE FROM task_calendar_tasks WHERE id = ?

-- Appuntamenti
SELECT * FROM task_calendar_appointments
INSERT INTO task_calendar_appointments (title, description, start_time, end_time, location, attendees)
UPDATE task_calendar_appointments SET status = 'completed' WHERE id = ?

-- Attività ricorrenti
SELECT * FROM recurring_activities
INSERT INTO recurring_activities (name, description, frequency, day_of_week, start_date, assigned_to)

-- Quick tasks
SELECT * FROM quick_tasks
INSERT INTO quick_tasks (type, title, description, stakeholder, priority)
UPDATE quick_tasks SET status = 'completed' WHERE id = ?
```

### **Dati Utilizzati:**
- **Task**: titolo, descrizione, status, priorità, scadenza, assegnato, categoria
- **Appuntamenti**: titolo, descrizione, orario inizio/fine, location, partecipanti
- **Attività ricorrenti**: nome, frequenza, giorno settimana/mese, assegnato
- **Quick tasks**: tipo (reminder, order, invoice, document, mail), stakeholder, priorità

---

## **📈 MARKETING - Gestione marketing**

### **Tabelle Utilizzate:**
- **`campaigns`** - Campagne marketing
- **`leads`** - Lead e contatti
- **`marketing_budgets`** - Budget marketing
- **`marketing_seo_projects`** - Progetti SEO
- **`marketing_seo_tasks`** - Task SEO
- **`marketing_crm_campaigns`** - Campagne CRM
- **`marketing_crm_contacts`** - Contatti CRM
- **`marketing_ad_campaigns`** - Campagne pubblicitarie
- **`marketing_ad_groups`** - Gruppi di annunci
- **`marketing_content_calendar`** - Calendario contenuti
- **`marketing_social_accounts`** - Account social media
- **`marketing_reports`** - Report marketing
- **`marketing_newsletter_templates`** - Template newsletter
- **`marketing_newsletter_campaigns`** - Campagne newsletter
- **`marketing_quick_quotes`** - Preventivi rapidi

### **Richieste Database:**
```sql
-- Campagne
SELECT * FROM campaigns WHERE user_id = ?
INSERT INTO campaigns (user_id, name, type, status, priority, budget, spent_amount, start_date, end_date)
UPDATE campaigns SET status = 'paused' WHERE id = ?
DELETE FROM campaigns WHERE id = ?

-- Lead
SELECT * FROM leads WHERE user_id = ?
INSERT INTO leads (user_id, first_name, last_name, email, phone, company, source, status, priority, score)
UPDATE leads SET status = 'qualified' WHERE id = ?
DELETE FROM leads WHERE id = ?

-- Budget
SELECT * FROM marketing_budgets WHERE campaign_id = ?
INSERT INTO marketing_budgets (campaign_id, amount, spent, category, description)

-- SEO Projects
SELECT * FROM marketing_seo_projects
INSERT INTO marketing_seo_projects (name, description, status, priority, start_date, end_date)

-- SEO Tasks
SELECT * FROM marketing_seo_tasks
INSERT INTO marketing_seo_tasks (title, description, status, priority, due_date, assigned_to)

-- CRM
SELECT * FROM marketing_crm_campaigns
SELECT * FROM marketing_crm_contacts
INSERT INTO marketing_crm_contacts (name, email, phone, company, source, status)

-- Ad Campaigns
SELECT * FROM marketing_ad_campaigns
SELECT * FROM marketing_ad_groups
INSERT INTO marketing_ad_campaigns (name, platform, status, budget, start_date, end_date)

-- Content Calendar
SELECT * FROM marketing_content_calendar
INSERT INTO marketing_content_calendar (title, content_type, platform, scheduled_date, status)

-- Social Accounts
SELECT * FROM marketing_social_accounts
INSERT INTO marketing_social_accounts (platform, account_name, status, followers_count)

-- Reports
SELECT * FROM marketing_reports
INSERT INTO marketing_reports (report_type, period, metrics, data)

-- Newsletter
SELECT * FROM marketing_newsletter_templates
SELECT * FROM marketing_newsletter_campaigns
INSERT INTO marketing_newsletter_templates (name, subject, content, status)

-- Quick Quotes
SELECT * FROM marketing_quick_quotes
INSERT INTO marketing_quick_quotes (client_name, client_email, items, total_amount, status)
```

### **Dati Utilizzati:**
- **Campagne**: nome, tipo, status, priorità, budget, spese, date, metriche
- **Lead**: nome, cognome, email, telefono, azienda, fonte, status, priorità, punteggio
- **Budget**: importo, speso, categoria, descrizione
- **SEO**: progetti e task per ottimizzazione
- **CRM**: campagne e contatti
- **Advertising**: campagne e gruppi di annunci
- **Content**: calendario contenuti e account social
- **Reports**: metriche e dati di performance
- **Newsletter**: template e campagne email
- **Quotes**: preventivi rapidi

---

## **🚀 PROGETTI - Gestione progetti**

### **Tabelle Utilizzate:**
- **`projects_main`** - Progetti principali
- **`project_objectives`** - Obiettivi progetto
- **`project_budget`** - Budget progetto
- **`project_team`** - Team progetto
- **`project_milestones`** - Milestone progetto
- **`project_risks`** - Rischi progetto
- **`task_calendar_projects`** - Progetti calendario (legacy)

### **Richieste Database:**
```sql
-- Progetti principali
SELECT * FROM projects_main WHERE user_id = ?
INSERT INTO projects_main (name, description, status, priority, start_date, end_date, budget, project_manager)
UPDATE projects_main SET status = 'completed' WHERE id = ?
DELETE FROM projects_main WHERE id = ?

-- Obiettivi
SELECT * FROM project_objectives WHERE project_id = ?
INSERT INTO project_objectives (project_id, objective, description, priority, due_date, status)

-- Budget
SELECT * FROM project_budget WHERE project_id = ?
INSERT INTO project_budget (project_id, category, amount, spent, description)

-- Team
SELECT * FROM project_team WHERE project_id = ?
INSERT INTO project_team (project_id, member_name, role, email, phone, start_date, end_date)

-- Milestone
SELECT * FROM project_milestones WHERE project_id = ?
INSERT INTO project_milestones (project_id, milestone_name, description, due_date, status, completion_percentage)

-- Rischi
SELECT * FROM project_risks WHERE project_id = ?
INSERT INTO project_risks (project_id, risk_name, description, probability, impact, mitigation_plan, status)
```

### **Dati Utilizzati:**
- **Progetti**: nome, descrizione, status, priorità, date, budget, project manager
- **Obiettivi**: obiettivo, descrizione, priorità, scadenza, status
- **Budget**: categoria, importo, speso, descrizione
- **Team**: nome membro, ruolo, email, telefono, date
- **Milestone**: nome, descrizione, scadenza, status, percentuale completamento
- **Rischi**: nome, descrizione, probabilità, impatto, piano mitigazione, status

---

## **📦 MAGAZZINO E DOCUMENTI - Gestione inventario e preventivi**

### **Tabelle Utilizzate:**
- **`warehouse_items`** - Articoli magazzino (da creare)
- **`warehouse_categories`** - Categorie articoli (da creare)
- **`warehouse_locations`** - Posizioni magazzino (da creare)
- **`quotes`** - Preventivi (da creare)
- **`quote_items`** - Articoli preventivo (da creare)
- **`warehouse_transactions`** - Transazioni magazzino (da creare)

### **Richieste Database (Da Implementare):**
```sql
-- Articoli magazzino
SELECT * FROM warehouse_items WHERE category = ?
INSERT INTO warehouse_items (name, category, quantity, unit, price, description, sku, location, min_stock, max_stock)
UPDATE warehouse_items SET quantity = ? WHERE id = ?
DELETE FROM warehouse_items WHERE id = ?

-- Categorie
SELECT * FROM warehouse_categories
INSERT INTO warehouse_categories (name, description, parent_id)

-- Posizioni
SELECT * FROM warehouse_locations
INSERT INTO warehouse_locations (name, description, capacity)

-- Preventivi
SELECT * FROM quotes WHERE client_email = ?
INSERT INTO quotes (client_name, client_email, client_address, language, subtotal, tax, total, valid_until, notes)
UPDATE quotes SET status = 'sent' WHERE id = ?

-- Articoli preventivo
SELECT * FROM quote_items WHERE quote_id = ?
INSERT INTO quote_items (quote_id, item_id, name, description, quantity, unit_price, total)

-- Transazioni
SELECT * FROM warehouse_transactions WHERE item_id = ?
INSERT INTO warehouse_transactions (item_id, transaction_type, quantity, reason, user_id, timestamp)
```

### **Dati Utilizzati:**
- **Articoli**: nome, categoria, quantità, unità, prezzo, descrizione, SKU, posizione, stock min/max
- **Categorie**: nome, descrizione, categoria padre
- **Posizioni**: nome, descrizione, capacità
- **Preventivi**: cliente, email, indirizzo, lingua, subtotale, tasse, totale, validità, note
- **Articoli preventivo**: articolo, nome, descrizione, quantità, prezzo unitario, totale
- **Transazioni**: articolo, tipo transazione, quantità, motivo, utente, timestamp

---

## **⚙️ GESTIONE - Gestione generale**

### **Tabelle Utilizzate:**
- **`dashboard_data`** - Dati dashboard
- **`business_plan_executive_summary`** - Executive summary
- **`business_plan_market_analysis`** - Analisi di mercato
- **`business_plan_marketing_strategy`** - Strategia marketing
- **`business_plan_operational_plan`** - Piano operativo
- **`business_plan_financial_plan`** - Piano finanziario
- **`business_plan_business_model`** - Modello di business
- **`business_plan_roadmap`** - Roadmap
- **`business_plan_documentation`** - Documentazione

### **Richieste Database:**
```sql
-- Dashboard Data
SELECT * FROM dashboard_data WHERE user_id = ? AND data_type = ?
INSERT INTO dashboard_data (user_id, data_type, data)
UPDATE dashboard_data SET data = ? WHERE user_id = ? AND data_type = ?

-- Executive Summary
SELECT * FROM business_plan_executive_summary WHERE user_id = ?
INSERT INTO business_plan_executive_summary (user_id, content, pitch, documents)
UPDATE business_plan_executive_summary SET content = ? WHERE user_id = ?

-- Market Analysis
SELECT * FROM business_plan_market_analysis WHERE user_id = ?
INSERT INTO business_plan_market_analysis (user_id, demographics, competitors, swot)
UPDATE business_plan_market_analysis SET demographics = ? WHERE user_id = ?

-- Marketing Strategy
SELECT * FROM business_plan_marketing_strategy WHERE user_id = ?
INSERT INTO business_plan_marketing_strategy (user_id, strategies, timeline, customer_journey)
UPDATE business_plan_marketing_strategy SET strategies = ? WHERE user_id = ?

-- Operational Plan
SELECT * FROM business_plan_operational_plan WHERE user_id = ?
INSERT INTO business_plan_operational_plan (user_id, roles, milestones, flow_diagram)
UPDATE business_plan_operational_plan SET roles = ? WHERE user_id = ?

-- Financial Plan
SELECT * FROM business_plan_financial_plan WHERE user_id = ?
INSERT INTO business_plan_financial_plan (user_id, revenues, expenses, forecasts)
UPDATE business_plan_financial_plan SET revenues = ? WHERE user_id = ?

-- Business Model
SELECT * FROM business_plan_business_model WHERE user_id = ?
INSERT INTO business_plan_business_model (user_id, canvas)
UPDATE business_plan_business_model SET canvas = ? WHERE user_id = ?

-- Roadmap
SELECT * FROM business_plan_roadmap WHERE user_id = ?
INSERT INTO business_plan_roadmap (user_id, goals, kpis, timeline)
UPDATE business_plan_roadmap SET goals = ? WHERE user_id = ?

-- Documentation
SELECT * FROM business_plan_documentation WHERE user_id = ?
INSERT INTO business_plan_documentation (user_id, files, links)
UPDATE business_plan_documentation SET files = ? WHERE user_id = ?
```

### **Dati Utilizzati:**
- **Dashboard Data**: dati generici dashboard per utente
- **Executive Summary**: contenuto, pitch, documenti
- **Market Analysis**: demografia, competitor, SWOT
- **Marketing Strategy**: strategie, timeline, customer journey
- **Operational Plan**: ruoli, milestone, diagramma flusso
- **Financial Plan**: entrate, spese, previsioni
- **Business Model**: canvas modello di business
- **Roadmap**: obiettivi, KPI, timeline
- **Documentation**: file, link

---

## **📋 RIEPILOGO TABELLE TOTALI**

### **Tabelle Principali (Esistenti):**
1. **`campaigns`** - Campagne marketing
2. **`leads`** - Lead e contatti
3. **`marketing_budgets`** - Budget marketing
4. **`task_calendar_projects`** - Progetti
5. **`task_calendar_tasks`** - Task
6. **`task_calendar_appointments`** - Appuntamenti
7. **`recurring_activities`** - Attività ricorrenti
8. **`quick_tasks`** - Task veloci
9. **`financial_fixed_costs`** - Costi fissi
10. **`financial_variable_costs`** - Costi variabili
11. **`financial_revenues`** - Entrate
12. **`financial_budgets`** - Budget finanziari
13. **`projects_main`** - Progetti principali
14. **`project_objectives`** - Obiettivi progetto
15. **`project_budget`** - Budget progetto
16. **`project_team`** - Team progetto
17. **`project_milestones`** - Milestone progetto
18. **`project_risks`** - Rischi progetto
19. **`dashboard_data`** - Dati dashboard
20. **`business_plan_executive_summary`** - Executive summary
21. **`business_plan_market_analysis`** - Analisi di mercato
22. **`business_plan_marketing_strategy`** - Strategia marketing
23. **`business_plan_operational_plan`** - Piano operativo
24. **`business_plan_financial_plan`** - Piano finanziario
25. **`business_plan_business_model`** - Modello di business
26. **`business_plan_roadmap`** - Roadmap
27. **`business_plan_documentation`** - Documentazione

### **Tabelle Marketing Avanzate:**
28. **`marketing_seo_projects`** - Progetti SEO
29. **`marketing_seo_tasks`** - Task SEO
30. **`marketing_crm_campaigns`** - Campagne CRM
31. **`marketing_crm_contacts`** - Contatti CRM
32. **`marketing_ad_campaigns`** - Campagne pubblicitarie
33. **`marketing_ad_groups`** - Gruppi di annunci
34. **`marketing_content_calendar`** - Calendario contenuti
35. **`marketing_social_accounts`** - Account social media
36. **`marketing_reports`** - Report marketing
37. **`marketing_newsletter_templates`** - Template newsletter
38. **`marketing_newsletter_campaigns`** - Campagne newsletter
39. **`marketing_quick_quotes`** - Preventivi rapidi

### **Tabelle Da Creare (Magazzino):**
40. **`warehouse_items`** - Articoli magazzino
41. **`warehouse_categories`** - Categorie articoli
42. **`warehouse_locations`** - Posizioni magazzino
43. **`quotes`** - Preventivi
44. **`quote_items`** - Articoli preventivo
45. **`warehouse_transactions`** - Transazioni magazzino

---

## **🎯 TOTALE TABELLE: 45**

- **27 Tabelle Principali** (esistenti)
- **12 Tabelle Marketing Avanzate** (esistenti)
- **6 Tabelle Magazzino** (da creare)

**Tutte le sezioni sono completamente mappate e analizzate!** 📊✨
