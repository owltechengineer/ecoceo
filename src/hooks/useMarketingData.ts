import { useState, useEffect, useCallback } from 'react';
import { Campaign, Lead } from '@/contexts/DashboardContext';
import { marketingService, MarketingStats } from '@/services/marketingService';
import { useNotifications } from './useNotifications';

export interface UseMarketingDataReturn {
  // Data
  campaigns: Campaign[];
  leads: Lead[];
  stats: MarketingStats | null;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  createLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export function useMarketingData(): UseMarketingDataReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showSuccess, showError } = useNotifications();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [campaignsData, leadsData, statsData] = await Promise.all([
        marketingService.getCampaigns(),
        marketingService.getLeads(),
        marketingService.getMarketingStats()
      ]);
      
      setCampaigns(campaignsData);
      setLeads(leadsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error refreshing marketing data:', err);
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (campaign: Omit<Campaign, 'id'>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const newCampaign = await marketingService.createCampaign(campaign);
      setCampaigns(prev => [newCampaign, ...prev]);
      
      // Refresh stats after creating campaign
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Campagna creata con successo!');
    } catch (err) {
      console.error('Error creating campaign:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nella creazione della campagna';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  const updateCampaign = useCallback(async (campaign: Campaign) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const updatedCampaign = await marketingService.updateCampaign(campaign);
      setCampaigns(prev => 
        prev.map(c => c.id === campaign.id ? updatedCampaign : c)
      );
      
      // Refresh stats after updating campaign
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Campagna aggiornata con successo!');
    } catch (err) {
      console.error('Error updating campaign:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'aggiornamento della campagna';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  const deleteCampaign = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      setError(null);
      
      await marketingService.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      
      // Refresh stats after deleting campaign
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Campagna eliminata con successo!');
    } catch (err) {
      console.error('Error deleting campaign:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'eliminazione della campagna';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  const createLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const newLead = await marketingService.createLead(lead);
      setLeads(prev => [newLead, ...prev]);
      
      // Refresh stats after creating lead
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Lead creato con successo!');
    } catch (err) {
      console.error('Error creating lead:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nella creazione del lead';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  const updateLead = useCallback(async (lead: Lead) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const updatedLead = await marketingService.updateLead(lead);
      setLeads(prev => 
        prev.map(l => l.id === lead.id ? updatedLead : l)
      );
      
      // Refresh stats after updating lead
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Lead aggiornato con successo!');
    } catch (err) {
      console.error('Error updating lead:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'aggiornamento del lead';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      setError(null);
      
      await marketingService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      
      // Refresh stats after deleting lead
      const updatedStats = await marketingService.getMarketingStats();
      setStats(updatedStats);
      
      showSuccess('Lead eliminato con successo!');
    } catch (err) {
      console.error('Error deleting lead:', err);
      const errorMessage = err instanceof Error ? err.message : 'Errore nell\'eliminazione del lead';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [showSuccess, showError]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    campaigns,
    leads,
    stats,
    isLoading,
    isSaving,
    error,
    refreshData,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    createLead,
    updateLead,
    deleteLead,
    clearError,
  };
}
