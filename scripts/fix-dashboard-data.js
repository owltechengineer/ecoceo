#!/usr/bin/env node

/**
 * Script per correggere i dati della dashboard
 * Questo script verifica e inserisce i dati mancanti
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://febpscjreqtxxpvjlqxd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwODIzOSwiZXhwIjoyMDc0ODg0MjM5fQ.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableExists(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error || !error.message.includes('does not exist');
  } catch (err) {
    return false;
  }
}

async function getTableCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', 'default-user');
    
    if (error) return 0;
    return count || 0;
  } catch (err) {
    return 0;
  }
}

async function insertTestData() {
  console.log('📥 Inserimento dati di test...');
  
  try {
    // Leggi il file SQL dei dati di test
    const sqlPath = path.join(__dirname, '..', 'docs', 'database', 'ALL_TEST_DATA.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.log('❌ File ALL_TEST_DATA.sql non trovato');
      return false;
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividi il contenuto in singole istruzioni INSERT
    const insertStatements = sqlContent
      .split(';')
      .filter(stmt => stmt.trim().startsWith('INSERT INTO'))
      .map(stmt => stmt.trim());

    console.log(`📝 Trovate ${insertStatements.length} istruzioni INSERT`);

    // Esegui le istruzioni una per una
    let successCount = 0;
    let errorCount = 0;

    for (const statement of insertStatements) {
      if (statement.trim()) {
        try {
          // Esegui l'istruzione SQL
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️  Errore: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.log(`⚠️  Errore esecuzione: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(`✅ Inserimenti riusciti: ${successCount}`);
    console.log(`❌ Inserimenti falliti: ${errorCount}`);

    return errorCount === 0;

  } catch (err) {
    console.log(`❌ Errore inserimento dati: ${err.message}`);
    return false;
  }
}

async function createMissingTables() {
  console.log('🔧 Creazione tabelle mancanti...');
  
  try {
    // Leggi il file SQL di creazione tabelle
    const sqlPath = path.join(__dirname, '..', 'docs', 'database', 'COMPLETE_DATABASE_ALL_TABLES.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.log('❌ File COMPLETE_DATABASE_ALL_TABLES.sql non trovato');
      return false;
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Esegui il contenuto SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.log(`❌ Errore creazione tabelle: ${error.message}`);
      return false;
    }

    console.log('✅ Tabelle create con successo');
    return true;

  } catch (err) {
    console.log(`❌ Errore creazione tabelle: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Avvio correzione dati dashboard...');
  console.log(`📡 Connessione a: ${supabaseUrl}`);
  
  // Verifica tabelle principali
  const mainTables = [
    'task_calendar_appointments',
    'task_calendar_tasks',
    'task_calendar_projects',
    'campaigns',
    'leads'
  ];

  console.log('\n🔍 Verifica tabelle principali...');
  
  let missingTables = [];
  let emptyTables = [];

  for (const table of mainTables) {
    const exists = await checkTableExists(table);
    if (!exists) {
      missingTables.push(table);
      console.log(`❌ Tabella ${table} non esiste`);
    } else {
      const count = await getTableCount(table);
      if (count === 0) {
        emptyTables.push(table);
        console.log(`⚠️  Tabella ${table} esiste ma è vuota`);
      } else {
        console.log(`✅ Tabella ${table}: ${count} record`);
      }
    }
  }

  // Se ci sono tabelle mancanti, creale
  if (missingTables.length > 0) {
    console.log(`\n🔧 Creazione ${missingTables.length} tabelle mancanti...`);
    const created = await createMissingTables();
    if (!created) {
      console.log('❌ Impossibile creare le tabelle. Esegui manualmente:');
      console.log('   psql -h your-host -U your-user -d your-db -f docs/database/COMPLETE_DATABASE_ALL_TABLES.sql');
      return;
    }
  }

  // Se ci sono tabelle vuote, inserisci i dati
  if (emptyTables.length > 0) {
    console.log(`\n📥 Inserimento dati in ${emptyTables.length} tabelle vuote...`);
    const inserted = await insertTestData();
    if (!inserted) {
      console.log('❌ Impossibile inserire i dati. Esegui manualmente:');
      console.log('   psql -h your-host -U your-user -d your-db -f docs/database/ALL_TEST_DATA.sql');
      return;
    }
  }

  // Verifica finale
  console.log('\n🔍 Verifica finale...');
  let allGood = true;

  for (const table of mainTables) {
    const count = await getTableCount(table);
    if (count === 0) {
      console.log(`❌ Tabella ${table} ancora vuota`);
      allGood = false;
    } else {
      console.log(`✅ Tabella ${table}: ${count} record`);
    }
  }

  if (allGood) {
    console.log('\n🎉 Tutti i dati sono stati corretti con successo!');
    console.log('Ora dovresti vedere appuntamenti e gestione nella dashboard.');
  } else {
    console.log('\n⚠️  Alcuni problemi persistono. Controlla manualmente:');
    console.log('1. Verifica che le tabelle esistano nel database');
    console.log('2. Esegui lo script di creazione database');
    console.log('3. Esegui lo script di inserimento dati');
  }
}

// Esegui la correzione
main().catch(console.error);
