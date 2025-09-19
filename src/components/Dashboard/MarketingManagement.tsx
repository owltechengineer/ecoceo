'use client';

import { useState, useEffect } from 'react';
import { useDashboard, Campaign, Lead } from '@/contexts/DashboardContext';
import FormModal, { FormField } from './FormModal';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';
import MarketingVisualizations from './MarketingVisualizations';
import { useMarketingData } from '@/hooks/useMarketingData';

export default function MarketingManagement() {
  // Use the new marketing data hook for database integration
  const {
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
  } = useMarketingData();

  // Keep the old dashboard context for fallback
  const { state } = useDashboard();

  // Funzione per formattare le date in modo consistente
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Campaign | Lead | null>(null);
  const [formType, setFormType] = useState<'campaign' | 'lead'>('campaign');
  const [showVisualizations, setShowVisualizations] = useState(false);
  
  // Form data per campagne
  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    channel: '',
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    leads: 0,
    conversions: 0,
    revenue: 0,
    status: 'active' as 'active' | 'paused' | 'completed' | 'cancelled',
    cac: 0,
    ltv: 0,
    ltvCacRatio: 0,
    plannedLeads: 0,
    plannedConversions: 0,
    plannedRevenue: 0,
    actualLeads: 0,
    actualConversions: 0,
  });

  // Form data per lead
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    source: '',
    campaign: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
    value: 0,
    date: '',
    roi: 0,
    plannedValue: 0,
    actualValue: 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Attiva';
      case 'paused': return 'In Pausa';
      case 'completed': return 'Completata';
      case 'draft': return 'Bozza';
      default: return status;
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-orange-100 text-orange-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nuovo';
      case 'contacted': return 'Contattato';
      case 'qualified': return 'Qualificato';
      case 'converted': return 'Convertito';
      case 'lost': return 'Perso';
      default: return status;
    }
  };

  // Use real-time stats from database
  const totalBudget = stats?.totalBudget || 0;
  const totalSpent = stats?.totalSpent || 0;
  const totalLeads = stats?.totalLeads || 0;
  const totalConversions = stats?.totalConversions || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const averageCAC = stats?.averageCAC || 0;
  const averageLTV = stats?.averageLTV || 0;
  const overallLTVCACRatio = stats?.overallLTVCACRatio || 0;
  const conversionRate = stats?.conversionRate || 0;

  const handleOpenForm = (type: 'campaign' | 'lead', item?: Campaign | Lead) => {
    setFormType(type);
    setEditingItem(item || null);
    
    if (item) {
      if (type === 'campaign') {
        const campaign = item as Campaign;
        setCampaignFormData({
          name: campaign.name,
          channel: campaign.channel,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          budget: campaign.budget,
          spent: campaign.spent,
          leads: campaign.leads,
          conversions: campaign.conversions,
          revenue: campaign.revenue,
          status: campaign.status,
          cac: campaign.cac,
          ltv: campaign.ltv,
          ltvCacRatio: campaign.ltvCacRatio,
          plannedLeads: campaign.plannedLeads,
          plannedConversions: campaign.plannedConversions,
          plannedRevenue: campaign.plannedRevenue,
          actualLeads: campaign.actualLeads,
          actualConversions: campaign.actualConversions,
        });
      } else if (type === 'lead') {
        const lead = item as Lead;
        setLeadFormData({
          name: lead.name,
          email: lead.email,
          source: lead.source,
          campaign: lead.campaign,
          status: lead.status,
          value: lead.value,
          date: lead.date,
          roi: lead.roi,
          plannedValue: lead.plannedValue,
          actualValue: lead.actualValue,
        });
      }
    } else {
      // Reset form data
      setCampaignFormData({
        name: '',
        channel: '',
        startDate: '',
        endDate: '',
        budget: 0,
        spent: 0,
        leads: 0,
        conversions: 0,
        revenue: 0,
        status: 'active',
        cac: 0,
        ltv: 0,
        ltvCacRatio: 0,
        plannedLeads: 0,
        plannedConversions: 0,
        plannedRevenue: 0,
        actualLeads: 0,
        actualConversions: 0,
      });
      setLeadFormData({
        name: '',
        email: '',
        source: '',
        campaign: '',
        status: 'new',
        value: 0,
        date: '',
        roi: 0,
        plannedValue: 0,
        actualValue: 0,
      });
    }
    
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formType === 'campaign') {
        if (editingItem) {
          await updateCampaign({ ...editingItem as Campaign, ...campaignFormData });
          console.log('Campagna aggiornata:', campaignFormData);
        } else {
          await createCampaign(campaignFormData);
          console.log('Nuova campagna aggiunta:', campaignFormData);
        }
      } else if (formType === 'lead') {
        if (editingItem) {
          await updateLead({ ...editingItem as Lead, ...leadFormData });
          console.log('Lead aggiornato:', leadFormData);
        } else {
          await createLead(leadFormData);
          console.log('Nuovo lead aggiunto:', leadFormData);
        }
      }
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      // Error is already handled by the hook and displayed in the UI
    }
  };

  const handleDelete = async (type: 'campaign' | 'lead', id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo elemento?')) {
      try {
        if (type === 'campaign') {
          await deleteCampaign(id);
          console.log('Campagna eliminata:', id);
        } else if (type === 'lead') {
          await deleteLead(id);
          console.log('Lead eliminato:', id);
        }
      } catch (error) {
        console.error('Errore nell\'eliminazione:', error);
        // Error is already handled by the hook and displayed in the UI
      }
    }
  };

  const getFormTitle = () => {
    const action = editingItem ? 'Modifica' : 'Nuova';
    const type = formType === 'campaign' ? 'Campagna' : 'Lead';
    return `${action} ${type}`;
  };

  const getSubmitText = () => {
    const action = editingItem ? 'Aggiorna' : 'Crea';
    const type = formType === 'campaign' ? 'Campagna' : 'Lead';
    return `${action} ${type}`;
  };

  const { openInfo } = useInfoModal();

  return (
    <div className="space-y-8 bg-gray-50 min-h-full p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 flex items-center">
              <span className="text-orange-400 mr-3">📈</span>
              Marketing Management
              {isLoading && (
                <span className="ml-3 inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></span>
              )}
            </h2>
            <p className="text-gray-300 text-lg">Campagne, costi, lead generati e conversioni per CAC, LTV e ROI marketing</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Aggiorna
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowVisualizations(!showVisualizations)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  showVisualizations 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg'
                }`}
              >
                {showVisualizations ? '📊 Nascondi Visualizzazioni' : '📊 Visualizzazioni'}
              </button>
            </div>
            <InfoButton onClick={() => openInfo(dashboardInfo.marketing.title, dashboardInfo.marketing.content)} />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 font-medium">Errore:</span>
              <span className="text-red-600 ml-2">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Visualizations Component */}
      {showVisualizations && (
        <div className="mb-6">
          <MarketingVisualizations />
        </div>
      )}


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <span className="text-2xl">💰</span>
        </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
                ></div>
        </div>
        </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">💰 Budget Totale</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">€{totalBudget.toLocaleString()}</p>
          <p className="text-sm text-gray-800 flex items-center font-semibold">
            <span className="mr-1">Speso:</span>
            <span className="font-bold">€{totalSpent.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1 font-medium">
            {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% utilizzato` : 'Nessun budget'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${totalLeads > 0 ? Math.min((totalConversions / totalLeads) * 100, 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">👥 Lead Totali</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{totalLeads}</p>
          <p className="text-sm text-gray-800 flex items-center font-semibold">
            <span className="mr-1">Conversioni:</span>
            <span className="font-bold">{totalConversions}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1 font-medium">
            Tasso: {conversionRate.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((averageCAC / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">📊 CAC Medio</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">€{averageCAC.toFixed(0)}</p>
          <p className="text-sm text-gray-800 flex items-center font-semibold">
            <span className="mr-1">LTV:</span>
            <span className="font-bold">€{averageLTV.toFixed(0)}</span>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-right">
              <div className="w-16 h-2 bg-orange-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    overallLTVCACRatio > 3 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}
                  style={{ width: `${Math.min((overallLTVCACRatio / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">⚡ LTV/CAC Ratio</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{overallLTVCACRatio.toFixed(1)}</p>
          <p className={`text-sm flex items-center font-bold ${
            overallLTVCACRatio > 3 ? 'text-green-800' : 'text-red-800'
          }`}>
            <span className="mr-1">{overallLTVCACRatio > 3 ? '✅' : '⚠️'}</span>
            <span className="font-semibold">{overallLTVCACRatio > 3 ? 'Sostenibile' : 'Da migliorare'}</span>
          </p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Campagne Marketing</h3>
            </div>
            <button 
              onClick={() => handleOpenForm('campaign')}
              disabled={isSaving}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Salvataggio...
                </span>
              ) : (
                '+ Nuova Campagna'
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Campagna
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Canale
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Speso
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Conversioni
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CAC
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  LTV/CAC
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></span>
                      <span className="text-gray-500">Caricamento campagne...</span>
                    </div>
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">🎯</span>
                      <span className="text-gray-500 font-medium">Nessuna campagna trovata</span>
                      <span className="text-gray-400 text-sm">Crea la tua prima campagna per iniziare</span>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                const roi = campaign.spent > 0 ? (campaign.revenue - campaign.spent) / campaign.spent : 0;
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {campaign.channel}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{campaign.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{campaign.spent.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {campaign.leads}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {campaign.conversions}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{campaign.cac}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        campaign.ltvCacRatio > 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {campaign.ltvCacRatio.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        roi > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {(roi * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenForm('campaign', campaign)}
                          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleDelete('campaign', campaign.id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                      >
                        Elimina
                      </button>
                      </div>
                    </td>
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lead Management</h3>
            </div>
            <button 
              onClick={() => handleOpenForm('lead')}
              disabled={isSaving}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Salvataggio...
                </span>
              ) : (
                '+ Nuovo Lead'
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fonte
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Campagna
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Valore
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></span>
                      <span className="text-gray-500">Caricamento lead...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">👥</span>
                      <span className="text-gray-500 font-medium">Nessun lead trovato</span>
                      <span className="text-gray-400 text-sm">Aggiungi il tuo primo lead per iniziare</span>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{lead.email}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.campaign}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLeadStatusColor(lead.status)}`}>
                      {getLeadStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                    €{lead.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {new Date(lead.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenForm('lead', lead)}
                        className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                    >
                      Modifica
                    </button>
                    <button 
                      onClick={() => handleDelete('lead', lead.id)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                    >
                      Elimina
                    </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <span className="text-xl">📊</span>
              </div>
            <h3 className="text-xl font-bold text-gray-900">Performance per Canale</h3>
            </div>
          <div className="space-y-6">
            {stats?.channelPerformance && stats.channelPerformance.length > 0 ? (
              stats.channelPerformance.map((channel, index) => {
                const colors = [
                  { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-800', textSmall: 'text-blue-600', bar: 'from-blue-500 to-blue-600', barBg: 'bg-blue-200' },
                  { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-800', textSmall: 'text-green-600', bar: 'from-green-500 to-green-600', barBg: 'bg-green-200' },
                  { bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800', textSmall: 'text-yellow-600', bar: 'from-yellow-500 to-yellow-600', barBg: 'bg-yellow-200' },
                  { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-800', textSmall: 'text-purple-600', bar: 'from-purple-500 to-purple-600', barBg: 'bg-purple-200' },
                  { bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-800', textSmall: 'text-red-600', bar: 'from-red-500 to-red-600', barBg: 'bg-red-200' },
                ];
                const colorScheme = colors[index % colors.length];
                const performancePercentage = Math.min((channel.ltvCacRatio / 10) * 100, 100);
                
                return (
                  <div key={channel.channel} className={`bg-gradient-to-r ${colorScheme.bg} rounded-lg p-4 border ${colorScheme.border}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${colorScheme.text}`}>{channel.channel}</span>
                      <span className={`text-xs ${colorScheme.textSmall}`}>CAC: €{channel.cac.toFixed(0)}</span>
              </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className={`w-full ${colorScheme.barBg} rounded-full h-2`}>
                          <div className={`bg-gradient-to-r ${colorScheme.bar} h-2 rounded-full transition-all duration-1000`} 
                               style={{ width: `${performancePercentage}%` }}></div>
            </div>
              </div>
                      <span className={`text-sm font-bold ${channel.ltvCacRatio > 3 ? 'text-green-600' : 'text-orange-600'}`}>
                        LTV/CAC: {channel.ltvCacRatio.toFixed(1)}
                      </span>
            </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Budget: €{channel.budget.toLocaleString()} | Speso: €{channel.spent.toLocaleString()} | Lead: {channel.leads} | Conversioni: {channel.conversions}
              </div>
            </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                <span className="text-4xl mb-2 block">📊</span>
                <p>Nessun dato di performance disponibile</p>
                <p className="text-sm">Aggiungi delle campagne per vedere le statistiche</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <span className="text-xl">🎯</span>
              </div>
            <h3 className="text-xl font-bold text-gray-900">Funnel di Conversione</h3>
              </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-semibold text-blue-800">Lead Generati</span>
                <span className="font-bold text-blue-900">{totalLeads}</span>
            </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
              </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-semibold text-yellow-800">Lead Qualificati</span>
                <span className="font-bold text-yellow-900">{Math.round(totalLeads * 0.3)}</span>
            </div>
              <div className="w-full bg-yellow-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
              </div>
              </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-semibold text-green-800">Conversioni</span>
                <span className="font-bold text-green-900">{totalConversions}</span>
            </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalConversions / totalLeads * 100), 100)}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-sm font-semibold text-gray-700 mb-1">Tasso di Conversione</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : '0.0'}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={getFormTitle()}
        onSubmit={handleSubmit}
        submitText={getSubmitText()}
      >
        {formType === 'campaign' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nome Campagna"
              name="name"
              type="text"
              value={campaignFormData.name}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, name: value as string })}
              required
            />
            <FormField
              label="Canale"
              name="channel"
              type="text"
              value={campaignFormData.channel}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, channel: value as string })}
              required
            />
            <FormField
              label="Data Inizio"
              name="startDate"
              type="date"
              value={campaignFormData.startDate}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, startDate: value as string })}
              required
            />
            <FormField
              label="Data Fine"
              name="endDate"
              type="date"
              value={campaignFormData.endDate}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, endDate: value as string })}
              required
            />
            <FormField
              label="Budget (€)"
              name="budget"
              type="number"
              value={campaignFormData.budget}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, budget: value as number })}
              min={0}
              step={0.01}
              required
            />
            <FormField
              label="Speso (€)"
              name="spent"
              type="number"
              value={campaignFormData.spent}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, spent: value as number })}
              min={0}
              step={0.01}
              required
            />
            <FormField
              label="Lead Generati"
              name="leads"
              type="number"
              value={campaignFormData.leads}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, leads: value as number })}
              min={0}
              step={1}
              required
            />
            <FormField
              label="Conversioni"
              name="conversions"
              type="number"
              value={campaignFormData.conversions}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, conversions: value as number })}
              min={0}
              step={1}
              required
            />
            <FormField
              label="Ricavi (€)"
              name="revenue"
              type="number"
              value={campaignFormData.revenue}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, revenue: value as number })}
              min={0}
              step={0.01}
              required
            />
            <FormField
              label="Stato"
              name="status"
              type="select"
              value={campaignFormData.status}
              onChange={(value) => setCampaignFormData({ ...campaignFormData, status: value as any })}
              options={[
                { value: 'active', label: 'Attiva' },
                { value: 'paused', label: 'In Pausa' },
                { value: 'completed', label: 'Completata' },
                { value: 'draft', label: 'Bozza' },
              ]}
              required
            />
          </div>
        )}

        {formType === 'lead' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nome"
              name="name"
              type="text"
              value={leadFormData.name}
              onChange={(value) => setLeadFormData({ ...leadFormData, name: value as string })}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={leadFormData.email}
              onChange={(value) => setLeadFormData({ ...leadFormData, email: value as string })}
              required
            />
            <FormField
              label="Fonte"
              name="source"
              type="text"
              value={leadFormData.source}
              onChange={(value) => setLeadFormData({ ...leadFormData, source: value as string })}
              required
            />
            <FormField
              label="Campagna"
              name="campaign"
              type="text"
              value={leadFormData.campaign}
              onChange={(value) => setLeadFormData({ ...leadFormData, campaign: value as string })}
              required
            />
            <FormField
              label="Stato"
              name="status"
              type="select"
              value={leadFormData.status}
              onChange={(value) => setLeadFormData({ ...leadFormData, status: value as any })}
              options={[
                { value: 'new', label: 'Nuovo' },
                { value: 'contacted', label: 'Contattato' },
                { value: 'qualified', label: 'Qualificato' },
                { value: 'converted', label: 'Convertito' },
                { value: 'lost', label: 'Perso' },
              ]}
              required
            />
            <FormField
              label="Valore (€)"
              name="value"
              type="number"
              value={leadFormData.value}
              onChange={(value) => setLeadFormData({ ...leadFormData, value: value as number })}
              min={0}
              step={0.01}
              required
            />
            <FormField
              label="Data"
              name="date"
              type="date"
              value={leadFormData.date}
              onChange={(value) => setLeadFormData({ ...leadFormData, date: value as string })}
              required
            />
          </div>
        )}
      </FormModal>
    </div>
  );
}
