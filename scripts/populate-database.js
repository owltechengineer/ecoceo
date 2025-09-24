#!/usr/bin/env node

/**
 * Script per popolare il database con dati di test
 * Esegui con: node scripts/populate-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usa la service role key per bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Inizio popolamento database...\n');

// ===== DATI DI TEST =====

const testCampaigns = [
  {
    user_id: 'default-user',
    name: 'Campagna Digital Marketing Q4 2024',
    description: 'Campagna principale per il quarto trimestre 2024 con focus su social media e Google Ads',
    type: 'digital',
    status: 'active',
    priority: 'high',
    budget: 15000.00,
    spent_amount: 8500.00,
    currency: 'EUR',
    start_date: '2024-10-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    campaign_manager: 'Mario Rossi',
    creative_director: 'Laura Bianchi',
    account_manager: 'Giulio Verdi',
    target_impressions: 500000,
    target_clicks: 25000,
    target_conversions: 1000,
    actual_impressions: 320000,
    actual_clicks: 18500,
    actual_conversions: 750,
    notes: 'Campagna performante, ottimi risultati su Facebook e Instagram',
    tags: ['digital', 'social-media', 'google-ads', 'q4-2024']
  },
  {
    user_id: 'default-user',
    name: 'Email Marketing Automation',
    description: 'Sequenza di email automatiche per nurturing dei lead e conversione clienti',
    type: 'email',
    status: 'active',
    priority: 'medium',
    budget: 5000.00,
    spent_amount: 2800.00,
    currency: 'EUR',
    start_date: '2024-09-01T00:00:00Z',
    end_date: '2025-02-28T23:59:59Z',
    campaign_manager: 'Anna Neri',
    creative_director: 'Paolo Rossi',
    account_manager: 'Chiara Blu',
    target_impressions: 100000,
    target_clicks: 8000,
    target_conversions: 400,
    actual_impressions: 75000,
    actual_clicks: 6200,
    actual_conversions: 310,
    notes: 'Buon tasso di apertura del 28%, conversion rate del 5%',
    tags: ['email-marketing', 'automation', 'nurturing']
  },
  {
    user_id: 'default-user',
    name: 'Campagna TV Locale',
    description: 'Spot televisivi per promozione brand su televisioni locali',
    type: 'tv',
    status: 'completed',
    priority: 'medium',
    budget: 25000.00,
    spent_amount: 24500.00,
    currency: 'EUR',
    start_date: '2024-06-01T00:00:00Z',
    end_date: '2024-08-31T23:59:59Z',
    campaign_manager: 'Roberto Gialli',
    creative_director: 'Francesca Viola',
    account_manager: 'Marco Arancio',
    target_impressions: 2000000,
    target_clicks: 0, // TV non ha clicks diretti
    target_conversions: 500,
    actual_impressions: 1850000,
    actual_clicks: 0,
    actual_conversions: 420,
    notes: 'Buona copertura del target demografico, incremento brand awareness del 15%',
    tags: ['tv', 'brand-awareness', 'locale']
  }
];

const testLeads = [
  {
    user_id: 'default-user',
    first_name: 'Alessandro',
    last_name: 'Romano',
    email: 'alessandro.romano@email.com',
    phone: '+39 335 1234567',
    company: 'Tech Solutions SRL',
    job_title: 'CEO',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    score: 85,
    country: 'Italia',
    city: 'Milano',
    address: 'Via Roma 123',
    notes: 'Interessato ai nostri servizi di consulenza digitale, budget confermato 50k€',
    tags: ['hot-lead', 'ceo', 'tech-sector'],
    first_contact_date: '2024-11-01T10:30:00Z',
    last_contact_date: '2024-11-15T14:20:00Z',
    next_followup_date: '2024-11-25T09:00:00Z'
  },
  {
    user_id: 'default-user',
    first_name: 'Valentina',
    last_name: 'Conti',
    email: 'v.conti@fashionbrand.it',
    phone: '+39 347 9876543',
    company: 'Fashion Brand Italia',
    job_title: 'Marketing Director',
    source: 'social',
    status: 'proposal',
    priority: 'high',
    score: 78,
    country: 'Italia',
    city: 'Roma',
    address: 'Corso Italia 45',
    notes: 'Proposta inviata per campagna social media, attesa feedback entro fine mese',
    tags: ['proposal-sent', 'fashion', 'social-media'],
    first_contact_date: '2024-10-15T16:45:00Z',
    last_contact_date: '2024-11-10T11:30:00Z',
    next_followup_date: '2024-11-30T15:00:00Z'
  },
  {
    user_id: 'default-user',
    first_name: 'Marco',
    last_name: 'Bianchi',
    email: 'marco.bianchi@startup.com',
    phone: '+39 329 5551234',
    company: 'InnovaTech Startup',
    job_title: 'Founder',
    source: 'referral',
    status: 'new',
    priority: 'medium',
    score: 65,
    country: 'Italia',
    city: 'Torino',
    address: 'Via Startup 10',
    notes: 'Contatto da referral di cliente esistente, da qualificare meglio',
    tags: ['startup', 'referral', 'to-qualify'],
    first_contact_date: '2024-11-18T09:15:00Z',
    last_contact_date: null,
    next_followup_date: '2024-11-22T10:00:00Z'
  },
  {
    user_id: 'default-user',
    first_name: 'Chiara',
    last_name: 'Ferretti',
    email: 'chiara.ferretti@restaurant.it',
    phone: '+39 340 7778888',
    company: 'Ristorante Da Chiara',
    job_title: 'Proprietaria',
    source: 'advertising',
    status: 'contacted',
    priority: 'low',
    score: 45,
    country: 'Italia',
    city: 'Napoli',
    address: 'Via del Gusto 22',
    notes: 'Interessata a marketing locale e gestione social media del ristorante',
    tags: ['restaurant', 'local-business', 'social-media'],
    first_contact_date: '2024-11-12T18:30:00Z',
    last_contact_date: '2024-11-16T12:45:00Z',
    next_followup_date: '2024-11-28T14:30:00Z'
  }
];

const testVariableCosts = [
  {
    user_id: 'default-user',
    name: 'Google Ads Spesa Mensile',
    amount: 2500.00,
    date: '2024-11-01T00:00:00Z',
    category: 'marketing',
    description: 'Spesa mensile per campagne Google Ads',
    vendor: 'Google LLC',
    payment_method: 'card',
    is_paid: true,
    payment_date: '2024-11-05T00:00:00Z',
    receipt_url: null
  },
  {
    user_id: 'default-user',
    name: 'Facebook Ads Budget',
    amount: 1800.00,
    date: '2024-11-01T00:00:00Z',
    category: 'marketing',
    description: 'Budget mensile per campagne Facebook e Instagram',
    vendor: 'Meta Platforms',
    payment_method: 'transfer',
    is_paid: true,
    payment_date: '2024-11-02T00:00:00Z',
    receipt_url: null
  },
  {
    user_id: 'default-user',
    name: 'Software Marketing Tools',
    amount: 450.00,
    date: '2024-11-01T00:00:00Z',
    category: 'other',
    description: 'Abbonamenti mensili software marketing (Mailchimp, Hootsuite, etc.)',
    vendor: 'Vari Fornitori',
    payment_method: 'card',
    is_paid: true,
    payment_date: '2024-11-01T00:00:00Z',
    receipt_url: null
  },
  {
    user_id: 'default-user',
    name: 'Freelancer Content Creation',
    amount: 1200.00,
    date: '2024-11-15T00:00:00Z',
    category: 'other',
    description: 'Pagamento freelancer per creazione contenuti social media',
    vendor: 'Freelancer Studio',
    payment_method: 'transfer',
    is_paid: false,
    payment_date: null,
    receipt_url: null
  }
];

const testRevenues = [
  {
    user_id: 'default-user',
    name: 'Consulenza Marketing Digitale',
    amount: 15000.00,
    date: '2024-11-10T00:00:00Z',
    source: 'services',
    description: 'Consulenza marketing digitale - Tech Solutions SRL',
    client: 'Tech Solutions SRL',
    payment_method: 'transfer',
    is_received: true,
    received_date: '2024-11-12T00:00:00Z',
    invoice_number: 'INV-2024-001'
  },
  {
    user_id: 'default-user',
    name: 'Social Media Management',
    amount: 8500.00,
    date: '2024-11-05T00:00:00Z',
    source: 'services',
    description: 'Campagna social media management - Fashion Brand',
    client: 'Fashion Brand Italia',
    payment_method: 'transfer',
    is_received: true,
    received_date: '2024-11-07T00:00:00Z',
    invoice_number: 'INV-2024-002'
  },
  {
    user_id: 'default-user',
    name: 'Marketing Automation Subscription',
    amount: 3200.00,
    date: '2024-11-20T00:00:00Z',
    source: 'subscriptions',
    description: 'Abbonamento mensile servizi marketing automation',
    client: 'InnovaTech Startup',
    payment_method: 'transfer',
    is_received: false,
    received_date: null,
    invoice_number: 'INV-2024-003'
  }
];

const testBudgets = [
  {
    user_id: 'default-user',
    name: 'Budget Marketing Q4 2024',
    amount: 50000.00,
    period_start: '2024-10-01T00:00:00Z',
    period_end: '2024-12-31T23:59:59Z',
    category: 'marketing',
    description: 'Budget trimestrale per tutte le attività di marketing',
    department_id: null,
    is_active: true
  },
  {
    user_id: 'default-user',
    name: 'Budget Operativo Mensile',
    amount: 8000.00,
    period_start: '2024-11-01T00:00:00Z',
    period_end: '2024-11-30T23:59:59Z',
    category: 'operational',
    description: 'Budget mensile per spese operative (software, tools, servizi)',
    department_id: null,
    is_active: true
  },
  {
    user_id: 'default-user',
    name: 'Budget Personale Q4',
    amount: 25000.00,
    period_start: '2024-10-01T00:00:00Z',
    period_end: '2024-12-31T23:59:59Z',
    category: 'personnel',
    description: 'Budget per costi del personale e freelancer',
    department_id: null,
    is_active: true
  }
];

// ===== FUNZIONI DI INSERIMENTO =====

async function insertCampaigns() {
  console.log('📊 Inserimento campagne...');
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(testCampaigns)
      .select();
    
    if (error) {
      console.error('❌ Errore inserimento campaigns:', error);
      return false;
    }
    
    console.log(`✅ Inserite ${data.length} campagne con successo`);
    return true;
  } catch (err) {
    console.error('❌ Errore generale campaigns:', err);
    return false;
  }
}

async function insertLeads() {
  console.log('👥 Inserimento lead...');
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert(testLeads)
      .select();
    
    if (error) {
      console.error('❌ Errore inserimento leads:', error);
      return false;
    }
    
    console.log(`✅ Inseriti ${data.length} lead con successo`);
    return true;
  } catch (err) {
    console.error('❌ Errore generale leads:', err);
    return false;
  }
}

async function insertVariableCosts() {
  console.log('💸 Inserimento costi variabili...');
  try {
    const { data, error } = await supabase
      .from('financial_variable_costs')
      .insert(testVariableCosts)
      .select();
    
    if (error) {
      console.error('❌ Errore inserimento costi variabili:', error);
      return false;
    }
    
    console.log(`✅ Inseriti ${data.length} costi variabili con successo`);
    return true;
  } catch (err) {
    console.error('❌ Errore generale costi variabili:', err);
    return false;
  }
}

async function insertRevenues() {
  console.log('💰 Inserimento ricavi...');
  try {
    const { data, error } = await supabase
      .from('financial_revenues')
      .insert(testRevenues)
      .select();
    
    if (error) {
      console.error('❌ Errore inserimento ricavi:', error);
      return false;
    }
    
    console.log(`✅ Inseriti ${data.length} ricavi con successo`);
    return true;
  } catch (err) {
    console.error('❌ Errore generale ricavi:', err);
    return false;
  }
}

async function insertBudgets() {
  console.log('📋 Inserimento budget...');
  try {
    const { data, error } = await supabase
      .from('financial_budgets')
      .insert(testBudgets)
      .select();
    
    if (error) {
      console.error('❌ Errore inserimento budget:', error);
      return false;
    }
    
    console.log(`✅ Inseriti ${data.length} budget con successo`);
    return true;
  } catch (err) {
    console.error('❌ Errore generale budget:', err);
    return false;
  }
}

// ===== FUNZIONE PRINCIPALE =====

async function populateDatabase() {
  console.log('🔄 Verifica connessione Supabase...');
  
  // Test connessione
  try {
    const { data, error, count } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Errore connessione Supabase:', error);
      process.exit(1);
    }
    console.log(`✅ Connessione Supabase OK (campaigns esistenti: ${count || 0})\n`);
  } catch (err) {
    console.error('❌ Impossibile connettersi a Supabase:', err);
    process.exit(1);
  }

  let successCount = 0;
  const operations = [
    { name: 'Campaigns', func: insertCampaigns },
    { name: 'Leads', func: insertLeads },
    { name: 'Variable Costs', func: insertVariableCosts },
    { name: 'Revenues', func: insertRevenues },
    { name: 'Budgets', func: insertBudgets }
  ];

  for (const operation of operations) {
    const success = await operation.func();
    if (success) successCount++;
    console.log(''); // Riga vuota per separare
  }

  console.log('🎉 COMPLETATO!');
  console.log(`✅ Operazioni riuscite: ${successCount}/${operations.length}`);
  console.log(`❌ Operazioni fallite: ${operations.length - successCount}/${operations.length}`);
  
  if (successCount === operations.length) {
    console.log('\n🚀 Database popolato con successo! Ora puoi testare la dashboard.');
  } else {
    console.log('\n⚠️  Alcune operazioni sono fallite. Controlla gli errori sopra.');
  }
}

// ===== ESECUZIONE =====

if (require.main === module) {
  populateDatabase().catch(console.error);
}

module.exports = {
  populateDatabase,
  testCampaigns,
  testLeads,
  testVariableCosts,
  testRevenues,
  testBudgets
};
