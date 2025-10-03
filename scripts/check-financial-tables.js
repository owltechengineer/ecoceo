#!/usr/bin/env node

/**
 * Script per verificare le tabelle finanziarie esistenti
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifica Tabelle Finanziarie');
console.log('==============================');

async function checkFinancialTables() {
  try {
    console.log('\n🔄 Controllo tabelle finanziarie...');
    
    const tablesToCheck = [
      'departments',
      'financial_fixed_costs',
      'financial_variable_costs', 
      'financial_budgets',
      'financial_revenues',
      'cost_distributions'
    ];

    const results = {};

    for (const table of tablesToCheck) {
      try {
        console.log(`\n🔍 Controllo tabella: ${table}`);
        
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
          results[table] = { exists: false, error: error.message };
        } else {
          console.log(`✅ ${table}: Esiste (${data?.length || 0} record trovati)`);
          results[table] = { exists: true, count: data?.length || 0 };
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
        results[table] = { exists: false, error: err.message };
      }
    }

    console.log('\n📊 Riepilogo tabelle:');
    console.log('====================');
    
    Object.entries(results).forEach(([table, result]) => {
      if (result.exists) {
        console.log(`✅ ${table}: Esiste`);
      } else {
        console.log(`❌ ${table}: ${result.error}`);
      }
    });

    // Determina quali tabelle mancano
    const missingTables = Object.entries(results)
      .filter(([_, result]) => !result.exists)
      .map(([table, _]) => table);

    if (missingTables.length > 0) {
      console.log('\n🚨 Tabelle mancanti:');
      missingTables.forEach(table => console.log(`- ${table}`));
      
      console.log('\n💡 Soluzione:');
      console.log('1. Eseguire lo script CREATE_FINANCIAL_TABLES.sql');
      console.log('2. Oppure creare manualmente le tabelle mancanti');
    } else {
      console.log('\n✅ Tutte le tabelle finanziarie esistono!');
    }

    return results;

  } catch (error) {
    console.error('❌ Errore generale verifica tabelle:', error);
    return null;
  }
}

// Esegui la verifica
checkFinancialTables().catch(console.error);
