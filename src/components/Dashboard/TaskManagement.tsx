'use client';

import { useState } from 'react';
import { useDashboard, Task } from '@/contexts/DashboardContext';
import FormModal from './FormModal';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

export default function TaskManagement() {
  const { openInfo } = useInfoModal();
  const { state, addTask, updateTask, deleteTask } = useDashboard();

  // Funzione per formattare le date in modo consistente
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  const { tasks, projects } = state;
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assignee: '',
    project: '',
    dueDate: '',
    estimatedHours: 0,
    tags: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Da Fare';
      case 'in-progress': return 'In Corso';
      case 'on-hold': return 'In Pausa';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Cancellato';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Bassa';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  // Filtra i task
  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterAssignee !== 'all' && task.assigned_to !== filterAssignee) return false;
    if (filterProject !== 'all' && task.project_id !== filterProject) return false;
    return true;
  });

  // Raggruppa per status per vista kanban
  const groupedTasks = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    'on-hold': filteredTasks.filter(t => t.status === 'on-hold'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    cancelled: filteredTasks.filter(t => t.status === 'cancelled'),
  };

  const handleOpenForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assigned_to || '',
        project: task.project_id || '',
        dueDate: task.due_date || '',
        estimatedHours: task.estimated_hours,
        tags: task.tags.join(', '),
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignee: '',
        project: '',
        dueDate: '',
        estimatedHours: 0,
        tags: '',
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assigned_to: formData.assignee,
        project_id: formData.project || undefined,
        due_date: formData.dueDate,
        estimated_hours: formData.estimatedHours,
        actual_hours: editingTask?.actual_hours || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        notes: formData.description,
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
      
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Errore nel salvataggio del task:', error);
      alert('Errore nel salvataggio del task. Riprova.');
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: newStatus });
    }
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'Nessun progetto';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Progetto non trovato';
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📋 Gestione Task</h2>
              <p className="text-gray-600">Gestione attività e progetti con vista kanban</p>
            </div>
            <InfoButton onClick={() => openInfo('Gestione Task', 'Sistema completo per gestire task, attività e progetti con vista kanban, lista e calendario.')} />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              + Nuovo Task
            </button>
          </div>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-600">Task Totali</h3>
            <p className="text-2xl font-bold text-blue-900">{totalTasks}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-600">Completati</h3>
            <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-600">In Corso</h3>
            <p className="text-2xl font-bold text-yellow-900">{inProgressTasks}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-600">Scaduti</h3>
            <p className="text-2xl font-bold text-red-900">{overdueTasks}</p>
          </div>
        </div>

        {/* Filtri e Vista */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'kanban' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'calendar' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendario
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tutti gli status</option>
            <option value="pending">Da Fare</option>
            <option value="in-progress">In Corso</option>
            <option value="on-hold">In Pausa</option>
            <option value="completed">Completato</option>
            <option value="cancelled">Cancellato</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tutti gli assegnati</option>
            {Array.from(new Set(tasks.map(t => t.assigned_to))).filter(Boolean).map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tutti i progetti</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vista Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="bg-white/30 backdrop-blur rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{getStatusLabel(status)}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {statusTasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenForm(task)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{task.assigned_to}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Scadenza: {task.due_date ? formatDate(task.due_date) : 'N/A'}</span>
                      <span>{task.estimated_hours}h</span>
                    </div>
                    
                    {task.project_id && (
                      <div className="mt-2">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {getProjectName(task.project_id)}
                        </span>
                      </div>
                    )}
                    
                    {task.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <div className="bg-white/30 backdrop-blur rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assegnato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorità</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scadenza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ore</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.assigned_to}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {task.due_date ? formatDate(task.due_date) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.estimated_hours}h</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleOpenForm(task)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
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

      {/* Vista Calendario */}
      {viewMode === 'calendar' && (
        <div className="bg-white/30 backdrop-blur rounded-xl shadow-sm p-6">
          <div className="text-center text-gray-500">
            <p>Vista calendario in sviluppo...</p>
            <p className="text-sm">Presto disponibile con integrazione calendario completo</p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingTask ? 'Modifica Task' : 'Nuovo Task'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Da Fare</option>
              <option value="in-progress">In Corso</option>
              <option value="on-hold">In Pausa</option>
              <option value="completed">Completato</option>
              <option value="cancelled">Cancellato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progetto</label>
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nessun progetto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Scadenza</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ore Stimate</label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag (separati da virgola)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="design, frontend, responsive"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
