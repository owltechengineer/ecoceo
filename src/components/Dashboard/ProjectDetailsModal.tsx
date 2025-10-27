'use client';

import React, { useState, useEffect } from 'react';
import { Project, Service } from '@/contexts/DashboardContext';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  services: Service[];
  onSave?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  allocation_percentage: number;
  hourly_rate: number;
  start_date: string;
  end_date: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  planned_date: string;
  actual_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
}

interface Risk {
  id: string;
  title: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  mitigation_strategy: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'resolved';
}

export default function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  services,
  onSave,
  onDelete
}: ProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'team' | 'milestones' | 'risks'>('overview');
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Inizializza i dati se non esistono
      setObjectives((project as any).objectives || []);
      setTeamMembers((project as any).teamMembers || []);
      setMilestones((project as any).milestones || []);
      setRisks((project as any).risks || []);
      // Reset editing mode quando si apre il modal
      setIsEditing(false);
    }
  }, [isOpen, project]);

  const handleSave = () => {
    if (onSave) {
      const updatedProject = {
        ...project,
        objectives,
        teamMembers,
        milestones,
        risks
      };
      onSave(updatedProject);
    }
    onClose();
  };

  const addObjective = () => {
    const newObjective: Objective = {
      id: `obj-${Date.now()}`,
      title: '',
      description: '',
      target_date: '',
      status: 'pending',
      priority: 'medium'
    };
    setObjectives([...objectives, newObjective]);
  };

  const updateObjective = (id: string, field: keyof Objective, value: any) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, [field]: value } : obj
    ));
  };

  const deleteObjective = (id: string) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      allocation_percentage: 0,
      hourly_rate: 0,
      start_date: '',
      end_date: ''
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      planned_date: '',
      actual_date: '',
      status: 'pending',
      dependencies: []
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const addRisk = () => {
    const newRisk: Risk = {
      id: `risk-${Date.now()}`,
      title: '',
      description: '',
      risk_level: 'medium',
      probability: 50,
      impact: 50,
      mitigation_strategy: '',
      status: 'identified'
    };
    setRisks([...risks, newRisk]);
  };

  const updateRisk = (id: string, field: keyof Risk, value: any) => {
    setRisks(risks.map(risk => 
      risk.id === id ? { ...risk, [field]: value } : risk
    ));
  };

  const deleteRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };

  if (!isOpen) return null;
  
  console.log('ProjectDetailsModal rendering:', { isOpen, isEditing, project: project.name });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${isEditing ? 'ring-2 ring-blue-500' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600">
              {isEditing ? '✏️ Modifica progetto - I campi sono modificabili' : '👁️ Gestione completa del progetto - Visualizzazione'}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              DEBUG: isEditing = {isEditing ? 'true' : 'false'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => {
                  console.log('Switching to editing mode');
                  setIsEditing(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <span className="text-lg">✏️</span>
                <span>Modifica Progetto</span>
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <span>👁️</span>
                Visualizza
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: '📊 Panoramica', icon: '📊' },
              { id: 'objectives', label: '🎯 Obiettivi', icon: '🎯' },
              { id: 'team', label: '👥 Team', icon: '👥' },
              { id: 'milestones', label: '🏁 Milestone', icon: '🏁' },
              { id: 'risks', label: '⚠️ Rischi', icon: '⚠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Base</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome Progetto</label>
                      <p className="text-gray-900">{project.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cliente</label>
                      <p className="text-gray-900">{project.client || 'Non specificato'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stato</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status === 'active' ? '🟢 Attivo' :
                         project.status === 'planning' ? '📋 Pianificazione' :
                         project.status === 'on-hold' ? '⏸️ In Pausa' :
                         project.status === 'completed' ? '✅ Completato' :
                         '❌ Cancellato'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Metriche</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Progresso</label>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{project.progress || 0}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Budget</label>
                      <p className="text-gray-900">€{project.budget?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Costo Effettivo</label>
                      <p className="text-gray-900">€{project.actualCost?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">🎯 Obiettivi del Progetto</h3>
                {isEditing && (
                  <button
                    onClick={addObjective}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Aggiungi Obiettivo
                  </button>
                )}
              </div>

              {objectives.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>Nessun obiettivo definito</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={objective.title}
                              onChange={(e) => updateObjective(objective.id, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Titolo obiettivo"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{objective.title || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Target</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={objective.target_date}
                              onChange={(e) => updateObjective(objective.id, 'target_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{objective.target_date ? new Date(objective.target_date).toLocaleDateString('it-IT') : 'Non specificato'}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                          {isEditing ? (
                            <textarea
                              value={objective.description}
                              onChange={(e) => updateObjective(objective.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Descrizione obiettivo"
                            />
                          ) : (
                            <p className="text-gray-900">{objective.description || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                          {isEditing ? (
                            <select
                              value={objective.status}
                              onChange={(e) => updateObjective(objective.id, 'status', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="pending">⏳ In Attesa</option>
                              <option value="in_progress">🔄 In Corso</option>
                              <option value="completed">✅ Completato</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              objective.status === 'completed' ? 'bg-green-100 text-green-800' :
                              objective.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {objective.status === 'completed' ? '✅ Completato' :
                               objective.status === 'in_progress' ? '🔄 In Corso' :
                               '⏳ In Attesa'}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                          {isEditing ? (
                            <select
                              value={objective.priority}
                              onChange={(e) => updateObjective(objective.id, 'priority', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">🟢 Bassa</option>
                              <option value="medium">🟡 Media</option>
                              <option value="high">🔴 Alta</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              objective.priority === 'high' ? 'bg-red-100 text-red-800' :
                              objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {objective.priority === 'high' ? '🔴 Alta' :
                               objective.priority === 'medium' ? '🟡 Media' :
                               '🟢 Bassa'}
                            </span>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => deleteObjective(objective.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">👥 Team del Progetto</h3>
                {isEditing && (
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Aggiungi Membro
                  </button>
                )}
              </div>

              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>Nessun membro del team definito</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nome membro"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{member.name || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ruolo nel progetto"
                            />
                          ) : (
                            <p className="text-gray-900">{member.role || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allocazione (%)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={member.allocation_percentage}
                              onChange={(e) => updateTeamMember(member.id, 'allocation_percentage', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{member.allocation_percentage}%</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tariffa Oraria (€)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={member.hourly_rate}
                              onChange={(e) => updateTeamMember(member.id, 'hourly_rate', parseFloat(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          ) : (
                            <p className="text-gray-900">€{member.hourly_rate?.toFixed(2) || '0.00'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={member.start_date}
                              onChange={(e) => updateTeamMember(member.id, 'start_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{member.start_date ? new Date(member.start_date).toLocaleDateString('it-IT') : 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={member.end_date}
                              onChange={(e) => updateTeamMember(member.id, 'end_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{member.end_date ? new Date(member.end_date).toLocaleDateString('it-IT') : 'Non specificato'}</p>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">🏁 Milestone del Progetto</h3>
                {isEditing && (
                  <button
                    onClick={addMilestone}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Aggiungi Milestone
                  </button>
                )}
              </div>

              {milestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏁</div>
                  <p>Nessun milestone definito</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Titolo milestone"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{milestone.title || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Pianificata</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={milestone.planned_date}
                              onChange={(e) => updateMilestone(milestone.id, 'planned_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{milestone.planned_date ? new Date(milestone.planned_date).toLocaleDateString('it-IT') : 'Non specificato'}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                          {isEditing ? (
                            <textarea
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Descrizione milestone"
                            />
                          ) : (
                            <p className="text-gray-900">{milestone.description || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                          {isEditing ? (
                            <select
                              value={milestone.status}
                              onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="pending">⏳ In Attesa</option>
                              <option value="in_progress">🔄 In Corso</option>
                              <option value="completed">✅ Completato</option>
                              <option value="delayed">⚠️ Ritardato</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                              milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.status === 'completed' ? '✅ Completato' :
                               milestone.status === 'in_progress' ? '🔄 In Corso' :
                               milestone.status === 'delayed' ? '⚠️ Ritardato' :
                               '⏳ In Attesa'}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data Effettiva</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={milestone.actual_date}
                              onChange={(e) => updateMilestone(milestone.id, 'actual_date', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{milestone.actual_date ? new Date(milestone.actual_date).toLocaleDateString('it-IT') : 'Non specificato'}</p>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => deleteMilestone(milestone.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">⚠️ Rischi del Progetto</h3>
                {isEditing && (
                  <button
                    onClick={addRisk}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ➕ Aggiungi Rischio
                  </button>
                )}
              </div>

              {risks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⚠️</div>
                  <p>Nessun rischio identificato</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {risks.map((risk) => (
                    <div key={risk.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={risk.title}
                              onChange={(e) => updateRisk(risk.id, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Titolo rischio"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{risk.title || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Livello Rischio</label>
                          {isEditing ? (
                            <select
                              value={risk.risk_level}
                              onChange={(e) => updateRisk(risk.id, 'risk_level', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">🟢 Basso</option>
                              <option value="medium">🟡 Medio</option>
                              <option value="high">🟠 Alto</option>
                              <option value="critical">🔴 Critico</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              risk.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                              risk.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                              risk.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {risk.risk_level === 'critical' ? '🔴 Critico' :
                               risk.risk_level === 'high' ? '🟠 Alto' :
                               risk.risk_level === 'medium' ? '🟡 Medio' :
                               '🟢 Basso'}
                            </span>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                          {isEditing ? (
                            <textarea
                              value={risk.description}
                              onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Descrizione rischio"
                            />
                          ) : (
                            <p className="text-gray-900">{risk.description || 'Non specificato'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Probabilità (%)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={risk.probability}
                              onChange={(e) => updateRisk(risk.id, 'probability', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{risk.probability}%</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Impatto (%)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={risk.impact}
                              onChange={(e) => updateRisk(risk.id, 'impact', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{risk.impact}%</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Strategia di Mitigazione</label>
                          {isEditing ? (
                            <textarea
                              value={risk.mitigation_strategy}
                              onChange={(e) => updateRisk(risk.id, 'mitigation_strategy', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Strategia per mitigare il rischio"
                            />
                          ) : (
                            <p className="text-gray-900">{risk.mitigation_strategy || 'Non specificato'}</p>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => deleteRisk(risk.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
                    onDelete(project.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️ Elimina Progetto
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    // Salva le modifiche
                    const updatedProject = {
                      ...project,
                      objectives,
                      teamMembers,
                      milestones,
                      risks
                    };
                    if (onSave) {
                      onSave(updatedProject);
                    }
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  💾 Salva Modifiche
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  ❌ Annulla
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Chiudi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
