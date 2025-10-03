const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateWarehouseFixed() {
  console.log('🏪 Inserimento dati magazzino corretti...');
  
  try {
    // 1. Inserisci categorie magazzino (con ON CONFLICT)
    console.log('📂 Inserimento categorie magazzino...');
    const { data: categories, error: categoriesError } = await supabase
      .from('warehouse_categories')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Elettronica',
          description: 'Componenti elettronici e dispositivi'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Accessori',
          description: 'Accessori e componenti di supporto'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Software',
          description: 'Licenze software e servizi digitali'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Servizi',
          description: 'Servizi professionali e consulenza'
        }
      ], { onConflict: 'id' })
      .select();

    if (categoriesError) {
      console.error('❌ Errore categorie:', categoriesError.message);
    } else {
      console.log('✅ Categorie inserite/aggiornate:', categories.length);
    }

    // 2. Inserisci posizioni magazzino (con ON CONFLICT)
    console.log('📍 Inserimento posizioni magazzino...');
    const { data: locations, error: locationsError } = await supabase
      .from('warehouse_locations')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440101',
          name: 'Magazzino A',
          description: 'Magazzino principale',
          capacity: 1000
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440102',
          name: 'Magazzino B',
          description: 'Magazzino secondario',
          capacity: 500
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440103',
          name: 'Ufficio',
          description: 'Deposito ufficio',
          capacity: 100
        }
      ], { onConflict: 'id' })
      .select();

    if (locationsError) {
      console.error('❌ Errore posizioni:', locationsError.message);
    } else {
      console.log('✅ Posizioni inserite/aggiornate:', locations.length);
    }

    // 3. Inserisci articoli magazzino (con ON CONFLICT)
    console.log('📦 Inserimento articoli magazzino...');
    const { data: items, error: itemsError } = await supabase
      .from('warehouse_items')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655441001',
          user_id: 'default-user',
          name: 'Laptop Dell XPS 13',
          category: 'Elettronica',
          quantity: 5,
          unit: 'pz',
          price: 1200.00,
          description: 'Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB',
          sku: 'DELL-XPS13-001',
          location: 'Magazzino A',
          min_stock: 2,
          max_stock: 10
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441002',
          user_id: 'default-user',
          name: 'Mouse Wireless Logitech',
          category: 'Accessori',
          quantity: 25,
          unit: 'pz',
          price: 25.00,
          description: 'Mouse wireless ergonomico con batteria ricaricabile',
          sku: 'LOG-MOUSE-001',
          location: 'Magazzino A',
          min_stock: 10,
          max_stock: 50
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441003',
          user_id: 'default-user',
          name: 'Licenza Microsoft Office 365',
          category: 'Software',
          quantity: 10,
          unit: 'lic',
          price: 150.00,
          description: 'Licenza annuale Office 365 Business',
          sku: 'MS-OFFICE-365',
          location: 'Ufficio',
          min_stock: 5,
          max_stock: 20
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441004',
          user_id: 'default-user',
          name: 'Monitor 27" 4K',
          category: 'Elettronica',
          quantity: 8,
          unit: 'pz',
          price: 400.00,
          description: 'Monitor 27 pollici 4K IPS con USB-C',
          sku: 'MON-27-4K-001',
          location: 'Magazzino B',
          min_stock: 3,
          max_stock: 15
        },
        {
          id: '550e8400-e29b-41d4-a716-446655441005',
          user_id: 'default-user',
          name: 'Servizio Consulenza IT',
          category: 'Servizi',
          quantity: 100,
          unit: 'ore',
          price: 80.00,
          description: 'Consulenza tecnica specializzata',
          sku: 'SERV-CONS-IT',
          location: 'Ufficio',
          min_stock: 0,
          max_stock: 0
        }
      ], { onConflict: 'id' })
      .select();

    if (itemsError) {
      console.error('❌ Errore articoli:', itemsError.message);
    } else {
      console.log('✅ Articoli inseriti/aggiornati:', items.length);
    }

    // 4. Inserisci transazioni magazzino
    console.log('📊 Inserimento transazioni magazzino...');
    const { data: transactions, error: transactionsError } = await supabase
      .from('warehouse_transactions')
      .insert([
        {
          item_id: '550e8400-e29b-41d4-a716-446655441001',
          transaction_type: 'in',
          quantity: 5,
          reason: 'Acquisto iniziale stock',
          user_id: 'default-user'
        },
        {
          item_id: '550e8400-e29b-41d4-a716-446655441002',
          transaction_type: 'in',
          quantity: 25,
          reason: 'Acquisto stock accessori',
          user_id: 'default-user'
        },
        {
          item_id: '550e8400-e29b-41d4-a716-446655441003',
          transaction_type: 'in',
          quantity: 10,
          reason: 'Acquisto licenze software',
          user_id: 'default-user'
        },
        {
          item_id: '550e8400-e29b-41d4-a716-446655441004',
          transaction_type: 'in',
          quantity: 8,
          reason: 'Acquisto monitor',
          user_id: 'default-user'
        },
        {
          item_id: '550e8400-e29b-41d4-a716-446655441005',
          transaction_type: 'in',
          quantity: 100,
          reason: 'Disponibilità servizi',
          user_id: 'default-user'
        }
      ])
      .select();

    if (transactionsError) {
      console.error('❌ Errore transazioni:', transactionsError.message);
    } else {
      console.log('✅ Transazioni inserite:', transactions.length);
    }

    // 5. Inserisci preventivi (con ON CONFLICT)
    console.log('📋 Inserimento preventivi...');
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655442001',
          user_id: 'default-user',
          client_name: 'TechCorp SRL',
          client_email: 'info@techcorp.it',
          client_address: 'Via Roma 123, Milano',
          language: 'it',
          subtotal: 2500.00,
          tax: 550.00,
          total: 3050.00,
          valid_until: '2024-03-15T23:59:59Z',
          notes: 'Preventivo per attrezzature ufficio',
          status: 'sent'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655442002',
          user_id: 'default-user',
          client_name: 'StartupXYZ',
          client_email: 'admin@startupxyz.com',
          client_address: 'Corso Italia 456, Torino',
          language: 'it',
          subtotal: 1200.00,
          tax: 264.00,
          total: 1464.00,
          valid_until: '2024-03-20T23:59:59Z',
          notes: 'Preventivo per licenze software',
          status: 'draft'
        }
      ], { onConflict: 'id' })
      .select();

    if (quotesError) {
      console.error('❌ Errore preventivi:', quotesError.message);
    } else {
      console.log('✅ Preventivi inseriti/aggiornati:', quotes.length);
    }

    // 6. Inserisci articoli preventivo
    console.log('🛒 Inserimento articoli preventivo...');
    const { data: quoteItems, error: quoteItemsError } = await supabase
      .from('quote_items')
      .insert([
        {
          quote_id: '550e8400-e29b-41d4-a716-446655442001',
          item_id: '550e8400-e29b-41d4-a716-446655441001',
          name: 'Laptop Dell XPS 13',
          description: 'Laptop ultrabook con processore Intel i7',
          quantity: 2,
          unit_price: 1200.00,
          total: 2400.00
        },
        {
          quote_id: '550e8400-e29b-41d4-a716-446655442001',
          item_id: '550e8400-e29b-41d4-a716-446655441002',
          name: 'Mouse Wireless Logitech',
          description: 'Mouse wireless ergonomico',
          quantity: 4,
          unit_price: 25.00,
          total: 100.00
        },
        {
          quote_id: '550e8400-e29b-41d4-a716-446655442002',
          item_id: '550e8400-e29b-41d4-a716-446655441003',
          name: 'Licenza Microsoft Office 365',
          description: 'Licenza annuale Office 365 Business',
          quantity: 8,
          unit_price: 150.00,
          total: 1200.00
        }
      ])
      .select();

    if (quoteItemsError) {
      console.error('❌ Errore articoli preventivo:', quoteItemsError.message);
    } else {
      console.log('✅ Articoli preventivo inseriti:', quoteItems.length);
    }

    console.log('🎉 Dati magazzino inseriti con successo!');
    console.log('📊 Riepilogo:');
    console.log(`- ${categories?.length || 0} categorie`);
    console.log(`- ${locations?.length || 0} posizioni`);
    console.log(`- ${items?.length || 0} articoli`);
    console.log(`- ${transactions?.length || 0} transazioni`);
    console.log(`- ${quotes?.length || 0} preventivi`);
    console.log(`- ${quoteItems?.length || 0} articoli preventivo`);

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui l'inserimento
populateWarehouseFixed();
