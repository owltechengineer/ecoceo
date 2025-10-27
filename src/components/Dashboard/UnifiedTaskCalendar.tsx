'use client';

import { useState, useEffect } from 'react';
import { useDashboard, Task, Appointment } from '@/contexts/DashboardContext';
import FormModal from './FormModal';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';
import CalendarView from './CalendarView';
import TasksView from './TasksView';

export default function UnifiedTaskCalendar() {
  const { openInfo } = useInfoModal();
  const { state, addTask, updateTask, deleteTask, addAppointment, updateAppointment, deleteAppointment } = useDashboard();

  // Funzione per formattare le date in modo consistente
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  const { tasks, appointments } = state;
  
  const [activeView, setActiveView] = useState<'tasks' | 'calendar' | 'unified'>('unified');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  // Form data per task
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assignee: '',
    project: '',
    dueDate: '',
    estimatedHours: 0,
    tags: '',
  });

  // Form data per appuntamenti
  const [appointmentFormData, setAppointmentFormData] = useState({
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

  const views = [
    { id: 'unified', label: 'Vista Unificata', icon: '📅' },
    { id: 'tasks', label: 'Solo Task', icon: '📋' },
    { id: 'calendar', label: 'Solo Calendario', icon: '🗓️' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

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

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        title: taskFormData.title,
        description: taskFormData.description,
        status: taskFormData.status === 'todo' ? 'pending' : 
                taskFormData.status === 'review' ? 'on-hold' : 
                taskFormData.status as any,
        priority: taskFormData.priority,
        assigned_to: taskFormData.assignee,
        project_id: taskFormData.project || undefined,
        due_date: taskFormData.dueDate,
        estimated_hours: taskFormData.estimatedHours,
        actual_hours: editingTask?.actual_hours || 0,
        tags: taskFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        notes: taskFormData.description || '',
        progress_percentage: editingTask?.progress_percentage || 0,
        depends_on_tasks: editingTask?.depends_on_tasks || [],
        category: 'other' as const,
      } as any;
      
      if (editingTask) {
        updateTask({ ...editingTask, ...taskData });
        console.log('Task aggiornato:', taskData);
        alert('Task aggiornato con successo!');
      } else {
        addTask(taskData);
        console.log('Nuovo task aggiunto:', taskData);
        alert('Task aggiunto con successo!');
      }
      
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Errore nel salvataggio del task:', error);
      alert('Errore nel salvataggio del task. Riprova.');
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const startDateTime = new Date(`${appointmentFormData.startDate}T${appointmentFormData.startTime}`);
      const endDateTime = new Date(`${appointmentFormData.endDate}T${appointmentFormData.endTime}`);
      
      const appointmentData = {
        title: appointmentFormData.title,
        description: appointmentFormData.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type: appointmentFormData.type,
        status: appointmentFormData.status,
        attendees: appointmentFormData.attendees.split(',').map(attendee => attendee.trim()).filter(attendee => attendee),
        location: appointmentFormData.location,
        client: appointmentFormData.client || undefined,
        project: appointmentFormData.project || undefined,
        notes: appointmentFormData.notes,
        reminder: appointmentFormData.reminder,
        reminderTime: Number(appointmentFormData.reminderTime),
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
      
      setShowAppointmentForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Errore nel salvataggio dell\'appuntamento:', error);
      alert('Errore nel salvataggio dell\'appuntamento. Riprova.');
    }
  };

  const handleTaskDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
      try {
        deleteTask(id);
        console.log('Task eliminato:', id);
        alert('Task eliminato con successo!');
      } catch (error) {
        console.error('Errore nell\'eliminazione del task:', error);
        alert('Errore nell\'eliminazione del task. Riprova.');
      }
    }
  };

  const handleAppointmentDelete = async (id: string) => {
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

  const handleEditTask = (task: Task) => {
    setTaskFormData({
      title: task.title,
      description: task.description || '',
      status: task.status === 'pending' ? 'todo' : 
              task.status === 'on-hold' ? 'review' : 
              task.status as any,
      priority: task.priority,
      assignee: task.assigned_to || '',
      project: task.project_id || '',
      dueDate: task.due_date || '',
      estimatedHours: task.estimated_hours,
      tags: task.tags.join(', '),
    });
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    const startDate = new Date(appointment.startDate);
    const endDate = new Date(appointment.endDate);
    
    setAppointmentFormData({
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
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  // Filtra i dati
  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterDate && task.due_date && !task.due_date.includes(filterDate)) return false;
    return true;
  });

  const filteredAppointments = appointments.filter(appointment => {
    if (filterDate && !appointment.startDate.includes(filterDate)) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <InfoButton onClick={() => openInfo('Task & Calendario', 'Vista unificata per gestire task e appuntamenti in modo integrato.')} />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === view.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{view.icon}</span>
                {view.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtro Stato</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tutti gli stati</option>
              <option value="todo">Da fare</option>
              <option value="in-progress">In corso</option>
              <option value="review">In revisione</option>
              <option value="completed">Completati</option>
              <option value="cancelled">Cancellati</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtro Data</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Nuovo Task
            </button>
            <button
              onClick={() => setShowAppointmentForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📅 Nuovo Appuntamento
            </button>
          </div>
        </div>
      </div>

      {/* Unified View */}
      {activeView === 'unified' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks Section */}
          <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Task ({filteredTasks.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-gray-500">
                            📅 {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleTaskDelete(task.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nessun task trovato</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Appuntamenti ({filteredAppointments.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                          {appointment.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          📅 {formatDate(appointment.startDate)}
                        </span>
                        <span className="text-xs text-gray-500">
                          🕐 {new Date(appointment.startDate).toLocaleTimeString().slice(0, 5)}
                        </span>
                      </div>
                      {appointment.location && (
                        <p className="text-xs text-gray-500 mt-1">📍 {appointment.location}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleAppointmentDelete(appointment.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nessun appuntamento trovato</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Only View */}
      {activeView === 'tasks' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Tutti i Task ({filteredTasks.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorità</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assegnato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scadenza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur/30 backdrop-blur divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.assigned_to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.due_date ? formatDate(task.due_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleTaskDelete(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar Only View */}
      {activeView === 'calendar' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Tutti gli Appuntamenti ({filteredAppointments.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appuntamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Luogo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur/30 backdrop-blur divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.title}</div>
                        <div className="text-sm text-gray-500">{appointment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(appointment.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(appointment.startDate).toLocaleTimeString().slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleAppointmentDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      <FormModal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title={editingTask ? 'Modifica Task' : 'Nuovo Task'}
        onSubmit={handleTaskSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
            <input
              type="text"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea
              value={taskFormData.description}
              onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              value={taskFormData.status}
              onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Da fare</option>
              <option value="in-progress">In corso</option>
              <option value="review">In revisione</option>
              <option value="completed">Completato</option>
              <option value="cancelled">Cancellato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
            <select
              value={taskFormData.priority}
              onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Bassa</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assegnato</label>
            <input
              type="text"
              value={taskFormData.assignee}
              onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progetto</label>
            <input
              type="text"
              value={taskFormData.project}
              onChange={(e) => setTaskFormData({ ...taskFormData, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Scadenza</label>
            <input
              type="date"
              value={taskFormData.dueDate}
              onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ore Stimate</label>
            <input
              type="number"
              value={taskFormData.estimatedHours}
              onChange={(e) => setTaskFormData({ ...taskFormData, estimatedHours: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              value={taskFormData.tags}
              onChange={(e) => setTaskFormData({ ...taskFormData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. urgente, frontend, bug"
            />
          </div>
        </div>
      </FormModal>

      {/* Appointment Form Modal */}
      <FormModal
        isOpen={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        title={editingAppointment ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
        onSubmit={handleAppointmentSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
            <input
              type="text"
              value={appointmentFormData.title}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea
              value={appointmentFormData.description}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
            <input
              type="date"
              value={appointmentFormData.startDate}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ora Inizio</label>
            <input
              type="time"
              value={appointmentFormData.startTime}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
            <input
              type="date"
              value={appointmentFormData.endDate}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ora Fine</label>
            <input
              type="time"
              value={appointmentFormData.endTime}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={appointmentFormData.type}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, type: e.target.value as any })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              value={appointmentFormData.status}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, status: e.target.value as any })}
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
              value={appointmentFormData.attendees}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, attendees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separati da virgola"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
            <input
              type="text"
              value={appointmentFormData.location}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              type="text"
              value={appointmentFormData.client}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, client: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progetto</label>
            <input
              type="text"
              value={appointmentFormData.project}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={appointmentFormData.notes}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={appointmentFormData.reminder}
                onChange={(e) => setAppointmentFormData({ ...appointmentFormData, reminder: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Promemoria</span>
            </label>
            {appointmentFormData.reminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minuti prima</label>
                <input
                  type="number"
                  value={appointmentFormData.reminderTime}
                  onChange={(e) => setAppointmentFormData({ ...appointmentFormData, reminderTime: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="5"
                  max="1440"
                />
              </div>
            )}
          </div>
        </div>
      </FormModal>
    </div>
  );
}
