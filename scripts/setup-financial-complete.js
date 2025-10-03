const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://febpscjreqtxxpvjlqxd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pxcmVxdHh4cHZqbHF4ZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM1NzQ4NzQ0LCJleHAiOjIwNTEzMjQ3NDR9.8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8QJ8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupFinancialComplete() {
    try {
        console.log('🚀 Avvio setup completo tabelle finanziarie...');
        
        // Leggi il file SQL
        const sqlFilePath = path.join(__dirname, '..', 'docs', 'database', 'CREATE_FINANCIAL_COMPLETE.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        
        console.log('📄 File SQL letto:', sqlFilePath);
        console.log('📏 Dimensione file:', sqlContent.length, 'caratteri');
        
        // Dividi il contenuto in sezioni per esecuzione più sicura
        const sections = sqlContent.split('-- =====================================================');
        
        console.log('📊 Numero sezioni SQL:', sections.length);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i].trim();
            if (!section || section.length < 50) continue;
            
            try {
                console.log(`\n🔧 Esecuzione sezione ${i + 1}/${sections.length}...`);
                
                // Esegui la sezione SQL
                const { data, error } = await supabase.rpc('exec_sql', { sql: section });
                
                if (error) {
                    console.error(`❌ Errore sezione ${i + 1}:`, error.message);
                    errorCount++;
                } else {
                    console.log(`✅ Sezione ${i + 1} completata`);
                    successCount++;
                }
            } catch (err) {
                console.error(`❌ Errore esecuzione sezione ${i + 1}:`, err.message);
                errorCount++;
            }
        }
        
        console.log('\n📊 Risultati:');
        console.log(`✅ Sezioni completate: ${successCount}`);
        console.log(`❌ Sezioni con errori: ${errorCount}`);
        
        // Verifica finale
        console.log('\n🔍 Verifica finale...');
        
        const { data: departments, error: deptError } = await supabase
            .from('departments')
            .select('*')
            .limit(1);
            
        if (deptError) {
            console.error('❌ Errore verifica departments:', deptError.message);
        } else {
            console.log('✅ Tabella departments verificata');
        }
        
        const { data: fixedCosts, error: fixedError } = await supabase
            .from('financial_fixed_costs')
            .select('*')
            .limit(1);
            
        if (fixedError) {
            console.error('❌ Errore verifica financial_fixed_costs:', fixedError.message);
        } else {
            console.log('✅ Tabella financial_fixed_costs verificata');
        }
        
        // Testa la funzione get_cost_distribution
        console.log('\n🧪 Test funzione get_cost_distribution...');
        
        const { data: distributionTest, error: distError } = await supabase
            .rpc('get_cost_distribution', {
                p_cost_id: '550e8400-e29b-41d4-a716-446655441001',
                p_cost_type: 'fixed'
            });
            
        if (distError) {
            console.error('❌ Errore test funzione get_cost_distribution:', distError.message);
        } else {
            console.log('✅ Funzione get_cost_distribution funziona');
            console.log('📊 Risultato test:', distributionTest);
        }
        
        console.log('\n🎉 Setup completo tabelle finanziarie terminato!');
        console.log('💡 Ora puoi testare la sezione gestione finanziaria nel browser');
        
    } catch (error) {
        console.error('❌ Errore generale:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Esegui lo script
setupFinancialComplete();