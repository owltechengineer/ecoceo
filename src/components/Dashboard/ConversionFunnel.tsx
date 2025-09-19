'use client';

import { useClientAnalytics } from '@/hooks/useClientAnalytics';
import { useState } from 'react';

export default function ConversionFunnel() {
  const { analyticsService, isClient } = useClientAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  const funnel = isClient && analyticsService ? analyticsService.getConversionFunnel(selectedPeriod) : {
    visits: 0,
    conversions: 0,
    orders: 0,
    revenue: 0,
    contactRequests: 0,
    funnelSteps: [],
  };

  const getStepColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-yellow-500',
      'bg-purple-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'Visite': return '👥';
      case 'Conversioni': return '🎯';
      case 'Ordini': return '🛒';
      case 'Richieste Contatto': return '📞';
      default: return '📊';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🔄 Funnel di Conversione</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Oggi</option>
          <option value="week">Questa Settimana</option>
          <option value="month">Questo Mese</option>
        </select>
      </div>

      {/* Statistiche generali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{funnel.visits}</p>
          <p className="text-xs text-blue-600">Visite</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{funnel.conversions}</p>
          <p className="text-xs text-green-600">Conversioni</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{funnel.orders}</p>
          <p className="text-xs text-yellow-600">Ordini</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{funnel.contactRequests}</p>
          <p className="text-xs text-purple-600">Richieste</p>
        </div>
      </div>

      {/* Funnel visuale */}
      <div className="space-y-4">
        {funnel.funnelSteps.map((step, index) => (
          <div key={step.step} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getStepIcon(step.step)}</span>
                <span className="font-medium text-gray-900">{step.step}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{step.count}</p>
                <p className="text-xs text-gray-500">{step.percentage.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getStepColor(index)}`}
                style={{ width: `${step.percentage}%` }}
              ></div>
            </div>
            
            {index < funnel.funnelSteps.length - 1 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
                <div className="w-0.5 h-4 bg-gray-300"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Metriche di performance */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">📈 Metriche di Performance</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tasso Conversione</span>
            <span className="font-medium">
              {funnel.visits > 0 ? ((funnel.conversions / funnel.visits) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tasso Acquisto</span>
            <span className="font-medium">
              {funnel.conversions > 0 ? ((funnel.orders / funnel.conversions) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valore Medio Ordine</span>
            <span className="font-medium">
              €{funnel.orders > 0 ? (funnel.revenue / funnel.orders).toFixed(2) : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Revenue Totale</span>
            <span className="font-medium">€{funnel.revenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
