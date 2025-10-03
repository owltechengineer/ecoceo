#!/usr/bin/env node

/**
 * Script per aggiungere le colonne mancanti alle tabelle finanziarie
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Aggiunta Colonne Mancanti');
console.log('============================');

async function fixMissingColumns() {
  try {
    console.log('\n🔄 Leggendo file SQL...');
    
    // Leggi il file SQL
    const sqlFilePath = path.join(__dirname, '..', 'docs', 'database', 'ADD_MISSING_COLUMNS.sql');
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
          
          // Usa rpc per eseguire SQL diretto
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
    
    // Verifica colonne aggiunte
    console.log('\n🔄 Verifica colonne aggiunte...');
    
    const tablesToCheck = [
      'departments',
      'financial_fixed_costs',
      'financial_variable_costs',
      'financial_revenues',
      'financial_budgets'
    ];
    
    for (const table of tablesToCheck) {
      try {
        console.log(`\n🔍 Controllo tabella: ${table}`);
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Errore tabella ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabella ${table}: OK`);
          
          // Se abbiamo dati, mostra le colonne
          if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log(`📋 Colonne disponibili: ${columns.join(', ')}`);
          }
        }
      } catch (err) {
        console.log(`❌ Errore tabella ${table}: ${err.message}`);
      }
    }
    
    console.log('\n✅ Aggiunta colonne completata!');
    console.log('\n💡 Prossimi passi:');
    console.log('1. Testare in browser la sezione gestione');
    console.log('2. Verificare che non ci siano più errori di colonne');
    console.log('3. Controllare che i dati si carichino correttamente');
    
  } catch (error) {
    console.error('❌ Errore generale aggiunta colonne:', error);
  }
}

// Esegui la correzione
fixMissingColumns().catch(console.error);
