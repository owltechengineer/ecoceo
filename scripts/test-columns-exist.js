#!/usr/bin/env node

/**
 * Script per testare se le colonne esistono nelle tabelle finanziarie
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Test Colonne Tabelle Finanziarie');
console.log('===================================');

async function testColumnsExist() {
  try {
    console.log('\n🔄 Test connessione Supabase...');
    
    // Test connessione
    const { data: testData, error: testError } = await supabase
      .from('financial_budgets')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log(`❌ Errore connessione: ${testError.message}`);
      return;
    }
    
    console.log('✅ Connessione Supabase OK');
    
    console.log('\n🔄 Test colonne nelle tabelle...');
    
    const tablesToTest = [
      {
        name: 'departments',
        testColumns: ['id', 'name', 'user_id']
      },
      {
        name: 'financial_fixed_costs',
        testColumns: ['id', 'name', 'amount', 'department_id', 'currency']
      },
      {
        name: 'financial_variable_costs',
        testColumns: ['id', 'name', 'amount', 'department_id', 'currency']
      },
      {
        name: 'financial_revenues',
        testColumns: ['id', 'name', 'amount', 'department_id', 'currency']
      },
      {
        name: 'financial_budgets',
        testColumns: ['id', 'name', 'planned_amount', 'department_id']
      }
    ];
    
    const results = {};
    
    for (const table of tablesToTest) {
      console.log(`\n🔍 Test tabella: ${table.name}`);
      
      try {
        // Prova a selezionare tutte le colonne di test
        const { data, error } = await supabase
          .from(table.name)
          .select(table.testColumns.join(', '))
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table.name}: ${error.message}`);
          results[table.name] = { exists: false, error: error.message };
        } else {
          console.log(`✅ ${table.name}: OK`);
          
          // Mostra le colonne disponibili
          if (data && data.length > 0) {
            const availableColumns = Object.keys(data[0]);
            console.log(`📋 Colonne disponibili: ${availableColumns.join(', ')}`);
            
            // Verifica colonne mancanti
            const missingColumns = table.testColumns.filter(col => !availableColumns.includes(col));
            if (missingColumns.length > 0) {
              console.log(`⚠️ Colonne mancanti: ${missingColumns.join(', ')}`);
            } else {
              console.log(`✅ Tutte le colonne richieste sono presenti`);
            }
          }
          
          results[table.name] = { exists: true, columns: data && data.length > 0 ? Object.keys(data[0]) : [] };
        }
      } catch (err) {
        console.log(`❌ ${table.name}: ${err.message}`);
        results[table.name] = { exists: false, error: err.message };
      }
    }
    
    console.log('\n📊 Riepilogo test colonne:');
    console.log('==========================');
    
    Object.entries(results).forEach(([table, result]) => {
      if (result.exists) {
        console.log(`✅ ${table}: Esiste`);
        if (result.columns) {
          console.log(`   Colonne: ${result.columns.join(', ')}`);
        }
      } else {
        console.log(`❌ ${table}: ${result.error}`);
      }
    });
    
    // Determina quali colonne mancano
    const missingColumns = [];
    Object.entries(results).forEach(([table, result]) => {
      if (result.exists && result.columns) {
        const expectedColumns = tablesToTest.find(t => t.name === table)?.testColumns || [];
        const missing = expectedColumns.filter(col => !result.columns.includes(col));
        if (missing.length > 0) {
          missingColumns.push({ table, columns: missing });
        }
      }
    });
    
    if (missingColumns.length > 0) {
      console.log('\n🚨 Colonne mancanti rilevate:');
      missingColumns.forEach(({ table, columns }) => {
        console.log(`- ${table}: ${columns.join(', ')}`);
      });
      
      console.log('\n💡 Soluzione:');
      console.log('1. Eseguire lo script ADD_MISSING_COLUMNS.sql');
      console.log('2. Oppure aggiungere manualmente le colonne mancanti');
    } else {
      console.log('\n✅ Tutte le colonne richieste sono presenti!');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Errore generale test colonne:', error);
    return null;
  }
}

// Esegui il test
testColumnsExist().catch(console.error);
