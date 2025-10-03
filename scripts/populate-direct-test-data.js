const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateDirectTestData() {
  console.log('🚀 Inserimento dati di test diretti...');
  
  try {
    // 1. Inserisci progetti task_calendar_projects
    console.log('📋 Inserimento progetti task_calendar_projects...');
    const { data: projects1, error: projects1Error } = await supabase
      .from('task_calendar_projects')
      .upsert([
        {
          id: 'aae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Sviluppo App Mobile',
          description: 'Sviluppo di un\'applicazione mobile per iOS e Android',
          status: 'active',
          priority: 'high',
          start_date: '2024-02-01T00:00:00Z',
          end_date: '2024-06-30T23:59:59Z',
          budget: 50000.00,
          spent: 15000.00,
          progress: 30
        },
        {
          id: 'bae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Sistema CRM',
          description: 'Implementazione di un sistema CRM personalizzato',
          status: 'active',
          priority: 'medium',
          start_date: '2024-03-01T00:00:00Z',
          end_date: '2024-08-31T23:59:59Z',
          budget: 75000.00,
          spent: 25000.00,
          progress: 45
        },
        {
          id: 'cae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Sito Web Aziendale',
          description: 'Redesign completo del sito web aziendale',
          status: 'completed',
          priority: 'low',
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-02-28T23:59:59Z',
          budget: 25000.00,
          spent: 25000.00,
          progress: 100
        }
      ], { onConflict: 'id' })
      .select();

    if (projects1Error) {
      console.error('❌ Errore progetti task_calendar_projects:', projects1Error.message);
    } else {
      console.log('✅ Progetti task_calendar_projects inseriti:', projects1.length);
    }

    // 2. Inserisci progetti projects
    console.log('📋 Inserimento progetti projects...');
    const { data: projects2, error: projects2Error } = await supabase
      .from('projects')
      .upsert([
        {
          id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Progetto Alpha',
          description: 'Progetto di sviluppo software per clienti enterprise',
          status: 'active',
          priority: 'high',
          start_date: '2024-02-01',
          end_date: '2024-12-31',
          budget: 100000.00,
          project_manager: 'Mario Rossi',
          team_members: ['Giulia Bianchi', 'Luca Verdi'],
          tags: ['enterprise', 'software', 'development'],
          notes: 'Progetto prioritario per il Q1 2024'
        },
        {
          id: 'eae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Progetto Beta',
          description: 'Progetto di ricerca e sviluppo per nuove tecnologie',
          status: 'planning',
          priority: 'medium',
          start_date: '2024-03-01',
          end_date: '2024-09-30',
          budget: 75000.00,
          project_manager: 'Anna Neri',
          team_members: ['Marco Blu', 'Sara Verde'],
          tags: ['research', 'innovation', 'technology'],
          notes: 'Progetto di innovazione per il futuro'
        },
        {
          id: 'fae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Progetto Gamma',
          description: 'Progetto di migrazione cloud per infrastruttura IT',
          status: 'completed',
          priority: 'low',
          start_date: '2024-01-01',
          end_date: '2024-02-29',
          budget: 50000.00,
          project_manager: 'Paolo Gialli',
          team_members: ['Roberto Rossi', 'Elena Bianchi'],
          tags: ['cloud', 'migration', 'infrastructure'],
          notes: 'Progetto completato con successo'
        }
      ], { onConflict: 'id' })
      .select();

    if (projects2Error) {
      console.error('❌ Errore progetti projects:', projects2Error.message);
    } else {
      console.log('✅ Progetti projects inseriti:', projects2.length);
    }

    // 3. Inserisci task
    console.log('📝 Inserimento task...');
    const { data: tasks, error: tasksError } = await supabase
      .from('task_calendar_tasks')
      .upsert([
        {
          id: 'task-001',
          user_id: 'default-user',
          title: 'Analisi Requisiti',
          description: 'Analisi dettagliata dei requisiti per l\'app mobile',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'Mario Rossi',
          due_date: '2024-02-15T23:59:59Z',
          category: 'analysis',
          project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
        },
        {
          id: 'task-002',
          user_id: 'default-user',
          title: 'Design UI/UX',
          description: 'Creazione del design dell\'interfaccia utente',
          status: 'pending',
          priority: 'medium',
          assigned_to: 'Giulia Bianchi',
          due_date: '2024-02-28T23:59:59Z',
          category: 'design',
          project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
        },
        {
          id: 'task-003',
          user_id: 'default-user',
          title: 'Setup Database',
          description: 'Configurazione del database per il sistema CRM',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'Luca Verdi',
          due_date: '2024-03-10T23:59:59Z',
          category: 'development',
          project_id: 'bae04797-b80a-408e-9017-11dc2aa459ed'
        },
        {
          id: 'task-004',
          user_id: 'default-user',
          title: 'Implementazione API',
          description: 'Sviluppo delle API REST per il CRM',
          status: 'pending',
          priority: 'medium',
          assigned_to: 'Anna Neri',
          due_date: '2024-03-20T23:59:59Z',
          category: 'development',
          project_id: 'bae04797-b80a-408e-9017-11dc2aa459ed'
        },
        {
          id: 'task-005',
          user_id: 'default-user',
          title: 'Test Finali',
          description: 'Test di accettazione del sito web',
          status: 'completed',
          priority: 'low',
          assigned_to: 'Paolo Gialli',
          due_date: '2024-02-25T23:59:59Z',
          category: 'testing',
          project_id: 'cae04797-b80a-408e-9017-11dc2aa459ed'
        }
      ], { onConflict: 'id' })
      .select();

    if (tasksError) {
      console.error('❌ Errore task:', tasksError.message);
    } else {
      console.log('✅ Task inseriti:', tasks.length);
    }

    // 4. Inserisci appointments
    console.log('📅 Inserimento appointments...');
    const { data: appointments, error: appointmentsError } = await supabase
      .from('task_calendar_appointments')
      .upsert([
        {
          id: 'appt-001',
          user_id: 'default-user',
          title: 'Meeting Progetto Alpha',
          description: 'Riunione settimanale per il progetto Alpha',
          start_time: '2024-02-15T10:00:00Z',
          end_time: '2024-02-15T11:00:00Z',
          location: 'Sala Riunioni A',
          attendees: ['Mario Rossi', 'Giulia Bianchi', 'Luca Verdi'],
          status: 'scheduled'
        },
        {
          id: 'appt-002',
          user_id: 'default-user',
          title: 'Demo Clienti',
          description: 'Presentazione del sistema CRM ai clienti',
          start_time: '2024-02-20T14:00:00Z',
          end_time: '2024-02-20T16:00:00Z',
          location: 'Sala Conferenze',
          attendees: ['Anna Neri', 'Marco Blu', 'Clienti'],
          status: 'scheduled'
        },
        {
          id: 'appt-003',
          user_id: 'default-user',
          title: 'Training Team',
          description: 'Formazione del team su nuove tecnologie',
          start_time: '2024-02-25T09:00:00Z',
          end_time: '2024-02-25T17:00:00Z',
          location: 'Aula Formazione',
          attendees: ['Tutto il team'],
          status: 'scheduled'
        },
        {
          id: 'appt-004',
          user_id: 'default-user',
          title: 'Review Codice',
          description: 'Review del codice per il progetto Beta',
          start_time: '2024-03-01T15:00:00Z',
          end_time: '2024-03-01T17:00:00Z',
          location: 'Sala Sviluppo',
          attendees: ['Sara Verde', 'Roberto Rossi'],
          status: 'scheduled'
        },
        {
          id: 'appt-005',
          user_id: 'default-user',
          title: 'Meeting Clienti',
          description: 'Incontro con i clienti per feedback',
          start_time: '2024-03-05T11:00:00Z',
          end_time: '2024-03-05T12:30:00Z',
          location: 'Ufficio Clienti',
          attendees: ['Paolo Gialli', 'Elena Bianchi', 'Clienti'],
          status: 'scheduled'
        },
        {
          id: 'appt-006',
          user_id: 'default-user',
          title: 'Planning Sprint',
          description: 'Pianificazione del prossimo sprint',
          start_time: '2024-03-10T09:00:00Z',
          end_time: '2024-03-10T10:30:00Z',
          location: 'Sala Agile',
          attendees: ['Tutto il team'],
          status: 'scheduled'
        }
      ], { onConflict: 'id' })
      .select();

    if (appointmentsError) {
      console.error('❌ Errore appointments:', appointmentsError.message);
    } else {
      console.log('✅ Appointments inseriti:', appointments.length);
    }

    // 5. Inserisci campagne marketing
    console.log('📢 Inserimento campagne marketing...');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .upsert([
        {
          id: 'camp-001',
          user_id: 'default-user',
          name: 'Campagna Q1 2024',
          description: 'Campagna marketing per il primo trimestre 2024',
          type: 'digital',
          status: 'active',
          priority: 'high',
          budget: 50000.00,
          spent_amount: 25000.00,
          currency: 'EUR',
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-03-31T23:59:59Z',
          campaign_manager: 'Mario Rossi',
          target_impressions: 100000,
          target_clicks: 5000,
          target_conversions: 250
        },
        {
          id: 'camp-002',
          user_id: 'default-user',
          name: 'Lancio App Mobile',
          description: 'Campagna per il lancio della nuova app mobile',
          type: 'social',
          status: 'active',
          priority: 'high',
          budget: 30000.00,
          spent_amount: 15000.00,
          currency: 'EUR',
          start_date: '2024-02-01T00:00:00Z',
          end_date: '2024-04-30T23:59:59Z',
          campaign_manager: 'Giulia Bianchi',
          target_impressions: 50000,
          target_clicks: 3000,
          target_conversions: 150
        },
        {
          id: 'camp-003',
          user_id: 'default-user',
          name: 'Retargeting E-commerce',
          description: 'Campagna di retargeting per utenti e-commerce',
          type: 'other',
          status: 'paused',
          priority: 'medium',
          budget: 15000.00,
          spent_amount: 8000.00,
          currency: 'EUR',
          start_date: '2024-01-15T00:00:00Z',
          end_date: '2024-02-28T23:59:59Z',
          campaign_manager: 'Luca Verdi',
          target_impressions: 25000,
          target_clicks: 1500,
          target_conversions: 75
        }
      ], { onConflict: 'id' })
      .select();

    if (campaignsError) {
      console.error('❌ Errore campagne:', campaignsError.message);
    } else {
      console.log('✅ Campagne inserite:', campaigns.length);
    }

    // 6. Inserisci lead
    console.log('👥 Inserimento lead...');
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .upsert([
        {
          id: 'lead-001',
          user_id: 'default-user',
          first_name: 'Marco',
          last_name: 'Rossi',
          email: 'marco.rossi@email.com',
          phone: '+39 333 123 4567',
          company: 'TechCorp SRL',
          job_title: 'CEO',
          source: 'website',
          status: 'new',
          priority: 'high',
          score: 85,
          first_contact_date: '2024-02-01T10:30:00Z',
          last_contact_date: '2024-02-01T10:30:00Z',
          notes: 'Interessato a soluzioni enterprise'
        },
        {
          id: 'lead-002',
          user_id: 'default-user',
          first_name: 'Anna',
          last_name: 'Neri',
          email: 'anna.neri@email.com',
          phone: '+39 333 888 9999',
          company: 'Corporation ABC',
          job_title: 'IT Director',
          source: 'email',
          status: 'qualified',
          priority: 'medium',
          score: 60,
          first_contact_date: '2024-02-08T11:15:00Z',
          last_contact_date: '2024-02-08T11:15:00Z',
          notes: 'In fase di valutazione'
        },
        {
          id: 'lead-003',
          user_id: 'default-user',
          first_name: 'Luca',
          last_name: 'Verdi',
          email: 'luca.verdi@email.com',
          phone: '+39 333 555 7777',
          company: 'StartupXYZ',
          job_title: 'CTO',
          source: 'social',
          status: 'contacted',
          priority: 'high',
          score: 75,
          first_contact_date: '2024-02-10T14:20:00Z',
          last_contact_date: '2024-02-10T14:20:00Z',
          notes: 'Interessato a soluzioni cloud'
        },
        {
          id: 'lead-004',
          user_id: 'default-user',
          first_name: 'Sara',
          last_name: 'Bianchi',
          email: 'sara.bianchi@email.com',
          phone: '+39 333 444 6666',
          company: 'Enterprise Ltd',
          job_title: 'Project Manager',
          source: 'referral',
          status: 'qualified',
          priority: 'medium',
          score: 70,
          first_contact_date: '2024-02-12T09:45:00Z',
          last_contact_date: '2024-02-12T09:45:00Z',
          notes: 'Raccomandato da cliente esistente'
        },
        {
          id: 'lead-005',
          user_id: 'default-user',
          first_name: 'Paolo',
          last_name: 'Gialli',
          email: 'paolo.gialli@email.com',
          phone: '+39 333 222 3333',
          company: 'TechStart SRL',
          job_title: 'Founder',
          source: 'website',
          status: 'closed_won',
          priority: 'high',
          score: 90,
          first_contact_date: '2024-02-15T16:30:00Z',
          last_contact_date: '2024-02-15T16:30:00Z',
          notes: 'Cliente convertito con successo'
        }
      ], { onConflict: 'id' })
      .select();

    if (leadsError) {
      console.error('❌ Errore lead:', leadsError.message);
    } else {
      console.log('✅ Lead inseriti:', leads.length);
    }

    // 7. Inserisci dati magazzino
    console.log('🏪 Inserimento dati magazzino...');
    
    // Categorie magazzino
    const { data: categories, error: categoriesError } = await supabase
      .from('warehouse_categories')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Elettronica',
          description: 'Componenti elettronici e dispositivi'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Accessori',
          description: 'Accessori e componenti di supporto'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Software',
          description: 'Licenze software e servizi digitali'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Servizi',
          description: 'Servizi professionali e consulenza'
        }
      ], { onConflict: 'id' })
      .select();

    if (categoriesError) {
      console.error('❌ Errore categorie magazzino:', categoriesError.message);
    } else {
      console.log('✅ Categorie magazzino inserite:', categories.length);
    }

    // Posizioni magazzino
    const { data: locations, error: locationsError } = await supabase
      .from('warehouse_locations')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440101',
          name: 'Magazzino A',
          description: 'Magazzino principale',
          capacity: 1000
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440102',
          name: 'Magazzino B',
          description: 'Magazzino secondario',
          capacity: 500
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440103',
          name: 'Ufficio',
          description: 'Deposito ufficio',
          capacity: 100
        }
      ], { onConflict: 'id' })
      .select();

    if (locationsError) {
      console.error('❌ Errore posizioni magazzino:', locationsError.message);
    } else {
      console.log('✅ Posizioni magazzino inserite:', locations.length);
    }

    // Articoli magazzino
    const { data: items, error: itemsError } = await supabase
      .from('warehouse_items')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655441001',
          user_id: 'default-user',
          name: 'Laptop Dell XPS 13',
          category: 'Elettronica',
          quantity: 5,
          unit: 'pz',
          price: 1200.00,
          description: 'Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB',
          sku: 'DELL-XPS13-001',
          location: 'Magazzino A',
          min_stock: 2,
          max_stock: 10
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441002',
          user_id: 'default-user',
          name: 'Mouse Wireless Logitech',
          category: 'Accessori',
          quantity: 25,
          unit: 'pz',
          price: 25.00,
          description: 'Mouse wireless ergonomico con batteria ricaricabile',
          sku: 'LOG-MOUSE-001',
          location: 'Magazzino A',
          min_stock: 10,
          max_stock: 50
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441003',
          user_id: 'default-user',
          name: 'Licenza Microsoft Office 365',
          category: 'Software',
          quantity: 10,
          unit: 'lic',
          price: 150.00,
          description: 'Licenza annuale Office 365 Business',
          sku: 'MS-OFFICE-365',
          location: 'Ufficio',
          min_stock: 5,
          max_stock: 20
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441004',
          user_id: 'default-user',
          name: 'Monitor 27" 4K',
          category: 'Elettronica',
          quantity: 8,
          unit: 'pz',
          price: 400.00,
          description: 'Monitor 27 pollici 4K IPS con USB-C',
          sku: 'MON-27-4K-001',
          location: 'Magazzino B',
          min_stock: 3,
          max_stock: 15
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441005',
          user_id: 'default-user',
          name: 'Servizio Consulenza IT',
          category: 'Servizi',
          quantity: 100,
          unit: 'ore',
          price: 80.00,
          description: 'Consulenza tecnica specializzata',
          sku: 'SERV-CONS-IT',
          location: 'Ufficio',
          min_stock: 0,
          max_stock: 0
        }
      ], { onConflict: 'id' })
      .select();

    if (itemsError) {
      console.error('❌ Errore articoli magazzino:', itemsError.message);
    } else {
      console.log('✅ Articoli magazzino inseriti:', items.length);
    }

    // Preventivi
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655442001',
          user_id: 'default-user',
          client_name: 'TechCorp SRL',
          client_email: 'info@techcorp.it',
          client_address: 'Via Roma 123, Milano',
          language: 'it',
          subtotal: 2500.00,
          tax: 550.00,
          total: 3050.00,
          valid_until: '2024-03-15T23:59:59Z',
          notes: 'Preventivo per attrezzature ufficio',
          status: 'sent'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655442002',
          user_id: 'default-user',
          client_name: 'StartupXYZ',
          client_email: 'admin@startupxyz.com',
          client_address: 'Corso Italia 456, Torino',
          language: 'it',
          subtotal: 1200.00,
          tax: 264.00,
          total: 1464.00,
          valid_until: '2024-03-20T23:59:59Z',
          notes: 'Preventivo per licenze software',
          status: 'draft'
        }
      ], { onConflict: 'id' })
      .select();

    if (quotesError) {
      console.error('❌ Errore preventivi:', quotesError.message);
    } else {
      console.log('✅ Preventivi inseriti:', quotes.length);
    }

    console.log('\n🎉 Inserimento dati completato!');
    console.log('📊 Riepilogo:');
    console.log(`- ✅ Progetti task_calendar_projects: ${projects1?.length || 0}`);
    console.log(`- ✅ Progetti projects: ${projects2?.length || 0}`);
    console.log(`- ✅ Task: ${tasks?.length || 0}`);
    console.log(`- ✅ Appointments: ${appointments?.length || 0}`);
    console.log(`- ✅ Campagne: ${campaigns?.length || 0}`);
    console.log(`- ✅ Lead: ${leads?.length || 0}`);
    console.log(`- ✅ Categorie magazzino: ${categories?.length || 0}`);
    console.log(`- ✅ Posizioni magazzino: ${locations?.length || 0}`);
    console.log(`- ✅ Articoli magazzino: ${items?.length || 0}`);
    console.log(`- ✅ Preventivi: ${quotes?.length || 0}`);

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui l'inserimento
populateDirectTestData();
