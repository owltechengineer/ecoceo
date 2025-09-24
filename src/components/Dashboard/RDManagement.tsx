'use client';

import { useState } from 'react';
import { useDashboard, RDProject } from '@/contexts/DashboardContext';
import FormModal, { FormField, FormArrayField } from './FormModal';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

export default function RDManagement() {
  const { state, addRDProject, updateRDProject, deleteRDProject } = useDashboard();
  const { rdProjects } = state;
  
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<RDProject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trl: 1,
    hours: 0,
    cost: 0,
    expectedReturn: 0,
    status: 'research' as 'research' | 'development' | 'completed' | 'suspended',
    startDate: '',
    endDate: '',
    team: [] as string[],
  });

  const { openInfo } = useInfoModal();

  const getTRLLabel = (trl: number) => {
    const labels = {
      1: 'Ricerca Base',
      2: 'Ricerca Applicata',
      3: 'Sviluppo Concettuale',
      4: 'Validazione Laboratorio',
      5: 'Validazione Ambiente Reale',
      6: 'Prototipo Sistema',
      7: 'Dimostrazione Prototipo',
      8: 'Sistema Qualificato',
      9: 'Sistema Verificato',
    };
    return labels[trl as keyof typeof labels] || 'Sconosciuto';
  };

  const getTRLColor = (trl: number) => {
    if (trl <= 3) return 'bg-red-100 text-red-800';
    if (trl <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'testing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'research': return 'Ricerca';
      case 'development': return 'Sviluppo';
      case 'testing': return 'Test';
      case 'completed': return 'Completato';
      default: return status;
    }
  };

  const totalCost = rdProjects.reduce((sum, p) => sum + p.cost, 0);
  const totalExpectedReturn = rdProjects.reduce((sum, p) => sum + p.expectedReturn, 0);
  const totalHours = rdProjects.reduce((sum, p) => sum + p.hours, 0);
  const averageTRL = rdProjects.length > 0 ? rdProjects.reduce((sum, p) => sum + p.trl, 0) / rdProjects.length : 0;

  const handleOpenForm = (project?: RDProject) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        trl: project.trl,
        hours: project.hours,
        cost: project.cost,
        expectedReturn: project.expectedReturn,
        status: project.status as 'research' | 'development' | 'completed' | 'suspended',
        startDate: project.startDate,
        endDate: project.endDate,
        team: [...project.team],
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        trl: 1,
        hours: 0,
        cost: 0,
        expectedReturn: 0,
        status: 'research',
        startDate: '',
        endDate: '',
        team: [],
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        updateRDProject({
          ...editingProject,
          ...formData,
        });
        console.log('Progetto R&D aggiornato:', formData);
        alert('Progetto R&D aggiornato con successo!');
      } else {
        addRDProject({
          ...formData,
          actualReturn: 0,
          progress: 0,
          roi: 0,
          plannedCost: formData.cost,
          plannedReturn: formData.expectedReturn,
          plannedProgress: 0,
          actualProgress: 0
        });
        console.log('Nuovo progetto R&D aggiunto:', formData);
        alert('Progetto R&D aggiunto con successo!');
      }
      
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Errore nel salvataggio del progetto R&D:', error);
      alert('Errore nel salvataggio del progetto R&D. Riprova.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto R&D?')) {
      try {
        deleteRDProject(id);
        console.log('Progetto R&D eliminato:', id);
        alert('Progetto R&D eliminato con successo!');
      } catch (error) {
        console.error('Errore nell\'eliminazione del progetto R&D:', error);
        alert('Errore nell\'eliminazione del progetto R&D. Riprova.');
      }
    }
  };

  return (
    <div className="space-y-8 min-h-full p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 R&D Management</h2>
              <p className="text-gray-600">Monitoraggio investimenti innovativi con TRL e ritorno atteso</p>
            </div>
            <InfoButton onClick={() => openInfo(dashboardInfo.rd.title, dashboardInfo.rd.content)} />
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Nuovo Progetto R&D
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-600">Costi Totali R&D</h3>
          <p className="text-2xl font-bold text-blue-900">€{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-600">Ritorno Atteso</h3>
          <p className="text-2xl font-bold text-green-900">€{totalExpectedReturn.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-600">Ore Totali</h3>
          <p className="text-2xl font-bold text-purple-900">{totalHours}h</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-orange-600">TRL Medio</h3>
          <p className="text-2xl font-bold text-orange-900">{averageTRL.toFixed(1)}</p>
        </div>
      </div>

      {/* TRL Legend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Readiness Level (TRL)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Ricerca (TRL 1-3)</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• TRL 1: Ricerca Base</div>
              <div>• TRL 2: Ricerca Applicata</div>
              <div>• TRL 3: Sviluppo Concettuale</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Sviluppo (TRL 4-6)</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• TRL 4: Validazione Laboratorio</div>
              <div>• TRL 5: Validazione Ambiente Reale</div>
              <div>• TRL 6: Prototipo Sistema</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Validazione (TRL 7-9)</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• TRL 7: Dimostrazione Prototipo</div>
              <div>• TRL 8: Sistema Qualificato</div>
              <div>• TRL 9: Sistema Verificato</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Progetti R&D</h3>
            <button 
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              + Nuovo Progetto R&D
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progetto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TRL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ore
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ritorno Atteso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rdProjects.map((project) => {
                const roi = project.cost > 0 ? (project.expectedReturn - project.cost) / project.cost : 0;
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTRLColor(project.trl)}`}>
                        TRL {project.trl}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{getTRLLabel(project.trl)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{project.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{project.expectedReturn.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        roi > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(roi * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.team.slice(0, 2).map((member, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {member}
                          </span>
                        ))}
                        {project.team.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            +{project.team.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenForm(project)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analisi ROI per TRL</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">TRL 1-3 (Ricerca)</span>
              <span className="text-sm font-medium text-red-600">-15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">TRL 4-6 (Sviluppo)</span>
              <span className="text-sm font-medium text-yellow-600">+25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">TRL 7-9 (Validazione)</span>
              <span className="text-sm font-medium text-green-600">+180%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Risorse</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Ricerca</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Sviluppo</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Validazione</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingProject ? 'Modifica Progetto R&D' : 'Nuovo Progetto R&D'}
        onSubmit={handleSubmit}
        submitText={editingProject ? 'Aggiorna Progetto' : 'Crea Progetto'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nome Progetto"
            name="name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value as string })}
            required
          />
          <FormField
            label="TRL"
            name="trl"
            type="number"
            value={formData.trl}
            onChange={(value) => setFormData({ ...formData, trl: value as number })}
            min={1}
            max={9}
            step={1}
            required
          />
          <FormField
            label="Stato"
            name="status"
            type="select"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as any })}
            options={[
              { value: 'research', label: 'Ricerca' },
              { value: 'development', label: 'Sviluppo' },
              { value: 'testing', label: 'Test' },
              { value: 'completed', label: 'Completato' },
            ]}
            required
          />
          <FormField
            label="Ore"
            name="hours"
            type="number"
            value={formData.hours}
            onChange={(value) => setFormData({ ...formData, hours: value as number })}
            min={0}
            step={1}
            required
          />
          <FormField
            label="Costi (€)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={(value) => setFormData({ ...formData, cost: value as number })}
            min={0}
            step={0.01}
            required
          />
          <FormField
            label="Ritorno Atteso (€)"
            name="expectedReturn"
            type="number"
            value={formData.expectedReturn}
            onChange={(value) => setFormData({ ...formData, expectedReturn: value as number })}
            min={0}
            step={0.01}
            required
          />
          <FormField
            label="Data Inizio"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={(value) => setFormData({ ...formData, startDate: value as string })}
            required
          />
          <FormField
            label="Data Fine"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={(value) => setFormData({ ...formData, endDate: value as string })}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="Descrizione"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value as string })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <FormArrayField
              label="Team"
              values={formData.team}
              onChange={(values) => setFormData({ ...formData, team: values })}
              placeholder="Nome membro team..."
              addButtonText="Aggiungi Membro"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
