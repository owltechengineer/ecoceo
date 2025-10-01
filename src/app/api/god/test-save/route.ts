import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { section } = await request.json();
    
    let testData: any = {};
    let tableName = '';
    let success = false;
    let error = '';

    // Dati di test per ogni sezione
    switch (section) {
      case 'Dashboard':
        tableName = 'dashboard_data';
        testData = {
          user_id: 'test-user',
          section: 'test',
          data: { test: 'dashboard test' },
          last_updated: new Date().toISOString()
        };
        break;

      case 'Task e Calendario':
        tableName = 'task_calendar_tasks';
        testData = {
          user_id: 'test-user',
          title: 'Test Task',
          description: 'Task di test per debug',
          status: 'pending',
          priority: 'medium',
          due_date: new Date().toISOString()
        };
        break;

      case 'Marketing':
        tableName = 'marketing_campaigns';
        testData = {
          user_id: 'test-user',
          name: 'Test Campaign',
          description: 'Campagna di test per debug',
          status: 'draft',
          budget: 1000,
          start_date: new Date().toISOString()
        };
        break;

      case 'Progetti':
        tableName = 'projects';
        testData = {
          user_id: 'test-user',
          title: 'Test Project',
          main_objective: 'Test objective',
          problem_solved: 'Test problem',
          solution_description: 'Test solution',
          status: 'draft',
          priority: 'medium'
        };
        break;

      case 'Magazzino':
        tableName = 'warehouse_items';
        testData = {
          user_id: 'test-user',
          name: 'Test Item',
          description: 'Item di test per debug',
          category: 'Test',
          sku: 'TEST-001',
          price: 10.00,
          stock_quantity: 100
        };
        break;

      case 'Finanziario':
        tableName = 'financial_revenues';
        testData = {
          user_id: 'test-user',
          name: 'Test Revenue',
          description: 'Revenue di test per debug',
          amount: 1000.00,
          category: 'Test',
          date: new Date().toISOString()
        };
        break;

      case 'Business Plan':
        tableName = 'business_plan_executive_summary';
        testData = {
          user_id: 'test-user',
          company_name: 'Test Company',
          executive_summary: 'Test executive summary',
          mission: 'Test mission',
          vision: 'Test vision'
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          message: `Sezione ${section} non riconosciuta`
        });
    }

    // Test inserimento
    try {
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(testData)
        .select();

      if (insertError) {
        error = `Errore inserimento: ${insertError.message}`;
      } else {
        success = true;
        
        // Pulisci il test data
        if (data && data.length > 0) {
          await supabase
            .from(tableName)
            .delete()
            .eq('id', data[0].id);
        }
      }
    } catch (err) {
      error = `Errore: ${err}`;
    }

    return NextResponse.json({
      success,
      message: success 
        ? `✅ ${section}: Salvataggio funzionante!`
        : `❌ ${section}: ${error}`,
      table: tableName,
      error: error || null
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Errore generale: ${error}`
    });
  }
}
