'use client';

import { useState, useEffect } from 'react';
import { sanityDataService, SanityService } from '@/services/sanityDataService';
import ServiceCard from './ServiceCard';
import { useDashboard, Service } from '@/contexts/DashboardContext';

export default function ServicesWithCards() {
  const [services, setServices] = useState<SanityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { addService, updateService, deleteService } = useDashboard();

  // Funzione per convertire SanityService in Service
  const convertSanityServiceToService = (sanityService: SanityService): Service => {
    return {
      id: sanityService._id,
      name: sanityService.title || 'Service Name',
      description: sanityService.description || 'Service description',
      category: 'consulting',
      status: 'active',
      priority: 'medium',
      base_price: sanityService.price || 0,
      currency: 'EUR',
      pricing_model: 'hourly',
      delivery_time_days: 7,
      delivery_method: 'remote',
      service_manager: 'Manager',
      team_members: [],
      requirements: [],
      deliverables: [],
      notes: '',
      tags: []
    };
  };

  useEffect(() => {
    loadData();
  }, [showPrivate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const sanityServices = await sanityDataService.getServices(showPrivate);
      setServices(sanityServices);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei servizi da Sanity');
      console.error('Errore nel caricamento:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async (service: SanityService) => {
    try {
      const success = await sanityDataService.updateService(service._id, service);
      if (success) {
        await loadData(); // Ricarica i dati
        updateService(convertSanityServiceToService(service));
      } else {
        setError('Errore nell\'aggiornamento del servizio');
      }
    } catch (err) {
      setError('Errore nell\'aggiornamento del servizio');
      console.error('Errore nell\'aggiornamento:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo servizio?')) return;
    
    try {
      const success = await sanityDataService.deleteService(id);
      if (success) {
        await loadData(); // Ricarica i dati
        deleteService(id);
      } else {
        setError('Errore nell\'eliminazione del servizio');
      }
    } catch (err) {
      setError('Errore nell\'eliminazione del servizio');
      console.error('Errore nell\'eliminazione:', err);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Caricamento servizi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="text-red-600 mr-2">⚠️</span>
          <span className="text-red-800">{error}</span>
          <button
            onClick={loadData}
            className="ml-auto text-red-600 hover:text-red-800 underline"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e controlli */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Servizi</h2>
          <p className="text-gray-600">
            {filteredServices.length} di {services.length} servizi
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/studio/desk/service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Crea su Sanity
          </a>
          
          <button
            onClick={() => setShowPrivate(!showPrivate)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showPrivate 
                ? 'bg-gray-100 border-gray-300 text-gray-700' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showPrivate ? '🔒 Solo Pubblici' : '🔓 Tutti'}
          </button>
        </div>
      </div>

      {/* Filtri e ricerca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cerca servizi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivo</option>
          <option value="inactive">Inattivo</option>
          <option value="maintenance">Manutenzione</option>
          <option value="deprecated">Deprecato</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tutte le categorie</option>
          <option value="development">Sviluppo</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="consulting">Consulenza</option>
          <option value="support">Supporto</option>
        </select>
      </div>

      {/* Grid delle card */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun servizio trovato
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Prova a modificare i filtri di ricerca'
              : 'Crea il tuo primo servizio su Sanity Studio'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
            <a
              href="/studio/desk/service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">➕</span>
              Crea Servizio
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service._id}
              service={convertSanityServiceToService(service)}
              onEdit={(service) => handleEditService(services.find(s => s._id === service.id)!)}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}

      {/* Pulsante di ricarica */}
      <div className="text-center">
        <button
          onClick={loadData}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">🔄</span>
          Ricarica Dati
        </button>
      </div>
    </div>
  );
}

