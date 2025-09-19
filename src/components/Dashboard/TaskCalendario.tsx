'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assigned_to: string;
  created_at: string;
}

export default function TaskCalendario() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_seo_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Errore caricamento task:', error);
        return;
      }

      setTasks(data || []);
    } catch (err) {
      console.error('Errore caricamento task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '❓';
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
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.due_date === dueDate)?.status.includes('completed');
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg mr-3">
              <span className="text-xl text-white">📅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task e Calendario</h1>
              <p className="text-gray-600">Gestione attività e pianificazione</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Calendario
            </button>
            <button
              onClick={loadTasks}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳' : '🔄'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {tasks.length}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Task Totali
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <span className="text-white text-xl">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Completati
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg mr-4">
              <span className="text-white text-xl">🔄</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-800">
                {tasks.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-sm text-yellow-600 font-medium">
                In Corso
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-lg border border-red-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-lg mr-4">
              <span className="text-white text-xl">⏰</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-800">
                {tasks.filter(t => isOverdue(t.due_date)).length}
              </div>
              <div className="text-sm text-red-600 font-medium">
                In Ritardo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Lista Task</h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Caricamento task...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📭</div>
                <p className="text-gray-500">Nessun task disponibile</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isOverdue(task.due_date)
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)} {task.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)} {task.priority}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {formatDate(task.due_date)}</span>
                          {task.assigned_to && (
                            <span>👤 {task.assigned_to}</span>
                          )}
                          <span>🕒 {formatDate(task.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Vista Calendario</h2>
            <p className="text-gray-600 mt-1">Visualizzazione calendario in sviluppo</p>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Vista Calendario
              </h3>
              <p className="text-gray-500">
                La visualizzazione calendario sarà disponibile in una versione futura
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">➕</span>
              <div>
                <div className="font-semibold text-blue-800">Nuovo Task</div>
                <div className="text-sm text-blue-600">Crea una nuova attività</div>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <div className="font-semibold text-green-800">Report</div>
                <div className="text-sm text-green-600">Visualizza statistiche</div>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <div className="font-semibold text-purple-800">Impostazioni</div>
                <div className="text-sm text-purple-600">Configura il sistema</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
