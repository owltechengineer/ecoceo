#!/usr/bin/env node

/**
 * Script per testare e verificare i dati della dashboard
 * Questo script verifica se le tabelle esistono e se i dati sono presenti
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://febpscjreqtxxpvjlqxd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwODIzOSwiZXhwIjoyMDc0ODg0MjM5fQ.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Tabelle da verificare
const tablesToCheck = [
  'task_calendar_appointments',
  'task_calendar_tasks', 
  'task_calendar_projects',
  'recurring_activities',
  'quick_tasks',
  'campaigns',
  'leads',
  'projects',
  'project_objectives',
  'project_budget',
  'project_team',
  'project_milestones',
  'project_risks'
];

async function testTable(tableName) {
  try {
    console.log(`\n🔍 Testando tabella: ${tableName}`);
    
    // Test 1: Verifica se la tabella esiste
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log(`❌ Tabella ${tableName} NON ESISTE`);
        return { exists: false, count: 0, error: error.message };
      } else {
        console.log(`⚠️  Errore accesso tabella ${tableName}: ${error.message}`);
        return { exists: true, count: 0, error: error.message };
      }
    }

    // Test 2: Conta i record
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log(`⚠️  Errore conteggio ${tableName}: ${countError.message}`);
    } else {
      console.log(`✅ Tabella ${tableName} esiste - ${count} record`);
    }

    return { exists: true, count: count || 0, error: null };

  } catch (err) {
    console.log(`❌ Errore generale ${tableName}: ${err.message}`);
    return { exists: false, count: 0, error: err.message };
  }
}

async function testSpecificData() {
  console.log('\n📊 Test dati specifici per dashboard...');
  
  try {
    // Test appuntamenti
    const { data: appointments, error: aptError } = await supabase
      .from('task_calendar_appointments')
      .select('*')
      .eq('user_id', 'default-user');

    if (aptError) {
      console.log(`❌ Errore caricamento appuntamenti: ${aptError.message}`);
    } else {
      console.log(`✅ Appuntamenti caricati: ${appointments?.length || 0}`);
      if (appointments && appointments.length > 0) {
        console.log(`   - Primo appuntamento: ${appointments[0].title}`);
      }
    }

    // Test task
    const { data: tasks, error: taskError } = await supabase
      .from('task_calendar_tasks')
      .select('*')
      .eq('user_id', 'default-user');

    if (taskError) {
      console.log(`❌ Errore caricamento task: ${taskError.message}`);
    } else {
      console.log(`✅ Task caricati: ${tasks?.length || 0}`);
    }

    // Test progetti
    const { data: projects, error: projError } = await supabase
      .from('task_calendar_projects')
      .select('*')
      .eq('user_id', 'default-user');

    if (projError) {
      console.log(`❌ Errore caricamento progetti: ${projError.message}`);
    } else {
      console.log(`✅ Progetti caricati: ${projects?.length || 0}`);
    }

  } catch (err) {
    console.log(`❌ Errore test dati specifici: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Avvio test dashboard data...');
  console.log(`📡 Connessione a: ${supabaseUrl}`);
  
  const results = {};
  
  // Test tutte le tabelle
  for (const table of tablesToCheck) {
    results[table] = await testTable(table);
  }
  
  // Test dati specifici
  await testSpecificData();
  
  // Riepilogo
  console.log('\n📋 RIEPILOGO:');
  console.log('================');
  
  const existingTables = Object.entries(results).filter(([_, result]) => result.exists);
  const missingTables = Object.entries(results).filter(([_, result]) => !result.exists);
  
  console.log(`✅ Tabelle esistenti: ${existingTables.length}/${tablesToCheck.length}`);
  existingTables.forEach(([table, result]) => {
    console.log(`   - ${table}: ${result.count} record`);
  });
  
  if (missingTables.length > 0) {
    console.log(`❌ Tabelle mancanti: ${missingTables.length}`);
    missingTables.forEach(([table, result]) => {
      console.log(`   - ${table}: ${result.error}`);
    });
  }
  
  // Suggerimenti
  console.log('\n💡 SUGGERIMENTI:');
  console.log('================');
  
  if (missingTables.length > 0) {
    console.log('1. Esegui lo script di creazione database:');
    console.log('   psql -h your-host -U your-user -d your-db -f docs/database/COMPLETE_DATABASE_ALL_TABLES.sql');
    console.log('');
  }
  
  const tablesWithNoData = existingTables.filter(([_, result]) => result.count === 0);
  if (tablesWithNoData.length > 0) {
    console.log('2. Inserisci i dati di test:');
    console.log('   psql -h your-host -U your-user -d your-db -f docs/database/ALL_TEST_DATA.sql');
    console.log('');
  }
  
  console.log('3. Verifica le variabili d\'ambiente:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('');
  
  console.log('✅ Test completato!');
}

// Esegui il test
main().catch(console.error);
