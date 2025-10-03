'use client';

import { useState } from 'react';
import { useDashboard, Appointment } from '@/contexts/DashboardContext';
import FormModal from './FormModal';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';

export default function CalendarManagement() {
  const { openInfo } = useInfoModal();
  const { state, addAppointment, updateAppointment, deleteAppointment } = useDashboard();
  const { appointments, projects } = state;
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    type: 'meeting' as 'meeting' | 'call' | 'presentation' | 'workshop' | 'other',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled',
    attendees: '',
    location: '',
    client: '',
    project: '',
    notes: '',
    reminder: true,
    reminderTime: '15',
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'presentation': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Riunione';
      case 'call': return 'Chiamata';
      case 'presentation': return 'Presentazione';
      case 'workshop': return 'Workshop';
      case 'other': return 'Altro';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmato';
      case 'confirmed': return 'Confermato';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Cancellato';
      case 'rescheduled': return 'Riprogrammato';
      default: return status;
    }
  };

  // Filtra appuntamenti per data
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startDate).toISOString().split('T')[0];
      return appointmentDate === dateStr;
    });
  };

  // Genera calendario mensile
  const generateMonthCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      calendar.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendar;
  };

  const handleOpenForm = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      const startDate = new Date(appointment.startDate);
      const endDate = new Date(appointment.endDate);
      setFormData({
        title: appointment.title,
        description: appointment.description,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        type: appointment.type,
        status: appointment.status,
        attendees: appointment.attendees.join(', '),
        location: appointment.location,
        client: appointment.client || '',
        project: appointment.project || '',
        notes: appointment.notes,
        reminder: appointment.reminder,
        reminderTime: appointment.reminderTime.toString(),
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '10:00',
        type: 'meeting',
        status: 'scheduled',
        attendees: '',
        location: '',
        client: '',
        project: '',
        notes: '',
        reminder: true,
        reminderTime: '15',
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      const appointmentData = {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type: formData.type,
        status: formData.status,
        attendees: formData.attendees.split(',').map(attendee => attendee.trim()).filter(attendee => attendee),
        location: formData.location,
        client: formData.client || undefined,
        project: formData.project || undefined,
        notes: formData.notes,
        reminder: formData.reminder,
        reminderTime: Number(formData.reminderTime),
      } as any;
      
      if (editingAppointment) {
        updateAppointment({ ...editingAppointment, ...appointmentData });
        console.log('Appuntamento aggiornato:', appointmentData);
        alert('Appuntamento aggiornato con successo!');
      } else {
        addAppointment(appointmentData);
        console.log('Nuovo appuntamento aggiunto:', appointmentData);
        alert('Appuntamento aggiunto con successo!');
      }
      
      setShowForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Errore nel salvataggio dell\'appuntamento:', error);
      alert('Errore nel salvataggio dell\'appuntamento. Riprova.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo appuntamento?')) {
      try {
        deleteAppointment(id);
        console.log('Appuntamento eliminato:', id);
        alert('Appuntamento eliminato con successo!');
      } catch (error) {
        console.error('Errore nell\'eliminazione dell\'appuntamento:', error);
        alert('Errore nell\'eliminazione dell\'appuntamento. Riprova.');
      }
    }
  };

  const today = new Date();
  const monthCalendar = generateMonthCalendar();
  const todayAppointments = getAppointmentsForDate(today);

  const upcomingAppointments = appointments
    .filter(appointment => new Date(appointment.startDate) > today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📅 Gestione Calendario</h2>
              <p className="text-gray-600">Gestione appuntamenti e riunioni</p>
            </div>
            <InfoButton onClick={() => openInfo('Gestione Calendario', 'Sistema completo per gestire appuntamenti, riunioni e calendario aziendale.')} />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              + Nuovo Appuntamento
            </button>
          </div>
        </div>

        {/* Controlli calendario */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold">
              {selectedDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm"
            >
              Oggi
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'month' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mese
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'week' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Settimana
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-sm ${
                viewMode === 'day' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Giorno
            </button>
          </div>
        </div>
      </div>

      {/* Vista Calendario Mensile */}
      {viewMode === 'month' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {monthCalendar.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString();
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
              const dayAppointments = getAppointmentsForDate(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-200 ${
                    isToday ? 'bg-blue-50 border-blue-300' : ''
                  } ${!isCurrentMonth ? 'bg-blue-500/20 text-gray-400' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : ''
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`text-xs p-1 rounded cursor-pointer ${getTypeColor(appointment.type)}`}
                        onClick={() => handleOpenForm(appointment)}
                        title={appointment.title}
                      >
                        {appointment.title.length > 15 
                          ? appointment.title.substring(0, 15) + '...' 
                          : appointment.title}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} altri
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista Settimanale */}
      {viewMode === 'week' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
          <div className="text-center text-gray-500">
            <p>Vista settimanale in sviluppo...</p>
            <p className="text-sm">Presto disponibile con visualizzazione completa della settimana</p>
          </div>
        </div>
      )}

      {/* Vista Giornaliera */}
      {viewMode === 'day' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
          <div className="text-center text-gray-500">
            <p>Vista giornaliera in sviluppo...</p>
            <p className="text-sm">Presto disponibile con timeline dettagliata</p>
          </div>
        </div>
      )}

      {/* Appuntamenti di Oggi */}
      {todayAppointments.length > 0 && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Appuntamenti di Oggi</h3>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(appointment.type).replace('bg-', 'bg-').replace(' text-', '')}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(appointment.endDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                  <button
                    onClick={() => handleOpenForm(appointment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prossimi Appuntamenti */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Prossimi Appuntamenti</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(appointment.type).replace('bg-', 'bg-').replace(' text-', '')}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startDate).toLocaleDateString('it-IT')} - 
                      {new Date(appointment.startDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                  <button
                    onClick={() => handleOpenForm(appointment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingAppointment ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ora Inizio</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ora Fine</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="meeting">Riunione</option>
              <option value="call">Chiamata</option>
              <option value="presentation">Presentazione</option>
              <option value="workshop">Workshop</option>
              <option value="other">Altro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scheduled">Programmato</option>
              <option value="confirmed">Confermato</option>
              <option value="completed">Completato</option>
              <option value="cancelled">Cancellato</option>
              <option value="rescheduled">Riprogrammato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partecipanti</label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome1, Nome2, Nome3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sala riunioni, Zoom, etc."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Promemoria</span>
            </label>
            
            {formData.reminder && (
              <select
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="5">5 minuti prima</option>
                <option value="15">15 minuti prima</option>
                <option value="30">30 minuti prima</option>
                <option value="60">1 ora prima</option>
              </select>
            )}
          </div>
        </div>
      </FormModal>
    </div>
  );
}
