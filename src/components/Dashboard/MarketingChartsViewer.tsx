'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export default function MarketingChartsViewer() {
  const [activeChart, setActiveChart] = useState('campaigns');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartTypes = [
    { key: 'campaigns', name: 'Campaigns per Status', icon: '📊' },
    { key: 'leads', name: 'Leads per Status', icon: '👥' },
    { key: 'seo_projects', name: 'Progetti SEO per Priorità', icon: '🔍' },
    { key: 'ad_campaigns', name: 'Campagne Ads per Piattaforma', icon: '🎯' },
    { key: 'content', name: 'Contenuti per Tipo', icon: '📅' },
    { key: 'newsletter', name: 'Newsletter per Status', icon: '📬' }
  ];

  const loadChartData = async (chartType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let data: any[] = [];
      let labels: string[] = [];
      let values: number[] = [];
      let colors: string[] = [];

      switch (chartType) {
        case 'campaigns':
          const { data: campaignsData, error: campaignsError } = await supabase
            .from('campaigns')
            .select('status');
          
          if (campaignsError) throw campaignsError;
          
          const campaignStatuses = campaignsData?.reduce((acc: any, item: any) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(campaignStatuses);
          values = Object.values(campaignStatuses);
          colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
          break;

        case 'leads':
          const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('status');
          
          if (leadsError) throw leadsError;
          
          const leadStatuses = leadsData?.reduce((acc: any, item: any) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(leadStatuses);
          values = Object.values(leadStatuses);
          colors = ['#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'];
          break;

        case 'seo_projects':
          const { data: seoData, error: seoError } = await supabase
            .from('marketing_seo_projects')
            .select('priority');
          
          if (seoError) throw seoError;
          
          const seoPriorities = seoData?.reduce((acc: any, item: any) => {
            acc[item.priority] = (acc[item.priority] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(seoPriorities);
          values = Object.values(seoPriorities);
          colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
          break;

        case 'ad_campaigns':
          const { data: adData, error: adError } = await supabase
            .from('marketing_ad_campaigns')
            .select('platform');
          
          if (adError) throw adError;
          
          const adPlatforms = adData?.reduce((acc: any, item: any) => {
            acc[item.platform] = (acc[item.platform] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(adPlatforms);
          values = Object.values(adPlatforms);
          colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
          break;

        case 'content':
          const { data: contentData, error: contentError } = await supabase
            .from('marketing_content_calendar')
            .select('content_type');
          
          if (contentError) throw contentError;
          
          const contentTypes = contentData?.reduce((acc: any, item: any) => {
            acc[item.content_type] = (acc[item.content_type] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(contentTypes);
          values = Object.values(contentTypes);
          colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
          break;

        case 'newsletter':
          const { data: newsletterData, error: newsletterError } = await supabase
            .from('marketing_newsletter_campaigns')
            .select('status');
          
          if (newsletterError) throw newsletterError;
          
          const newsletterStatuses = newsletterData?.reduce((acc: any, item: any) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}) || {};
          
          labels = Object.keys(newsletterStatuses);
          values = Object.values(newsletterStatuses);
          colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
          break;

        default:
          throw new Error('Tipo di grafico non supportato');
      }

      setChartData({
        labels,
        datasets: [{
          label: chartTypes.find(c => c.key === chartType)?.name || 'Dati',
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length),
          borderWidth: 2
        }]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData(activeChart);
  }, [activeChart]);

  const SimpleBarChart = ({ data }: { data: ChartData }) => {
    const maxValue = Math.max(...data.datasets[0].data);
    
    return (
      <div className="space-y-4">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const color = data.datasets[0].backgroundColor[index];
          
          return (
            <div key={label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {label.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const SimplePieChart = ({ data }: { data: ChartData }) => {
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.labels.map((label, index) => {
              const value = data.datasets[0].data[index];
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const angle = (percentage / 100) * 360;
              const color = data.datasets[0].backgroundColor[index];
              
              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={label}
                  d={pathData}
                  fill={color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {total}
              </div>
              <div className="text-sm text-gray-600">
                Totale
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-8 space-y-2">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const color = data.datasets[0].backgroundColor[index];
            
            return (
              <div key={label} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700 capitalize">
                  {label.replace(/_/g, ' ')}: {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg mr-3">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Grafici Marketing</h2>
              <p className="text-gray-600">Visualizzazioni grafiche dei dati marketing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => (
            <button
              key={chart.key}
              onClick={() => setActiveChart(chart.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeChart === chart.key
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{chart.icon}</span>
              {chart.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
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
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Caricamento grafico...</span>
          </div>
        )}

        {!isLoading && !error && chartData && (
          <div className="space-y-6">
            {/* Chart Title */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {chartTypes.find(c => c.key === activeChart)?.name}
              </h3>
              <p className="text-gray-600">
                {chartData.labels.length} categorie, {chartData.datasets[0].data.reduce((sum, val) => sum + val, 0)} record totali
              </p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Grafico a Barre</h4>
                <SimpleBarChart data={chartData} />
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Grafico a Torta</h4>
                <SimplePieChart data={chartData} />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Dati Dettagliati</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valore
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentuale
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.labels.map((label, index) => {
                      const value = chartData.datasets[0].data[index];
                      const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                      
                      return (
                        <tr key={label}>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                            {label.replace(/_/g, ' ')}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {value}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && !chartData && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <p className="text-gray-500">Nessun dato disponibile per questo grafico</p>
          </div>
        )}
      </div>
    </div>
  );
}
