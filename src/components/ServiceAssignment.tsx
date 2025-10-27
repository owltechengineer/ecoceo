'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { useDashboard } from '@/contexts/DashboardContext';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

interface SanityService {
  _id: string;
  name: string;
  slug: { current: string };
}

interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  service?: {
    _id: string;
    name: string;
  };
}

export default function ServiceAssignment() {
  const { openInfo } = useInfoModal();
  const { state } = useDashboard();
  const [sanityServices, setSanityServices] = useState<SanityService[]>([]);
  const [sanityProjects, setSanityProjects] = useState<SanityProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadSanityData();
  }, []);

  const loadSanityData = async () => {
    try {
      setIsLoading(true);
      
      // Carica servizi e progetti da Sanity
      const [services, projects] = await Promise.all([
        client.fetch(`*[_type == "service" && isActive == true] | order(name asc) {
          _id,
          name,
          slug
        }`),
        client.fetch(`*[_type == "project" && isActive == true] | order(title asc) {
          _id,
          title,
          slug,
          service->{
            _id,
            name
          }
        }`)
      ]);

      setSanityServices(services);
      setSanityProjects(projects);
    } catch (error) {
      console.error('Errore nel caricamento dei dati di Sanity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignService = async () => {
    if (!selectedProject || !selectedService) {
      alert('Seleziona sia un progetto che un servizio');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Aggiorna il progetto in Sanity
      await client
        .patch(selectedProject)
        .set({
          service: {
            _type: 'reference',
            _ref: selectedService
          }
        })
        .commit();

      // Ricarica i dati
      await loadSanityData();
      
      // Reset form
      setSelectedProject('');
      setSelectedService('');
      
      alert('Servizio assegnato con successo!');
    } catch (error) {
      console.error('Errore nell\'assegnazione del servizio:', error);
      alert('Errore nell\'assegnazione del servizio');
    } finally {
      setIsUpdating(false);
    }
  };

  const getServiceName = (serviceRef: any) => {
    if (!serviceRef) return 'Nessun servizio';
    return sanityServices.find(s => s._id === serviceRef._id)?.name || 'Servizio non trovato';
  };

  if (isLoading) {
    return (
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Assegnazione Servizi</h3>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Caricamento dati...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🔗 Assegnazione Servizi</h3>
            <p className="text-sm text-gray-600">
              Assegna progetti ai servizi di Sanity CMS
            </p>
          </div>
          <InfoButton onClick={() => openInfo(dashboardInfo.serviceAssignment.title, dashboardInfo.serviceAssignment.content)} />
        </div>
        <button
          onClick={loadSanityData}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Aggiorna
        </button>
      </div>

      {/* Form di assegnazione */}
      <div className="mb-6 p-4 bg-white/30rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Assegna Servizio a Progetto</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progetto
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleziona progetto...</option>
              {sanityProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servizio
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleziona servizio...</option>
              {sanityServices.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAssignService}
              disabled={!selectedProject || !selectedService || isUpdating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUpdating ? 'Aggiornando...' : 'Assegna'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabella progetti con servizi assegnati */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progetto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servizio Assegnato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/30 backdrop-blur/30 backdrop-blurdivide-y divide-gray-200">
            {sanityProjects.map((project) => (
              <tr key={project._id} className="hover:bg-white/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.title}</div>
                  <div className="text-sm text-gray-500">{project.slug.current}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.service ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getServiceName(project.service)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`/studio/project;${project._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Modifica
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Suggerimento:</strong> Dopo aver assegnato un servizio, ricorda di sincronizzare 
          la dashboard per vedere i dati aggiornati.
        </p>
      </div>
    </div>
  );
}
