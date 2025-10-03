'use client';

import { useState, useEffect } from 'react';
import { recurringActivitiesService, WeeklyTemplate } from '@/lib/supabase';
import DatabaseErrorNotification from './DatabaseErrorNotification';

interface WeeklyActivity {
  id: string;
  name: string;
  description: string;
  day_of_week: number;
  time: string;
  duration: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  is_active: boolean;
}

interface WeeklyScheduleProps {
  onDataChange?: () => void;
}

export default function WeeklySchedule({ onDataChange }: WeeklyScheduleProps) {
  const [templates, setTemplates] = useState<WeeklyTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WeeklyTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [databaseError, setDatabaseError] = useState<Error | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<WeeklyActivity | null>(null);

  const daysOfWeek = [
    'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'
  ];

  const timeSlots = Array.from({length: 24}, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const priorities = {
    low: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Bassa' },
    medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Media' },
    high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Alta' }
  };

  const categories = {
    'Lavoro': 'bg-blue-100 text-blue-800',
    'Personale': 'bg-purple-100 text-purple-800',
    'Salute': 'bg-green-100 text-green-800',
    'Formazione': 'bg-orange-100 text-orange-800',
    'Sociale': 'bg-pink-100 text-pink-800',
    'Famiglia': 'bg-indigo-100 text-indigo-800',
    'Hobby': 'bg-teal-100 text-teal-800',
    'Altro': 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await recurringActivitiesService.loadTemplates();
      const activeTemplates = data.filter(t => t.is_active);
      setTemplates(activeTemplates);
      
      if (activeTemplates.length > 0) {
        setSelectedTemplate(activeTemplates[0]);
      }
    } catch (error) {
      console.error('Errore nel caricamento template:', error);
      // Mostra un messaggio di errore più dettagliato
      if (error instanceof Error) {
        setDatabaseError(error);
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('❌ Tabelle non esistenti. Esegui lo script SQL per crearle.');
        } else if (error.message.includes('permission denied')) {
          console.error('❌ Permessi insufficienti. Verifica le policy RLS.');
        } else {
          console.error('❌ Errore di connessione:', error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getActivitiesForDay = (dayIndex: number) => {
    if (!selectedTemplate) return [];
    return selectedTemplate.activities.filter(activity => 
      activity.status === 'active' && activity.day_of_week === dayIndex
    ).sort((a, b) => (a.time_of_day || '').localeCompare(b.time_of_day || ''));
  };

  const getActivityPosition = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    
    return {
      top: `${(startMinutes / 60) * 100}%`,
      height: `${(duration / 60) * 100}%`,
      startMinutes,
      endMinutes
    };
  };

  const generateWeekFromTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const startOfWeek = new Date(currentWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const weekStartDate = startOfWeek.toISOString().split('T')[0];
      const generatedCount = await recurringActivitiesService.generateWeekFromTemplate(
        selectedTemplate.id, 
        weekStartDate
      );

      alert(`Settimana generata con successo! ${generatedCount} attività create nel calendario.`);
      // Ricarica i dati del calendario
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Errore nella generazione settimana:', error);
      alert('Errore nella generazione della settimana');
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getWeekRange = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return {
      start: startOfWeek.toLocaleDateString('it-IT'),
      end: endOfWeek.toLocaleDateString('it-IT')
    };
  };

  const handleActivityClick = (activity: WeeklyActivity) => {
    setEditingActivity(activity);
    setShowEditForm(true);
  };

  const handleSaveActivity = async (updatedActivity: WeeklyActivity) => {
    try {
      setLoading(true);
      // Qui implementeremo la logica per salvare l'attività modificata
      // Per ora mostriamo un alert
      alert(`Attività "${updatedActivity.name}" salvata con successo!`);
      setShowEditForm(false);
      setEditingActivity(null);
      
      // Ricarica i dati
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio dell\'attività');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Caricamento template...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Error Notification */}
      <DatabaseErrorNotification 
        error={databaseError} 
        onDismiss={() => setDatabaseError(null)} 
      />
      

      {/* Template Selector */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Template Selezionato</h3>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => {
              const template = templates.find(t => t.id === e.target.value);
              setSelectedTemplate(template || null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleziona un template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedTemplate && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900">{selectedTemplate.name}</h4>
            <p className="text-blue-700 text-sm mt-1">{selectedTemplate.description}</p>
            <p className="text-blue-600 text-sm mt-2">
              {selectedTemplate.activities?.length || 0} attività programmate
            </p>
          </div>
        )}
      </div>

      {/* Weekly Schedule Grid */}
      {selectedTemplate ? (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-blue-500/20 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-500">Ora</div>
            </div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="p-4 bg-blue-500/20 border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-900">{day}</div>
                <div className="text-xs text-gray-500">
                  {new Date(currentWeek.getTime() + (index - currentWeek.getDay()) * 24 * 60 * 60 * 1000).getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-2 bg-blue-500/20 border-r border-gray-200 text-xs text-gray-500">
                  {time}
                </div>
                {daysOfWeek.map((_, dayIndex) => (
                  <div key={dayIndex} className="p-2 border-r border-gray-100 last:border-r-0 min-h-[60px] relative">
                    {/* Activities for this day and time */}
                    {getActivitiesForDay(dayIndex).map(activity => {
                      const position = getActivityPosition(activity.time_of_day || '09:00', activity.duration_minutes);
                      const [activityHour] = (activity.time_of_day || '09:00').split(':');
                      
                      if (parseInt(activityHour) === timeIndex) {
                        return (
                          <div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity)}
                            className={`absolute left-1 right-1 rounded-lg p-3 text-xs border-l-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
                              priorities[activity.priority].color
                            } ${categories[activity.type as keyof typeof categories] || 'bg-gray-100 text-gray-800'}`}
                            style={{
                              top: position.top,
                              height: position.height,
                              zIndex: 10
                            }}
                            title={`Clicca per modificare: ${activity.name}`}
                          >
                            <div className="font-semibold text-sm mb-1 truncate">{activity.name}</div>
                            <div className="text-xs opacity-75 leading-tight">
                              {activity.time_of_day} - {activity.duration_minutes}min
                            </div>
                            {activity.description && (
                              <div className="text-xs opacity-60 truncate mt-1">
                                {activity.description}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun Template Selezionato</h3>
          <p className="text-gray-600">
            Seleziona un template per visualizzare lo schema settimanale
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Priorità</h4>
            <div className="space-y-2">
              {Object.entries(priorities).map(([key, priority]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border-l-4 ${priority.color}`}></div>
                  <span className="text-sm text-gray-600">{priority.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Categorie</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categories).map(([category, color]) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${color}`}></div>
                  <span className="text-xs text-gray-600">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form di Modifica Attività */}
      {showEditForm && editingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Modifica Attività</h3>
                    <p className="text-sm text-gray-600">Modifica i dettagli dell'attività ricorrente</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedActivity: WeeklyActivity = {
                  ...editingActivity,
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  time: formData.get('time') as string,
                  duration: parseInt(formData.get('duration') as string),
                  category: formData.get('category') as string,
                  priority: formData.get('priority') as 'low' | 'medium' | 'high',
                  is_active: formData.get('is_active') === 'on'
                };
                handleSaveActivity(updatedActivity);
              }} className="space-y-4">
                {/* Nome Attività */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Attività *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingActivity.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Descrizione */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                  <textarea
                    name="description"
                    defaultValue={editingActivity.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                {/* Giorno della Settimana */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giorno della Settimana *</label>
                  <select
                    name="day_of_week"
                    defaultValue={editingActivity.day_of_week}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>

                {/* Orario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orario *</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue={editingActivity.time}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Durata */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durata (minuti) *</label>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={editingActivity.duration}
                    min="15"
                    max="480"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingActivity.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(categories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Priorità */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorità</label>
                  <select
                    name="priority"
                    defaultValue={editingActivity.priority}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">🟢 Bassa</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                  </select>
                </div>

                {/* Attiva */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingActivity.is_active}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Attività attiva
                  </label>
                </div>

                {/* Bottoni */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salva Modifiche'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
