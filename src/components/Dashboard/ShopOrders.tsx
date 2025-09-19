'use client';

import { useAnalytics } from '@/contexts/AnalyticsContext';

export default function ShopOrders() {
  const { state } = useAnalytics();
  const { shopOrders } = state;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'shipped': return 'text-purple-600 bg-purple-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'In Attesa';
      case 'processing': return 'In Elaborazione';
      case 'shipped': return 'Spedito';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Cancellato';
      default: return status;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return '💳';
      case 'paypal': return '🅿️';
      case 'bank': return '🏦';
      default: return '💰';
    }
  };

  const totalOrders = shopOrders.length;
  const pendingOrders = shopOrders.filter(o => o.status === 'pending').length;
  const totalRevenue = shopOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🛍️ Ordini Shop</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-500">Totale: {totalOrders}</span>
          <span className="text-yellow-600">In attesa: {pendingOrders}</span>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          <p className="text-xs text-blue-600">Ordini Totali</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-green-600">Fatturato</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-xs text-yellow-600">In Attesa</p>
        </div>
      </div>

      {/* Lista ordini recenti */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Ordini Recenti</h4>
        {shopOrders.slice(0, 4).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <p className="font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.customerId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-medium text-gray-900">€{order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.products.length} prodotti</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getPaymentIcon(order.paymentMethod)}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shopOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-4 block">🛍️</span>
          <p>Nessun ordine recente</p>
        </div>
      )}
    </div>
  );
}
