# 📋 Progetti Documentation

Questa sezione contiene la documentazione per il modulo progetti della dashboard.

## 📋 File Disponibili

### 🗄️ Database
- **[PROJECTS_SCHEMA.sql](../database/PROJECTS_SCHEMA.sql)** - Schema completo tabelle progetti

## 🎯 Funzionalità Progetti

### Gestione Progetti
- Creazione e gestione progetti
- Status tracking (active, completed, on-hold, cancelled)
- Priorità (low, medium, high, urgent)
- Budget e costi
- Progress tracking

### Obiettivi Progetti
- Definizione obiettivi
- Tracking completamento
- Target date
- Status (pending, in-progress, achieved, failed)

### Budget Progetti
- Pianificazione budget
- Tracking spese
- Categorie (personnel, equipment, software, marketing, travel, materials, external, other)
- Variance analysis

### Team Progetti
- Gestione team
- Ruoli e responsabilità
- Hourly rates
- Time tracking
- Allocation

### Milestone
- Definizione milestone
- Planned vs actual dates
- Deliverables
- Acceptance criteria
- Status tracking

### Gestione Rischi
- Identificazione rischi
- Probability e impact assessment
- Risk level calculation
- Mitigation strategies
- Contingency plans

## 🚨 Errori Comuni

### Progetti non caricati
**Soluzione**: Verifica che la tabella `projects_projects` esista

### Obiettivi non salvati
**Soluzione**: Verifica che la tabella `projects_objectives` esista

### Errori budget
**Soluzione**: Esegui `PROJECTS_SCHEMA.sql`

## 📞 Supporto

Per problemi progetti:
1. Verifica le tabelle database
2. Controlla i log di Supabase
3. Usa gli script di fix appropriati
4. Consulta la documentazione database
