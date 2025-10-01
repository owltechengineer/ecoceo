#!/usr/bin/env node

// =====================================================
// 🧪 TEST DOPO FIX USER_ID
// =====================================================
// Verifica che le colonne user_id siano state aggiunte
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserIdColumns() {
  console.log('🔍 TEST COLONNE USER_ID DOPO FIX:');
  console.log('==================================\n');
  
  const userTables = [
    'task_calendar_projects',
    'task_calendar_tasks',
    'task_calendar_appointments', 
    'recurring_activities',
    'quick_tasks'
  ];
  
  let allOk = true;
  
  for (const table of userTables) {
    try {
      console.log(`🔍 Testando user_id in ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('user_id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('user_id')) {
          console.log(`❌ ${table}: Colonna user_id ancora mancante`);
          allOk = false;
        } else {
          console.log(`❌ ${table}: ${error.message}`);
          allOk = false;
        }
      } else {
        console.log(`✅ ${table}: Colonna user_id OK`);
      }
      
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      allOk = false;
    }
  }
  
  console.log('\n📋 RISULTATO:');
  if (allOk) {
    console.log('🎉 TUTTE LE COLONNE USER_ID SONO OK!');
    console.log('✅ Il database è pronto per l\'uso!');
  } else {
    console.log('❌ ALCUNE COLONNE USER_ID SONO ANCORA MANCANTI');
    console.log('🔧 Esegui FIX_USER_ID_COLUMNS.sql in Supabase');
  }
  
  return allOk;
}

// Esegui test
testUserIdColumns().catch(console.error);
