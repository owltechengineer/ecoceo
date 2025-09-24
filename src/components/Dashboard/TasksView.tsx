'use client';

import React, { useState, useEffect } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { 
  loadTasks, 
  saveTask, 
  updateTask, 
  deleteTask as deleteTaskFromDB,
  Task as DBTask 
} from '@/lib/supabase';

// Usa il tipo Task dal database
type Task = DBTask;

export default function TasksView() {
  const { openInfo } = useInfoModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    assigned_to: 'all',
    search: ''
  });

  // Form per nuovo task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    assigned_to: '',
    due_date: '',
    estimated_hours: 0,
    tags: '',
    notes: ''
  });

  // Caricamento task dal database
  useEffect(() => {
    loadTasksFromDB();
  }, []);

  const loadTasksFromDB = async () => {
    setLoading(true);
    try {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Errore nel caricamento tasks:', error);
      // Fallback a dati mock in caso di errore
      const mockTasks: Task[] = [
        {
          id: '1',
          user_id: 'default-user',
          title: 'Implementare dashboard AI',
          description: 'Creare sezione AI Management nella dashboard',
          status: 'in-progress',
          priority: 'high',
          assigned_to: 'Developer',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_hours: 8.0,
          actual_hours: 3.5,
          tags: ['ai', 'dashboard', 'frontend'],
          progress_percentage: 45,
          depends_on_tasks: [],
          category: 'development',
          notes: 'In corso di sviluppo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.status !== 'all' && task.status !== filter.status) return false;
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
    if (filter.assigned_to !== 'all' && task.assigned_to !== filter.assigned_to) return false;
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'review': return '👀';
      case 'todo': return '📋';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const handleSaveTask = async () => {
    if (!newTask.title) {
      alert('Inserisci un titolo per il task');
      return;
    }

    try {
      const taskData = {
        user_id: 'default-user',
        title: newTask.title,
        description: newTask.description || undefined,
        status: newTask.status,
        priority: newTask.priority,
        assigned_to: newTask.assigned_to || undefined,
        due_date: newTask.due_date || undefined,
        estimated_hours: newTask.estimated_hours || 0,
        actual_hours: 0,
        tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t),
        progress_percentage: 0,
        depends_on_tasks: [],
        category: 'other' as const,
        notes: newTask.notes || undefined
      };

      const savedTask = await saveTask(taskData);
      setTasks(prev => [...prev, savedTask]);
      setShowNewTask(false);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assigned_to: '',
        due_date: '',
        estimated_hours: 0,
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Errore nel salvataggio task:', error);
      alert('Errore nel salvataggio del task. Riprova.');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      ));
    } catch (error) {
      console.error('Errore nell\'aggiornamento status:', error);
      alert('Errore nell\'aggiornamento del task. Riprova.');
    }
  };

  const updateTaskProgress = async (taskId: string, newProgress: number) => {
    try {
      const newStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'pending';
      await updateTask(taskId, { progress_percentage: newProgress, status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              progress_percentage: newProgress, 
              status: newStatus,
              updated_at: new Date().toISOString() 
            }
          : task
      ));
    } catch (error) {
      console.error('Errore nell\'aggiornamento progresso:', error);
      alert('Errore nell\'aggiornamento del task. Riprova.');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteTaskFromDB(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Errore nell\'eliminazione task:', error);
      alert('Errore nell\'eliminazione del task. Riprova.');
    }
  };

  const getUniqueAssignees = () => {
    const assignees = tasks.map(task => task.assigned_to).filter(Boolean);
    return [...new Set(assignees)];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Task Management</h1>
            <p className="text-gray-600 mt-1">
              Gestisci e monitora tutti i task del team
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InfoButton
              onClick={() => openInfo('Task', 'Gestione delle attività e task con priorità, assegnazioni e scadenze')}
              className="text-blue-600 hover:text-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca task..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">Tutti gli stati</option>
              <option value="todo">📋 Da fare</option>
              <option value="in-progress">🔄 In corso</option>
              <option value="review">👀 In revisione</option>
              <option value="completed">✅ Completati</option>
              <option value="cancelled">❌ Cancellati</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">Tutte le priorità</option>
              <option value="urgent">🚨 Urgente</option>
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Media</option>
              <option value="low">🟢 Bassa</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={filter.assigned_to}
              onChange={(e) => setFilter(prev => ({ ...prev, assigned_to: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">Tutti gli assegnatari</option>
              {getUniqueAssignees().map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowNewTask(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Nuovo Task
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Caricamento task...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorità
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assegnato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scadenza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {task.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {task.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{task.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)} {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)} {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.assigned_to || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.due_date ? (
                        <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(task.due_date)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${task.progress_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{task.progress_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.actual_hours || 0}/{task.estimated_hours || 0}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Completa"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Elimina"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTask.title}
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Stato</label>
                  <div className="mt-1">
                    <select
                      value={selectedTask.status}
                      onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value as Task['status'])}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="todo">📋 Da fare</option>
                      <option value="in-progress">🔄 In corso</option>
                      <option value="review">👀 In revisione</option>
                      <option value="completed">✅ Completato</option>
                      <option value="cancelled">❌ Cancellato</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Progresso</label>
                  <div className="mt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedTask.progress_percentage}
                      onChange={(e) => updateTaskProgress(selectedTask.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>{selectedTask.progress_percentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Priorità</label>
                  <p className="text-gray-900">{getPriorityIcon(selectedTask.priority)} {selectedTask.priority}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Assegnato</label>
                  <p className="text-gray-900">{selectedTask.assigned_to || 'Non assegnato'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedTask.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Descrizione</label>
                    <p className="text-gray-900">{selectedTask.description}</p>
                  </div>
                )}
                
                {selectedTask.due_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Scadenza</label>
                    <p className={`text-gray-900 ${isOverdue(selectedTask.due_date) ? 'text-red-600 font-medium' : ''}`}>
                      {formatDate(selectedTask.due_date)}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Ore</label>
                  <p className="text-gray-900">
                    {selectedTask.actual_hours || 0} / {selectedTask.estimated_hours || 0} ore
                  </p>
                </div>
                
                {selectedTask.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tag</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTask.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTask.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Note</label>
                    <p className="text-gray-900">{selectedTask.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Chiudi
              </button>
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Elimina Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuovo Task</h3>
              <button
                onClick={() => setShowNewTask(false)}
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
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Titolo del task"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  rows={3}
                  placeholder="Descrizione del task"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="todo">📋 Da fare</option>
                    <option value="in-progress">🔄 In corso</option>
                    <option value="review">👀 In revisione</option>
                    <option value="completed">✅ Completato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="low">🟢 Bassa</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                    <option value="urgent">🚨 Urgente</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assegnato</label>
                <input
                  type="text"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Nome assegnatario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ore stimate</label>
                <input
                  type="number"
                  step="0.5"
                  value={newTask.estimated_hours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <input
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  rows={2}
                  placeholder="Note aggiuntive"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveTask}
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
