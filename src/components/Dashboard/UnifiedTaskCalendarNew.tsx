'use client';

import { useState, useEffect } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import CalendarView from './CalendarView';
import TasksView from './TasksView';
import RecurringActivities from './RecurringActivities';
import { loadTasks, loadAppointments, Task, Appointment, recurringActivitiesService, supabase } from '@/lib/supabase';

export default function UnifiedTaskCalendarNew() {
  const { openInfo } = useInfoModal();
  const [activeView, setActiveView] = useState<'tasks' | 'calendar' | 'unified' | 'recurring'>('unified');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Carica dati dal database
  useEffect(() => {
    loadData();
  }, []);

  // Funzione per generare automaticamente le attività ricorrenti
  const generateRecurringActivities = async () => {
    try {
      // Carica le attività ricorrenti
      const activities = await recurringActivitiesService.loadActivities();
      
      // Genera attività settimanali per la settimana corrente
      const weeklyActivities = activities.filter(a => a.status === 'active' && a.frequency === 'weekly');
      if (weeklyActivities.length > 0) {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        for (const activity of weeklyActivities) {
          const activityDate = new Date(startOfWeek);
          activityDate.setDate(activityDate.getDate() + (activity.day_of_week || 0));
          
          const [hours, minutes] = (activity.time_of_day || '09:00').split(':');
          activityDate.setHours(parseInt(hours), parseInt(minutes));

          const endDate = new Date(activityDate);
          endDate.setMinutes(endDate.getMinutes() + activity.duration_minutes);

          // Controlla se l'attività esiste già nel calendario per questa settimana
          const existingAppointments = await loadAppointments();
          const activityExists = existingAppointments.some(apt => 
            apt.title === activity.name &&
            apt.is_recurring === true &&
            new Date(apt.start_time).toDateString() === activityDate.toDateString()
          );

          if (!activityExists) {
            // Inserisci nel calendario
            const { error } = await supabase
              .from('task_calendar_appointments')
              .insert([{
                title: activity.name,
                description: activity.description,
                start_time: activityDate.toISOString(),
                end_time: endDate.toISOString(),
                is_recurring: true,
                recurring_frequency: activity.frequency,
                recurring_interval: activity.interval_value || 1,
                user_id: 'default-user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);

            if (error) {
              console.error(`Errore inserimento attività settimanale ${activity.name}:`, JSON.stringify(error, null, 2));
              console.error('Dati che stavano per essere inseriti:', {
                title: activity.name,
                description: activity.description,
                start_time: activityDate.toISOString(),
                end_time: endDate.toISOString(),
                is_recurring: true,
                recurring_frequency: activity.frequency,
                recurring_interval: activity.interval_value || 1,
                user_id: 'default-user'
              });
            }
          }
        }
      }

      // Genera attività mensili per il mese corrente
      const monthlyActivities = activities.filter(a => a.status === 'active' && a.frequency === 'monthly');
      if (monthlyActivities.length > 0) {
        for (const activity of monthlyActivities) {
          const activityDate = new Date();
          activityDate.setDate(activity.day_of_month || 1);
          
          const [hours, minutes] = (activity.time_of_day || '09:00').split(':');
          activityDate.setHours(parseInt(hours), parseInt(minutes));

          const endDate = new Date(activityDate);
          endDate.setMinutes(endDate.getMinutes() + activity.duration_minutes);

          // Controlla se l'attività esiste già nel calendario per questo mese
          const existingAppointments = await loadAppointments();
          const activityExists = existingAppointments.some(apt => 
            apt.title === activity.name &&
            apt.is_recurring === true &&
            new Date(apt.start_time).getMonth() === activityDate.getMonth() &&
            new Date(apt.start_time).getFullYear() === activityDate.getFullYear()
          );

          if (!activityExists) {
            // Inserisci nel calendario
            const { error } = await supabase
              .from('task_calendar_appointments')
              .insert([{
                title: activity.name,
                description: activity.description,
                start_time: activityDate.toISOString(),
                end_time: endDate.toISOString(),
                is_recurring: true,
                recurring_frequency: activity.frequency,
                recurring_interval: activity.interval_value || 1,
                user_id: 'default-user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);

            if (error) {
              console.error(`Errore inserimento attività mensile ${activity.name}:`, JSON.stringify(error, null, 2));
              console.error('Dati che stavano per essere inseriti:', {
                title: activity.name,
                description: activity.description,
                start_time: activityDate.toISOString(),
                end_time: endDate.toISOString(),
                is_recurring: true,
                recurring_frequency: activity.frequency,
                recurring_interval: activity.interval_value || 1,
                user_id: 'default-user'
              });
            }
          }
        }
      }

      console.log('✅ Attività ricorrenti generate automaticamente');
    } catch (error) {
      console.error('Errore nella generazione automatica delle attività ricorrenti:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Prima genera le attività ricorrenti automaticamente
      await generateRecurringActivities();
      
      // Poi carica i dati aggiornati
      const [loadedTasks, loadedAppointments] = await Promise.all([
        loadTasks(),
        loadAppointments()
      ]);
      setTasks(loadedTasks);
      setAppointments(loadedAppointments);
      console.log(`✅ Dati caricati: ${loadedTasks.length} task, ${loadedAppointments.length} appuntamenti`);
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per ricaricare i dati (da chiamare quando vengono generate attività ricorrenti)
  const refreshData = () => {
    loadData();
  };

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📅 Task & Calendario Unificato</h1>
            <p className="text-gray-600 mt-1">
              Gestisci task e appuntamenti in un'unica interfaccia
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InfoButton
              onClick={() => openInfo('Task e Calendario', 'Gestione unificata di task e appuntamenti con attività ricorrenti settimanali e mensili.')}
              className="text-blue-600 hover:text-blue-700"
            />
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setActiveView('tasks')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'tasks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Task Management
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Calendario
          </button>
            <button
              onClick={() => setActiveView('unified')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeView === 'unified'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔄 Vista Unificata
            </button>
            <button
              onClick={() => setActiveView('recurring')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeView === 'recurring'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔄 Attività Ricorrenti
            </button>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'tasks' && <TasksView />}
      {activeView === 'calendar' && <CalendarView />}
      {activeView === 'recurring' && <RecurringActivities onDataChange={refreshData} />}
      {activeView === 'unified' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Task Recenti</h2>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2 text-sm">Caricamento...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        {task.status} • {task.priority}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{task.assigned_to || 'Non assegnato'}</p>
                      <p className="text-xs text-gray-400">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('it-IT') : 'Nessuna scadenza'}
                      </p>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nessun task trovato</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setActiveView('tasks')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Vedi tutti i task
              </button>
            </div>
          </div>
          
          {/* Calendar Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Appuntamenti Oggi</h2>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2 text-sm">Caricamento...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments
                  .filter(apt => {
                    const aptDate = new Date(apt.start_time);
                    const today = new Date();
                    return aptDate.toDateString() === today.toDateString();
                  })
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                        <p className="text-sm text-gray-500">
                          {appointment.type === 'meeting' && '👥'}
                          {appointment.type === 'call' && '📞'}
                          {appointment.type === 'presentation' && '📊'}
                          {appointment.type === 'training' && '🎓'}
                          {appointment.type === 'other' && '📅'}
                          {' '}{appointment.type} • {appointment.location || 'Nessuna location'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.start_time).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {Math.round((new Date(appointment.end_time).getTime() - new Date(appointment.start_time).getTime()) / (1000 * 60 * 60))} ore
                        </p>
                      </div>
                    </div>
                  ))}
                {appointments.filter(apt => {
                  const aptDate = new Date(apt.start_time);
                  const today = new Date();
                  return aptDate.toDateString() === today.toDateString();
                }).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nessun appuntamento oggi</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setActiveView('calendar')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Vedi calendario completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
