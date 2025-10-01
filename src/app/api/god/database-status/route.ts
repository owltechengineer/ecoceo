import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const status = {
      connected: false,
      tables: [] as string[],
      errors: [] as string[],
      lastCheck: new Date().toISOString()
    };

    // Test connessione
    try {
      const { data, error } = await supabase.from('dashboard_data').select('count', { count: 'exact', head: true });
      if (error) {
        status.errors.push(`Errore connessione: ${error.message}`);
      } else {
        status.connected = true;
      }
    } catch (error) {
      status.errors.push(`Errore connessione: ${error}`);
    }

    // Lista tabelle
    const expectedTables = [
      // Dashboard
      'dashboard_data', 'quick_tasks', 'recurring_activities',
      // Task e Calendario
      'task_calendar_tasks', 'task_calendar_appointments',
      // Marketing
      'marketing_campaigns', 'marketing_leads', 'marketing_budgets',
      // Progetti
      'projects',
      // Magazzino
      'warehouse_items', 'quotes', 'quote_items',
      // Finanziario
      'financial_revenues', 'financial_fixed_costs', 'financial_variable_costs',
      // Business Plan
      'business_plan_executive_summary', 'business_plan_market_analysis'
    ];

    // Verifica esistenza tabelle
    for (const table of expectedTables) {
      try {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (!error) {
          status.tables.push(table);
        } else {
          status.errors.push(`Tabella ${table} non trovata: ${error.message}`);
        }
      } catch (error) {
        status.errors.push(`Errore verifica tabella ${table}: ${error}`);
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      connected: false,
      tables: [],
      errors: [`Errore generale: ${error}`],
      lastCheck: new Date().toISOString()
    });
  }
}
