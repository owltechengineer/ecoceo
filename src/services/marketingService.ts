import { 
  loadCampaigns, 
  saveCampaign, 
  updateCampaign, 
  deleteCampaign,
  loadLeads, 
  saveLead, 
  updateLead, 
  deleteLead,
  Campaign as DBCampaign, 
  Lead as DBLead 
} from '@/lib/supabase';
import { Campaign, Lead } from '@/contexts/DashboardContext';

export interface MarketingStats {
  totalBudget: number;
  totalSpent: number;
  totalLeads: number;
  totalConversions: number;
  totalRevenue: number;
  averageCAC: number;
  averageLTV: number;
  overallLTVCACRatio: number;
  conversionRate: number;
  channelPerformance: Array<{
    channel: string;
    budget: number;
    spent: number;
    leads: number;
    conversions: number;
    revenue: number;
    cac: number;
    ltvCacRatio: number;
  }>;
}

export class MarketingService {
  private static instance: MarketingService;
  private userId: string = 'default-user';

  private constructor() {}

  public static getInstance(): MarketingService {
    if (!MarketingService.instance) {
      MarketingService.instance = new MarketingService();
    }
    return MarketingService.instance;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  // ===== CAMPAIGNS =====

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const campaigns = await loadCampaigns(this.userId);
      return campaigns.map(this.mapCampaignFromDB);
    } catch (error) {
      console.error('Error in getCampaigns:', error);
      throw error;
    }
  }

  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    try {
      const campaignData = this.mapCampaignToDB(campaign);
      const newCampaign = await saveCampaign(campaignData);
      return this.mapCampaignFromDB(newCampaign);
    } catch (error) {
      console.error('Error in createCampaign:', error);
      throw error;
    }
  }

  async updateCampaign(campaign: Campaign): Promise<Campaign> {
    try {
      const campaignData = this.mapCampaignToDB(campaign);
      const updatedCampaign = await updateCampaign(campaign.id, campaignData);
      return this.mapCampaignFromDB(updatedCampaign);
    } catch (error) {
      console.error('Error in updateCampaign:', error);
      throw error;
    }
  }

  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      await deleteCampaign(campaignId);
    } catch (error) {
      console.error('Error in deleteCampaign:', error);
      throw error;
    }
  }

  // ===== LEADS =====

  async getLeads(): Promise<Lead[]> {
    try {
      const leads = await loadLeads(this.userId);
      return leads.map(this.mapLeadFromDB);
    } catch (error) {
      console.error('Error in getLeads:', error);
      throw error;
    }
  }

  async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    try {
      const leadData = this.mapLeadToDB(lead);
      const newLead = await saveLead(leadData);
      return this.mapLeadFromDB(newLead);
    } catch (error) {
      console.error('Error in createLead:', error);
      throw error;
    }
  }

  async updateLead(lead: Lead): Promise<Lead> {
    try {
      const leadData = this.mapLeadToDB(lead);
      const updatedLead = await updateLead(lead.id, leadData);
      return this.mapLeadFromDB(updatedLead);
    } catch (error) {
      console.error('Error in updateLead:', error);
      throw error;
    }
  }

  async deleteLead(leadId: string): Promise<void> {
    try {
      await deleteLead(leadId);
    } catch (error) {
      console.error('Error in deleteLead:', error);
      throw error;
    }
  }

  // ===== ANALYTICS & STATS =====

  async getMarketingStats(): Promise<MarketingStats> {
    try {
      const [campaigns, leads] = await Promise.all([
        this.getCampaigns(),
        this.getLeads()
      ]);

      return this.calculateMarketingStats(campaigns, leads);
    } catch (error) {
      console.error('Error in getMarketingStats:', error);
      throw error;
    }
  }

  private calculateMarketingStats(campaigns: Campaign[], leads: Lead[]): MarketingStats {
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    
    const averageCAC = totalLeads > 0 ? totalSpent / totalLeads : 0;
    const averageLTV = totalConversions > 0 ? totalRevenue / totalConversions : 0;
    const overallLTVCACRatio = averageCAC > 0 ? averageLTV / averageCAC : 0;
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;

    // Channel performance
    const channelMap = new Map<string, any>();
    campaigns.forEach(campaign => {
      const channel = campaign.channel;
      if (!channelMap.has(channel)) {
        channelMap.set(channel, {
          channel,
          budget: 0,
          spent: 0,
          leads: 0,
          conversions: 0,
          revenue: 0,
          cac: 0,
          ltvCacRatio: 0
        });
      }
      
      const channelData = channelMap.get(channel);
      channelData.budget += campaign.budget;
      channelData.spent += campaign.spent;
      channelData.leads += campaign.leads;
      channelData.conversions += campaign.conversions;
      channelData.revenue += campaign.revenue;
    });

    // Calculate CAC and LTV/CAC for each channel
    const channelPerformance = Array.from(channelMap.values()).map(channel => ({
      ...channel,
      cac: channel.leads > 0 ? channel.spent / channel.leads : 0,
      ltvCacRatio: channel.leads > 0 && channel.spent > 0 ? 
        (channel.revenue / channel.conversions) / (channel.spent / channel.leads) : 0
    }));

    return {
      totalBudget,
      totalSpent,
      totalLeads,
      totalConversions,
      totalRevenue,
      averageCAC,
      averageLTV,
      overallLTVCACRatio,
      conversionRate,
      channelPerformance
    };
  }

  // ===== DATA MAPPING =====

  private mapCampaignFromDB(data: DBCampaign): Campaign {
    return {
      id: data.id,
      name: data.name,
      channel: data.channel,
      startDate: data.start_date,
      endDate: data.end_date,
      budget: parseFloat(data.budget.toString()) || 0,
      spent: parseFloat(data.spent.toString()) || 0,
      leads: parseInt(data.leads.toString()) || 0,
      conversions: parseInt(data.conversions.toString()) || 0,
      revenue: parseFloat(data.revenue.toString()) || 0,
      status: data.status,
      cac: parseFloat(data.cac.toString()) || 0,
      ltv: parseFloat(data.ltv.toString()) || 0,
      ltvCacRatio: parseFloat(data.ltv_cac_ratio.toString()) || 0,
      plannedLeads: parseInt(data.planned_leads.toString()) || 0,
      plannedConversions: parseInt(data.planned_conversions.toString()) || 0,
      plannedRevenue: parseFloat(data.planned_revenue.toString()) || 0,
      actualLeads: parseInt(data.actual_leads.toString()) || 0,
      actualConversions: parseInt(data.actual_conversions.toString()) || 0,
    };
  }

  private mapCampaignToDB(campaign: Campaign | Omit<Campaign, 'id'>): Omit<DBCampaign, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: this.userId,
      name: campaign.name,
      channel: campaign.channel,
      start_date: campaign.startDate,
      end_date: campaign.endDate,
      budget: campaign.budget,
      spent: campaign.spent,
      leads: campaign.leads,
      conversions: campaign.conversions,
      revenue: campaign.revenue,
      status: campaign.status,
      cac: campaign.cac,
      ltv: campaign.ltv,
      ltv_cac_ratio: campaign.ltvCacRatio,
      planned_leads: campaign.plannedLeads,
      planned_conversions: campaign.plannedConversions,
      planned_revenue: campaign.plannedRevenue,
      actual_leads: campaign.actualLeads,
      actual_conversions: campaign.actualConversions,
    };
  }

  private mapLeadFromDB(data: DBLead): Lead {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      source: data.source,
      campaign: data.campaign || '',
      status: data.status,
      value: parseFloat(data.value.toString()) || 0,
      date: data.date,
      roi: parseFloat(data.roi.toString()) || 0,
      plannedValue: parseFloat(data.planned_value.toString()) || 0,
      actualValue: parseFloat(data.actual_value.toString()) || 0,
    };
  }

  private mapLeadToDB(lead: Lead | Omit<Lead, 'id'>): Omit<DBLead, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: this.userId,
      name: lead.name,
      email: lead.email,
      source: lead.source,
      campaign: lead.campaign,
      status: lead.status,
      value: lead.value,
      date: lead.date,
      roi: lead.roi,
      planned_value: lead.plannedValue,
      actual_value: lead.actualValue,
    };
  }
}

export const marketingService = MarketingService.getInstance();
