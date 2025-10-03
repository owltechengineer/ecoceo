const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gwieustvitlezpssjkwf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinalSQL() {
  console.log('🧪 Test file SQL finale...');
  
  try {
    // Test 1: Inserisci quick tasks con valori corretti
    console.log('📋 Test 1: Inserisci quick tasks...');
    const { data: quickTasks, error: quickTasksError } = await supabase
      .from('quick_tasks')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440501',
          user_id: 'default-user',
          type: 'document',
          title: 'Aggiornare documentazione',
          description: 'Aggiornare la documentazione del progetto',
          stakeholder: 'Mario Rossi',
          priority: 'medium',
          status: 'pending',
          due_date: '2024-02-18T23:59:59Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440502',
          user_id: 'default-user',
          type: 'reminder',
          title: 'Eseguire test unitari',
          description: 'Eseguire tutti i test unitari per il modulo CRM',
          stakeholder: 'Giulia Bianchi',
          priority: 'high',
          status: 'pending',
          due_date: '2024-02-20T23:59:59Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440503',
          user_id: 'default-user',
          type: 'document',
          title: 'Code review',
          description: 'Review del codice per il modulo mobile',
          stakeholder: 'Luca Verdi',
          priority: 'medium',
          status: 'pending',
          due_date: '2024-02-22T23:59:59Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440504',
          user_id: 'default-user',
          type: 'order',
          title: 'Deploy in produzione',
          description: 'Deploy della versione 1.2 in produzione',
          stakeholder: 'Anna Neri',
          priority: 'high',
          status: 'pending',
          due_date: '2024-02-25T23:59:59Z'
        }
      ], { onConflict: 'id' })
      .select();

    if (quickTasksError) {
      console.error('❌ Errore quick tasks:', quickTasksError.message);
    } else {
      console.log('✅ Quick tasks inseriti:', quickTasks.length);
    }

    // Test 2: Inserisci progetti
    console.log('📋 Test 2: Inserisci progetti...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .upsert([
        {
          id: 'dae04797-b80a-408e-9017-11dc2aa459ed',
          user_id: 'default-user',
          name: 'Progetto Alpha',
          description: 'Progetto di sviluppo software per clienti enterprise',
          status: 'active',
          priority: 'high',
          start_date: '2024-02-01',
          end_date: '2024-12-31',
          budget: 100000.00,
          project_manager: 'Mario Rossi',
          team_members: ['Giulia Bianchi', 'Luca Verdi'],
          tags: ['enterprise', 'software', 'development'],
          notes: 'Progetto prioritario per il Q1 2024'
        }
      ], { onConflict: 'id' })
      .select();

    if (projectsError) {
      console.error('❌ Errore progetti:', projectsError.message);
    } else {
      console.log('✅ Progetti inseriti:', projects.length);
    }

    // Test 3: Inserisci task
    console.log('📋 Test 3: Inserisci task...');
    const { data: tasks, error: tasksError } = await supabase
      .from('task_calendar_tasks')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440201',
          user_id: 'default-user',
          title: 'Analisi Requisiti',
          description: 'Analisi dettagliata dei requisiti per l\'app mobile',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'Mario Rossi',
          due_date: '2024-02-15T23:59:59Z',
          category: 'analysis',
          project_id: 'aae04797-b80a-408e-9017-11dc2aa459ed'
        }
      ], { onConflict: 'id' })
      .select();

    if (tasksError) {
      console.error('❌ Errore task:', tasksError.message);
    } else {
      console.log('✅ Task inseriti:', tasks.length);
    }

    // Test 4: Inserisci dati magazzino
    console.log('📋 Test 4: Inserisci dati magazzino...');
    const { data: categories, error: categoriesError } = await supabase
      .from('warehouse_categories')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Elettronica',
          description: 'Componenti elettronici e dispositivi'
        }
      ], { onConflict: 'id' })
      .select();

    if (categoriesError) {
      console.error('❌ Errore categorie:', categoriesError.message);
    } else {
      console.log('✅ Categorie inserite:', categories.length);
    }

    console.log('\n🎉 Test completato!');
    console.log('📊 Riepilogo:');
    console.log(`- ✅ Quick Tasks: ${quickTasks?.length || 0}`);
    console.log(`- ✅ Progetti: ${projects?.length || 0}`);
    console.log(`- ✅ Task: ${tasks?.length || 0}`);
    console.log(`- ✅ Categorie: ${categories?.length || 0}`);

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui il test
testFinalSQL();
