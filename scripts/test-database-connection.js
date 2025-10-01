#!/usr/bin/env node

// =====================================================
// 🧪 TEST CONNESSIONE DATABASE SUPABASE
// =====================================================
// Script per testare la connessione e le tabelle
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 TEST CONNESSIONE DATABASE SUPABASE');
console.log('=====================================\n');

// Verifica variabili ambiente
console.log('📋 CONFIGURAZIONE:');
console.log(`URL: ${supabaseUrl ? '✅ Presente' : '❌ Mancante'}`);
console.log(`Key: ${supabaseKey ? '✅ Presente' : '❌ Mancante'}\n`);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRORE: Variabili ambiente mancanti!');
  console.log('Verifica il file .env.local:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

// Crea client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Lista tabelle da testare
const tablesToTest = [
  'task_calendar_projects',
  'task_calendar_tasks', 
  'task_calendar_appointments',
  'recurring_activities',
  'quick_tasks',
  'campaigns',
  'leads',
  'financial_fixed_costs',
  'financial_variable_costs',
  'financial_revenues',
  'financial_budgets',
  'warehouse_categories',
  'warehouse_items',
  'quotes',
  'quote_items',
  'quote_settings'
];

async function testConnection() {
  try {
    console.log('🔌 Test connessione...');
    
    // Test connessione base
    const { data, error } = await supabase
      .from('task_calendar_projects')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ ERRORE CONNESSIONE:', error.message);
      return false;
    }
    
    console.log('✅ Connessione OK!\n');
    return true;
    
  } catch (err) {
    console.error('❌ ERRORE CONNESSIONE:', err.message);
    return false;
  }
}

async function testTables() {
  console.log('📊 TEST TABELLE:');
  console.log('================\n');
  
  const results = {};
  
  for (const table of tablesToTest) {
    try {
      console.log(`🔍 Testando ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = { status: 'error', message: error.message };
      } else {
        console.log(`✅ ${table}: OK (${data?.length || 0} record)`);
        results[table] = { status: 'ok', count: data?.length || 0 };
      }
      
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      results[table] = { status: 'error', message: err.message };
    }
  }
  
  return results;
}

async function testUserIdColumns() {
  console.log('\n🔍 TEST COLONNE USER_ID:');
  console.log('========================\n');
  
  const userTables = [
    'task_calendar_projects',
    'task_calendar_tasks',
    'task_calendar_appointments', 
    'recurring_activities',
    'quick_tasks'
  ];
  
  for (const table of userTables) {
    try {
      console.log(`🔍 Testando user_id in ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('user_id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('user_id')) {
          console.log(`❌ ${table}: Colonna user_id mancante`);
        } else {
          console.log(`❌ ${table}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${table}: Colonna user_id OK`);
      }
      
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

async function runTests() {
  console.log('🚀 AVVIO TEST...\n');
  
  // Test 1: Connessione
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ TEST FALLITO: Connessione non riuscita');
    process.exit(1);
  }
  
  // Test 2: Tabelle
  const tableResults = await testTables();
  
  // Test 3: Colonne user_id
  await testUserIdColumns();
  
  // Riepilogo
  console.log('\n📋 RIEPILOGO:');
  console.log('=============\n');
  
  const okTables = Object.values(tableResults).filter(r => r.status === 'ok').length;
  const errorTables = Object.values(tableResults).filter(r => r.status === 'error').length;
  
  console.log(`✅ Tabelle OK: ${okTables}`);
  console.log(`❌ Tabelle con errori: ${errorTables}`);
  
  if (errorTables > 0) {
    console.log('\n🔧 AZIONI CONSIGLIATE:');
    console.log('1. Esegui FIX_USER_ID_COLUMNS.sql in Supabase');
    console.log('2. Reload schema (Settings → API → Reload schema)');
    console.log('3. Riavvia npm run dev');
  } else {
    console.log('\n🎉 TUTTO OK! Database pronto per l\'uso!');
  }
}

// Esegui test
runTests().catch(console.error);
