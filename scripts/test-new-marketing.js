#!/usr/bin/env node

/**
 * Script per testare il nuovo sistema marketing
 * Esegui con: node scripts/test-new-marketing.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Test del nuovo sistema marketing...\n');

// Test data che corrispondono esattamente allo schema SQL
const testCampaign = {
  user_id: 'default-user',
  name: 'Test New Marketing System',
  description: 'Test campaign per il nuovo sistema marketing',
  type: 'digital',
  status: 'active',
  priority: 'medium',
  budget: 1500.00,
  spent_amount: 300.00,
  currency: 'EUR',
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  campaign_manager: 'Test Manager',
  creative_director: 'Test Creative',
  account_manager: 'Test Account',
  target_impressions: 15000,
  target_clicks: 750,
  target_conversions: 75,
  actual_impressions: 8000,
  actual_clicks: 400,
  actual_conversions: 40,
  notes: 'Campaign creata dal nuovo sistema marketing',
  tags: ['test', 'new-system', 'marketing-v2']
};

const testLead = {
  user_id: 'default-user',
  first_name: 'Mario',
  last_name: 'Rossi',
  email: 'mario.rossi@newtest.com',
  phone: '+39 320 123 4567',
  company: 'New Test Company',
  job_title: 'Marketing Director',
  source: 'website',
  status: 'qualified',
  priority: 'high',
  score: 85,
  campaign_id: null, // Verrà impostato dopo aver creato la campaign
  country: 'Italia',
  city: 'Milano',
  address: 'Via Test 456',
  notes: 'Lead generato dal nuovo sistema marketing',
  tags: ['test', 'new-system', 'qualified'],
  first_contact_date: new Date().toISOString(),
  last_contact_date: new Date().toISOString(),
  next_followup_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
};

async function testNewMarketingSystem() {
  console.log('🔍 Test inserimento campaign...');
  
  try {
    // 1. Test campaign creation
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert([testCampaign])
      .select()
      .single();
    
    if (campaignError) {
      console.error('❌ Errore creazione campaign:', campaignError);
      return false;
    }
    
    console.log('✅ Campaign creata:', campaign.id, '-', campaign.name);
    
    // 2. Test lead creation (associata alla campaign)
    console.log('\n🔍 Test inserimento lead...');
    
    testLead.campaign_id = campaign.id;
    
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([testLead])
      .select()
      .single();
    
    if (leadError) {
      console.error('❌ Errore creazione lead:', leadError);
      return false;
    }
    
    console.log('✅ Lead creato:', lead.id, '-', lead.first_name, lead.last_name);
    
    // 3. Test caricamento dati
    console.log('\n🔍 Test caricamento dati...');
    
    const { data: campaigns, error: loadCampaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', 'default-user')
      .order('created_at', { ascending: false });
    
    if (loadCampaignsError) {
      console.error('❌ Errore caricamento campaigns:', loadCampaignsError);
      return false;
    }
    
    const { data: leads, error: loadLeadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', 'default-user')
      .order('created_at', { ascending: false });
    
    if (loadLeadsError) {
      console.error('❌ Errore caricamento leads:', loadLeadsError);
      return false;
    }
    
    console.log('✅ Campaigns caricate:', campaigns.length);
    console.log('✅ Leads caricati:', leads.length);
    
    // 4. Test statistiche
    console.log('\n📊 Calcolo statistiche...');
    
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent_amount, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.actual_impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.actual_clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.actual_conversions, 0);
    
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    const cpc = totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : '0.00';
    const cpa = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : '0.00';
    
    console.log(`💰 Budget Totale: €${totalBudget.toLocaleString()}`);
    console.log(`💸 Speso Totale: €${totalSpent.toLocaleString()}`);
    console.log(`👀 Impressioni: ${totalImpressions.toLocaleString()}`);
    console.log(`👆 Click: ${totalClicks.toLocaleString()}`);
    console.log(`🎯 Conversioni: ${totalConversions.toLocaleString()}`);
    console.log(`📈 CTR: ${ctr}%`);
    console.log(`💰 CPC: €${cpc}`);
    console.log(`🎯 CPA: €${cpa}`);
    console.log(`👥 Lead Totali: ${leads.length}`);
    
    // 5. Test aggiornamento
    console.log('\n🔍 Test aggiornamento campaign...');
    
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('campaigns')
      .update({ 
        spent_amount: testCampaign.spent_amount + 200,
        actual_impressions: testCampaign.actual_impressions + 2000,
        notes: 'Campaign aggiornata dal test'
      })
      .eq('id', campaign.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Errore aggiornamento campaign:', updateError);
      return false;
    }
    
    console.log('✅ Campaign aggiornata:', updatedCampaign.spent_amount);
    
    // 6. Test lead associato alla campaign
    console.log('\n🔍 Test caricamento lead per campaign...');
    
    const { data: campaignLeads, error: campaignLeadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', campaign.id);
    
    if (campaignLeadsError) {
      console.error('❌ Errore caricamento lead per campaign:', campaignLeadsError);
      return false;
    }
    
    console.log('✅ Lead associati alla campaign:', campaignLeads.length);
    
    return true;
  } catch (error) {
    console.error('❌ Errore generale:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Avvio test nuovo sistema marketing...\n');
  
  // Test connessione database
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Errore connessione database:', error);
      process.exit(1);
    }
    
    console.log('✅ Connessione database OK\n');
  } catch (err) {
    console.error('❌ Impossibile connettersi al database:', err);
    process.exit(1);
  }
  
  // Esegui test
  const success = await testNewMarketingSystem();
  
  console.log('\n🏁 RISULTATO:');
  if (success) {
    console.log('🎉 Tutti i test del nuovo sistema marketing sono PASSATI!');
    console.log('✅ Il nuovo sistema è pronto per l\'uso.');
    console.log('\n📋 Cosa è stato testato:');
    console.log('• Creazione campagne con schema corretto');
    console.log('• Creazione lead associati a campagne');
    console.log('• Caricamento dati con performance');
    console.log('• Calcolo statistiche marketing');
    console.log('• Aggiornamento dati esistenti');
    console.log('• Relazioni tra campaigns e leads');
  } else {
    console.log('❌ Alcuni test sono FALLITI.');
    console.log('⚠️  Controlla gli errori sopra e correggi.');
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testNewMarketingSystem };
