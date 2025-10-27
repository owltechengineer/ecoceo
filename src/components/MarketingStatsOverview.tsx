'use client';

import { useState, useEffect } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import { supabase } from '@/lib/supabase';

interface TableStats {
  tableName: string;
  recordCount: number;
  lastUpdate: string;
  status: 'success' | 'error' | 'loading';
  error?: string;
}

export default function MarketingStatsOverview() {
  const [stats, setStats] = useState<TableStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { formatDateTime } = useClientDate();

  const tables = [
    'campaigns',
    'leads',
    'marketing_seo_projects',
    'marketing_seo_tasks',
    'marketing_crm_campaigns',
    'marketing_crm_contacts',
    'marketing_ad_campaigns',
    'marketing_ad_groups',
    'marketing_content_calendar',
    'marketing_social_accounts',
    'marketing_reports',
    'marketing_newsletter_templates',
    'marketing_newsletter_campaigns',
    'marketing_quick_quotes'
  ];

  const tableInfo = {
    campaigns: { name: 'Campaigns', icon: '📊', color: 'blue' },
    leads: { name: 'Leads', icon: '👥', color: 'green' },
    marketing_seo_projects: { name: 'SEO Projects', icon: '🔍', color: 'purple' },
    marketing_seo_tasks: { name: 'SEO Tasks', icon: '✅', color: 'indigo' },
    marketing_crm_campaigns: { name: 'CRM Campaigns', icon: '📧', color: 'pink' },
    marketing_crm_contacts: { name: 'CRM Contacts', icon: '👤', color: 'orange' },
    marketing_ad_campaigns: { name: 'Ad Campaigns', icon: '🎯', color: 'red' },
    marketing_ad_groups: { name: 'Ad Groups', icon: '📈', color: 'yellow' },
    marketing_content_calendar: { name: 'Content Calendar', icon: '📅', color: 'teal' },
    marketing_social_accounts: { name: 'Social Accounts', icon: '📱', color: 'cyan' },
    marketing_reports: { name: 'Reports', icon: '📊', color: 'gray' },
    marketing_newsletter_templates: { name: 'Newsletter Templates', icon: '📰', color: 'emerald' },
    marketing_newsletter_campaigns: { name: 'Newsletter Campaigns', icon: '📬', color: 'violet' },
    marketing_quick_quotes: { name: 'Quick Quotes', icon: '💰', color: 'amber' }
  };

  const loadStats = async () => {
    setIsLoading(true);
    const newStats: TableStats[] = [];

    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count', { count: 'exact' });

        if (error) {
          newStats.push({
            tableName,
            recordCount: 0,
            lastUpdate: new Date().toISOString(),
            status: 'error',
            error: error.message
          });
        } else {
          newStats.push({
            tableName,
            recordCount: data?.length || 0,
            lastUpdate: new Date().toISOString(),
            status: 'success'
          });
        }
      } catch (err) {
        newStats.push({
          tableName,
          recordCount: 0,
          lastUpdate: new Date().toISOString(),
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    setStats(newStats);
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
      teal: 'from-teal-500 to-teal-600',
      cyan: 'from-cyan-500 to-cyan-600',
      gray: 'from-gray-500 to-gray-600',
      emerald: 'from-emerald-500 to-emerald-600',
      violet: 'from-violet-500 to-violet-600',
      amber: 'from-amber-500 to-amber-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'loading': return '⏳';
      default: return '❓';
    }
  };

  const totalRecords = stats.reduce((sum, stat) => sum + stat.recordCount, 0);
  const successfulTables = stats.filter(stat => stat.status === 'success').length;
  const errorTables = stats.filter(stat => stat.status === 'error').length;

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg mr-3">
              <span className="text-xl text-white">📈</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Statistiche Marketing</h2>
              <p className="text-gray-600">Panoramica di tutte le tabelle marketing</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Aggiorna
              </span>
            ) : (
              '🔄 Aggiorna'
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tabelle Totali</p>
                <p className="text-2xl font-bold text-blue-800">{tables.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <span className="text-white text-lg">✅</span>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Tabelle OK</p>
                <p className="text-2xl font-bold text-green-800">{successfulTables}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-lg mr-3">
                <span className="text-white text-lg">❌</span>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Tabelle con Errori</p>
                <p className="text-2xl font-bold text-red-800">{errorTables}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500 rounded-lg mr-3">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Record Totali</p>
                <p className="text-2xl font-bold text-purple-800">{totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Stats Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Caricamento statistiche...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const info = tableInfo[stat.tableName as keyof typeof tableInfo];
              return (
                <div
                  key={stat.tableName}
                  className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                    stat.status === 'success'
                      ? 'bg-white/30 backdrop-blur/30 backdrop-blurborder-gray-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`p-2 bg-gradient-to-r ${getColorClasses(info?.color || 'gray')} rounded-lg mr-3`}>
                        <span className="text-white text-lg">{info?.icon || '📊'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {info?.name || stat.tableName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {getStatusIcon(stat.status)} {stat.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Record:</span>
                      <span className={`font-bold ${
                        stat.status === 'success' ? 'text-gray-900' : 'text-red-600'
                      }`}>
                        {stat.recordCount.toLocaleString()}
                      </span>
                    </div>

                    {stat.error && (
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                        {stat.error}
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Aggiornato: {new Date(stat.lastUpdate).toLocaleTimeString('it-IT')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white/30border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Ultimo aggiornamento: {formatDateTime(lastRefresh)}
          </div>
          <div>
            {successfulTables}/{tables.length} tabelle funzionanti
          </div>
        </div>
      </div>
    </div>
  );
}
