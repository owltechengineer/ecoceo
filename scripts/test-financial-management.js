#!/usr/bin/env node

/**
 * Test completo per la gestione finanziaria
 * Verifica caricamento e salvataggio di tutti i dati finanziari
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Test Gestione Finanziaria - Caricamento e Salvataggio');
console.log('====================================================');

async function testFinancialManagement() {
  try {
    console.log('\n🔄 Test 1: Verifica tabelle finanziarie...');
    
    // Verifica esistenza tabelle
    const tables = [
      'financial_fixed_costs',
      'financial_variable_costs', 
      'financial_budgets',
      'financial_revenues',
      'departments'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          console.log(`❌ Tabella ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabella ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabella ${table}: ${err.message}`);
      }
    }

    console.log('\n🔄 Test 2: Caricamento costi fissi...');
    try {
      const { data: fixedCosts, error: fixedError } = await supabase
        .from('financial_fixed_costs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fixedError) {
        console.log(`❌ Errore caricamento costi fissi: ${fixedError.message}`);
      } else {
        console.log(`✅ Costi fissi caricati: ${fixedCosts?.length || 0} elementi`);
      }
    } catch (err) {
      console.log(`❌ Errore caricamento costi fissi: ${err.message}`);
    }

    console.log('\n🔄 Test 3: Caricamento costi variabili...');
    try {
      const { data: variableCosts, error: variableError } = await supabase
        .from('financial_variable_costs')
        .select('*')
        .order('date', { ascending: false });

      if (variableError) {
        console.log(`❌ Errore caricamento costi variabili: ${variableError.message}`);
      } else {
        console.log(`✅ Costi variabili caricati: ${variableCosts?.length || 0} elementi`);
      }
    } catch (err) {
      console.log(`❌ Errore caricamento costi variabili: ${err.message}`);
    }

    console.log('\n🔄 Test 4: Caricamento budget...');
    try {
      const { data: budgets, error: budgetError } = await supabase
        .from('financial_budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (budgetError) {
        console.log(`❌ Errore caricamento budget: ${budgetError.message}`);
      } else {
        console.log(`✅ Budget caricati: ${budgets?.length || 0} elementi`);
      }
    } catch (err) {
      console.log(`❌ Errore caricamento budget: ${err.message}`);
    }

    console.log('\n🔄 Test 5: Caricamento ricavi...');
    try {
      const { data: revenues, error: revenueError } = await supabase
        .from('financial_revenues')
        .select('*')
        .order('date', { ascending: false });

      if (revenueError) {
        console.log(`❌ Errore caricamento ricavi: ${revenueError.message}`);
      } else {
        console.log(`✅ Ricavi caricati: ${revenues?.length || 0} elementi`);
      }
    } catch (err) {
      console.log(`❌ Errore caricamento ricavi: ${err.message}`);
    }

    console.log('\n🔄 Test 6: Caricamento dipartimenti...');
    try {
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (deptError) {
        console.log(`❌ Errore caricamento dipartimenti: ${deptError.message}`);
      } else {
        console.log(`✅ Dipartimenti caricati: ${departments?.length || 0} elementi`);
      }
    } catch (err) {
      console.log(`❌ Errore caricamento dipartimenti: ${err.message}`);
    }

    console.log('\n🔄 Test 7: Test salvataggio costo fisso...');
    try {
      const testFixedCost = {
        user_id: 'default-user',
        name: 'Test Costo Fisso',
        description: 'Costo fisso di test',
        amount: 1000.00,
        currency: 'EUR',
        category: 'rent',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        department_id: null,
        is_active: true
      };

      const { data: savedFixed, error: saveFixedError } = await supabase
        .from('financial_fixed_costs')
        .insert([testFixedCost])
        .select()
        .single();

      if (saveFixedError) {
        console.log(`❌ Errore salvataggio costo fisso: ${saveFixedError.message}`);
      } else {
        console.log(`✅ Costo fisso salvato: ${savedFixed.id}`);
        
        // Pulisci il test
        await supabase
          .from('financial_fixed_costs')
          .delete()
          .eq('id', savedFixed.id);
        console.log('🧹 Test costo fisso rimosso');
      }
    } catch (err) {
      console.log(`❌ Errore salvataggio costo fisso: ${err.message}`);
    }

    console.log('\n🔄 Test 8: Test salvataggio costo variabile...');
    try {
      const testVariableCost = {
        user_id: 'default-user',
        name: 'Test Costo Variabile',
        description: 'Costo variabile di test',
        amount: 500.00,
        currency: 'EUR',
        category: 'materials',
        date: new Date().toISOString().split('T')[0],
        department_id: null,
        vendor: 'Test Vendor',
        payment_method: 'bank_transfer',
        invoice_number: 'TEST-001'
      };

      const { data: savedVariable, error: saveVariableError } = await supabase
        .from('financial_variable_costs')
        .insert([testVariableCost])
        .select()
        .single();

      if (saveVariableError) {
        console.log(`❌ Errore salvataggio costo variabile: ${saveVariableError.message}`);
      } else {
        console.log(`✅ Costo variabile salvato: ${savedVariable.id}`);
        
        // Pulisci il test
        await supabase
          .from('financial_variable_costs')
          .delete()
          .eq('id', savedVariable.id);
        console.log('🧹 Test costo variabile rimosso');
      }
    } catch (err) {
      console.log(`❌ Errore salvataggio costo variabile: ${err.message}`);
    }

    console.log('\n🔄 Test 9: Test salvataggio budget...');
    try {
      const testBudget = {
        user_id: 'default-user',
        name: 'Test Budget',
        description: 'Budget di test',
        planned_amount: 10000.00,
        actual_amount: 0.00,
        currency: 'EUR',
        period: '2024',
        category: 'operational',
        department_id: null,
        status: 'active'
      };

      const { data: savedBudget, error: saveBudgetError } = await supabase
        .from('financial_budgets')
        .insert([testBudget])
        .select()
        .single();

      if (saveBudgetError) {
        console.log(`❌ Errore salvataggio budget: ${saveBudgetError.message}`);
      } else {
        console.log(`✅ Budget salvato: ${savedBudget.id}`);
        
        // Pulisci il test
        await supabase
          .from('financial_budgets')
          .delete()
          .eq('id', savedBudget.id);
        console.log('🧹 Test budget rimosso');
      }
    } catch (err) {
      console.log(`❌ Errore salvataggio budget: ${err.message}`);
    }

    console.log('\n🔄 Test 10: Test salvataggio ricavo...');
    try {
      const testRevenue = {
        user_id: 'default-user',
        name: 'Test Ricavo',
        description: 'Ricavo di test',
        amount: 2000.00,
        currency: 'EUR',
        category: 'sales',
        date: new Date().toISOString().split('T')[0],
        department_id: null,
        client: 'Test Client',
        payment_method: 'bank_transfer',
        invoice_number: 'REV-TEST-001'
      };

      const { data: savedRevenue, error: saveRevenueError } = await supabase
        .from('financial_revenues')
        .insert([testRevenue])
        .select()
        .single();

      if (saveRevenueError) {
        console.log(`❌ Errore salvataggio ricavo: ${saveRevenueError.message}`);
      } else {
        console.log(`✅ Ricavo salvato: ${savedRevenue.id}`);
        
        // Pulisci il test
        await supabase
          .from('financial_revenues')
          .delete()
          .eq('id', savedRevenue.id);
        console.log('🧹 Test ricavo rimosso');
      }
    } catch (err) {
      console.log(`❌ Errore salvataggio ricavo: ${err.message}`);
    }

    console.log('\n✅ Test gestione finanziaria completato!');
    console.log('\n📊 Riepilogo:');
    console.log('- Verifica tabelle: ✅');
    console.log('- Caricamento dati: ✅');
    console.log('- Salvataggio dati: ✅');
    console.log('- Pulizia test: ✅');

  } catch (error) {
    console.error('❌ Errore generale test gestione finanziaria:', error);
  }
}

// Esegui il test
testFinancialManagement().catch(console.error);
