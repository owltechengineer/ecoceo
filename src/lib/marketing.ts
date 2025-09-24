/**
 * MARKETING MODULE
 * Funzioni per gestire le operazioni marketing (campaigns e leads)
 * Allineato con docs/database/02_MARKETING_TABLES.sql
 */

import { supabase } from './supabase';

// ===== MARKETING INTERFACES =====

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'digital' | 'print' | 'tv' | 'radio' | 'outdoor' | 'social' | 'email' | 'other';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Budget e Costi
  budget: number;
  spent_amount: number;
  currency: string;
  // Date
  start_date: string; // TIMESTAMP WITH TIME ZONE
  end_date?: string; // TIMESTAMP WITH TIME ZONE
  // Team
  campaign_manager?: string;
  creative_director?: string;
  account_manager?: string;
  // Metrics
  target_impressions: number;
  target_clicks: number;
  target_conversions: number;
  actual_impressions: number;
  actual_clicks: number;
  actual_conversions: number;
  // Metadata
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  // Informazioni Personali
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  // Lead Information
  source: 'website' | 'social' | 'email' | 'referral' | 'advertising' | 'event' | 'cold_call' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  // Campaign
  campaign_id?: string;
  // Location
  country?: string;
  city?: string;
  address?: string;
  // Notes
  notes?: string;
  tags: string[];
  // Dates
  first_contact_date: string; // TIMESTAMP WITH TIME ZONE
  last_contact_date?: string; // TIMESTAMP WITH TIME ZONE
  next_followup_date?: string; // TIMESTAMP WITH TIME ZONE
  created_at: string;
  updated_at: string;
}

// ===== CAMPAIGN FUNCTIONS =====

export const createCampaign = async (
  campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>
): Promise<Campaign> => {
  try {
    console.log('🔍 Creating campaign:', campaignData.name);
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single();

    if (error) {
      console.error('❌ Campaign creation error:', error);
      throw new Error(`Campaign creation failed: ${error.message}`);
    }

    console.log('✅ Campaign created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Campaign creation error:', error);
    throw error;
  }
};

export const getCampaigns = async (userId: string = 'default-user'): Promise<Campaign[]> => {
  try {
    console.log('🔍 Loading campaigns for user:', userId);
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading campaigns:', error);
      throw new Error(`Failed to load campaigns: ${error.message}`);
    }

    console.log('✅ Campaigns loaded:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('❌ Error loading campaigns:', error);
    throw error;
  }
};

export const updateCampaign = async (
  id: string, 
  updates: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at'>>
): Promise<Campaign> => {
  try {
    console.log('🔍 Updating campaign:', id);
    
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Campaign update error:', error);
      throw new Error(`Campaign update failed: ${error.message}`);
    }

    console.log('✅ Campaign updated successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Campaign update error:', error);
    throw error;
  }
};

export const deleteCampaign = async (id: string): Promise<void> => {
  try {
    console.log('🔍 Deleting campaign:', id);
    
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Campaign deletion error:', error);
      throw new Error(`Campaign deletion failed: ${error.message}`);
    }

    console.log('✅ Campaign deleted successfully');
  } catch (error) {
    console.error('❌ Campaign deletion error:', error);
    throw error;
  }
};

// ===== LEAD FUNCTIONS =====

export const createLead = async (
  leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
): Promise<Lead> => {
  try {
    console.log('🔍 Creating lead:', leadData.email);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('❌ Lead creation error:', error);
      throw new Error(`Lead creation failed: ${error.message}`);
    }

    console.log('✅ Lead created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Lead creation error:', error);
    throw error;
  }
};

export const getLeads = async (userId: string = 'default-user'): Promise<Lead[]> => {
  try {
    console.log('🔍 Loading leads for user:', userId);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading leads:', error);
      throw new Error(`Failed to load leads: ${error.message}`);
    }

    console.log('✅ Leads loaded:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('❌ Error loading leads:', error);
    throw error;
  }
};

export const updateLead = async (
  id: string, 
  updates: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
): Promise<Lead> => {
  try {
    console.log('🔍 Updating lead:', id);
    
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Lead update error:', error);
      throw new Error(`Lead update failed: ${error.message}`);
    }

    console.log('✅ Lead updated successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Lead update error:', error);
    throw error;
  }
};

export const deleteLead = async (id: string): Promise<void> => {
  try {
    console.log('🔍 Deleting lead:', id);
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Lead deletion error:', error);
      throw new Error(`Lead deletion failed: ${error.message}`);
    }

    console.log('✅ Lead deleted successfully');
  } catch (error) {
    console.error('❌ Lead deletion error:', error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

export const getLeadsByCampaign = async (campaignId: string): Promise<Lead[]> => {
  try {
    console.log('🔍 Loading leads for campaign:', campaignId);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading leads by campaign:', error);
      throw new Error(`Failed to load leads by campaign: ${error.message}`);
    }

    console.log('✅ Leads by campaign loaded:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('❌ Error loading leads by campaign:', error);
    throw error;
  }
};

export const getMarketingStats = async (userId: string = 'default-user') => {
  try {
    console.log('🔍 Loading marketing stats for user:', userId);
    
    // Carica campaigns e leads in parallelo
    const [campaigns, leads] = await Promise.all([
      getCampaigns(userId),
      getLeads(userId)
    ]);

    // Calcola statistiche
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent_amount, 0);
    const totalLeads = leads.length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.actual_impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.actual_clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.actual_conversions, 0);

    // Calcola metriche
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const cpa = totalConversions > 0 ? totalSpent / totalConversions : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const stats = {
      campaigns: campaigns.length,
      leads: totalLeads,
      totalBudget,
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      ctr: Number(ctr.toFixed(2)),
      cpc: Number(cpc.toFixed(2)),
      cpa: Number(cpa.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(2)),
      budgetUtilization: totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(2)) : 0
    };

    console.log('✅ Marketing stats calculated:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error calculating marketing stats:', error);
    throw error;
  }
};

// ===== HELPER FUNCTIONS =====

export const validateCampaignData = (data: Partial<Campaign>): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) errors.push('Il nome della campagna è obbligatorio');
  if (!data.type) errors.push('Il tipo di campagna è obbligatorio');
  if (!data.status) errors.push('Lo stato della campagna è obbligatorio');
  if (typeof data.budget !== 'number' || data.budget < 0) errors.push('Il budget deve essere un numero positivo');
  if (!data.start_date) errors.push('La data di inizio è obbligatoria');
  
  return errors;
};

export const validateLeadData = (data: Partial<Lead>): string[] => {
  const errors: string[] = [];
  
  if (!data.first_name?.trim()) errors.push('Il nome è obbligatorio');
  if (!data.last_name?.trim()) errors.push('Il cognome è obbligatorio');
  if (!data.email?.trim()) errors.push('L\'email è obbligatoria');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('L\'email non è valida');
  if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) errors.push('Il punteggio deve essere tra 0 e 100');
  
  return errors;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  try {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};
