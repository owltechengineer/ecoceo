#!/usr/bin/env node

/**
 * Script per testare le funzioni di marketing
 * Esegui con: node scripts/test-marketing.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Test delle funzioni marketing...\n');

// ===== TEST DATI =====

const testCampaign = {
  user_id: 'default-user',
  name: 'Test Campaign Script',
  description: 'Campagna di test creata tramite script automatico',
  type: 'digital',
  status: 'active',
  priority: 'medium',
  budget: 1000.00,
  spent_amount: 0.00,
  currency: 'EUR',
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 giorni
  campaign_manager: 'Test Manager',
  creative_director: 'Test Creative',
  account_manager: 'Test Account',
  target_impressions: 10000,
  target_clicks: 500,
  target_conversions: 50,
  actual_impressions: 0,
  actual_clicks: 0,
  actual_conversions: 0,
  notes: 'Campagna creata automaticamente per test',
  tags: ['test', 'script', 'automation']
};

const testLead = {
  user_id: 'default-user',
  first_name: 'Test',
  last_name: 'Lead',
  email: 'test.lead@example.com',
  phone: '+39 123 456 7890',
  company: 'Test Company SRL',
  job_title: 'Test Manager',
  source: 'website',
  status: 'new',
  priority: 'medium',
  score: 50,
  country: 'Italia',
  city: 'Test City',
  address: 'Via Test 123',
  notes: 'Lead creato automaticamente per test',
  tags: ['test', 'script'],
  first_contact_date: new Date().toISOString(),
  last_contact_date: null,
  next_followup_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 giorni
};

// ===== FUNZIONI DI TEST =====

async function testCampaignCRUD() {
  console.log('📊 Test CRUD Campaigns...');
  
  try {
    // 1. CREATE
    console.log('  ➕ Test inserimento campaign...');
    const { data: createdCampaign, error: createError } = await supabase
      .from('campaigns')
      .insert([testCampaign])
      .select()
      .single();
    
    if (createError) {
      console.error('  ❌ Errore creazione campaign:', createError);
      return false;
    }
    console.log('  ✅ Campaign creata:', createdCampaign.id);
    
    // 2. READ
    console.log('  📖 Test lettura campaign...');
    const { data: readCampaign, error: readError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', createdCampaign.id)
      .single();
    
    if (readError) {
      console.error('  ❌ Errore lettura campaign:', readError);
      return false;
    }
    console.log('  ✅ Campaign letta correttamente');
    
    // 3. UPDATE
    console.log('  📝 Test aggiornamento campaign...');
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('campaigns')
      .update({ 
        spent_amount: 250.00,
        actual_impressions: 2500,
        notes: 'Campaign aggiornata tramite test script'
      })
      .eq('id', createdCampaign.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('  ❌ Errore aggiornamento campaign:', updateError);
      return false;
    }
    console.log('  ✅ Campaign aggiornata correttamente');
    
    // 4. DELETE
    console.log('  🗑️ Test eliminazione campaign...');
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', createdCampaign.id);
    
    if (deleteError) {
      console.error('  ❌ Errore eliminazione campaign:', deleteError);
      return false;
    }
    console.log('  ✅ Campaign eliminata correttamente');
    
    return true;
  } catch (err) {
    console.error('  ❌ Errore generale test campaign:', err);
    return false;
  }
}

async function testLeadCRUD() {
  console.log('👥 Test CRUD Leads...');
  
  try {
    // 1. CREATE
    console.log('  ➕ Test inserimento lead...');
    const { data: createdLead, error: createError } = await supabase
      .from('leads')
      .insert([testLead])
      .select()
      .single();
    
    if (createError) {
      console.error('  ❌ Errore creazione lead:', createError);
      return false;
    }
    console.log('  ✅ Lead creato:', createdLead.id);
    
    // 2. READ
    console.log('  📖 Test lettura lead...');
    const { data: readLead, error: readError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', createdLead.id)
      .single();
    
    if (readError) {
      console.error('  ❌ Errore lettura lead:', readError);
      return false;
    }
    console.log('  ✅ Lead letto correttamente');
    
    // 3. UPDATE
    console.log('  📝 Test aggiornamento lead...');
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({ 
        status: 'contacted',
        score: 75,
        notes: 'Lead aggiornato tramite test script',
        last_contact_date: new Date().toISOString()
      })
      .eq('id', createdLead.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('  ❌ Errore aggiornamento lead:', updateError);
      return false;
    }
    console.log('  ✅ Lead aggiornato correttamente');
    
    // 4. DELETE
    console.log('  🗑️ Test eliminazione lead...');
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', createdLead.id);
    
    if (deleteError) {
      console.error('  ❌ Errore eliminazione lead:', deleteError);
      return false;
    }
    console.log('  ✅ Lead eliminato correttamente');
    
    return true;
  } catch (err) {
    console.error('  ❌ Errore generale test lead:', err);
    return false;
  }
}

async function testMarketingStats() {
  console.log('📈 Test statistiche marketing...');
  
  try {
    // Test conteggio campaigns
    const { data: campaignsCount, error: campaignsError, count: campaignsTotal } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact' });
    
    if (campaignsError) {
      console.error('  ❌ Errore conteggio campaigns:', campaignsError);
      return false;
    }
    console.log(`  ✅ Campaigns nel database: ${campaignsTotal || 0}`);
    
    // Test conteggio leads
    const { data: leadsCount, error: leadsError, count: leadsTotal } = await supabase
      .from('leads')
      .select('*', { count: 'exact' });
    
    if (leadsError) {
      console.error('  ❌ Errore conteggio leads:', leadsError);
      return false;
    }
    console.log(`  ✅ Leads nel database: ${leadsTotal || 0}`);
    
    // Test aggregazioni
    const { data: campaignStats, error: statsError } = await supabase
      .from('campaigns')
      .select('budget, spent_amount, actual_impressions, actual_clicks, actual_conversions');
    
    if (statsError) {
      console.error('  ❌ Errore statistiche campaigns:', statsError);
      return false;
    }
    
    if (campaignStats.length > 0) {
      const totalBudget = campaignStats.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = campaignStats.reduce((sum, c) => sum + c.spent_amount, 0);
      const totalImpressions = campaignStats.reduce((sum, c) => sum + c.actual_impressions, 0);
      const totalClicks = campaignStats.reduce((sum, c) => sum + c.actual_clicks, 0);
      const totalConversions = campaignStats.reduce((sum, c) => sum + c.actual_conversions, 0);
      
      console.log(`  📊 Budget totale: €${totalBudget.toLocaleString()}`);
      console.log(`  💸 Speso totale: €${totalSpent.toLocaleString()}`);
      console.log(`  👀 Impressioni totali: ${totalImpressions.toLocaleString()}`);
      console.log(`  👆 Click totali: ${totalClicks.toLocaleString()}`);
      console.log(`  🎯 Conversioni totali: ${totalConversions.toLocaleString()}`);
      
      if (totalClicks > 0) {
        const ctr = ((totalClicks / totalImpressions) * 100).toFixed(2);
        console.log(`  📈 CTR medio: ${ctr}%`);
      }
      
      if (totalConversions > 0) {
        const cpc = (totalSpent / totalClicks).toFixed(2);
        const cpa = (totalSpent / totalConversions).toFixed(2);
        console.log(`  💰 CPC medio: €${cpc}`);
        console.log(`  🎯 CPA medio: €${cpa}`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('  ❌ Errore generale test stats:', err);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('🔌 Test connessione database...');
  
  try {
    // Test connessione base
    const { data, error, count } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('  ❌ Errore connessione:', error);
      return false;
    }
    
    console.log('  ✅ Connessione database OK');
    
    // Test tabelle esistenti
    const tables = ['campaigns', 'leads', 'financial_variable_costs', 'financial_revenues', 'financial_budgets'];
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ⚠️  Tabella ${table}: ${error.message}`);
      } else {
        console.log(`  ✅ Tabella ${table}: OK (${count || 0} record)`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('  ❌ Errore test connessione:', err);
    return false;
  }
}

// ===== FUNZIONE PRINCIPALE =====

async function runMarketingTests() {
  console.log('🔄 Avvio test marketing...\n');
  
  let passedTests = 0;
  const tests = [
    { name: 'Database Connection', func: testDatabaseConnection },
    { name: 'Campaign CRUD', func: testCampaignCRUD },
    { name: 'Lead CRUD', func: testLeadCRUD },
    { name: 'Marketing Stats', func: testMarketingStats }
  ];
  
  for (const test of tests) {
    const success = await test.func();
    if (success) passedTests++;
    console.log(''); // Riga vuota per separare
  }
  
  console.log('🏁 RISULTATI TEST:');
  console.log(`✅ Test passati: ${passedTests}/${tests.length}`);
  console.log(`❌ Test falliti: ${tests.length - passedTests}/${tests.length}`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 Tutti i test sono passati! Il sistema marketing funziona correttamente.');
  } else {
    console.log('\n⚠️  Alcuni test sono falliti. Controlla gli errori sopra.');
  }
}

// ===== ESECUZIONE =====

if (require.main === module) {
  runMarketingTests().catch(console.error);
}

module.exports = {
  runMarketingTests,
  testCampaignCRUD,
  testLeadCRUD,
  testMarketingStats,
  testDatabaseConnection
};
