#!/usr/bin/env node

/**
 * Script semplificato per creare le tabelle finanziarie
 * Usa le funzioni standard di Supabase invece di SQL diretto
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Creazione Tabelle Finanziarie - Versione Semplificata');
console.log('=========================================================');

async function createTablesSimple() {
  try {
    console.log('\n🔄 Test connessione Supabase...');
    
    // Test connessione con una query semplice
    const { data: testData, error: testError } = await supabase
      .from('financial_budgets')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log(`❌ Errore connessione: ${testError.message}`);
      console.log('💡 Verifica le credenziali Supabase nel file .env');
      return;
    }
    
    console.log('✅ Connessione Supabase OK');
    
    console.log('\n🔄 Creazione dati di esempio...');
    
    // Crea dipartimenti di esempio
    console.log('\n📁 Creazione dipartimenti...');
    try {
      const departments = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          user_id: 'default-user',
          name: 'Sviluppo',
          description: 'Dipartimento di sviluppo software',
          budget_limit: 50000.00,
          manager: 'Mario Rossi',
          color: '#3B82F6',
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          user_id: 'default-user',
          name: 'Marketing',
          description: 'Dipartimento marketing e comunicazione',
          budget_limit: 30000.00,
          manager: 'Giulia Bianchi',
          color: '#10B981',
          is_active: true
        }
      ];

      for (const dept of departments) {
        const { data, error } = await supabase
          .from('departments')
          .upsert([dept])
          .select();

        if (error) {
          console.log(`❌ Errore creazione dipartimento ${dept.name}: ${error.message}`);
        } else {
          console.log(`✅ Dipartimento ${dept.name} creato`);
        }
      }
    } catch (err) {
      console.log(`❌ Errore creazione dipartimenti: ${err.message}`);
    }

    // Crea costi fissi di esempio
    console.log('\n💰 Creazione costi fissi...');
    try {
      const fixedCosts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440101',
          user_id: 'default-user',
          name: 'Affitto Ufficio',
          description: 'Affitto mensile ufficio principale',
          amount: 2000.00,
          currency: 'EUR',
          category: 'rent',
          frequency: 'monthly',
          department_id: '550e8400-e29b-41d4-a716-446655440001',
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440102',
          user_id: 'default-user',
          name: 'Software Licenze',
          description: 'Licenze software annuali',
          amount: 500.00,
          currency: 'EUR',
          category: 'software',
          frequency: 'yearly',
          department_id: '550e8400-e29b-41d4-a716-446655440001',
          is_active: true
        }
      ];

      for (const cost of fixedCosts) {
        const { data, error } = await supabase
          .from('financial_fixed_costs')
          .upsert([cost])
          .select();

        if (error) {
          console.log(`❌ Errore creazione costo fisso ${cost.name}: ${error.message}`);
        } else {
          console.log(`✅ Costo fisso ${cost.name} creato`);
        }
      }
    } catch (err) {
      console.log(`❌ Errore creazione costi fissi: ${err.message}`);
    }

    // Crea costi variabili di esempio
    console.log('\n📊 Creazione costi variabili...');
    try {
      const variableCosts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440201',
          user_id: 'default-user',
          name: 'Materiali Sviluppo',
          description: 'Materiali per progetto sviluppo',
          amount: 1500.00,
          currency: 'EUR',
          category: 'materials',
          date: '2024-01-15',
          department_id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440202',
          user_id: 'default-user',
          name: 'Campagna Marketing',
          description: 'Costi campagna marketing Q1',
          amount: 2000.00,
          currency: 'EUR',
          category: 'marketing',
          date: '2024-02-01',
          department_id: '550e8400-e29b-41d4-a716-446655440002'
        }
      ];

      for (const cost of variableCosts) {
        const { data, error } = await supabase
          .from('financial_variable_costs')
          .upsert([cost])
          .select();

        if (error) {
          console.log(`❌ Errore creazione costo variabile ${cost.name}: ${error.message}`);
        } else {
          console.log(`✅ Costo variabile ${cost.name} creato`);
        }
      }
    } catch (err) {
      console.log(`❌ Errore creazione costi variabili: ${err.message}`);
    }

    // Crea ricavi di esempio
    console.log('\n💵 Creazione ricavi...');
    try {
      const revenues = [
        {
          id: '550e8400-e29b-41d4-a716-446655440301',
          user_id: 'default-user',
          name: 'Vendita Software',
          description: 'Vendita licenza software personalizzato',
          amount: 5000.00,
          currency: 'EUR',
          category: 'sales',
          date: '2024-01-10',
          department_id: '550e8400-e29b-41d4-a716-446655440001',
          client: 'Cliente A'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440302',
          user_id: 'default-user',
          name: 'Consulenza Marketing',
          description: 'Servizio consulenza marketing digitale',
          amount: 3000.00,
          currency: 'EUR',
          category: 'consulting',
          date: '2024-01-25',
          department_id: '550e8400-e29b-41d4-a716-446655440002',
          client: 'Cliente B'
        }
      ];

      for (const revenue of revenues) {
        const { data, error } = await supabase
          .from('financial_revenues')
          .upsert([revenue])
          .select();

        if (error) {
          console.log(`❌ Errore creazione ricavo ${revenue.name}: ${error.message}`);
        } else {
          console.log(`✅ Ricavo ${revenue.name} creato`);
        }
      }
    } catch (err) {
      console.log(`❌ Errore creazione ricavi: ${err.message}`);
    }

    console.log('\n✅ Creazione dati di esempio completata!');
    console.log('\n💡 Prossimi passi:');
    console.log('1. Testare in browser la sezione gestione');
    console.log('2. Verificare che tutti i dati si carichino');
    console.log('3. Controllare che le statistiche siano corrette');

  } catch (error) {
    console.error('❌ Errore generale creazione tabelle:', error);
  }
}

// Esegui la creazione
createTablesSimple().catch(console.error);
