# 📅 Task e Calendario Documentation

Questa sezione contiene la documentazione per il modulo task e calendario della dashboard.

## 📋 File Disponibili

### 🗄️ Database
- **[TASKS_CALENDAR_SCHEMA.sql](../database/TASKS_CALENDAR_SCHEMA.sql)** - Schema tabelle task e calendario
- **[RECURRING_ACTIVITIES_SCHEMA.sql](../database/RECURRING_ACTIVITIES_SCHEMA.sql)** - Schema attività ricorrenti

## 🎯 Funzionalità Task e Calendario

### Gestione Task
- Creazione e gestione task
- Priorità (low, medium, high, urgent)
- Status (pending, in-progress, completed, cancelled)
- Due dates
- Assignments
- Categories

### Calendario Appuntamenti
- Scheduling appuntamenti
- Time blocking
- Recurring events
- Reminders
- Status tracking

### Progetti Calendario
- Project-based organization
- Timeline view
- Milestone tracking
- Resource allocation

### Attività Ricorrenti
- Template attività
- Frequency settings (daily, weekly, monthly, yearly)
- Auto-generation
- Custom patterns

### Template Settimanali
- Weekly templates
- Activity scheduling
- Template management
- Bulk operations

## 🚨 Errori Comuni

### Task non caricati
**Soluzione**: Verifica che la tabella `task_calendar_tasks` esista

### Appuntamenti non salvati
**Soluzione**: Verifica che la tabella `task_calendar_appointments` esista

### Errori attività ricorrenti
**Soluzione**: Esegui `RECURRING_ACTIVITIES_SCHEMA.sql`

## 📞 Supporto

Per problemi task e calendario:
1. Verifica le tabelle database
2. Controlla i log di Supabase
3. Usa gli script di fix appropriati
4. Consulta la documentazione database
