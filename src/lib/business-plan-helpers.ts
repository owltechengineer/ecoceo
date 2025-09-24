'use client';

import { supabase } from './supabase';

// Tipi che corrispondono alle tabelle reali in 05_BUSINESS_PLAN_TABLES.sql
export interface BusinessPlanExecutiveSummary {
  id?: string;
  user_id: string;
  business_plan_id?: string;
  company_overview?: string;
  mission_statement?: string;
  vision_statement?: string;
  values?: string[];
  key_highlights?: string[];
  unique_selling_proposition?: string;
  competitive_advantages?: string[];
  funding_requirements?: number;
  expected_revenue_year1?: number;
  expected_revenue_year3?: number;
  break_even_month?: number;
  key_team_members?: string[];
  advisory_board?: string[];
  immediate_next_steps?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BusinessPlanMarketAnalysis {
  id?: string;
  user_id: string;
  business_plan_id?: string;
  total_addressable_market?: number;
  serviceable_addressable_market?: number;
  serviceable_obtainable_market?: number;
  market_growth_rate?: number;
  target_customers?: string[];
  customer_segments?: any;
  customer_personas?: any;
  market_trends?: string[];
  industry_trends?: string[];
  technology_trends?: string[];
  direct_competitors?: string[];
  indirect_competitors?: string[];
  competitive_analysis?: any;
  market_entry_strategy?: string[];
  barriers_to_entry?: string[];
  created_at?: string;
  updated_at?: string;
}

// Helper per convertire i dati dal formato del componente al formato della tabella
export const businessPlanHelpers = {
  
  // Converte ExecutiveSummary del componente ai campi della tabella
  convertExecutiveSummary(data: any): BusinessPlanExecutiveSummary {
    return {
      user_id: 'default-user',
      company_overview: data.content || '',
      mission_statement: data.pitch || '',
      vision_statement: data.vision || '',
      values: data.values || [],
      key_highlights: data.highlights || [],
      unique_selling_proposition: data.usp || '',
      competitive_advantages: data.advantages || [],
      funding_requirements: data.funding || 0,
      expected_revenue_year1: data.revenueYear1 || 0,
      expected_revenue_year3: data.revenueYear3 || 0,
      break_even_month: data.breakEven || 0,
      key_team_members: data.team || [],
      advisory_board: data.advisors || [],
      immediate_next_steps: data.nextSteps || [],
      updated_at: new Date().toISOString()
    };
  },

  // Converte MarketAnalysis del componente ai campi della tabella  
  convertMarketAnalysis(data: any): BusinessPlanMarketAnalysis {
    return {
      user_id: 'default-user',
      total_addressable_market: data.tam || 0,
      serviceable_addressable_market: data.sam || 0,
      serviceable_obtainable_market: data.som || 0,
      market_growth_rate: data.growthRate || 0,
      target_customers: data.targetCustomers || [],
      customer_segments: data.demographics || {},
      customer_personas: data.personas || {},
      market_trends: data.trends || [],
      industry_trends: data.industryTrends || [],
      technology_trends: data.techTrends || [],
      direct_competitors: data.competitors?.map((c: any) => c.name) || [],
      indirect_competitors: data.indirectCompetitors || [],
      competitive_analysis: data.competitors || {},
      market_entry_strategy: data.entryStrategy || [],
      barriers_to_entry: data.barriers || [],
      updated_at: new Date().toISOString()
    };
  },

  // Salvataggio Executive Summary nella tabella corretta
  async saveExecutiveSummary(userId: string, data: any) {
    const convertedData = this.convertExecutiveSummary(data);
    convertedData.user_id = userId;

    const { data: result, error } = await supabase
      .from('business_plan_executive_summary')
      .upsert(convertedData, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('❌ Errore salvataggio Executive Summary:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: convertedData
      });
      throw new Error(`Errore salvataggio Executive Summary: ${error.message}`);
    }

    console.log('✅ Executive Summary salvato:', result);
    return result;
  },

  // Caricamento Executive Summary dalla tabella corretta
  async loadExecutiveSummary(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_executive_summary')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nessun record trovato - restituisci dati vuoti
        return {
          id: '1',
          content: '',
          pitch: '',
          documents: []
        };
      }
      console.error('❌ Errore caricamento Executive Summary:', error);
      throw error;
    }

    // Converte i dati della tabella al formato del componente
    return {
      id: data.id,
      content: data.company_overview || '',
      pitch: data.mission_statement || '',
      vision: data.vision_statement || '',
      values: data.values || [],
      highlights: data.key_highlights || [],
      usp: data.unique_selling_proposition || '',
      advantages: data.competitive_advantages || [],
      funding: data.funding_requirements || 0,
      revenueYear1: data.expected_revenue_year1 || 0,
      revenueYear3: data.expected_revenue_year3 || 0,
      breakEven: data.break_even_month || 0,
      team: data.key_team_members || [],
      advisors: data.advisory_board || [],
      nextSteps: data.immediate_next_steps || [],
      documents: []
    };
  },

  // Salvataggio Market Analysis nella tabella corretta
  async saveMarketAnalysis(userId: string, data: any) {
    const convertedData = this.convertMarketAnalysis(data);
    convertedData.user_id = userId;

    const { data: result, error } = await supabase
      .from('business_plan_market_analysis')
      .upsert(convertedData, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('❌ Errore salvataggio Market Analysis:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: convertedData
      });
      throw new Error(`Errore salvataggio Market Analysis: ${error.message}`);
    }

    console.log('✅ Market Analysis salvato:', result);
    return result;
  },

  // Caricamento Market Analysis dalla tabella corretta
  async loadMarketAnalysis(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_market_analysis')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nessun record trovato - restituisci dati vuoti
        return {
          id: '1',
          demographics: [],
          competitors: [],
          trends: []
        };
      }
      console.error('❌ Errore caricamento Market Analysis:', error);
      throw error;
    }

    // Converte i dati della tabella al formato del componente
    return {
      id: data.id,
      demographics: data.customer_segments || [],
      competitors: Array.isArray(data.competitive_analysis) ? data.competitive_analysis : 
                   (data.direct_competitors || []).map((name: string) => ({ name, strength: 'Medium' })),
      trends: data.market_trends || [],
      tam: data.total_addressable_market || 0,
      sam: data.serviceable_addressable_market || 0,
      som: data.serviceable_obtainable_market || 0,
      growthRate: data.market_growth_rate || 0,
      targetCustomers: data.target_customers || [],
      personas: data.customer_personas || {},
      industryTrends: data.industry_trends || [],
      techTrends: data.technology_trends || [],
      indirectCompetitors: data.indirect_competitors || [],
      entryStrategy: data.market_entry_strategy || [],
      barriers: data.barriers_to_entry || []
    };
  },

  // Test connessione con le tabelle reali
  async testConnection() {
    try {
      // Test tabella executive summary
      const { data: execData, error: execError } = await supabase
        .from('business_plan_executive_summary')
        .select('id')
        .limit(1);

      if (execError) {
        throw new Error(`Tabella business_plan_executive_summary: ${execError.message}`);
      }

      // Test tabella market analysis
      const { data: marketData, error: marketError } = await supabase
        .from('business_plan_market_analysis')
        .select('id')
        .limit(1);

      if (marketError) {
        throw new Error(`Tabella business_plan_market_analysis: ${marketError.message}`);
      }

      return {
        success: true,
        message: '✅ Tutte le tabelle Business Plan sono accessibili',
        tables: {
          executive_summary: 'OK',
          market_analysis: 'OK'
        }
      };

    } catch (error: any) {
      return {
        success: false,
        message: `❌ Errore connessione: ${error.message}`,
        error: error.message
      };
    }
  }

};
