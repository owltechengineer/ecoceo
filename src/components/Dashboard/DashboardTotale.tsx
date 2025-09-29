'use client';

import { useState, useEffect } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  // Marketing
  totalCampaigns: number;
  totalLeads: number;
  totalBudget: number;
  totalSpent: number;
  
  // Progetti e Task
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  
  // Finanziario
  totalRevenue: number;
  totalFixedCosts: number;
  totalVariableCosts: number;
  monthlyBreakEven: number;
  
  // Attività Ricorrenti
  totalRecurringActivities: number;
  weeklyActivities: number;
  monthlyActivities: number;
  
  // Organizzativo
  activeUsers: number;
  conversionRate: number;
}

interface DailyActivity {
  id: string;
  type: 'task' | 'payment' | 'campaign' | 'project' | 'recurring';
  title: string;
  description: string;
  amount?: number;
  status: 'completed' | 'pending' | 'overdue';
  time: string;
  section: string;
  icon: string;
}

interface TodayPayments {
  fixedCosts: number;
  variableCosts: number;
  revenues: number;
  netFlow: number;
}

export default function DashboardTotale() {
  const [stats, setStats] = useState<DashboardStats>({
    // Marketing
    totalCampaigns: 0,
    totalLeads: 0,
    totalBudget: 0,
    totalSpent: 0,
    
    // Progetti e Task
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    
    // Finanziario
    totalRevenue: 0,
    totalFixedCosts: 0,
    totalVariableCosts: 0,
    monthlyBreakEven: 0,
    
    // Attività Ricorrenti
    totalRecurringActivities: 0,
    weeklyActivities: 0,
    monthlyActivities: 0,
    
    // Organizzativo
    activeUsers: 1,
    conversionRate: 0
  });
  
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [todayPayments, setTodayPayments] = useState<TodayPayments>({
    fixedCosts: 0,
    variableCosts: 0,
    revenues: 0,
    netFlow: 0
  });
  const [quickTasks, setQuickTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [importantLeads, setImportantLeads] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showQuickTask, setShowQuickTask] = useState(false);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const [quickTaskForm, setQuickTaskForm] = useState({
    type: 'reminder',
    title: '',
    description: '',
    stakeholder: '',
    priority: 'medium'
  });
  const [quickQuoteForm, setQuickQuoteForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    description: '',
    estimatedValue: '',
    priority: 'high'
  });
  const { formatDateTime } = useClientDate();

  const loadDashboardStats = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Carica dati da tutte le sezioni
      const [
        // Marketing
        campaignsResult,
        leadsResult,
        
        // Progetti e Task
        projectsResult,
        tasksResult,
        appointmentsResult,
        
        // Finanziario
        fixedCostsResult,
        variableCostsResult,
        revenuesResult,
        
        // Attività Ricorrenti
        recurringActivitiesResult,
        
        // Organizzativo
        organizationalResult
      ] = await Promise.allSettled([
        // Marketing
        supabase.from('campaigns').select('*'),
        supabase.from('leads').select('*'),
        
        // Progetti e Task
        supabase.from('task_calendar_projects').select('*'),
        supabase.from('task_calendar_tasks').select('*'),
        supabase.from('task_calendar_appointments').select('*'),
        
        // Finanziario
        supabase.from('financial_fixed_costs').select('*'),
        supabase.from('financial_variable_costs').select('*'),
        supabase.from('financial_revenues').select('*'),
        
        // Attività Ricorrenti
        supabase.from('recurring_activities').select('*'),
        
        // Organizzativo (placeholder)
        Promise.resolve({ data: [] })
      ]);

      // Estrai dati
      const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value.data || [] : [];
      const leads = leadsResult.status === 'fulfilled' ? leadsResult.value.data || [] : [];
      const projects = projectsResult.status === 'fulfilled' ? projectsResult.value.data || [] : [];
      const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value.data || [] : [];
      const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.data || [] : [];
      const fixedCosts = fixedCostsResult.status === 'fulfilled' ? fixedCostsResult.value.data || [] : [];
      const variableCosts = variableCostsResult.status === 'fulfilled' ? variableCostsResult.value.data || [] : [];
      const revenues = revenuesResult.status === 'fulfilled' ? revenuesResult.value.data || [] : [];
      const recurringActivities = recurringActivitiesResult.status === 'fulfilled' ? recurringActivitiesResult.value.data || [] : [];

      // Calcola statistiche Marketing
      const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
      const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
      const totalLeadsCount = campaigns.reduce((sum, c) => sum + (c.leads || 0), 0);
      const conversionRate = totalLeadsCount > 0 ? (totalConversions / totalLeadsCount) * 100 : 0;

      // Calcola statistiche Progetti e Task
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;

      // Calcola statistiche Finanziarie
      const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
      const totalFixedCostsAmount = fixedCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const totalVariableCostsAmount = variableCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const monthlyBreakEven = totalFixedCostsAmount + (totalVariableCostsAmount / 30);

      // Calcola statistiche Attività Ricorrenti
      const weeklyActivities = recurringActivities.filter(a => a.frequency === 'weekly').length;
      const monthlyActivities = recurringActivities.filter(a => a.frequency === 'monthly').length;

      // Calcola pagamenti di oggi
      const todayFixedCosts = fixedCosts.filter(c => 
        c.next_payment_date && c.next_payment_date.startsWith(today)
      ).reduce((sum, c) => sum + (c.amount || 0), 0);
      
      const todayVariableCosts = variableCosts.filter(c => 
        c.date && c.date.startsWith(today)
      ).reduce((sum, c) => sum + (c.amount || 0), 0);
      
      const todayRevenues = revenues.filter(r => 
        r.received_date && r.received_date.startsWith(today)
      ).reduce((sum, r) => sum + (r.amount || 0), 0);

      // Genera attività giornaliere
      const activities: DailyActivity[] = [
        // Task di oggi
        ...tasks.filter(t => t.due_date && t.due_date.startsWith(today)).map(t => ({
          id: t.id,
          type: 'task' as const,
          title: t.title,
          description: t.description || '',
          status: t.status as 'completed' | 'pending' | 'overdue',
          time: t.due_date?.split('T')[1]?.substring(0, 5) || '00:00',
          section: 'Task e Calendario',
          icon: '📅'
        })),
        
        // Appuntamenti di oggi
        ...appointments.filter(a => a.start_time && a.start_time.startsWith(today)).map(a => ({
          id: a.id,
          type: 'project' as const,
          title: a.title,
          description: a.description || '',
          status: 'pending' as const,
          time: a.start_time?.split('T')[1]?.substring(0, 5) || '00:00',
          section: 'Task e Calendario',
          icon: '📅'
        })),
        
        // Pagamenti fissi di oggi
        ...fixedCosts.filter(c => c.next_payment_date && c.next_payment_date.startsWith(today)).map(c => ({
          id: c.id,
          type: 'payment' as const,
          title: c.name,
          description: `Pagamento fisso - ${c.frequency}`,
          amount: c.amount,
          status: 'pending' as const,
          time: '09:00',
          section: 'Gestione Finanziaria',
          icon: '💰'
        })),
        
        // Entrate di oggi
        ...revenues.filter(r => r.received_date && r.received_date.startsWith(today)).map(r => ({
          id: r.id,
          type: 'payment' as const,
          title: r.name,
          description: `Entrata - ${r.category}`,
          amount: r.amount,
          status: 'completed' as const,
          time: '10:00',
          section: 'Gestione Finanziaria',
          icon: '💳'
        }))
      ].sort((a, b) => a.time.localeCompare(b.time));

      setStats({
        // Marketing
        totalCampaigns: campaigns.length,
        totalLeads: leads.length,
        totalBudget,
        totalSpent,
        
        // Progetti e Task
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        
        // Finanziario
        totalRevenue,
        totalFixedCosts: totalFixedCostsAmount,
        totalVariableCosts: totalVariableCostsAmount,
        monthlyBreakEven,
        
        // Attività Ricorrenti
        totalRecurringActivities: recurringActivities.length,
        weeklyActivities,
        monthlyActivities,
        
        // Organizzativo
        activeUsers: 1,
        conversionRate
      });

      setDailyActivities(activities);
      setTodayPayments({
        fixedCosts: todayFixedCosts,
        variableCosts: todayVariableCosts,
        revenues: todayRevenues,
        netFlow: todayRevenues - todayFixedCosts - todayVariableCosts
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
    loadQuickTasks();
    loadProjects();
    loadCampaigns();
    loadImportantLeads();
  }, []);

  const loadQuickTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Errore caricamento quick tasks:', error);
        return;
      }

      setQuickTasks(data || []);
    } catch (error) {
      console.error('Errore caricamento quick tasks:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('task_calendar_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Errore caricamento progetti:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Errore caricamento progetti:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Errore caricamento campagne:', error);
        return;
      }

      setCampaigns(data || []);
    } catch (error) {
      console.error('Errore caricamento campagne:', error);
    }
  };

  const loadImportantLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('priority', ['high', 'hot'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Errore caricamento lead importanti:', error);
        return;
      }

      setImportantLeads(data || []);
    } catch (error) {
      console.error('Errore caricamento lead importanti:', error);
    }
  };

  // Funzioni per task veloci
  const quickTaskTypes = [
    { id: 'reminder', label: 'Reminder', icon: '⏰', color: 'blue' },
    { id: 'order', label: 'Ordine', icon: '📦', color: 'green' },
    { id: 'invoice', label: 'Fattura', icon: '🧾', color: 'purple' },
    { id: 'document', label: 'Documento', icon: '📄', color: 'orange' },
    { id: 'email', label: 'Mail', icon: '📧', color: 'indigo' },
    { id: 'call', label: 'Chiamata', icon: '📞', color: 'red' },
    { id: 'meeting', label: 'Riunione', icon: '🤝', color: 'teal' },
    { id: 'payment', label: 'Pagamento', icon: '💳', color: 'yellow' }
  ];

  const handleQuickTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskForm.title.trim()) return;

    try {
      // Combina titolo e descrizione in modo intelligente
      const combinedTitle = `${quickTaskTypes.find(t => t.id === quickTaskForm.type)?.icon} ${quickTaskForm.title}`;
      const combinedDescription = quickTaskForm.description 
        ? `${quickTaskForm.description}${quickTaskForm.stakeholder ? ` | Stakeholder: ${quickTaskForm.stakeholder}` : ''}`
        : quickTaskForm.stakeholder ? `Stakeholder: ${quickTaskForm.stakeholder}` : '';

      const quickTaskData = {
        type: quickTaskForm.type,
        title: combinedTitle,
        description: combinedDescription,
        stakeholder: quickTaskForm.stakeholder,
        priority: quickTaskForm.priority,
        status: 'pending',
        due_date: new Date().toISOString(),
        user_id: 'default-user'
      };

      // Salva nella tabella quick_tasks
      const { data, error } = await supabase
        .from('quick_tasks')
        .insert([quickTaskData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Sincronizza automaticamente con task_calendar_tasks
      const { error: syncError } = await supabase.rpc('sync_quick_tasks_to_calendar');
      
      if (syncError) {
        console.warn('Errore sincronizzazione con calendario:', syncError);
      }
      
      // Reset form
      setQuickTaskForm({
        type: 'reminder',
        title: '',
        description: '',
        stakeholder: '',
        priority: 'medium'
      });
      
      setShowQuickTask(false);
      
      // Ricarica i dati
      loadDashboardStats();
      loadQuickTasks();
      loadProjects();
      loadCampaigns();
      loadImportantLeads();
      
      alert('Task veloce creato e sincronizzato con successo!');
    } catch (error) {
      console.error('Errore creazione task veloce:', error);
      alert('Errore nella creazione del task');
    }
  };

  const handleQuickQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuoteForm.clientName.trim()) return;

    try {
      // Crea il lead con priorità alta
      const leadData = {
        name: quickQuoteForm.clientName,
        email: quickQuoteForm.clientEmail,
        phone: quickQuoteForm.clientPhone,
        company: quickQuoteForm.company,
        source: 'Preventivo Veloce',
        status: 'new',
        priority: 'high',
        notes: `Preventivo veloce: ${quickQuoteForm.description}${quickQuoteForm.estimatedValue ? ` | Valore stimato: €${quickQuoteForm.estimatedValue}` : ''}`,
        user_id: 'default-user'
      };

      const { data: lead, error: leadError } = await supabase
        .from('marketing_leads')
        .insert([leadData])
        .select()
        .single();

      if (leadError) {
        throw leadError;
      }

      // Crea il preventivo
      const quoteData = {
        client_name: quickQuoteForm.clientName,
        client_email: quickQuoteForm.clientEmail,
        client_phone: quickQuoteForm.clientPhone,
        client_company: quickQuoteForm.company,
        description: quickQuoteForm.description,
        estimated_value: quickQuoteForm.estimatedValue ? parseFloat(quickQuoteForm.estimatedValue) : 0,
        status: 'draft',
        priority: 'high',
        lead_id: lead.id,
        user_id: 'default-user'
      };

      const { data: quote, error: quoteError } = await supabase
        .from('marketing_quotes')
        .insert([quoteData])
        .select()
        .single();

      if (quoteError) {
        console.warn('Errore creazione preventivo:', quoteError);
      }

      // Reset form
      setQuickQuoteForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        company: '',
        description: '',
        estimatedValue: '',
        priority: 'high'
      });
      setShowQuickQuote(false);
      
      // Reload data
      loadDashboardStats();
      loadImportantLeads();
      
      alert(`Lead creato con successo!\nNome: ${quickQuoteForm.clientName}\nPriorità: Alta\nPreventivo: ${quote ? 'Creato' : 'Errore'}`);
    } catch (error) {
      console.error('Errore creazione preventivo veloce:', error);
      alert('Errore nella creazione del lead e preventivo');
    }
  };

  const statCards = [
    // Marketing
    {
      title: 'Campagne Attive',
      value: stats.totalCampaigns,
      icon: '📊',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      section: 'Marketing'
    },
    {
      title: 'Lead Totali',
      value: stats.totalLeads,
      icon: '👥',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      section: 'Marketing'
    },
    {
      title: 'Budget Marketing',
      value: `€${stats.totalBudget.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '💳',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      section: 'Marketing'
    },
    {
      title: 'Tasso Conversione',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: '📈',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      section: 'Marketing'
    },
    
    // Progetti e Task
    {
      title: 'Progetti Attivi',
      value: stats.totalProjects,
      icon: '🚀',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      section: 'Progetti'
    },
    {
      title: 'Task Completati',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: '✅',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      section: 'Task'
    },
    {
      title: 'Task Pendenti',
      value: stats.pendingTasks,
      icon: '⏳',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      section: 'Task'
    },
    
    // Finanziario
    {
      title: 'Ricavi Totali',
      value: `€${stats.totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '💰',
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      section: 'Finanziario'
    },
    {
      title: 'Costi Fissi',
      value: `€${stats.totalFixedCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '🏠',
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      section: 'Finanziario'
    },
    {
      title: 'Break Even Mensile',
      value: `€${stats.monthlyBreakEven.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '⚖️',
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      section: 'Finanziario'
    },
    
    // Attività Ricorrenti
    {
      title: 'Attività Ricorrenti',
      value: stats.totalRecurringActivities,
      icon: '🔄',
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      section: 'Ricorrenti'
    },
    {
      title: 'Attività Settimanali',
      value: stats.weeklyActivities,
      icon: '📅',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      section: 'Ricorrenti'
    },
    {
      title: 'Attività Mensili',
      value: stats.monthlyActivities,
      icon: '📆',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      section: 'Ricorrenti'
    }
  ];

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header Semplificato */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-3">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Totale</h1>
              <p className="text-gray-600">Panoramica rapida delle attività di oggi</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowQuickTask(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm"
            >
              ⚡ Task Veloce
            </button>
            <button
              onClick={() => setShowQuickQuote(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm"
            >
              📄 Preventivo Veloce
            </button>
          </div>
        </div>
      </div>

      {/* Layout a 2 colonne per PC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonna Sinistra - Attività di Oggi */}
        <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📅</span>
            Attività di Oggi
          </h2>
          {dailyActivities.length > 0 ? (
            <div className="space-y-3">
              {dailyActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl mr-3">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                    <div className="text-xs text-gray-600 truncate">{activity.description}</div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{activity.section}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'completed' ? 'Completato' :
                         activity.status === 'pending' ? 'In attesa' : 'In ritardo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <span className="text-3xl mb-2 block">📅</span>
              <p className="text-sm">Nessuna attività programmata per oggi</p>
            </div>
          )}
        </div>

        {/* Colonna Destra - Quick Tasks Recenti */}
        {quickTasks.length > 0 && (
          <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Task Veloci Recenti
            </h2>
            <div className="space-y-3">
              {quickTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 truncate text-sm">{task.title}</div>
                      <div className="text-xs text-gray-600 truncate">{task.description}</div>
                    </div>
                    <span className="text-lg">
                      {quickTaskTypes.find(t => t.id === task.type)?.icon || '📝'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? '🔴 Alta' :
                       task.priority === 'medium' ? '🟡 Media' : '🟢 Bassa'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(task.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recap Pagamenti di Oggi */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">💰</span>
          Recap Pagamenti di Oggi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 font-medium">Costi Fissi</div>
                <div className="text-2xl font-bold text-red-800">
                  €{todayPayments.fixedCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">🏠</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-600 font-medium">Costi Variabili</div>
                <div className="text-2xl font-bold text-orange-800">
                  €{todayPayments.variableCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Entrate</div>
                <div className="text-2xl font-bold text-green-800">
                  €{todayPayments.revenues.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">💳</span>
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${todayPayments.netFlow >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-red-50 to-red-100 border-red-200'} rounded-lg p-4 border`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium ${todayPayments.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Flusso Netto
                </div>
                <div className={`text-2xl font-bold ${todayPayments.netFlow >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  €{todayPayments.netFlow.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">{todayPayments.netFlow >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Campagne Attive */}
      {campaigns.filter(c => c.status === 'active').length > 0 && (
        <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Campagne Attive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {campaigns.filter(c => c.status === 'active').slice(0, 4).map((campaign) => (
              <div key={campaign.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">{campaign.name}</h3>
                    <p className="text-xs text-gray-600 truncate hidden md:block">{campaign.description}</p>
                  </div>
                  <span className="text-lg">📈</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                    🟢 Attiva
                  </span>
                  {campaign.budget && (
                    <span className="text-gray-600 text-xs">€{campaign.budget.toLocaleString('it-IT')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Importanti */}
      {importantLeads.length > 0 && (
        <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🔥</span>
            Lead Importanti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {importantLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 truncate text-sm">{lead.name}</div>
                    <div className="text-xs text-gray-600 truncate hidden md:block">{lead.email}</div>
                  </div>
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded ${
                    lead.priority === 'hot' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {lead.priority === 'hot' ? '🔥 Hot' : '🔴 Alta'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Task Veloce */}
      {showQuickTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">⚡ Task Veloce</h3>
              <button
                onClick={() => setShowQuickTask(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
              {/* Tipo Task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickTaskTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setQuickTaskForm({...quickTaskForm, type: type.id})}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        quickTaskForm.type === type.id
                          ? `bg-${type.color}-100 text-${type.color}-800 border-2 border-${type.color}-300`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg">{type.icon}</div>
                      <div className="text-xs">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Titolo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input
                  type="text"
                  value={quickTaskForm.title}
                  onChange={(e) => setQuickTaskForm({...quickTaskForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Inserisci il titolo del task..."
                  required
                />
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <textarea
                  value={quickTaskForm.description}
                  onChange={(e) => setQuickTaskForm({...quickTaskForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descrizione opzionale..."
                  rows={2}
                />
              </div>

              {/* Stakeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholder</label>
                <input
                  type="text"
                  value={quickTaskForm.stakeholder}
                  onChange={(e) => setQuickTaskForm({...quickTaskForm, stakeholder: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome del stakeholder..."
                />
              </div>

              {/* Priorità */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorità</label>
                <select
                  value={quickTaskForm.priority}
                  onChange={(e) => setQuickTaskForm({...quickTaskForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">🟢 Bassa</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>

              {/* Bottoni */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickTask(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  ⚡ Crea Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preventivo Veloce */}
      {showQuickQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">📄 Preventivo Veloce</h3>
              <button
                onClick={() => setShowQuickQuote(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleQuickQuoteSubmit} className="space-y-4">
              {/* Nome Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Cliente *</label>
                <input
                  type="text"
                  value={quickQuoteForm.clientName}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nome del cliente..."
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={quickQuoteForm.clientEmail}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, clientEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="email@cliente.com"
                />
              </div>

              {/* Telefono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                <input
                  type="tel"
                  value={quickQuoteForm.clientPhone}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+39 123 456 7890"
                />
              </div>

              {/* Azienda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Azienda</label>
                <input
                  type="text"
                  value={quickQuoteForm.company}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nome dell'azienda..."
                />
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione Preventivo</label>
                <textarea
                  value={quickQuoteForm.description}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Descrizione del preventivo..."
                  rows={3}
                />
              </div>

              {/* Valore Stimato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valore Stimato (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={quickQuoteForm.estimatedValue}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, estimatedValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                />
              </div>

              {/* Priorità */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorità</label>
                <select
                  value={quickQuoteForm.priority}
                  onChange={(e) => setQuickQuoteForm({...quickQuoteForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="high">🔴 Alta</option>
                  <option value="medium">🟡 Media</option>
                  <option value="low">🟢 Bassa</option>
                </select>
              </div>

              {/* Bottoni */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickQuote(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  📄 Crea Lead + Preventivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
