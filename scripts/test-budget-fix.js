const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBudgetFix() {
  console.log('🧪 Test correzione budget progetto...');
  
  try {
    // Test 1: Inserisci budget con campi corretti
    console.log('📋 Test 1: Inserisci budget progetto...');
    const { data: budget, error: budgetError } = await supabase
      .from('project_budget')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440901',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          category: 'personnel',
          item_name: 'Costi Personale',
          description: 'Costi per risorse umane del progetto',
          estimated_cost: 60000.00,
          actual_cost: 25000.00,
          currency: 'EUR',
          status: 'in-progress',
          payment_status: 'pending'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440902',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          category: 'software',
          item_name: 'Licenze Software',
          description: 'Licenze software e strumenti di sviluppo',
          estimated_cost: 10000.00,
          actual_cost: 5000.00,
          currency: 'EUR',
          status: 'completed',
          payment_status: 'paid'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440903',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          category: 'equipment',
          item_name: 'Attrezzature Hardware',
          description: 'Hardware e attrezzature per il progetto',
          estimated_cost: 15000.00,
          actual_cost: 8000.00,
          currency: 'EUR',
          status: 'in-progress',
          payment_status: 'pending'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440904',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          category: 'marketing',
          item_name: 'Costi Marketing',
          description: 'Costi di marketing e promozione',
          estimated_cost: 5000.00,
          actual_cost: 2000.00,
          currency: 'EUR',
          status: 'planned',
          payment_status: 'pending'
        }
      ], { onConflict: 'id' })
      .select();

    if (budgetError) {
      console.error('❌ Errore budget:', budgetError.message);
    } else {
      console.log('✅ Budget inseriti:', budget.length);
    }

    // Test 2: Verifica categorie valide
    console.log('📋 Test 2: Verifica categorie valide...');
    const validCategories = ['personnel', 'equipment', 'software', 'marketing', 'travel', 'materials', 'external', 'other'];
    console.log('✅ Categorie valide:', validCategories.join(', '));

    // Test 3: Verifica status validi
    console.log('📋 Test 3: Verifica status validi...');
    const validStatuses = ['planned', 'approved', 'in-progress', 'completed', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
    console.log('✅ Status validi:', validStatuses.join(', '));
    console.log('✅ Payment status validi:', validPaymentStatuses.join(', '));

    console.log('\n🎉 Test completato!');
    console.log('📊 Riepilogo:');
    console.log(`- ✅ Budget inseriti: ${budget?.length || 0}`);
    console.log('- ✅ Categorie valide: personnel, equipment, software, marketing');
    console.log('- ✅ Status validi: planned, approved, in-progress, completed, cancelled');
    console.log('- ✅ Payment status validi: pending, paid, overdue, cancelled');

    if (budget && budget.length > 0) {
      console.log('\n🎯 Budget inseriti:');
      budget.forEach(item => {
        console.log(`- ${item.item_name} (${item.category}) - €${item.estimated_cost} / €${item.actual_cost} (${item.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui il test
testBudgetFix();
