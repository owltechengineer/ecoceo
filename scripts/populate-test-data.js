const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = 'https://febpscjreqtxxpvjlqxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwODIzOSwiZXhwIjoyMDc0ODg0MjM5fQ.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dati di test per Task & Calendar
const testTasks = [
  {
    user_id: 'test-user',
    title: 'Sviluppo Frontend App',
    description: 'Implementare l\'interfaccia utente per la nuova applicazione mobile',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-02-15T23:59:59Z',
    category: 'development',
    assigned_to: 'Mario Rossi',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Test di Integrazione',
    description: 'Eseguire test completi di integrazione per tutti i moduli',
    status: 'pending',
    priority: 'medium',
    due_date: '2024-02-20T23:59:59Z',
    category: 'testing',
    assigned_to: 'Giulia Bianchi',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Documentazione API',
    description: 'Creare documentazione completa per le API del sistema',
    status: 'completed',
    priority: 'low',
    due_date: '2024-02-10T23:59:59Z',
    category: 'documentation',
    assigned_to: 'Luca Verdi',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Ottimizzazione Database',
    description: 'Migliorare le performance delle query del database',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-02-25T23:59:59Z',
    category: 'development',
    assigned_to: 'Anna Neri',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Deploy in Produzione',
    description: 'Configurare e eseguire il deploy dell\'applicazione in produzione',
    status: 'pending',
    priority: 'urgent',
    due_date: '2024-03-01T23:59:59Z',
    category: 'deployment',
    assigned_to: 'Marco Blu',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  }
];

const testAppointments = [
  {
    user_id: 'test-user',
    title: 'Meeting con Cliente',
    description: 'Presentazione del progetto e raccolta feedback',
    start_time: '2024-02-12T10:00:00Z',
    end_time: '2024-02-12T11:30:00Z',
    location: 'Ufficio principale',
    attendees: ['Mario Rossi', 'Giulia Bianchi', 'Cliente ABC'],
    type: 'meeting',
    status: 'scheduled',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Review Code',
    description: 'Revisione del codice per il modulo di autenticazione',
    start_time: '2024-02-13T14:00:00Z',
    end_time: '2024-02-13T16:00:00Z',
    location: 'Sala riunioni',
    attendees: ['Luca Verdi', 'Anna Neri'],
    type: 'review',
    status: 'scheduled',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Training Team',
    description: 'Formazione del team sulle nuove tecnologie',
    start_time: '2024-02-15T09:00:00Z',
    end_time: '2024-02-15T17:00:00Z',
    location: 'Aula formazione',
    attendees: ['Tutto il team'],
    type: 'training',
    status: 'scheduled',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  },
  {
    user_id: 'test-user',
    title: 'Demo Prodotto',
    description: 'Dimostrazione del prodotto al management',
    start_time: '2024-02-20T15:00:00Z',
    end_time: '2024-02-20T16:30:00Z',
    location: 'Sala conferenze',
    attendees: ['Management', 'Team sviluppo'],
    type: 'presentation',
    status: 'scheduled',
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
  }
];

const testProjects = [
  {
    id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    name: 'Sviluppo App Mobile',
    description: 'Sviluppo di un\'applicazione mobile per iOS e Android',
    status: 'active',
    priority: 'high',
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    budget: 50000.00,
    actual_cost: 15000.00,
    currency: 'EUR',
    progress_percentage: 45,
    progress: 45,
    completion_percentage: 45,
    client_name: 'TechCorp SRL',
    project_manager: 'Mario Rossi',
    team_members: ['Mario Rossi', 'Giulia Bianchi', 'Luca Verdi', 'Anna Neri'],
    tags: ['mobile', 'ios', 'android', 'development'],
    notes: 'Progetto prioritario per il Q2 2024'
  },
  {
    id: 'bae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    name: 'Sistema CRM',
    description: 'Sviluppo di un sistema CRM personalizzato',
    status: 'planning',
    priority: 'medium',
    start_date: '2024-03-01',
    end_date: '2024-08-31',
    budget: 75000.00,
    actual_cost: 0.00,
    currency: 'EUR',
    progress_percentage: 0,
    progress: 0,
    completion_percentage: 0,
    client_name: 'BusinessCorp',
    project_manager: 'Giulia Bianchi',
    team_members: ['Giulia Bianchi', 'Marco Blu'],
    tags: ['crm', 'business', 'database'],
    notes: 'Progetto in fase di pianificazione'
  },
  {
    id: 'cae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    name: 'E-commerce Platform',
    description: 'Piattaforma e-commerce completa con gestione ordini',
    status: 'completed',
    priority: 'high',
    start_date: '2023-09-01',
    end_date: '2023-12-31',
    budget: 100000.00,
    actual_cost: 95000.00,
    currency: 'EUR',
    progress_percentage: 100,
    progress: 100,
    completion_percentage: 100,
    client_name: 'ShopCorp',
    project_manager: 'Luca Verdi',
    team_members: ['Luca Verdi', 'Anna Neri', 'Marco Blu'],
    tags: ['ecommerce', 'completed', 'success'],
    notes: 'Progetto completato con successo'
  }
];

// Dati per obiettivi progetto
const testObjectives = [
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Completare sviluppo frontend',
    description: 'Implementare tutte le funzionalità del frontend',
    objective_type: 'deliverable',
    priority: 'high',
    status: 'in-progress',
    target_date: '2024-03-15',
    progress_percentage: 65,
    success_criteria: 'Tutte le pagine funzionanti e responsive',
    responsible_person: 'Mario Rossi'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Test di integrazione',
    description: 'Eseguire test completi di integrazione',
    objective_type: 'milestone',
    priority: 'medium',
    status: 'pending',
    target_date: '2024-03-20',
    progress_percentage: 0,
    success_criteria: 'Tutti i test passano al 100%',
    responsible_person: 'Giulia Bianchi'
  }
];

// Dati per budget progetto
const testBudget = [
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    category: 'personnel',
    item_name: 'Sviluppatore Senior',
    description: 'Sviluppo frontend e backend',
    estimated_cost: 15000.00,
    actual_cost: 8505.00,
    currency: 'EUR',
    status: 'in-progress',
    vendor: 'TechCorp',
    payment_status: 'pending'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    category: 'software',
    item_name: 'Licenze software',
    description: 'Licenze per strumenti di sviluppo',
    estimated_cost: 2000.00,
    actual_cost: 2000.00,
    currency: 'EUR',
    status: 'completed',
    vendor: 'SoftwareVendor',
    payment_status: 'paid'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    category: 'equipment',
    item_name: 'Server cloud',
    description: 'Server per hosting e testing',
    estimated_cost: 5000.00,
    actual_cost: 0.00,
    currency: 'EUR',
    status: 'planned',
    vendor: 'CloudProvider',
    payment_status: 'pending'
  }
];

// Dati per team progetto
const testTeam = [
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    member_name: 'Mario Rossi',
    role: 'Lead Developer',
    department: 'IT',
    email: 'mario.rossi@company.com',
    allocation_percentage: 100,
    hourly_rate: 75.00,
    currency: 'EUR',
    status: 'active',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    responsibilities: 'Sviluppo frontend e coordinamento team'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    member_name: 'Giulia Bianchi',
    role: 'UI/UX Designer',
    department: 'Design',
    email: 'giulia.bianchi@company.com',
    allocation_percentage: 50,
    hourly_rate: 60.00,
    currency: 'EUR',
    status: 'active',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    responsibilities: 'Design interfacce e user experience'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    member_name: 'Luca Verdi',
    role: 'Backend Developer',
    department: 'IT',
    email: 'luca.verdi@company.com',
    allocation_percentage: 80,
    hourly_rate: 70.00,
    currency: 'EUR',
    status: 'active',
    skills: ['Python', 'Django', 'API'],
    responsibilities: 'Sviluppo backend e API'
  }
];

// Dati per milestone progetto
const testMilestones = [
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Consegna MVP',
    description: 'Consegna della prima versione funzionante dell\'applicazione',
    milestone_type: 'deliverable',
    planned_date: '2024-03-30',
    status: 'pending',
    responsible_person: 'Mario Rossi'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Revisione Design',
    description: 'Revisione finale del design UI/UX con il cliente',
    milestone_type: 'review',
    planned_date: '2024-02-28',
    status: 'completed',
    responsible_person: 'Giulia Bianchi'
  }
];

// Dati per rischi progetto
const testRisks = [
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Ritardo sviluppo',
    description: 'Possibile ritardo nella consegna del progetto',
    risk_type: 'schedule',
    probability: 'medium',
    impact: 'high',
    risk_level: 'high',
    mitigation_strategy: 'Aumentare risorse e ottimizzare processi',
    owner: 'Mario Rossi',
    status: 'monitored'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Budget insufficiente',
    description: 'Rischio di superamento del budget allocato',
    risk_type: 'financial',
    probability: 'low',
    impact: 'medium',
    risk_level: 'medium',
    mitigation_strategy: 'Monitoraggio costi e ottimizzazione risorse',
    owner: 'Giulia Bianchi',
    status: 'assessed'
  },
  {
    project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
    user_id: 'test-user',
    title: 'Problemi tecnici',
    description: 'Difficoltà tecniche impreviste',
    risk_type: 'technical',
    probability: 'medium',
    impact: 'high',
    risk_level: 'high',
    mitigation_strategy: 'Formazione team e supporto esterno',
    owner: 'Luca Verdi',
    status: 'identified'
  }
];

// Funzione per inserire i dati
async function populateTestData() {
  try {
    console.log('🚀 Inserimento dati di test...');

    // Inserisci progetti
    console.log('📋 Inserimento progetti...');
    const { error: projectsError } = await supabase
      .from('projects')
      .upsert(testProjects, { onConflict: 'id' });

    if (projectsError) {
      console.error('Errore progetti:', projectsError);
    } else {
      console.log('✅ Progetti inseriti');
    }

    // Inserisci task
    console.log('📝 Inserimento task...');
    const { error: tasksError } = await supabase
      .from('task_calendar_tasks')
      .upsert(testTasks, { onConflict: 'id' });

    if (tasksError) {
      console.error('Errore task:', tasksError);
    } else {
      console.log('✅ Task inseriti');
    }

    // Inserisci appointments
    console.log('📅 Inserimento appointments...');
    const { error: appointmentsError } = await supabase
      .from('task_calendar_appointments')
      .upsert(testAppointments, { onConflict: 'id' });

    if (appointmentsError) {
      console.error('Errore appointments:', appointmentsError);
    } else {
      console.log('✅ Appointments inseriti');
    }

    // Inserisci obiettivi
    console.log('🎯 Inserimento obiettivi...');
    const { error: objectivesError } = await supabase
      .from('project_objectives')
      .upsert(testObjectives, { onConflict: 'id' });

    if (objectivesError) {
      console.error('Errore obiettivi:', objectivesError);
    } else {
      console.log('✅ Obiettivi inseriti');
    }

    // Inserisci budget
    console.log('💰 Inserimento budget...');
    const { error: budgetError } = await supabase
      .from('project_budget')
      .upsert(testBudget, { onConflict: 'id' });

    if (budgetError) {
      console.error('Errore budget:', budgetError);
    } else {
      console.log('✅ Budget inserito');
    }

    // Inserisci team
    console.log('👥 Inserimento team...');
    const { error: teamError } = await supabase
      .from('project_team')
      .upsert(testTeam, { onConflict: 'id' });

    if (teamError) {
      console.error('Errore team:', teamError);
    } else {
      console.log('✅ Team inserito');
    }

    // Inserisci milestone
    console.log('📅 Inserimento milestone...');
    const { error: milestonesError } = await supabase
      .from('project_milestones')
      .upsert(testMilestones, { onConflict: 'id' });

    if (milestonesError) {
      console.error('Errore milestone:', milestonesError);
    } else {
      console.log('✅ Milestone inseriti');
    }

    // Inserisci rischi
    console.log('⚠️ Inserimento rischi...');
    const { error: risksError } = await supabase
      .from('project_risks')
      .upsert(testRisks, { onConflict: 'id' });

    if (risksError) {
      console.error('Errore rischi:', risksError);
    } else {
      console.log('✅ Rischi inseriti');
    }

    console.log('🎉 Tutti i dati di test sono stati inseriti con successo!');
    console.log('\n📊 Riepilogo dati inseriti:');
    console.log(`- ${testProjects.length} progetti`);
    console.log(`- ${testTasks.length} task`);
    console.log(`- ${testAppointments.length} appointments`);
    console.log(`- ${testObjectives.length} obiettivi`);
    console.log(`- ${testBudget.length} voci budget`);
    console.log(`- ${testTeam.length} membri team`);
    console.log(`- ${testMilestones.length} milestone`);
    console.log(`- ${testRisks.length} rischi`);

  } catch (error) {
    console.error('❌ Errore durante l\'inserimento dei dati:', error);
  }
}

// Esegui lo script
populateTestData();
