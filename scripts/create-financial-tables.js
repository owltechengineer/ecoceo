#!/usr/bin/env node

/**
 * Script per creare le tabelle finanziarie mancanti
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Creazione Tabelle Finanziarie');
console.log('================================');

async function createFinancialTables() {
  try {
    console.log('\n🔄 Leggendo file SQL...');
    
    // Leggi il file SQL
    const sqlFilePath = path.join(__dirname, '..', 'docs', 'database', 'CREATE_FINANCIAL_TABLES.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('✅ File SQL letto correttamente');
    console.log(`📄 Dimensione file: ${sqlContent.length} caratteri`);
    
    // Dividi il contenuto in statement separati
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Trovati ${statements.length} statement SQL`);
    
    console.log('\n🔄 Esecuzione statement...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`\n🔄 Esecuzione statement ${i + 1}/${statements.length}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement 
          });
          
          if (error) {
            console.log(`❌ Errore statement ${i + 1}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} eseguito con successo`);
            successCount++;
          }
        } catch (err) {
          console.log(`❌ Errore statement ${i + 1}: ${err.message}`);
          errorCount++;
        }
      }
    }
    
    console.log('\n📊 Riepilogo esecuzione:');
    console.log(`✅ Statement eseguiti con successo: ${successCount}`);
    console.log(`❌ Statement con errori: ${errorCount}`);
    
    // Verifica tabelle create
    console.log('\n🔄 Verifica tabelle create...');
    
    const tablesToCheck = [
      'financial_budgets',
      'departments', 
      'cost_distributions'
    ];
    
    for (const table of tablesToCheck) {
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
    
    // Test inserimento dati di esempio
    console.log('\n🔄 Test inserimento dati di esempio...');
    
    try {
      // Test dipartimenti
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id, name')
        .limit(1);
      
      if (deptError) {
        console.log(`❌ Errore verifica dipartimenti: ${deptError.message}`);
      } else {
        console.log(`✅ Dipartimenti: ${deptData?.length || 0} trovati`);
      }
      
      // Test budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('financial_budgets')
        .select('id, name')
        .limit(1);
      
      if (budgetError) {
        console.log(`❌ Errore verifica budget: ${budgetError.message}`);
      } else {
        console.log(`✅ Budget: ${budgetData?.length || 0} trovati`);
      }
      
    } catch (err) {
      console.log(`❌ Errore test dati: ${err.message}`);
    }
    
    console.log('\n✅ Creazione tabelle finanziarie completata!');
    
  } catch (error) {
    console.error('❌ Errore generale creazione tabelle:', error);
  }
}

// Esegui la creazione
createFinancialTables().catch(console.error);
