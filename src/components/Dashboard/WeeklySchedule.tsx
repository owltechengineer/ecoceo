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
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
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
        <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-500">Ora</div>
            </div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
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
                <div className="p-2 bg-gray-50 border-r border-gray-200 text-xs text-gray-500">
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
                            className={`absolute left-1 right-1 rounded-lg p-2 text-xs border-l-4 ${
                              priorities[activity.priority].color
                            } ${categories[activity.type as keyof typeof categories] || 'bg-gray-100 text-gray-800'}`}
                            style={{
                              top: position.top,
                              height: position.height,
                              zIndex: 10
                            }}
                          >
                            <div className="font-medium truncate">{activity.name}</div>
                            <div className="text-xs opacity-75">
                              {activity.time_of_day} - {activity.duration_minutes}min
                            </div>
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
        <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun Template Selezionato</h3>
          <p className="text-gray-600">
            Seleziona un template per visualizzare lo schema settimanale
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm p-6">
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
    </div>
  );
}
