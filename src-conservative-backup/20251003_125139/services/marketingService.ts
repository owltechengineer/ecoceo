/**
 * MARKETING SERVICE
 * Servizio centralizzato per tutte le operazioni marketing
 * Utilizza il modulo marketing per le operazioni CRUD
 */

import {
  Campaign,
  Lead,
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadsByCampaign,
  getMarketingStats,
  validateCampaignData,
  validateLeadData,
  formatDate,
  formatCurrency
} from '@/lib/marketing';

export interface MarketingServiceInterface {
  // Campaign methods
  createCampaign(data: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign>;
  getCampaigns(userId?: string): Promise<Campaign[]>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  
  // Lead methods
  createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead>;
  getLeads(userId?: string): Promise<Lead[]>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  
  // Utility methods
  getLeadsByCampaign(campaignId: string): Promise<Lead[]>;
  getMarketingStats(userId?: string): Promise<any>;
}

export class MarketingService implements MarketingServiceInterface {
  private static instance: MarketingService;
  private userId: string = 'default-user';

  private constructor() {}

  public static getInstance(): MarketingService {
    if (!MarketingService.instance) {
      MarketingService.instance = new MarketingService();
    }
    return MarketingService.instance;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // ===== CAMPAIGN METHODS =====

  async createCampaign(data: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    try {
      // Validazione dati
      const errors = validateCampaignData(data);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }

      // Prepara dati con user_id
      const campaignData = {
        ...data,
        user_id: this.userId,
        // Assicura che i campi numerici abbiano valori validi
        budget: data.budget || 0,
        spent_amount: data.spent_amount || 0,
        target_impressions: data.target_impressions || 0,
        target_clicks: data.target_clicks || 0,
        target_conversions: data.target_conversions || 0,
        actual_impressions: data.actual_impressions || 0,
        actual_clicks: data.actual_clicks || 0,
        actual_conversions: data.actual_conversions || 0,
        tags: data.tags || [],
        // Converte le date in formato ISO se necessario
        start_date: this.ensureISODate(data.start_date),
        end_date: data.end_date ? this.ensureISODate(data.end_date) : undefined
      };

      return await createCampaign(campaignData);
    } catch (error) {
      console.error('MarketingService.createCampaign error:', error);
      throw error;
    }
  }

  async getCampaigns(userId?: string): Promise<Campaign[]> {
    try {
      return await getCampaigns(userId || this.userId);
    } catch (error) {
      console.error('MarketingService.getCampaigns error:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    try {
      // Rimuovi campi che non dovrebbero essere aggiornati
      const { created_at, updated_at, ...safeUpdates } = updates as any;
      
      // Converte le date se presenti
      if (safeUpdates.start_date) {
        safeUpdates.start_date = this.ensureISODate(safeUpdates.start_date);
      }
      if (safeUpdates.end_date) {
        safeUpdates.end_date = this.ensureISODate(safeUpdates.end_date);
      }

      return await updateCampaign(id, safeUpdates);
    } catch (error) {
      console.error('MarketingService.updateCampaign error:', error);
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      return await deleteCampaign(id);
    } catch (error) {
      console.error('MarketingService.deleteCampaign error:', error);
      throw error;
    }
  }

  // ===== LEAD METHODS =====

  async createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    try {
      // Validazione dati
      const errors = validateLeadData(data);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }

      // Prepara dati con user_id
      const leadData = {
        ...data,
        user_id: this.userId,
        // Assicura che i campi abbiano valori validi
        score: data.score || 0,
        tags: data.tags || [],
        // Converte le date in formato ISO se necessario
        first_contact_date: this.ensureISODate(data.first_contact_date || new Date().toISOString()),
        last_contact_date: data.last_contact_date ? this.ensureISODate(data.last_contact_date) : undefined,
        next_followup_date: data.next_followup_date ? this.ensureISODate(data.next_followup_date) : undefined
      };

      return await createLead(leadData);
    } catch (error) {
      console.error('MarketingService.createLead error:', error);
      throw error;
    }
  }

  async getLeads(userId?: string): Promise<Lead[]> {
    try {
      return await getLeads(userId || this.userId);
    } catch (error) {
      console.error('MarketingService.getLeads error:', error);
      throw error;
    }
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      // Rimuovi campi che non dovrebbero essere aggiornati
      const { created_at, updated_at, ...safeUpdates } = updates as any;
      
      // Converte le date se presenti
      if (safeUpdates.first_contact_date) {
        safeUpdates.first_contact_date = this.ensureISODate(safeUpdates.first_contact_date);
      }
      if (safeUpdates.last_contact_date) {
        safeUpdates.last_contact_date = this.ensureISODate(safeUpdates.last_contact_date);
      }
      if (safeUpdates.next_followup_date) {
        safeUpdates.next_followup_date = this.ensureISODate(safeUpdates.next_followup_date);
      }

      return await updateLead(id, safeUpdates);
    } catch (error) {
      console.error('MarketingService.updateLead error:', error);
      throw error;
    }
  }

  async deleteLead(id: string): Promise<void> {
    try {
      return await deleteLead(id);
    } catch (error) {
      console.error('MarketingService.deleteLead error:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  async getLeadsByCampaign(campaignId: string): Promise<Lead[]> {
    try {
      return await getLeadsByCampaign(campaignId);
    } catch (error) {
      console.error('MarketingService.getLeadsByCampaign error:', error);
      throw error;
    }
  }

  async getMarketingStats(userId?: string): Promise<any> {
    try {
      return await getMarketingStats(userId || this.userId);
    } catch (error) {
      console.error('MarketingService.getMarketingStats error:', error);
      throw error;
    }
  }

  // ===== HELPER METHODS =====

  private ensureISODate(dateInput: string | Date): string {
    try {
      if (typeof dateInput === 'string') {
        // Se la stringa è già in formato ISO, la restituisce
        if (dateInput.includes('T') && dateInput.includes('Z')) {
          return dateInput;
        }
        // Altrimenti converte una data in formato YYYY-MM-DD in ISO timestamp
        return new Date(dateInput).toISOString();
      }
      return dateInput.toISOString();
    } catch (error) {
      console.warn('Date conversion error:', error);
      return new Date().toISOString();
    }
  }

  // Metodi di utilità per i componenti
  formatDate(dateString: string): string {
    return formatDate(dateString);
  }

  formatCurrency(amount: number, currency: string = 'EUR'): string {
    return formatCurrency(amount, currency);
  }

  validateCampaignData(data: Partial<Campaign>): string[] {
    return validateCampaignData(data);
  }

  validateLeadData(data: Partial<Lead>): string[] {
    return validateLeadData(data);
  }
}

// Esporta l'istanza singleton
export const marketingService = MarketingService.getInstance();

// Esporta anche i tipi per l'uso nei componenti
export type { Campaign, Lead } from '@/lib/marketing';