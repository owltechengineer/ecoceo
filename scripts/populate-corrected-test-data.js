const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateCorrectedTestData() {
  console.log('🚀 Inserimento dati di test corretti...');
  
  try {
    // Leggi il file SQL corretto
    const sqlFilePath = path.join(__dirname, '..', 'docs', 'database', 'ALL_TEST_DATA_CORRECTED.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Dividi il contenuto in singoli statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('='))
      .filter(stmt => stmt.includes('INSERT INTO'));
    
    console.log(`📋 Trovati ${statements.length} statement SQL`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`\n🔄 Eseguendo statement ${i + 1}/${statements.length}...`);
          console.log(`📝 ${statement.substring(0, 100)}...`);
          
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`❌ Errore statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} eseguito con successo`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Errore statement ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n🎉 Inserimento dati completato!');
    console.log(`📊 Riepilogo:`);
    console.log(`- ✅ Statement eseguiti: ${successCount}`);
    console.log(`- ❌ Statement falliti: ${errorCount}`);
    console.log(`- 📋 Totale statement: ${statements.length}`);
    
    if (successCount > 0) {
      console.log('\n🎯 Dati inseriti con successo:');
      console.log('- ✅ Progetti e Task');
      console.log('- ✅ Appointments e Attività');
      console.log('- ✅ Campagne Marketing e Lead');
      console.log('- ✅ Obiettivi, Budget, Team');
      console.log('- ✅ Milestone e Rischi');
      console.log('- ✅ Magazzino e Preventivi');
    }
    
  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui l'inserimento
populateCorrectedTestData();
