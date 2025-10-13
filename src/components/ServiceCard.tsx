'use client';

import { useState } from 'react';
import { Service } from '@/contexts/DashboardContext';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
}

export default function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);


  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header della card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
            </div>
            
            {/* Description not available in current Service type */}
            
            {/* Prezzo */}
            <div className="mb-3">
              <span className="text-lg font-semibold text-green-600">
                €{service.base_price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                / ora
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(service)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(service.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenuto espandibile */}
      {isExpanded && (
        <div className="p-6 space-y-4">
          {/* Dettagli del servizio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 Statistiche</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {/* Duration, Deliverables, Availability not available in current Service type */}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">💰 Pricing</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Prezzo Base: €{service.base_price.toLocaleString()}</div>
                <div>Modello: {service.pricing_model}</div>
                <div>Valuta: {service.currency}</div>
              </div>
            </div>
          </div>

          {/* Features, Technologies, Requirements, Notes not available in current Service type */}

          {/* Link a Sanity Studio */}
          <div className="pt-4 border-t border-gray-200">
            <a
              href={`/studio/desk/service;${service.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <span>✏️ Modifica su Sanity Studio</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

