const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWarehouse() {
  console.log('🧪 Test Magazzino - Inizio');
  
  try {
    // Test 1: Carica articoli magazzino
    console.log('\n1. Test caricamento articoli magazzino...');
    const { data: items, error: itemsError } = await supabase
      .from('warehouse_items')
      .select('*')
      .eq('user_id', 'default-user')
      .order('name', { ascending: true });

    if (itemsError) {
      console.error('❌ Errore caricamento articoli:', itemsError.message);
    } else {
      console.log(`✅ Articoli caricati: ${items.length}`);
      if (items.length > 0) {
        console.log('   Primi 3 articoli:', items.slice(0, 3).map(item => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price
        })));
      }
    }

    // Test 2: Carica categorie
    console.log('\n2. Test caricamento categorie...');
    const { data: categories, error: categoriesError } = await supabase
      .from('warehouse_categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) {
      console.error('❌ Errore caricamento categorie:', categoriesError.message);
    } else {
      console.log(`✅ Categorie caricate: ${categories.length}`);
      if (categories.length > 0) {
        console.log('   Categorie:', categories.map(cat => cat.name));
      }
    }

    // Test 3: Carica posizioni
    console.log('\n3. Test caricamento posizioni...');
    const { data: locations, error: locationsError } = await supabase
      .from('warehouse_locations')
      .select('*')
      .order('name', { ascending: true });

    if (locationsError) {
      console.error('❌ Errore caricamento posizioni:', locationsError.message);
    } else {
      console.log(`✅ Posizioni caricate: ${locations.length}`);
      if (locations.length > 0) {
        console.log('   Posizioni:', locations.map(loc => loc.name));
      }
    }

    // Test 4: Carica preventivi
    console.log('\n4. Test caricamento preventivi...');
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', 'default-user')
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('❌ Errore caricamento preventivi:', quotesError.message);
    } else {
      console.log(`✅ Preventivi caricati: ${quotes.length}`);
      if (quotes.length > 0) {
        console.log('   Primi 2 preventivi:', quotes.slice(0, 2).map(quote => ({
          client_name: quote.client_name,
          total: quote.total,
          status: quote.status
        })));
      }
    }

    // Test 5: Carica articoli preventivo
    console.log('\n5. Test caricamento articoli preventivo...');
    const { data: quoteItems, error: quoteItemsError } = await supabase
      .from('quote_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (quoteItemsError) {
      console.error('❌ Errore caricamento articoli preventivo:', quoteItemsError.message);
    } else {
      console.log(`✅ Articoli preventivo caricati: ${quoteItems.length}`);
      if (quoteItems.length > 0) {
        console.log('   Primi 3 articoli:', quoteItems.slice(0, 3).map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        })));
      }
    }

    // Test 6: Carica transazioni
    console.log('\n6. Test caricamento transazioni...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('warehouse_transactions')
      .select('*')
      .eq('user_id', 'default-user')
      .order('timestamp', { ascending: false });

    if (transactionsError) {
      console.error('❌ Errore caricamento transazioni:', transactionsError.message);
    } else {
      console.log(`✅ Transazioni caricate: ${transactions.length}`);
      if (transactions.length > 0) {
        console.log('   Primi 3 transazioni:', transactions.slice(0, 3).map(trans => ({
          transaction_type: trans.transaction_type,
          quantity: trans.quantity,
          reason: trans.reason
        })));
      }
    }

    // Test 7: Inserisci articolo di test
    console.log('\n7. Test inserimento articolo...');
    const testItem = {
      user_id: 'default-user',
      name: 'Articolo Test Script',
      category: 'Test',
      quantity: 1,
      unit: 'pz',
      price: 15.00,
      description: 'Articolo di test inserito via script',
      sku: 'TEST-SCRIPT-001',
      location: 'Test',
      min_stock: 0,
      max_stock: 5
    };

    const { data: newItem, error: insertError } = await supabase
      .from('warehouse_items')
      .insert([testItem])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Errore inserimento articolo:', insertError.message);
    } else {
      console.log(`✅ Articolo inserito: ${newItem.name} (ID: ${newItem.id})`);
    }

    // Test 8: Inserisci preventivo di test
    console.log('\n8. Test inserimento preventivo...');
    const testQuote = {
      user_id: 'default-user',
      client_name: 'Cliente Test Script',
      client_email: 'test-script@example.com',
      client_address: 'Via Test Script 123',
      language: 'it',
      subtotal: 50.00,
      tax: 11.00,
      total: 61.00,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Preventivo di test inserito via script',
      status: 'draft'
    };

    const { data: newQuote, error: quoteInsertError } = await supabase
      .from('quotes')
      .insert([testQuote])
      .select()
      .single();

    if (quoteInsertError) {
      console.error('❌ Errore inserimento preventivo:', quoteInsertError.message);
    } else {
      console.log(`✅ Preventivo inserito: ${newQuote.client_name} (ID: ${newQuote.id})`);
    }

    console.log('\n🎉 Test Magazzino completato!');
    
  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui il test
testWarehouse();
