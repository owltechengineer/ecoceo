'use client';

import { useState, useEffect } from 'react';
import { recurringActivitiesService, RecurringActivity, supabase } from '@/lib/supabase';
import DatabaseErrorNotification from './DatabaseErrorNotification';


interface RecurringActivitiesProps {
  onDataChange?: () => void;
}

export default function RecurringActivities({ onDataChange }: RecurringActivitiesProps) {
  const [activities, setActivities] = useState<RecurringActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'weekly' | 'monthly'>('activities');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<RecurringActivity | null>(null);
  const [databaseError, setDatabaseError] = useState<Error | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'weekly' as 'weekly' | 'monthly',
    day_of_week: 1,
    day_of_month: 1,
    time: '09:00',
    duration: 60,
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    is_active: true
  });


  const daysOfWeek = [
    'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'
  ];

  const categories = [
    'Lavoro', 'Personale', 'Salute', 'Formazione', 'Sociale', 'Famiglia', 'Hobby', 'Altro'
  ];

  const priorities = [
    { value: 'low', label: 'Bassa', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Media', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'Alta', color: 'text-red-600 bg-red-100' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carica attività ricorrenti
      const activitiesData = await recurringActivitiesService.loadActivities();
      setActivities(activitiesData);

    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
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

  const saveActivity = async () => {
    try {
      setLoading(true);
      
      // Validazione
      if (!formData.name.trim()) {
        alert('Il nome dell\'attività è obbligatorio');
        return;
      }
      if (!formData.category) {
        alert('La categoria è obbligatoria');
        return;
      }
      if (formData.type === 'weekly' && formData.day_of_week === null) {
        alert('Il giorno della settimana è obbligatorio per attività settimanali');
        return;
      }
      if (formData.type === 'monthly' && formData.day_of_month === null) {
        alert('Il giorno del mese è obbligatorio per attività mensili');
        return;
      }

      if (editingActivity) {
        await recurringActivitiesService.updateActivity(editingActivity.id, formData);
        alert('Attività aggiornata con successo!');
      } else {
        const savedActivity = await recurringActivitiesService.saveActivity(formData);
        alert(`Attività "${savedActivity.name}" creata con successo!`);
      }

      setShowForm(false);
      setEditingActivity(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert(`Errore nel salvataggio attività: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };


  const deleteActivity = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa attività ricorrente?')) return;

    try {
      await recurringActivitiesService.deleteActivity(id);
      loadData();
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'weekly',
      day_of_week: 1,
      day_of_month: 1,
      time: '09:00',
      duration: 60,
      category: '',
      priority: 'medium',
      is_active: true
    });
  };


  const editActivity = (activity: RecurringActivity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      type: activity.type,
      day_of_week: activity.day_of_week || 1,
      day_of_month: activity.day_of_month || 1,
      time: activity.time,
      duration: activity.duration,
      category: activity.category,
      priority: activity.priority,
      is_active: activity.is_active
    });
    setShowForm(true);
  };


  const generateWeeklySchedule = async () => {
    try {
      setLoading(true);
      
      // Genera tutte le attività settimanali
      const activitiesToGenerate = activities.filter(a => a.is_active && a.type === 'weekly');

      if (activitiesToGenerate.length === 0) {
        alert('Nessuna attività settimanale attiva trovata per la generazione.');
        return;
      }

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      let activitiesGenerated = 0;

      for (const activity of activitiesToGenerate) {
        const activityDate = new Date(startOfWeek);
        activityDate.setDate(activityDate.getDate() + (activity.day_of_week || 0));
        
        const [hours, minutes] = activity.time.split(':');
        activityDate.setHours(parseInt(hours), parseInt(minutes));

        const endDate = new Date(activityDate);
        endDate.setMinutes(endDate.getMinutes() + activity.duration);

        // Inserisci nel calendario
        const { error } = await supabase
          .from('task_calendar_appointments')
          .insert([{
            title: activity.name,
            description: activity.description,
            start_time: activityDate.toISOString(),
            end_time: endDate.toISOString(),
            category: activity.category,
            priority: activity.priority,
            is_recurring: true,
            recurring_activity_id: activity.id,
            user_id: 'default-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) {
          console.error(`Errore inserimento attività ${activity.name}:`, error);
          continue;
        }
        
        activitiesGenerated++;
      }

      if (activitiesGenerated > 0) {
        alert(`Settimana generata con successo! ${activitiesGenerated} attività inserite nel calendario.`);
        // Ricarica i dati del calendario
        if (onDataChange) {
          onDataChange();
        }
      } else {
        alert('Nessuna attività è stata inserita nel calendario.');
      }
    } catch (error) {
      console.error('Errore nella generazione settimana:', error);
      alert(`Errore nella generazione settimana: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlySchedule = async () => {
    try {
      setLoading(true);
      
      const monthlyActivities = activities.filter(a => a.is_active && a.type === 'monthly');
      
      if (monthlyActivities.length === 0) {
        alert('Nessuna attività mensile attiva trovata.');
        return;
      }

      let activitiesGenerated = 0;

      for (const activity of monthlyActivities) {
        const activityDate = new Date();
        activityDate.setDate(activity.day_of_month || 1);
        
        const [hours, minutes] = activity.time.split(':');
        activityDate.setHours(parseInt(hours), parseInt(minutes));

        const endDate = new Date(activityDate);
        endDate.setMinutes(endDate.getMinutes() + activity.duration);

        // Inserisci nel calendario
        const { error } = await supabase
          .from('task_calendar_appointments')
          .insert([{
            title: activity.name,
            description: activity.description,
            start_time: activityDate.toISOString(),
            end_time: endDate.toISOString(),
            category: activity.category,
            priority: activity.priority,
            is_recurring: true,
            recurring_activity_id: activity.id,
            user_id: 'default-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) {
          console.error(`Errore inserimento attività mensile ${activity.name}:`, error);
          continue;
        }
        
        activitiesGenerated++;
      }

      if (activitiesGenerated > 0) {
        alert(`Attività mensili generate con successo! ${activitiesGenerated} attività inserite nel calendario.`);
        // Ricarica i dati del calendario
        if (onDataChange) {
          onDataChange();
        }
      } else {
        alert('Nessuna attività mensile è stata inserita nel calendario.');
      }
    } catch (error) {
      console.error('Errore nella generazione mensile:', error);
      alert(`Errore nella generazione mensile: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };


  // Genera visualizzazione settimana
  const generateWeeklyView = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const weeklyActivities = activities.filter(a => a.is_active && a.type === 'weekly');
    
    return daysOfWeek.map((day, dayIndex) => {
      const dayActivities = weeklyActivities.filter(a => a.day_of_week === dayIndex);
      
      return (
        <div key={day} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
          <div className="space-y-2">
            {dayActivities.length > 0 ? (
              dayActivities.map(activity => (
                <div key={activity.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">{activity.name}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-blue-600">{activity.time}</p>
                      <p className="text-sm text-gray-600">{activity.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                      priorities.find(p => p.value === activity.priority)?.color || 'bg-gray-100 text-gray-600'
                    }`}>
                      {priorities.find(p => p.value === activity.priority)?.label}
                    </span>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{activity.category}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Nessuna attività</p>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Genera visualizzazione mese
  const generateMonthlyView = () => {
    const monthlyActivities = activities.filter(a => a.is_active && a.type === 'monthly');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Raggruppa i giorni in settimane per una migliore visualizzazione
    const weeks = [];
    for (let i = 1; i <= daysInMonth; i += 7) {
      const weekDays = Array.from({length: 7}, (_, j) => i + j).filter(day => day <= daysInMonth);
      weeks.push(weekDays);
    }
    
    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Settimana {weekIndex + 1}</h3>
        <div className="grid grid-cols-7 gap-2">
          {week.map(day => {
            const dayActivities = monthlyActivities.filter(a => a.day_of_month === day);
            
            return (
              <div key={day} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-center">{day}°</h4>
                <div className="space-y-1">
                  {dayActivities.length > 0 ? (
                    dayActivities.map(activity => (
                      <div key={activity.id} className="bg-white rounded-lg p-2 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <h5 className="text-sm font-bold text-gray-900 truncate mb-1">{activity.name}</h5>
                          <p className="text-sm font-medium text-blue-600 mb-1">{activity.time}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                            priorities.find(p => p.value === activity.priority)?.color || 'bg-gray-100 text-gray-600'
                          }`}>
                            {priorities.find(p => p.value === activity.priority)?.label}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-1 text-gray-500">
                      <p className="text-xs">-</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Database Error Notification */}
      <DatabaseErrorNotification 
        error={databaseError} 
        onDismiss={() => setDatabaseError(null)} 
      />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔄 Attività Ricorrenti</h2>
            <p className="text-gray-600 mt-1">
              Crea e gestisci attività ricorrenti settimanali e mensili
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setActiveTab('activities');
                setShowForm(true);
                resetForm();
                setEditingActivity(null);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
            >
              + Nuova Attività
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'activities', label: 'Attività', icon: '🔄' },
            { key: 'weekly', label: 'Settimanali', icon: '📅' },
            { key: 'monthly', label: 'Mensili', icon: '📆' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento...</p>
          </div>
        ) : (
          <>
            {/* Attività Ricorrenti */}
            {activeTab === 'activities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{activity.name}</h3>
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                        priorities.find(p => p.value === activity.priority)?.color || 'bg-gray-100 text-gray-600'
                      }`}>
                        {priorities.find(p => p.value === activity.priority)?.label}
                      </span>
                    </div>
                    <p className="text-gray-700 text-base mb-4 leading-relaxed">{activity.description}</p>
                    <div className="space-y-3 text-base">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Tipo:</span>
                        <span className="font-bold text-blue-600">{activity.type === 'weekly' ? 'Settimanale' : 'Mensile'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Giorno:</span>
                        <span className="font-bold text-green-600">
                          {activity.type === 'weekly' 
                            ? daysOfWeek[activity.day_of_week || 0]
                            : `${activity.day_of_month}° del mese`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Ora:</span>
                        <span className="font-bold text-purple-600">{activity.time}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Durata:</span>
                        <span className="font-bold text-orange-600">{activity.duration} min</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Categoria:</span>
                        <span className="font-bold text-indigo-600">{activity.category}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => editActivity(activity)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* Visualizzazione Settimanale */}
            {activeTab === 'weekly' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">📅 Calendario Settimanale</h3>
                  <p className="text-blue-700 mb-4">
                    Visualizzazione della settimana costruita con le attività ricorrenti
                  </p>
                  <button
                    onClick={() => {
                      const weeklyActivities = activities.filter(a => a.is_active && a.type === 'weekly');
                      if (weeklyActivities.length === 0) {
                        alert('Nessuna attività settimanale attiva trovata. Crea prima delle attività settimanali.');
                        return;
                      }
                      generateWeeklySchedule();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    🚀 Genera Settimana nel Calendario
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                  {generateWeeklyView()}
                </div>
              </div>
            )}

            {/* Visualizzazione Mensile */}
            {activeTab === 'monthly' && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">📆 Calendario Mensile</h3>
                  <p className="text-green-700 mb-4">
                    Visualizzazione del mese costruito con le attività ricorrenti
                  </p>
                  <button
                    onClick={generateMonthlySchedule}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    🚀 Genera Mese nel Calendario
                  </button>
                </div>
                
                <div className="space-y-4">
                  {generateMonthlyView()}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingActivity ? 'Modifica Attività' : 'Nuova Attività'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nome Attività
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Es: Riunione Team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    rows={3}
                    placeholder="Descrizione dell'attività..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'weekly' | 'monthly'})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="weekly">Settimanale</option>
                      <option value="monthly">Mensile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Seleziona categoria</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.type === 'weekly' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Giorno della Settimana
                    </label>
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Giorno del Mese
                    </label>
                    <select
                      value={formData.day_of_month}
                      onChange={(e) => setFormData({...formData, day_of_month: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}° del mese</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ora
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Durata (min)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Priorità
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activity_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="activity_active" className="text-sm font-medium text-gray-700">
                    Attività attiva
                  </label>
                </div>
              </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveActivity}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                {editingActivity ? 'Aggiorna Attività' : 'Crea Attività'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
                }}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
