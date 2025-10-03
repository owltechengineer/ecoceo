'use client';

import { useState, useEffect } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import { supabase } from '@/lib/supabase';

interface TableData {
  [key: string]: any[];
}

export default function MarketingTablesViewer() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [tableData, setTableData] = useState<TableData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentTime } = useClientDate();
  const [error, setError] = useState<string | null>(null);

  const tables = [
    { key: 'campaigns', name: 'Campaigns', icon: '📊', description: 'Campagne marketing semplici' },
    { key: 'leads', name: 'Leads', icon: '👥', description: 'Lead e contatti' },
    { key: 'marketing_seo_projects', name: 'SEO Projects', icon: '🔍', description: 'Progetti SEO' },
    { key: 'marketing_seo_tasks', name: 'SEO Tasks', icon: '✅', description: 'Task SEO' },
    { key: 'marketing_crm_campaigns', name: 'CRM Campaigns', icon: '📧', description: 'Campagne CRM' },
    { key: 'marketing_crm_contacts', name: 'CRM Contacts', icon: '👤', description: 'Contatti CRM' },
    { key: 'marketing_ad_campaigns', name: 'Ad Campaigns', icon: '🎯', description: 'Campagne pubblicitarie' },
    { key: 'marketing_ad_groups', name: 'Ad Groups', icon: '📈', description: 'Gruppi di annunci' },
    { key: 'marketing_content_calendar', name: 'Content Calendar', icon: '📅', description: 'Calendario contenuti' },
    { key: 'marketing_social_accounts', name: 'Social Accounts', icon: '📱', description: 'Account social media' },
    { key: 'marketing_reports', name: 'Reports', icon: '📊', description: 'Report marketing' },
    { key: 'marketing_newsletter_templates', name: 'Newsletter Templates', icon: '📰', description: 'Template newsletter' },
    { key: 'marketing_newsletter_campaigns', name: 'Newsletter Campaigns', icon: '📬', description: 'Campagne newsletter' },
    { key: 'marketing_quick_quotes', name: 'Quick Quotes', icon: '💰', description: 'Preventivi rapidi' }
  ];

  const loadTableData = async (tableName: string) => {
    if (tableData[tableName]) return; // Already loaded

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(50)
        .order('created_at', { ascending: false });

      if (error) {
        setError(`Errore caricamento ${tableName}: ${error.message}`);
        return;
      }

      setTableData(prev => ({
        ...prev,
        [tableName]: data || []
      }));
    } catch (err) {
      setError(`Errore caricamento ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTableData(activeTab);
  }, [activeTab]);

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return '-';
    
    if (typeof value === 'boolean') return value ? 'Sì' : 'No';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '-';
      }
      return JSON.stringify(value);
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'converted':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'paused':
      case 'draft':
      case 'new':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'lost':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
      case 'qualified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentData = tableData[activeTab] || [];
  const currentTable = tables.find(t => t.key === activeTab);

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg mr-3">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Visualizzazioni Tabelle Marketing</h2>
              <p className="text-gray-600">Esplora tutti i dati delle tabelle marketing</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {currentData.length} record
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tables.map((table) => (
            <button
              key={table.key}
              onClick={() => setActiveTab(table.key)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === table.key
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{table.icon}</span>
              {table.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Caricamento dati...</span>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Table Info */}
            <div className="mb-4 p-4 bg-blue-500/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">
                {currentTable?.icon} {currentTable?.name}
              </h3>
              <p className="text-sm text-gray-600">{currentTable?.description}</p>
            </div>

            {/* Data Table */}
            {currentData.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📭</div>
                <p className="text-gray-500">Nessun dato disponibile per questa tabella</p>
                <p className="text-sm text-gray-400 mt-1">
                  La tabella potrebbe non esistere o essere vuota
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-500/20">
                    <tr>
                      {Object.keys(currentData[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 backdrop-blur/30 backdrop-blurdivide-y divide-gray-200">
                    {currentData.map((row, index) => (
                      <tr key={index} className="hover:bg-blue-500/20">
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key} className="px-4 py-3 text-sm text-gray-900">
                            {key === 'status' ? (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(String(value))}`}>
                                {formatValue(value, key)}
                              </span>
                            ) : key.includes('date') || key.includes('_at') ? (
                              <span className="text-gray-600">
                                {value ? new Date(String(value)).toLocaleDateString('it-IT') : '-'}
                              </span>
                            ) : key.includes('amount') || key.includes('budget') || key.includes('price') || key.includes('cost') ? (
                              <span className="font-mono text-green-600">
                                {value ? `€${parseFloat(String(value)).toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '-'}
                              </span>
                            ) : (
                              <span className="text-gray-900">
                                {formatValue(value, key)}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-blue-500/20 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Mostrando {currentData.length} record da {currentTable?.name}
          </div>
          <div>
            Ultimo aggiornamento: {getCurrentTime()}
          </div>
        </div>
      </div>
    </div>
  );
}
