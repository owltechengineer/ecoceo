const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBrowserWarehouse() {
  console.log('🧪 Test sistema magazzino per browser...');
  
  try {
    // Test 1: Carica categorie magazzino
    console.log('📋 Test 1: Carica categorie magazzino...');
    const { data: categories, error: categoriesError } = await supabase
      .from('warehouse_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Errore categorie:', categoriesError.message);
    } else {
      console.log('✅ Categorie caricate:', categories.length);
    }

    // Test 2: Carica posizioni magazzino
    console.log('📋 Test 2: Carica posizioni magazzino...');
    const { data: locations, error: locationsError } = await supabase
      .from('warehouse_locations')
      .select('*');
    
    if (locationsError) {
      console.error('❌ Errore posizioni:', locationsError.message);
    } else {
      console.log('✅ Posizioni caricate:', locations.length);
    }

    // Test 3: Carica articoli magazzino
    console.log('📋 Test 3: Carica articoli magazzino...');
    const { data: items, error: itemsError } = await supabase
      .from('warehouse_items')
      .select('*');
    
    if (itemsError) {
      console.error('❌ Errore articoli:', itemsError.message);
    } else {
      console.log('✅ Articoli caricati:', items.length);
    }

    // Test 4: Carica preventivi
    console.log('📋 Test 4: Carica preventivi...');
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*');
    
    if (quotesError) {
      console.error('❌ Errore preventivi:', quotesError.message);
    } else {
      console.log('✅ Preventivi caricati:', quotes.length);
    }

    // Test 5: Carica progetti
    console.log('📋 Test 5: Carica progetti...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');
    
    if (projectsError) {
      console.error('❌ Errore progetti:', projectsError.message);
    } else {
      console.log('✅ Progetti caricati:', projects.length);
    }

    // Test 6: Carica task
    console.log('📋 Test 6: Carica task...');
    const { data: tasks, error: tasksError } = await supabase
      .from('task_calendar_tasks')
      .select('*');
    
    if (tasksError) {
      console.error('❌ Errore task:', tasksError.message);
    } else {
      console.log('✅ Task caricati:', tasks.length);
    }

    // Test 7: Carica campagne
    console.log('📋 Test 7: Carica campagne...');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*');
    
    if (campaignsError) {
      console.error('❌ Errore campagne:', campaignsError.message);
    } else {
      console.log('✅ Campagne caricate:', campaigns.length);
    }

    // Test 8: Carica lead
    console.log('📋 Test 8: Carica lead...');
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*');
    
    if (leadsError) {
      console.error('❌ Errore lead:', leadsError.message);
    } else {
      console.log('✅ Lead caricati:', leads.length);
    }

    console.log('\n🎉 Test completato!');
    console.log('📊 Riepilogo:');
    console.log(`- ✅ Categorie: ${categories?.length || 0}`);
    console.log(`- ✅ Posizioni: ${locations?.length || 0}`);
    console.log(`- ✅ Articoli: ${items?.length || 0}`);
    console.log(`- ✅ Preventivi: ${quotes?.length || 0}`);
    console.log(`- ✅ Progetti: ${projects?.length || 0}`);
    console.log(`- ✅ Task: ${tasks?.length || 0}`);
    console.log(`- ✅ Campagne: ${campaigns?.length || 0}`);
    console.log(`- ✅ Lead: ${leads?.length || 0}`);

    if (items && items.length > 0) {
      console.log('\n🎯 Dati magazzino disponibili:');
      items.forEach(item => {
        console.log(`- ${item.name} (${item.quantity} ${item.unit}) - €${item.price}`);
      });
    }

    if (quotes && quotes.length > 0) {
      console.log('\n🎯 Preventivi disponibili:');
      quotes.forEach(quote => {
        console.log(`- ${quote.client_name} - €${quote.total} (${quote.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui il test
testBrowserWarehouse();
