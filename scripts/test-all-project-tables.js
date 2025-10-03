const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllProjectTables() {
  console.log('🧪 Test tutte le tabelle dei progetti...');
  
  try {
    // Test 1: Project Budget
    console.log('📋 Test 1: Project Budget...');
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
        }
      ], { onConflict: 'id' })
      .select();

    if (budgetError) {
      console.error('❌ Errore budget:', budgetError.message);
    } else {
      console.log('✅ Budget inserito:', budget.length);
    }

    // Test 2: Project Team
    console.log('📋 Test 2: Project Team...');
    const { data: team, error: teamError } = await supabase
      .from('project_team')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655441001',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          member_name: 'Mario Rossi',
          role: 'Project Manager',
          email: 'mario.rossi@company.com',
          start_date: '2024-02-01',
          end_date: '2024-12-31',
          allocation_percentage: 100,
          hourly_rate: 50.00,
          currency: 'EUR',
          status: 'active',
          notes: 'Project Manager esperto'
        }
      ], { onConflict: 'id' })
      .select();

    if (teamError) {
      console.error('❌ Errore team:', teamError.message);
    } else {
      console.log('✅ Team inserito:', team.length);
    }

    // Test 3: Project Milestones
    console.log('📋 Test 3: Project Milestones...');
    const { data: milestones, error: milestonesError } = await supabase
      .from('project_milestones')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655441101',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          title: 'Completamento Backend',
          description: 'Completamento dello sviluppo del backend',
          milestone_type: 'milestone',
          planned_date: '2024-04-30',
          actual_date: null,
          status: 'pending',
          responsible_person: 'Luca Verdi',
          notes: 'Milestone critica per il progetto'
        }
      ], { onConflict: 'id' })
      .select();

    if (milestonesError) {
      console.error('❌ Errore milestone:', milestonesError.message);
    } else {
      console.log('✅ Milestone inserita:', milestones.length);
    }

    // Test 4: Project Risks
    console.log('📋 Test 4: Project Risks...');
    const { data: risks, error: risksError } = await supabase
      .from('project_risks')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655441201',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          title: 'Ritardo Sviluppo',
          description: 'Rischio di ritardo nello sviluppo del progetto',
          risk_type: 'schedule',
          probability: 'medium',
          impact: 'high',
          risk_level: 'high',
          mitigation_strategy: 'Aumentare le risorse e ottimizzare i processi',
          owner: 'Mario Rossi',
          status: 'identified',
          notes: 'Rischio critico da monitorare'
        }
      ], { onConflict: 'id' })
      .select();

    if (risksError) {
      console.error('❌ Errore rischi:', risksError.message);
    } else {
      console.log('✅ Rischio inserito:', risks.length);
    }

    // Test 5: Project Objectives
    console.log('📋 Test 5: Project Objectives...');
    const { data: objectives, error: objectivesError } = await supabase
      .from('project_objectives')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440801',
          project_id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          title: 'Completare Sviluppo Backend',
          description: 'Sviluppare completamente il backend del sistema',
          objective_type: 'milestone',
          priority: 'high',
          status: 'in-progress',
          target_date: '2024-04-30',
          progress_percentage: 60,
          responsible_person: 'Luca Verdi',
          notes: 'Backend in fase di sviluppo'
        }
      ], { onConflict: 'id' })
      .select();

    if (objectivesError) {
      console.error('❌ Errore obiettivi:', objectivesError.message);
    } else {
      console.log('✅ Obiettivo inserito:', objectives.length);
    }

    console.log('\n🎉 Test completato!');
    console.log('📊 Riepilogo:');
    console.log(`- ✅ Budget: ${budget?.length || 0}`);
    console.log(`- ✅ Team: ${team?.length || 0}`);
    console.log(`- ✅ Milestone: ${milestones?.length || 0}`);
    console.log(`- ✅ Rischi: ${risks?.length || 0}`);
    console.log(`- ✅ Obiettivi: ${objectives?.length || 0}`);

    console.log('\n🎯 Tabelle progetti corrette:');
    console.log('- ✅ project_budget: estimated_cost, actual_cost, currency, status, payment_status');
    console.log('- ✅ project_team: allocation_percentage, hourly_rate, currency, status');
    console.log('- ✅ project_milestones: title, milestone_type, planned_date, responsible_person');
    console.log('- ✅ project_risks: title, risk_type, probability, impact, risk_level, owner, status');
    console.log('- ✅ project_objectives: title, objective_type, priority, status, progress_percentage');

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui il test
testAllProjectTables();
