'use client';

import React, { useState, useEffect } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { 
  loadAppointments, 
  saveAppointment, 
  updateAppointment, 
  deleteAppointment as deleteAppointmentFromDB,
  Appointment as DBAppointment 
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
    type: 'meeting' as const,
    status: 'scheduled' as const,
    priority: 'medium' as const,
    reminder_minutes: 15,
    meeting_url: '',
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
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium',
          is_recurring: false,
          reminder_minutes: 15,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
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
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        appointments: dayAppointments
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
        type: newAppointment.type,
        status: newAppointment.status,
        priority: newAppointment.priority,
        start_time: newAppointment.start_time,
        end_time: newAppointment.end_time,
        location: newAppointment.location || undefined,
        meeting_url: newAppointment.meeting_url || undefined,
        attendees: newAppointment.attendees.split(',').map(a => a.trim()).filter(a => a),
        is_recurring: false,
        reminder_minutes: newAppointment.reminder_minutes,
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
        type: 'meeting',
        status: 'scheduled',
        priority: 'medium',
        reminder_minutes: 15,
        meeting_url: '',
        notes: ''
      });
    } catch (error) {
      console.error('Errore nel salvataggio appointment:', error);
      alert('Errore nel salvataggio dell\'appuntamento. Riprova.');
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

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'call': return '📞';
      case 'presentation': return '📊';
      case 'workshop': return '🎓';
      default: return '📅';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
                        className="text-xs p-1 rounded cursor-pointer hover:bg-gray-100 bg-blue-100 text-blue-800 truncate"
                        title={appointment.title}
                      >
                        {getMeetingTypeIcon(appointment.type)} {formatTime(appointment.start_time)} {appointment.title}
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
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-medium mb-2">Vista Settimana</h3>
              <p className="text-sm">La vista settimana è in fase di sviluppo</p>
              <div className="mt-4 text-xs text-gray-400">
                Data selezionata: {currentDate.toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-medium mb-2">Vista Giorno</h3>
              <p className="text-sm">La vista giorno è in fase di sviluppo</p>
              <div className="mt-4 text-xs text-gray-400">
                Data selezionata: {currentDate.toLocaleDateString('it-IT')}
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
                {getMeetingTypeIcon(selectedAppointment.type)} {selectedAppointment.title}
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
              
              {selectedAppointment.meeting_url && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Link Meeting</label>
                  <a href={selectedAppointment.meeting_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedAppointment.meeting_url}
                  </a>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                >
                  <option value="meeting">👥 Meeting</option>
                  <option value="call">📞 Chiamata</option>
                  <option value="presentation">📊 Presentazione</option>
                  <option value="interview">💼 Intervista</option>
                  <option value="training">🎓 Training</option>
                  <option value="other">📅 Altro</option>
                </select>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Meeting</label>
                <input
                  type="url"
                  value={newAppointment.meeting_url}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, meeting_url: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
                  placeholder="https://meet.google.com/..."
                />
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
