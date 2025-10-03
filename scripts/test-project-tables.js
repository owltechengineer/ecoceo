/**
 * Test script per verificare che le tabelle dei progetti funzionino correttamente
 * Esegui questo script dopo aver creato le tabelle in Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = 'https://febpscjreqtxxpvjlqxd.supabase.co';
const supabaseAnonKey = 'sb_publishable_l6xuRDnwya9ZoT_A56e5-w_KxOq3JKO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectTables() {
  console.log('🧪 Test delle tabelle progetti...\n');

  try {
    // Test 1: Verifica esistenza tabelle
    console.log('1️⃣ Verifica esistenza tabelle...');
    const tables = ['projects', 'project_objectives', 'project_budget', 'project_team', 'project_milestones', 'project_risks'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }

    console.log('\n2️⃣ Test caricamento dati...');
    
    // Test 2: Caricamento progetti
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.log(`❌ Errore caricamento progetti: ${projectsError.message}`);
    } else {
      console.log(`✅ Progetti caricati: ${projects.length}`);
    }

    // Test 3: Caricamento obiettivi
    const { data: objectives, error: objectivesError } = await supabase
      .from('project_objectives')
      .select('*')
      .limit(5);
    
    if (objectivesError) {
      console.log(`❌ Errore caricamento obiettivi: ${objectivesError.message}`);
    } else {
      console.log(`✅ Obiettivi caricati: ${objectives.length}`);
    }

    // Test 4: Caricamento budget
    const { data: budget, error: budgetError } = await supabase
      .from('project_budget')
      .select('*')
      .limit(5);
    
    if (budgetError) {
      console.log(`❌ Errore caricamento budget: ${budgetError.message}`);
    } else {
      console.log(`✅ Budget caricato: ${budget.length}`);
    }

    // Test 5: Caricamento team
    const { data: team, error: teamError } = await supabase
      .from('project_team')
      .select('*')
      .limit(5);
    
    if (teamError) {
      console.log(`❌ Errore caricamento team: ${teamError.message}`);
    } else {
      console.log(`✅ Team caricato: ${team.length}`);
    }

    // Test 6: Caricamento milestone
    const { data: milestones, error: milestonesError } = await supabase
      .from('project_milestones')
      .select('*')
      .limit(5);
    
    if (milestonesError) {
      console.log(`❌ Errore caricamento milestone: ${milestonesError.message}`);
    } else {
      console.log(`✅ Milestone caricati: ${milestones.length}`);
    }

    // Test 7: Caricamento rischi
    const { data: risks, error: risksError } = await supabase
      .from('project_risks')
      .select('*')
      .limit(5);
    
    if (risksError) {
      console.log(`❌ Errore caricamento rischi: ${risksError.message}`);
    } else {
      console.log(`✅ Rischi caricati: ${risks.length}`);
    }

    console.log('\n3️⃣ Test statistiche progetto...');
    
    // Test 8: Test funzione getProjectStats (se esiste un progetto)
    if (projects && projects.length > 0) {
      const projectId = projects[0].id;
      console.log(`📊 Test statistiche per progetto: ${projectId}`);
      
      // Carica tutti i dati per il progetto
      const [objectives, budget, team, milestones, risks] = await Promise.all([
        supabase.from('project_objectives').select('*').eq('project_id', projectId),
        supabase.from('project_budget').select('*').eq('project_id', projectId),
        supabase.from('project_team').select('*').eq('project_id', projectId),
        supabase.from('project_milestones').select('*').eq('project_id', projectId),
        supabase.from('project_risks').select('*').eq('project_id', projectId)
      ]);

      console.log(`📈 Obiettivi: ${objectives.data?.length || 0}`);
      console.log(`💰 Budget items: ${budget.data?.length || 0}`);
      console.log(`👥 Team members: ${team.data?.length || 0}`);
      console.log(`🎯 Milestone: ${milestones.data?.length || 0}`);
      console.log(`⚠️ Rischi: ${risks.data?.length || 0}`);
    }

    console.log('\n✅ Test completato!');
    console.log('\n📋 ISTRUZIONI:');
    console.log('1. Se tutti i test sono ✅, le tabelle sono configurate correttamente');
    console.log('2. Se ci sono errori ❌, controlla che lo script SQL sia stato eseguito');
    console.log('3. Vai alla dashboard e testa la card "Progetti"');

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }
}

// Esegui il test
testProjectTables();
