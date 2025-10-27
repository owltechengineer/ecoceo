'use client';

import { useState } from 'react';
import UnifiedProjectCard from './UnifiedProjectCard';
import { Project, Service } from '@/contexts/DashboardContext';

export default function ProjectEditDemo() {
  const [demoProject, setDemoProject] = useState<Project>({
    id: 'demo-project-1',
    name: 'Progetto Demo',
    description: 'Questo è un progetto di esempio per testare la funzionalità di modifica',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    budget: 50000,
    actualCost: 25000,
    expectedRevenue: 75000,
    actualRevenue: 30000,
    progress: 60,
    client: 'Cliente Demo SRL',
    roi: 20,
    margin: 16.67,
    variance: -50,
    plannedCost: 50000,
    plannedRevenue: 75000,
    plannedProgress: 60,
    tags: ['demo', 'test', 'frontend']
  });

  const [demoServices] = useState<Service[]>([
    {
      id: 'service-1',
      name: 'Sviluppo Frontend',
      description: 'Sviluppo interfaccia utente',
      category: 'development',
      status: 'active',
      priority: 'high',
      base_price: 100,
      currency: 'EUR',
      pricing_model: 'hourly',
      delivery_time_days: 30,
      delivery_method: 'remote',
      service_manager: 'Mario Rossi',
      team_members: [],
      requirements: [],
      deliverables: [],
      notes: '',
      tags: []
    }
  ]);

  const handleSaveProject = (updatedProject: Project) => {
    setDemoProject(updatedProject);
    alert('Progetto aggiornato con successo!');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto demo?')) {
      alert('Progetto eliminato!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Demo Funzionalità Modifica Progetto
        </h2>
        <p className="text-gray-600 text-lg">
          Clicca su "Modifica" per vedere la card trasformarsi in un form di modifica
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Istruzioni:</h3>
        <ol className="text-blue-800 space-y-1">
          <li>1. Clicca sul pulsante "Modifica" nella card del progetto</li>
          <li>2. La card si trasformerà in un form con tutti i dati precompilati</li>
          <li>3. Modifica i campi che desideri</li>
          <li>4. Clicca "Salva" per aggiornare il progetto</li>
          <li>5. Oppure clicca "Annulla" per tornare alla vista normale</li>
        </ol>
      </div>

      <UnifiedProjectCard
        project={demoProject}
        services={demoServices}
        onSave={handleSaveProject}
        onEdit={handleSaveProject}
        onDelete={handleDeleteProject}
      />

      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Funzionalità Implementate:</h3>
        <ul className="text-green-800 space-y-1">
          <li>• Card unificata per creazione e modifica</li>
          <li>• Pulsante "Modifica" che apre il form con dati precompilati</li>
          <li>• Validazione in tempo reale</li>
          <li>• Indicatori visivi per la modalità editing</li>
          <li>• Campi completi per tutti i dati del progetto</li>
          <li>• Salvataggio e annullamento delle modifiche</li>
        </ul>
      </div>
    </div>
  );
}
