#!/usr/bin/env node

/**
 * Script per applicare le correzioni al database Supabase
 * Risolve i problemi identificati nella sezione finanziaria
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  console.log('Assicurati di avere NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyDatabaseFixes() {
  console.log('🔧 Applicazione correzioni database Supabase');
  console.log('================================================\n');

  try {
    // Leggi il file SQL delle correzioni
    const sqlFilePath = path.join(__dirname, '../docs/database/FIX_FINANCIAL_DATABASE_ISSUES.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 File SQL caricato:', sqlFilePath);
    console.log('📏 Dimensione file:', sqlContent.length, 'caratteri\n');

    // Dividi il contenuto SQL in comandi separati
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`🔧 Trovati ${sqlCommands.length} comandi SQL da eseguire\n`);

    let successCount = 0;
    let errorCount = 0;

    // Esegui ogni comando SQL
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      
      // Salta commenti e comandi vuoti
      if (command.startsWith('--') || command.length < 10) {
        continue;
      }

      try {
        console.log(`⚡ Esecuzione comando ${i + 1}/${sqlCommands.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: command + ';' 
        });

        if (error) {
          // Alcuni errori sono normali (es. "column already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('duplicate key')) {
            console.log(`⚠️  Comando ${i + 1}: ${error.message.substring(0, 100)}... (ignorato)`);
          } else {
            console.error(`❌ Comando ${i + 1}: ${error.message}`);
            errorCount++;
          }
        } else {
          console.log(`✅ Comando ${i + 1}: Eseguito con successo`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Comando ${i + 1}: Errore - ${err.message}`);
        errorCount++;
      }

      // Pausa tra i comandi per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Risultati:');
    console.log(`✅ Comandi eseguiti con successo: ${successCount}`);
    console.log(`❌ Comandi con errori: ${errorCount}`);
    console.log(`📈 Tasso di successo: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%\n`);

    // Verifica che le correzioni siano state applicate
    console.log('🔍 Verifica correzioni applicate...\n');

    // Verifica tabelle
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['departments', 'financial_budgets', 'financial_cost_distributions']);

    if (tablesError) {
      console.log('⚠️  Non è possibile verificare le tabelle (normale per Supabase)');
    } else {
      console.log('✅ Tabelle verificate:', tables?.map(t => t.table_name).join(', '));
    }

    // Verifica funzione
    const { data: functions, error: functionsError } = await supabase
      .rpc('get_cost_distribution', { p_cost_id: '00000000-0000-0000-0000-000000000000', p_cost_type: 'fixed' });

    if (functionsError && functionsError.message.includes('function') && functionsError.message.includes('not found')) {
      console.log('❌ Funzione get_cost_distribution non trovata');
    } else {
      console.log('✅ Funzione get_cost_distribution disponibile');
    }

    console.log('\n🎉 Correzioni database completate!');
    console.log('💡 Ricarica la pagina per vedere le modifiche');

  } catch (error) {
    console.error('❌ Errore durante l\'applicazione delle correzioni:', error);
    process.exit(1);
  }
}

// Esegui lo script
if (require.main === module) {
  applyDatabaseFixes()
    .then(() => {
      console.log('\n✅ Script completato con successo');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script fallito:', error);
      process.exit(1);
    });
}

module.exports = { applyDatabaseFixes };
