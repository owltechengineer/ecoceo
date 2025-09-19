'use client';

import { useAnalytics } from '@/contexts/AnalyticsContext';

export default function ContactRequests() {
  const { state } = useAnalytics();
  const { contactRequests } = state;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-red-600 bg-red-50';
      case 'contacted': return 'text-yellow-600 bg-yellow-50';
      case 'qualified': return 'text-blue-600 bg-blue-50';
      case 'converted': return 'text-green-600 bg-green-50';
      case 'lost': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nuova';
      case 'contacted': return 'Contattata';
      case 'qualified': return 'Qualificata';
      case 'converted': return 'Convertita';
      case 'lost': return 'Persa';
      default: return status;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'contact-form': return '📝';
      case 'email': return '📧';
      case 'linkedin': return '💼';
      case 'support': return '🛠️';
      case 'referral': return '👥';
      default: return '📞';
    }
  };

  const newRequests = contactRequests.filter(r => r.status === 'new').length;
  const contactedRequests = contactRequests.filter(r => r.status === 'contacted').length;
  const qualifiedRequests = contactRequests.filter(r => r.status === 'qualified').length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📞 Richieste Contatti</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-red-600 font-medium">Nuove: {newRequests}</span>
          <span className="text-gray-500">Totale: {contactRequests.length}</span>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{newRequests}</p>
          <p className="text-xs text-red-600">Nuove</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{contactedRequests}</p>
          <p className="text-xs text-yellow-600">Contattate</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{qualifiedRequests}</p>
          <p className="text-xs text-blue-600">Qualificate</p>
        </div>
      </div>

      {/* Lista richieste recenti */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Richieste Recenti</h4>
        {contactRequests.slice(0, 4).map((request) => (
          <div key={request.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSourceIcon(request.source)}</span>
                <div>
                  <p className="font-medium text-gray-900">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
            </div>
            
            <div className="mb-2">
              <p className="font-medium text-gray-900 text-sm">{request.subject}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{request.message}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{new Date(request.createdAt).toLocaleDateString('it-IT')}</span>
              <span>{request.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {contactRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-4 block">📞</span>
          <p>Nessuna richiesta recente</p>
        </div>
      )}
    </div>
  );
}
