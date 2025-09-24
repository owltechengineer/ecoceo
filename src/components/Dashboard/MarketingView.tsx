'use client';

import React, { useState, useEffect } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { marketingService, Campaign, Lead } from '@/services/marketingService';

export default function MarketingView() {
  const { openInfo } = useInfoModal();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads' | 'analytics'>('overview');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewLead, setShowNewLead] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [editCampaignForm, setEditCampaignForm] = useState<Partial<Campaign>>({});
  const [editLeadForm, setEditLeadForm] = useState<Partial<Lead>>({});
  const [marketingStats, setMarketingStats] = useState<any>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  // Form per nuova campagna
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'digital' as const,
    status: 'planning' as const,
    priority: 'medium' as const,
    budget: 0,
    spent_amount: 0,
    currency: 'EUR',
    start_date: '',
    end_date: '',
    campaign_manager: '',
    creative_director: '',
    account_manager: '',
    target_impressions: 0,
    target_clicks: 0,
    target_conversions: 0,
    actual_impressions: 0,
    actual_clicks: 0,
    actual_conversions: 0,
    notes: '',
    tags: ''
  });

  // Form per nuovo lead
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    source: 'website' as const,
    status: 'new' as const,
    priority: 'medium' as const,
    score: 50,
    campaign_id: '',
    country: 'Italia',
    city: '',
    address: '',
    notes: '',
    tags: '',
    first_contact_date: new Date().toISOString().split('T')[0],
    last_contact_date: '',
    next_followup_date: ''
  });

  // Caricamento dati dal database
  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = async () => {
    setLoading(true);
    try {
      const [campaignData, leadData, statsData] = await Promise.all([
        marketingService.getCampaigns(),
        marketingService.getLeads(),
        marketingService.getMarketingStats()
      ]);
      
      setCampaigns(campaignData);
      setLeads(leadData);
      setMarketingStats(statsData);
    } catch (error) {
      console.error('Errore nel caricamento dati marketing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestione campagne
  const handleSaveCampaign = async () => {
    try {
      // Validazione base
      if (!newCampaign.name.trim()) {
        alert('Il nome della campagna è obbligatorio');
        return;
      }
      
      const campaignData = {
        ...newCampaign,
        user_id: 'default-user',
        tags: newCampaign.tags ? newCampaign.tags.split(',').map(t => t.trim()) : []
      };

      await marketingService.createCampaign(campaignData);
      
      alert('Campagna creata con successo!');
      
      // Reset form
      setNewCampaign({
        name: '',
        description: '',
        type: 'digital',
        status: 'planning',
        priority: 'medium',
        budget: 0,
        spent_amount: 0,
        currency: 'EUR',
        start_date: '',
        end_date: '',
        campaign_manager: '',
        creative_director: '',
        account_manager: '',
        target_impressions: 0,
        target_clicks: 0,
        target_conversions: 0,
        actual_impressions: 0,
        actual_clicks: 0,
        actual_conversions: 0,
        notes: '',
        tags: ''
      });
      setShowNewCampaign(false);
      
      // Ricarica dati
      await loadMarketingData();
    } catch (error) {
      console.error('Errore nel salvataggio campagna:', error);
      alert('Errore nel salvataggio della campagna: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'));
    }
  };

  // Gestione lead
  const handleSaveLead = async () => {
    try {
      // Validazione base
      if (!newLead.first_name.trim() || !newLead.last_name.trim() || !newLead.email.trim()) {
        alert('Nome, cognome e email sono obbligatori');
        return;
      }
      
      const leadData = {
        ...newLead,
        user_id: 'default-user',
        tags: newLead.tags ? newLead.tags.split(',').map(t => t.trim()) : [],
        campaign_id: newLead.campaign_id || undefined
      };

      await marketingService.createLead(leadData);
      
      alert('Lead creato con successo!');
      
      // Reset form
      setNewLead({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        source: 'website',
        status: 'new',
        priority: 'medium',
        score: 50,
        campaign_id: '',
        country: 'Italia',
        city: '',
        address: '',
        notes: '',
        tags: '',
        first_contact_date: new Date().toISOString().split('T')[0],
        last_contact_date: '',
        next_followup_date: ''
      });
      setShowNewLead(false);
      
      // Ricarica dati
      await loadMarketingData();
    } catch (error) {
      console.error('Errore nel salvataggio lead:', error);
      alert('Errore nel salvataggio del lead: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'));
    }
  };

  const handleEditCampaign = async (campaignId: string) => {
    try {
      const updatedData = {
        ...editCampaignForm,
        tags: typeof editCampaignForm.tags === 'string' 
          ? (editCampaignForm.tags as string).split(',').map(t => t.trim()) 
          : (editCampaignForm.tags as string[])
      };

      await marketingService.updateCampaign(campaignId, updatedData);
      setEditingCampaign(null);
      setEditCampaignForm({});
      await loadMarketingData();
    } catch (error) {
      console.error('Errore nell\'aggiornamento campagna:', error);
    }
  };

  const handleEditLead = async (leadId: string) => {
    try {
      const updatedData = {
        ...editLeadForm,
        tags: typeof editLeadForm.tags === 'string' 
          ? (editLeadForm.tags as string).split(',').map(t => t.trim()) 
          : (editLeadForm.tags as string[])
      };

      await marketingService.updateLead(leadId, updatedData);
      setEditingLead(null);
      setEditLeadForm({});
      await loadMarketingData();
    } catch (error) {
      console.error('Errore nell\'aggiornamento lead:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa campagna?')) {
      try {
        await marketingService.deleteCampaign(campaignId);
        await loadMarketingData();
      } catch (error) {
        console.error('Errore nell\'eliminazione campagna:', error);
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo lead?')) {
      try {
        await marketingService.deleteLead(leadId);
        await loadMarketingData();
      } catch (error) {
        console.error('Errore nell\'eliminazione lead:', error);
      }
    }
  };

  // Funzioni di utilità per i colori
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      planning: 'text-yellow-600 bg-yellow-100',
      active: 'text-green-600 bg-green-100',
      paused: 'text-orange-600 bg-orange-100',
      completed: 'text-blue-600 bg-blue-100',
      cancelled: 'text-red-600 bg-red-100',
      new: 'text-blue-600 bg-blue-100',
      contacted: 'text-yellow-600 bg-yellow-100',
      qualified: 'text-green-600 bg-green-100',
      proposal: 'text-purple-600 bg-purple-100',
      negotiation: 'text-orange-600 bg-orange-100',
      closed_won: 'text-green-700 bg-green-200',
      closed_lost: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  // Filtri per campagne
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = filter.status === 'all' || campaign.status === filter.status;
    const matchesPriority = filter.priority === 'all' || campaign.priority === filter.priority;
    const matchesSearch = !filter.search || 
      campaign.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      (campaign.description && campaign.description.toLowerCase().includes(filter.search.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Filtri per lead
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filter.status === 'all' || lead.status === filter.status;
    const matchesPriority = filter.priority === 'all' || lead.priority === filter.priority;
    const matchesSearch = !filter.search || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(filter.search.toLowerCase()) ||
      lead.email.toLowerCase().includes(filter.search.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(filter.search.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Marketing Management</h2>
          <InfoButton
            onClick={() => openInfo('Marketing Management', 'Gestisci le tue campagne marketing e i lead. Monitora le performance, traccia i risultati e ottimizza le tue strategie di marketing.')}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewCampaign(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">📊</span>
            Nuova Campagna
          </button>
          <button
            onClick={() => {
              console.log('🔄 Apertura form nuovo lead...');
              setShowNewLead(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="mr-2">👥</span>
            Nuovo Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {marketingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Campagne</dt>
                    <dd className="text-lg font-medium text-gray-900">{marketingStats.campaigns}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Lead</dt>
                    <dd className="text-lg font-medium text-gray-900">{marketingStats.leads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Budget Totale</dt>
                    <dd className="text-lg font-medium text-gray-900">€{marketingStats.totalBudget.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversioni</dt>
                    <dd className="text-lg font-medium text-gray-900">{marketingStats.totalConversions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtri */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
            <input
              type="text"
              placeholder="Cerca per nome, email, azienda..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tutti gli status</option>
              <option value="planning">Planning</option>
              <option value="active">Attivo</option>
              <option value="paused">In Pausa</option>
              <option value="completed">Completato</option>
              <option value="new">Nuovo</option>
              <option value="contacted">Contattato</option>
              <option value="qualified">Qualificato</option>
              <option value="proposal">Proposta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tutte le priorità</option>
              <option value="low">Bassa</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Panoramica', count: campaigns.length + leads.length },
            { id: 'campaigns', label: 'Campagne', count: filteredCampaigns.length },
            { id: 'leads', label: 'Lead', count: filteredLeads.length },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {'count' in tab && tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campagne Recenti */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Campagne Recenti</h3>
              </div>
              <div className="px-6 py-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.type} • €{campaign.budget.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Nessuna campagna presente</p>
                )}
              </div>
            </div>

            {/* Lead Recenti */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Lead Recenti</h3>
              </div>
              <div className="px-6 py-4">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-gray-500">{lead.email} • {lead.company || 'N/A'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{lead.score}/100</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Nessun lead presente</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <span className="text-6xl">📊</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nessuna campagna</h3>
                <p className="mt-1 text-sm text-gray-500">Inizia creando la tua prima campagna marketing.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowNewCampaign(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="mr-2">📊</span>
                    Nuova Campagna
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-blue-600 truncate">
                                {campaign.name}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                                  {campaign.status}
                                </span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(campaign.priority)}`}>
                                  {campaign.priority}
                                </span>
                              </div>
                            </div>
                            {campaign.description && (
                              <p className="mt-1 text-sm text-gray-600">{campaign.description}</p>
                            )}
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex space-x-4">
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">💰</span>
                                  €{campaign.spent_amount.toLocaleString()} / €{campaign.budget.toLocaleString()}
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">📈</span>
                                  {campaign.actual_impressions.toLocaleString()} impressioni
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">🎯</span>
                                  {campaign.actual_conversions} conversioni
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span className="mr-1">📅</span>
                                {new Date(campaign.start_date).toLocaleDateString('it-IT')}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setEditingCampaign(campaign.id);
                                setEditCampaignForm({
                                  name: campaign.name,
                                  description: campaign.description,
                                  type: campaign.type,
                                  status: campaign.status,
                                  priority: campaign.priority,
                                  budget: campaign.budget,
                                  spent_amount: campaign.spent_amount,
                                  notes: campaign.notes,
                                  tags: campaign.tags
                                });
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              ✏️ Modifica
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              🗑️ Elimina
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <span className="text-6xl">👥</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun lead</h3>
                <p className="mt-1 text-sm text-gray-500">Inizia aggiungendo il tuo primo lead.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowNewLead(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="mr-2">👥</span>
                    Nuovo Lead
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <li key={lead.id}>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-green-600 truncate">
                                {lead.first_name} {lead.last_name}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <span className="text-sm text-gray-500">{lead.score}/100</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                                  {lead.priority}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex space-x-4">
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">📧</span>
                                  {lead.email}
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">🏢</span>
                                  {lead.company || 'N/A'}
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                  <span className="mr-1">💼</span>
                                  {lead.job_title || 'N/A'}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span className="mr-1">📅</span>
                                {new Date(lead.first_contact_date).toLocaleDateString('it-IT')}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex space-x-2">
                            <button
                              onClick={() => {
                                console.log('🔄 Apertura form modifica lead:', lead.id);
                                setSelectedLead(lead);
                                setEditingLead(lead.id);
                                setEditLeadForm({
                                  first_name: lead.first_name,
                                  last_name: lead.last_name,
                                  email: lead.email,
                                  phone: lead.phone,
                                  company: lead.company,
                                  job_title: lead.job_title,
                                  source: lead.source,
                                  status: lead.status,
                                  priority: lead.priority,
                                  score: lead.score,
                                  notes: lead.notes,
                                  tags: lead.tags
                                });
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              ✏️ Modifica
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              🗑️ Elimina
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && marketingStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CTR Medio</dt>
                      <dd className="text-lg font-medium text-gray-900">{marketingStats.ctr}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CPC Medio</dt>
                      <dd className="text-lg font-medium text-gray-900">€{marketingStats.cpc}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CPA Medio</dt>
                      <dd className="text-lg font-medium text-gray-900">€{marketingStats.cpa}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👀</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Impressioni</dt>
                      <dd className="text-lg font-medium text-gray-900">{marketingStats.totalImpressions.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👆</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Click Totali</dt>
                      <dd className="text-lg font-medium text-gray-900">{marketingStats.totalClicks.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💸</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Budget Utilizz.</dt>
                      <dd className="text-lg font-medium text-gray-900">{marketingStats.budgetUtilization}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modali per creazione/modifica */}
      {/* Modal Nuova Campagna */}
      {showNewCampaign && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowNewCampaign(false)}></div>

            <div className="relative bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Nuova Campagna</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome *</label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      placeholder="Nome della campagna"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                    <textarea
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      rows={3}
                      placeholder="Descrizione della campagna"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <select
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="digital">Digital</option>
                        <option value="print">Stampa</option>
                        <option value="tv">TV</option>
                        <option value="radio">Radio</option>
                        <option value="outdoor">Outdoor</option>
                        <option value="social">Social</option>
                        <option value="email">Email</option>
                        <option value="other">Altro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stato</label>
                      <select
                        value={newCampaign.status}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, status: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Attiva</option>
                        <option value="paused">In Pausa</option>
                        <option value="completed">Completata</option>
                        <option value="cancelled">Annullata</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Budget</label>
                      <input
                        type="number"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Inizio</label>
                      <input
                        type="date"
                        value={newCampaign.start_date}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, start_date: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveCampaign}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Crea Campagna
                </button>
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuovo Lead */}
      {showNewLead && console.log('📝 Rendering modal nuovo lead', { showNewLead }) && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewLead(false)}></div>

            <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6 relative z-10">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Nuovo Lead</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome *</label>
                      <input
                        type="text"
                        value={newLead.first_name}
                        onChange={(e) => setNewLead(prev => ({ ...prev, first_name: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="Nome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cognome *</label>
                      <input
                        type="text"
                        value={newLead.last_name}
                        onChange={(e) => setNewLead(prev => ({ ...prev, last_name: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="Cognome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      placeholder="email@esempio.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Azienda</label>
                      <input
                        type="text"
                        value={newLead.company}
                        onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="Nome azienda"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ruolo</label>
                      <input
                        type="text"
                        value={newLead.job_title}
                        onChange={(e) => setNewLead(prev => ({ ...prev, job_title: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="Ruolo aziendale"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fonte</label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead(prev => ({ ...prev, source: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="website">Website</option>
                        <option value="social">Social</option>
                        <option value="email">Email</option>
                        <option value="referral">Referral</option>
                        <option value="advertising">Advertising</option>
                        <option value="event">Event</option>
                        <option value="cold_call">Cold Call</option>
                        <option value="other">Altro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stato</label>
                      <select
                        value={newLead.status}
                        onChange={(e) => setNewLead(prev => ({ ...prev, status: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="new">Nuovo</option>
                        <option value="contacted">Contattato</option>
                        <option value="qualified">Qualificato</option>
                        <option value="proposal">Proposta</option>
                        <option value="negotiation">Negoziazione</option>
                        <option value="closed_won">Chiuso Vinto</option>
                        <option value="closed_lost">Chiuso Perso</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Punteggio</label>
                      <input
                        type="number"
                        value={newLead.score}
                        onChange={(e) => setNewLead(prev => ({ ...prev, score: Number(e.target.value) }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveLead}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Crea Lead
                </button>
                <button
                  onClick={() => setShowNewLead(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifica Campagna */}
      {editingCampaign && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingCampaign(null)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Modifica Campagna</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={editCampaignForm.name || ''}
                      onChange={(e) => setEditCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                    <textarea
                      value={editCampaignForm.description || ''}
                      onChange={(e) => setEditCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stato</label>
                      <select
                        value={editCampaignForm.status || ''}
                        onChange={(e) => setEditCampaignForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Attiva</option>
                        <option value="paused">In Pausa</option>
                        <option value="completed">Completata</option>
                        <option value="cancelled">Annullata</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priorità</label>
                      <select
                        value={editCampaignForm.priority || ''}
                        onChange={(e) => setEditCampaignForm(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="low">Bassa</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <input
                      type="number"
                      value={editCampaignForm.budget || 0}
                      onChange={(e) => setEditCampaignForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleEditCampaign(editingCampaign)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Salva Modifiche
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifica Lead */}
      {editingLead && console.log('📝 Rendering modal modifica lead', { editingLead }) && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingLead(null)}></div>

            <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6 relative z-10">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Modifica Lead</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <input
                        type="text"
                        value={editLeadForm.first_name || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cognome</label>
                      <input
                        type="text"
                        value={editLeadForm.last_name || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editLeadForm.email || ''}
                      onChange={(e) => setEditLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Azienda</label>
                      <input
                        type="text"
                        value={editLeadForm.company || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, company: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ruolo</label>
                      <input
                        type="text"
                        value={editLeadForm.job_title || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, job_title: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stato</label>
                      <select
                        value={editLeadForm.status || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="new">Nuovo</option>
                        <option value="contacted">Contattato</option>
                        <option value="qualified">Qualificato</option>
                        <option value="proposal">Proposta</option>
                        <option value="negotiation">Negoziazione</option>
                        <option value="closed_won">Chiuso Vinto</option>
                        <option value="closed_lost">Chiuso Perso</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priorità</label>
                      <select
                        value={editLeadForm.priority || ''}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                      >
                        <option value="low">Bassa</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Punteggio</label>
                      <input
                        type="number"
                        value={editLeadForm.score || 0}
                        onChange={(e) => setEditLeadForm(prev => ({ ...prev, score: Number(e.target.value) }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleEditLead(editingLead)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Salva Modifiche
                </button>
                <button
                  onClick={() => setEditingLead(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
