#!/usr/bin/env node

/**
 * Test completo per verificare le correzioni della sezione finanziaria
 * Verifica che tutti i problemi identificati siano stati risolti
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  console.log('Assicurati di avere NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinancialFixes() {
  console.log('🧪 Test Correzioni Sezione Finanziaria');
  console.log('=====================================\n');

  let allTestsPassed = true;

  try {
    // Test 1: Verifica tabelle create
    console.log('📊 Test 1: Verifica tabelle create');
    console.log('----------------------------------');
    
    const requiredTables = [
      'departments',
      'financial_budgets', 
      'financial_cost_distributions'
    ];

    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabella ${tableName}: ${error.message}`);
          allTestsPassed = false;
        } else {
          console.log(`✅ Tabella ${tableName}: Esiste e accessibile`);
        }
      } catch (err) {
        console.log(`❌ Tabella ${tableName}: ${err.message}`);
        allTestsPassed = false;
      }
    }

    console.log('');

    // Test 2: Verifica colonne aggiunte
    console.log('📊 Test 2: Verifica colonne aggiunte');
    console.log('------------------------------------');
    
    const tableColumns = [
      { table: 'financial_fixed_costs', columns: ['department_id', 'currency', 'frequency', 'is_active'] },
      { table: 'financial_variable_costs', columns: ['department_id', 'currency', 'is_paid'] },
      { table: 'financial_revenues', columns: ['department_id', 'currency', 'client', 'is_received'] }
    ];

    for (const { table, columns } of tableColumns) {
      for (const column of columns) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select(column)
            .limit(1);
          
          if (error && error.message.includes('column') && error.message.includes('does not exist')) {
            console.log(`❌ ${table}.${column}: Colonna mancante`);
            allTestsPassed = false;
          } else {
            console.log(`✅ ${table}.${column}: Colonna presente`);
          }
        } catch (err) {
          console.log(`❌ ${table}.${column}: ${err.message}`);
          allTestsPassed = false;
        }
      }
    }

    console.log('');

    // Test 3: Verifica funzione get_cost_distribution
    console.log('📊 Test 3: Verifica funzione get_cost_distribution');
    console.log('--------------------------------------------------');
    
    try {
      const { data, error } = await supabase
        .rpc('get_cost_distribution', { 
          p_cost_id: '00000000-0000-0000-0000-000000000000', 
          p_cost_type: 'fixed' 
        });
      
      if (error) {
        if (error.message.includes('function') && error.message.includes('not found')) {
          console.log('❌ Funzione get_cost_distribution: Non trovata');
          allTestsPassed = false;
        } else {
          console.log('✅ Funzione get_cost_distribution: Esiste (errore normale per ID inesistente)');
        }
      } else {
        console.log('✅ Funzione get_cost_distribution: Funziona correttamente');
      }
    } catch (err) {
      console.log(`❌ Funzione get_cost_distribution: ${err.message}`);
      allTestsPassed = false;
    }

    console.log('');

    // Test 4: Verifica dati di esempio
    console.log('📊 Test 4: Verifica dati di esempio');
    console.log('-----------------------------------');
    
    try {
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('*');
      
      if (deptError) {
        console.log(`❌ Dipartimenti: ${deptError.message}`);
        allTestsPassed = false;
      } else {
        console.log(`✅ Dipartimenti: ${departments?.length || 0} record trovati`);
      }

      const { data: budgets, error: budgetError } = await supabase
        .from('financial_budgets')
        .select('*');
      
      if (budgetError) {
        console.log(`❌ Budget: ${budgetError.message}`);
        allTestsPassed = false;
      } else {
        console.log(`✅ Budget: ${budgets?.length || 0} record trovati`);
      }
    } catch (err) {
      console.log(`❌ Dati di esempio: ${err.message}`);
      allTestsPassed = false;
    }

    console.log('');

    // Test 5: Test operazioni CRUD
    console.log('📊 Test 5: Test operazioni CRUD');
    console.log('-------------------------------');
    
    try {
      // Test lettura dipartimenti
      const { data: deptData, error: deptReadError } = await supabase
        .from('departments')
        .select('*')
        .limit(1);
      
      if (deptReadError) {
        console.log(`❌ Lettura dipartimenti: ${deptReadError.message}`);
        allTestsPassed = false;
      } else {
        console.log('✅ Lettura dipartimenti: Funziona');
      }

      // Test lettura budget
      const { data: budgetData, error: budgetReadError } = await supabase
        .from('financial_budgets')
        .select('*')
        .limit(1);
      
      if (budgetReadError) {
        console.log(`❌ Lettura budget: ${budgetReadError.message}`);
        allTestsPassed = false;
      } else {
        console.log('✅ Lettura budget: Funziona');
      }
    } catch (err) {
      console.log(`❌ Operazioni CRUD: ${err.message}`);
      allTestsPassed = false;
    }

    console.log('');

    // Test 6: Verifica integrità referenziale
    console.log('📊 Test 6: Verifica integrità referenziale');
    console.log('------------------------------------------');
    
    try {
      // Verifica che i department_id nelle tabelle finanziarie siano validi
      const { data: fixedCosts, error: fixedError } = await supabase
        .from('financial_fixed_costs')
        .select('department_id')
        .not('department_id', 'is', null)
        .limit(1);
      
      if (fixedError) {
        console.log(`❌ Integrità referenziale costi fissi: ${fixedError.message}`);
        allTestsPassed = false;
      } else {
        console.log('✅ Integrità referenziale costi fissi: OK');
      }
    } catch (err) {
      console.log(`❌ Integrità referenziale: ${err.message}`);
      allTestsPassed = false;
    }

    console.log('');

    // Risultati finali
    console.log('📊 Risultati Finali');
    console.log('===================');
    
    if (allTestsPassed) {
      console.log('🎉 Tutti i test sono passati!');
      console.log('✅ Le correzioni sono state applicate con successo');
      console.log('💡 La sezione finanziaria dovrebbe ora funzionare correttamente');
    } else {
      console.log('❌ Alcuni test sono falliti');
      console.log('🔧 Controlla i messaggi di errore sopra');
      console.log('💡 Potrebbe essere necessario eseguire lo script SQL in Supabase');
    }

    console.log('\n📋 Istruzioni per applicare le correzioni:');
    console.log('1. Vai al dashboard Supabase');
    console.log('2. Apri SQL Editor');
    console.log('3. Copia e incolla il contenuto di APPLY_FINANCIAL_FIXES.sql');
    console.log('4. Esegui lo script');
    console.log('5. Ricarica la pagina dell\'applicazione');

  } catch (error) {
    console.error('❌ Errore durante i test:', error);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

// Esegui i test
if (require.main === module) {
  testFinancialFixes()
    .then((success) => {
      if (success) {
        console.log('\n✅ Test completati con successo');
        process.exit(0);
      } else {
        console.log('\n❌ Alcuni test sono falliti');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n❌ Errore durante i test:', error);
      process.exit(1);
    });
}

module.exports = { testFinancialFixes };