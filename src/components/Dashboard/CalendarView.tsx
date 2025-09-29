'use client';

import React, { useState, useEffect } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { 
  loadAppointments, 
  saveAppointment, 
  updateAppointment, 
  deleteAppointment as deleteAppointmentFromDB,
  Appointment as DBAppointment,
  recurringActivitiesService,
  RecurringActivity,
  loadTasks,
  Task
} from '@/lib/supabase';

// Usa il tipo Appointment dal database
type Appointment = DBAppointment;

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

export default function CalendarView() {
  const { openInfo } = useInfoModal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recurringActivities, setRecurringActivities] = useState<RecurringActivity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form per nuovo appuntamento
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    attendees: '',
    status: 'scheduled' as const,
    priority: 'medium' as const,
    notes: ''
  });

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  // Caricamento appuntamenti dal database
  useEffect(() => {
    loadAppointmentsFromDB();
    loadRecurringActivities();
    loadTasksFromDB();
  }, [currentDate]);

  const loadAppointmentsFromDB = async () => {
    setLoading(true);
    try {
      const loadedAppointments = await loadAppointments();
      setAppointments(loadedAppointments);
    } catch (error) {
      console.error('Errore nel caricamento appointments:', error);
      // Fallback a dati mock in caso di errore
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          user_id: 'default-user',
          title: 'Team Meeting',
          description: 'Riunione settimanale del team',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          location: 'Ufficio',
          attendees: ['Manager', 'Developer', 'Marketing'],
          status: 'scheduled',
          priority: 'medium',
          is_recurring: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const loadRecurringActivities = async () => {
    try {
      const activities = await recurringActivitiesService.loadActivities();
      setRecurringActivities(activities);
    } catch (error) {
      console.error('Errore nel caricamento attività ricorrenti:', error);
    }
  };

  const loadTasksFromDB = async () => {
    try {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Errore nel caricamento task:', error);
    }
  };

  // Funzione per convertire le task in formato Appointment per il calendario
  const getTasksForDay = (date: Date): Appointment[] => {
    return tasks
      .filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate.toDateString() === date.toDateString();
      })
      .map(task => {
        const startTime = new Date(date);
        startTime.setHours(9, 0, 0, 0); // Default 9:00 AM
        
        const endTime = new Date(startTime);
        endTime.setHours(10, 0, 0, 0); // Default 1 hour duration
        
        return {
          id: `task-${task.id}`,
          user_id: task.user_id || 'default-user',
          title: task.title,
          description: task.description || '',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          location: '',
          attendees: [],
          status: task.status || 'scheduled',
          priority: task.priority || 'medium',
          is_recurring: false,
          is_task: true, // Flag per identificare le task
          notes: task.notes || '',
          created_at: task.created_at || new Date().toISOString(),
          updated_at: task.updated_at || new Date().toISOString()
        };
      });
  };

  // Funzione per ottenere le attività ricorrenti per un giorno specifico
  const getRecurringActivitiesForDay = (date: Date): Appointment[] => {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    
    return recurringActivities
      .filter(activity => activity.status === 'active')
      .filter(activity => {
        if (activity.frequency === 'daily') {
          return true;
        } else if (activity.frequency === 'weekly' && activity.day_of_week === dayOfWeek) {
          return true;
        } else if (activity.frequency === 'monthly' && activity.day_of_month === dayOfMonth) {
          return true;
        }
        return false;
      })
      .map(activity => {
        const startTime = new Date(date);
        if (activity.time_of_day) {
          const [hours, minutes] = activity.time_of_day.split(':');
          startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          startTime.setHours(9, 0, 0, 0); // Default 9:00
        }
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (activity.duration_minutes || 60));
        
        return {
          id: `recurring-${activity.id}-${date.toISOString().split('T')[0]}`,
          user_id: activity.user_id || 'default-user',
          title: activity.name,
          description: activity.description || '',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          location: '',
          attendees: [],
          status: 'scheduled' as const,
          priority: activity.priority || 'medium',
          is_recurring: true,
          notes: activity.notes || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
  };

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start_time);
        return aptDate.toDateString() === currentDay.toDateString();
      });

      // Aggiungi attività ricorrenti e task per questo giorno
      const recurringForDay = getRecurringActivitiesForDay(currentDay);
      const tasksForDay = getTasksForDay(currentDay);
      const allAppointments = [...dayAppointments, ...recurringForDay, ...tasksForDay];
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        appointments: allAppointments
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleSaveAppointment = async () => {
    if (!newAppointment.title || !newAppointment.start_time || !newAppointment.end_time) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    try {
      const appointmentData = {
        user_id: 'default-user',
        title: newAppointment.title,
        description: newAppointment.description || undefined,
        status: newAppointment.status,
        priority: newAppointment.priority,
        start_time: newAppointment.start_time,
        end_time: newAppointment.end_time,
        location: newAppointment.location || undefined,
        attendees: newAppointment.attendees.split(',').map(a => a.trim()).filter(a => a),
        is_recurring: false,
        notes: newAppointment.notes || undefined
      };

      const savedAppointment = await saveAppointment(appointmentData);
      setAppointments(prev => [...prev, savedAppointment]);
      setShowNewAppointment(false);
      setNewAppointment({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        attendees: '',
        status: 'scheduled',
        priority: 'medium',
        notes: ''
      });
    } catch (error: any) {
      console.error('Errore nel salvataggio appointment:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: error
      });
      
      const errorMessage = error?.message || 'Errore sconosciuto';
      alert(`Errore nel salvataggio dell'appuntamento: ${errorMessage}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Funzione per ottenere i giorni della settimana
  const getWeekDays = (): CalendarDay[] => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const weekDays: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start_time);
        return aptDate.toDateString() === dayDate.toDateString();
      });

      // Aggiungi attività ricorrenti e task per questo giorno
      const recurringForDay = getRecurringActivitiesForDay(dayDate);
      const tasksForDay = getTasksForDay(dayDate);
      const allAppointments = [...dayAppointments, ...recurringForDay, ...tasksForDay];
      
      weekDays.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === currentDate.getMonth(),
        isToday: dayDate.toDateString() === new Date().toDateString(),
        appointments: allAppointments
      });
    }
    
    return weekDays;
  };

  // Funzione per ottenere gli appuntamenti del giorno
  const getDayAppointments = (): Appointment[] => {
    const dayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.toDateString() === currentDate.toDateString();
    });

    // Aggiungi attività ricorrenti e task per questo giorno
    const recurringForDay = getRecurringActivitiesForDay(currentDate);
    const tasksForDay = getTasksForDay(currentDate);
    return [...dayAppointments, ...recurringForDay, ...tasksForDay];
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📅 Calendario</h1>
            <p className="text-gray-600 mt-1">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InfoButton
              onClick={() => openInfo('Calendario', 'Gestione del calendario aziendale con appuntamenti e riunioni')}
              className="text-blue-600 hover:text-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Oggi
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              →
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg ${
                view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Mese
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg ${
                view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Settimana
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-lg ${
                view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Giorno
            </button>
          </div>
          
          <button
            onClick={() => setShowNewAppointment(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Nuovo Appuntamento
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm overflow-hidden">
        {view === 'month' && (
          <>
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {daysOfWeek.map(day => (
                <div key={day} className="p-4 text-center font-medium text-gray-500 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                    !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white/30 backdrop-blur'
                  } ${day.isToday ? 'bg-blue-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {day.appointments.slice(0, 3).map(appointment => (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className={`text-xs p-1 rounded cursor-pointer hover:bg-gray-100 truncate ${
                          appointment.is_task 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.is_recurring 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        title={appointment.title}
                      >
                        {appointment.is_recurring ? '🔄' : appointment.is_task ? '✅' : '📅'} {formatTime(appointment.start_time)} {appointment.title}
                      </div>
                    ))}
                    {day.appointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{day.appointments.length - 3} altri
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Week View */}
        {view === 'week' && (
          <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Week Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="grid grid-cols-7">
                {daysOfWeek.map((day, index) => {
                  const dayDate = getWeekDays()[index]?.date;
                  const isToday = dayDate?.toDateString() === new Date().toDateString();
                  return (
                    <div key={day} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                      isToday ? 'bg-blue-100' : 'bg-white/50'
                    }`}>
                      <div className={`text-sm font-semibold mb-1 ${
                        isToday ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {day}
                      </div>
                      <div className={`text-lg font-bold ${
                        isToday ? 'text-blue-800' : 'text-gray-900'
                      }`}>
                        {dayDate?.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Week Content */}
            <div className="grid grid-cols-7 min-h-[600px]">
              {getWeekDays().map((day, index) => (
                <div
                  key={index}
                  className={`border-r border-gray-200 last:border-r-0 p-3 ${
                    day.isToday ? 'bg-blue-50/50' : 'bg-white/20'
                  }`}
                >
                  {/* Time slots */}
                  <div className="space-y-2">
                    {Array.from({ length: 12 }, (_, hour) => {
                      const timeSlot = hour + 8; // 8:00 to 19:00
                      const slotAppointments = day.appointments.filter(apt => {
                        const aptHour = new Date(apt.start_time).getHours();
                        return aptHour === timeSlot;
                      });
                      
                      return (
                        <div key={timeSlot} className="relative min-h-[40px] border-b border-gray-100">
                          {/* Time label */}
                          <div className="absolute left-0 top-0 text-xs text-gray-400 font-medium">
                            {timeSlot.toString().padStart(2, '0')}:00
                          </div>
                          
                          {/* Appointments in this time slot */}
                          <div className="ml-12 space-y-1">
                            {slotAppointments.map(appointment => (
                              <div
                                key={appointment.id}
                                onClick={() => setSelectedAppointment(appointment)}
                                className={`text-xs p-2 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${
                                  appointment.is_task 
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                                    : appointment.is_recurring 
                                    ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200' 
                                    : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                                }`}
                                title={appointment.title}
                              >
                                <div className="flex items-center space-x-1 mb-1">
                                  <span className="text-sm">
                                    {appointment.is_recurring ? '🔄' : appointment.is_task ? '✅' : '📅'}
                                  </span>
                                  <span className="font-semibold text-xs">
                                    {formatTime(appointment.start_time)}
                                  </span>
                                </div>
                                <div className="font-medium text-xs leading-tight truncate">
                                  {appointment.title}
                                </div>
                                {appointment.location && (
                                  <div className="text-xs text-gray-600 truncate mt-1">
                                    📍 {appointment.location}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Empty state for days with no appointments */}
                  {day.appointments.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-2xl mb-2">📅</div>
                      <p className="text-xs">Nessun appuntamento</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className="p-6">
            <div className="bg-white/30 backdrop-blur rounded-lg shadow-sm">
              {/* Day header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
              </div>
              
              {/* Day content */}
              <div className="p-4">
                <div className="space-y-4">
                  {getDayAppointments().map(appointment => (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        appointment.is_task 
                          ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                          : appointment.is_recurring 
                          ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' 
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {appointment.is_recurring ? '🔄' : appointment.is_task ? '✅' : '📅'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Appuntamento
                        </div>
                      </div>
                      
                      {appointment.description && (
                        <p className="mt-2 text-sm text-gray-600">{appointment.description}</p>
                      )}
                      
                      {appointment.location && (
                        <p className="mt-1 text-xs text-gray-500">📍 {appointment.location}</p>
                      )}
                    </div>
                  ))}
                  
                  {getDayAppointments().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📅</div>
                      <p>Nessun appuntamento per oggi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blurrounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAppointment.is_recurring ? '🔄' : selectedAppointment.is_task ? '✅' : '📅'} {selectedAppointment.title}
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Data e Ora</label>
                <p className="text-gray-900">
                  {new Date(selectedAppointment.start_time).toLocaleDateString('it-IT')} - 
                  {formatTime(selectedAppointment.start_time)} - {formatTime(selectedAppointment.end_time)}
                </p>
              </div>
              
              {selectedAppointment.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrizione</label>
                  <p className="text-gray-900">{selectedAppointment.description}</p>
                </div>
              )}
              
              {selectedAppointment.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Luogo</label>
                  <p className="text-gray-900">{selectedAppointment.location}</p>
                </div>
              )}
              
              {selectedAppointment.attendees.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Partecipanti</label>
                  <p className="text-gray-900">{selectedAppointment.attendees.join(', ')}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Stato</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              
              {selectedAppointment.is_recurring && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🔄 Attività Ricorrente
                  </span>
                </div>
              )}
              
              {selectedAppointment.is_task && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Task
                  </span>
                </div>
              )}
              
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Modifica
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blurrounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuovo Appuntamento</h3>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titolo *</label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  placeholder="Titolo appuntamento"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  rows={3}
                  placeholder="Descrizione appuntamento"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inizio *</label>
                  <input
                    type="datetime-local"
                    value={newAppointment.start_time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fine *</label>
                  <input
                    type="datetime-local"
                    value={newAppointment.end_time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  placeholder="Luogo appuntamento"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partecipanti</label>
                <input
                  type="text"
                  value={newAppointment.attendees}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, attendees: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  placeholder="Nome1, Nome2, Nome3"
                />
              </div>
              
              

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select
                    value={newAppointment.status}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  >
                    <option value="scheduled">📅 Programmato</option>
                    <option value="confirmed">✅ Confermato</option>
                    <option value="completed">✔️ Completato</option>
                    <option value="cancelled">❌ Cancellato</option>
                    <option value="rescheduled">🔄 Riprogrammato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select
                    value={newAppointment.priority}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  >
                    <option value="low">🟢 Bassa</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                    <option value="urgent">🚨 Urgente</option>
                  </select>
                </div>
              </div>
              
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewAppointment(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveAppointment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
