import { createClient } from '@supabase/supabase-js'

// Configurazione Supabase
const supabaseUrl = 'https://febpscjreqtxxpvjlqxd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDgyMzksImV4cCI6MjA3NDg4NDIzOX0.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client per operazioni admin
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwODIzOSwiZXhwIjoyMDc0ODg0MjM5fQ.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Secret key per operazioni avanzate
const supabaseSecretKey = 'sb_secret_Z7l9wY0V8-3iiqBM3Kw8IQ_ejR7prq9'
export const supabaseSecret = createClient(supabaseUrl, supabaseSecretKey)

// Tipi per il database
export interface Database {
  public: {
    Tables: {
      dashboard_data: {
        Row: {
          id: string
          user_id: string
          data_type: string
          data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data_type: string
          data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data_type?: string
          data?: any
          created_at?: string
          updated_at?: string
        }
      }
      business_plan: {
        Row: {
          id: string
          user_id: string
          section: string
          data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          section: string
          data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          section?: string
          data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Funzioni helper per il database
export const supabaseHelpers = {
  // Le funzioni di salvataggio/caricamento dashboard completa sono state rimosse
  // I dati vengono gestiti dalle singole sezioni nelle loro tabelle specifiche

  // Carica dati dashboard (mantenuto per compatibilità ma deprecato)
  async loadDashboardData(userId: string, dataType?: string) {
    let query = supabase
      .from('dashboard_data')
      .select('*')
      .eq('user_id', userId)

    if (dataType) {
      query = query.eq('data_type', dataType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore nel caricamento dashboard:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      })
      throw new Error(`Errore caricamento Dashboard: ${error.message || 'Errore sconosciuto'}`)
    }

    return data
  },

  // Salva sezione business plan
  async saveBusinessPlanSection(userId: string, section: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan')
      .upsert({
        user_id: userId,
        section: section,
        data: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,section'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio business plan:', error)
      throw error
    }

    return result
  },

  // Carica sezione business plan
  async loadBusinessPlanSection(userId: string, section?: string) {
    let query = supabase
      .from('business_plan')
      .select('*')
      .eq('user_id', userId)

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore nel caricamento business plan:', error)
      throw error
    }

    return data
  },

  // Carica tutto il business plan
  async loadBusinessPlan(userId: string) {
    const { data, error } = await supabase
      .from('business_plan')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Errore nel caricamento business plan completo:', error)
      throw error
    }

    // Organizza i dati per sezione
    const businessPlan: any = {}
    data?.forEach(item => {
      businessPlan[item.section] = item.data
    })

    return businessPlan
  },

  // Funzioni specifiche per le nuove tabelle Business Plan
  
  // Executive Summary
  async saveExecutiveSummary(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_executive_summary')
      .upsert({
        user_id: userId,
        content: data.content,
        pitch: data.pitch,
        documents: data.documents,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio executive summary:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      })
      throw new Error(`Errore salvataggio Executive Summary: ${error.message || 'Errore sconosciuto'}`)
    }

    return result
  },

  async loadExecutiveSummary(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_executive_summary')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Errore nel caricamento executive summary:', error)
      throw error
    }

    return data || { content: '', pitch: '', documents: [] }
  },

  // Market Analysis
  async saveMarketAnalysis(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_market_analysis')
      .upsert({
        user_id: userId,
        demographics: data.demographics,
        competitors: data.competitors,
        swot: data.swot,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio market analysis:', error)
      throw error
    }

    return result
  },

  async loadMarketAnalysis(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_market_analysis')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento market analysis:', error)
      throw error
    }

    return data || { demographics: [], competitors: [], swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] } }
  },

  // Marketing Strategy
  async saveMarketingStrategy(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_marketing_strategy')
      .upsert({
        user_id: userId,
        marketing_objectives: data.marketing_objectives || [],
        target_audience: data.target_audience || {},
        pricing_strategy: data.pricing_strategy || '',
        distribution_channels: data.distribution_channels || [],
        promotion_strategy: data.promotion_strategy || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio marketing strategy:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      })
      throw new Error(`Errore salvataggio Marketing Strategy: ${error.message || 'Errore sconosciuto'}`)
    }

    return result
  },

  async loadMarketingStrategy(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_marketing_strategy')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento marketing strategy:', error)
      throw error
    }

    return data || { marketing_objectives: [], target_audience: {}, pricing_strategy: '', distribution_channels: [], promotion_strategy: '' }
  },

  // Operational Plan
  async saveOperationalPlan(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_operational_plan')
      .upsert({
        user_id: userId,
        roles: data.roles || [],
        milestones: data.milestones || [],
        flow_diagram: data.flow_diagram || {},
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio operational plan:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      })
      throw new Error(`Errore salvataggio Operational Plan: ${error.message || 'Errore sconosciuto'}`)
    }

    return result
  },

  async loadOperationalPlan(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_operational_plan')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento operational plan:', error)
      throw error
    }

    return data || { roles: [], milestones: [], flow_diagram: {} }
  },

  // Financial Plan
  async saveFinancialPlan(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_financial_plan')
      .upsert({
        user_id: userId,
        revenues: data.revenues || [],
        expenses: data.expenses || [],
        forecasts: data.forecasts || {},
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio financial plan:', error)
      throw error
    }

    return result
  },

  async loadFinancialPlan(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_financial_plan')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento financial plan:', error)
      throw error
    }

    return data || { revenues: [], expenses: [], forecasts: {} }
  },

  // Business Model
  async saveBusinessModel(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_business_model')
      .upsert({
        user_id: userId,
        key_partners: data.key_partners || [],
        key_activities: data.key_activities || [],
        value_propositions: data.value_propositions || [],
        customer_segments: data.customer_segments || [],
        revenue_streams: data.revenue_streams || [],
        canvas_data: data.canvas_data || {},
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio business model:', error)
      throw error
    }

    return result
  },

  async loadBusinessModel(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_business_model')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento business model:', error)
      throw error
    }

    return data || { key_partners: [], key_activities: [], value_propositions: [], customer_segments: [], revenue_streams: [], canvas_data: {} }
  },

  // Roadmap
  async saveRoadmap(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_roadmap')
      .upsert({
        user_id: userId,
        goals: data.goals || [],
        kpis: data.kpis || [],
        timeline: data.timeline || {},
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio roadmap:', error)
      throw error
    }

    return result
  },

  async loadRoadmap(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_roadmap')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento roadmap:', error)
      throw error
    }

    return data || { goals: [], kpis: [], timeline: {} }
  },

  // Documentation
  async saveDocumentation(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('business_plan_documentation')
      .upsert({
        user_id: userId,
        files: data.files || [],
        links: data.links || [],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('Errore nel salvataggio documentation:', error)
      throw error
    }

    return result
  },

  async loadDocumentation(userId: string) {
    const { data, error } = await supabase
      .from('business_plan_documentation')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel caricamento documentation:', error)
      throw error
    }

    return data || { files: [], links: [] }
  }
}

// ===== TASK & CALENDAR FUNCTIONS =====

// Tipi per Task & Calendar
export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  start_date?: string;
  completed_date?: string;
  estimated_hours: number;
  actual_hours: number;
  progress_percentage: number;
  depends_on_tasks: string[];
  category: 'development' | 'design' | 'testing' | 'documentation' | 'meeting' | 'review' | 'other';
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'call' | 'presentation' | 'interview' | 'training' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  meeting_id?: string;
  attendees: string[];
  organizer?: string;
  is_recurring: boolean;
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_end_date?: string;
  reminder_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

// Funzioni per Tasks
export const saveTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio task:', error);
      throw new Error(`Errore salvataggio task: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio task:', error);
    throw error;
  }
};

export const loadTasks = async (userId: string = 'default-user'): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento tasks:', error);
      throw new Error(`Errore caricamento tasks: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento tasks:', error);
    throw error;
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento task:', error);
      throw new Error(`Errore aggiornamento task: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore aggiornamento task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('task_calendar_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione task:', error);
      throw new Error(`Errore eliminazione task: ${error.message}`);
    }
  } catch (error) {
    console.error('Errore eliminazione task:', error);
    throw error;
  }
};

// Funzioni per Appointments
export const saveAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  try {
    // Verifica accessibilità tabella
    const { error: testError } = await supabase
      .from('task_calendar_appointments')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Tabella task_calendar_appointments non accessibile:', testError);
      throw new Error(`Tabella non accessibile: ${testError.message || 'Errore sconosciuto'}`);
    }

    const { data, error } = await supabase
      .from('task_calendar_appointments')
      .insert([appointment])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio appointment:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      throw new Error(`Errore salvataggio appointment: ${error.message || 'Errore sconosciuto'}`);
    }

    return data;
  } catch (error: any) {
    console.error('Errore salvataggio appointment:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      fullError: error
    });
    throw new Error(`Errore salvataggio appointment: ${error?.message || 'Errore sconosciuto'}`);
  }
};

export const loadAppointments = async (userId: string = 'default-user'): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_appointments')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Errore caricamento appointments:', error);
      throw new Error(`Errore caricamento appointments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento appointments:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento appointment:', error);
      throw new Error(`Errore aggiornamento appointment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore aggiornamento appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('task_calendar_appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione appointment:', error);
      throw new Error(`Errore eliminazione appointment: ${error.message}`);
    }
  } catch (error) {
    console.error('Errore eliminazione appointment:', error);
    throw error;
  }
};

// Funzioni per Projects
export const saveProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio project:', error);
      throw new Error(`Errore salvataggio project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio project:', error);
    throw error;
  }
};

export const loadProjects = async (userId: string = 'default-user'): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('task_calendar_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento projects:', error);
      throw new Error(`Errore caricamento projects: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento projects:', error);
    throw error;
  }
};

// Funzione per test connessione Task & Calendar
export const testTaskCalendarConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // Test caricamento tasks
    const tasks = await loadTasks();
    
    // Test caricamento appointments
    const appointments = await loadAppointments();
    
    // Test caricamento projects
    const projects = await loadProjects();

    return {
      success: true,
      message: `Connessione Task & Calendar OK - Tasks: ${tasks.length}, Appointments: ${appointments.length}, Projects: ${projects.length}`,
      data: {
        tasks: tasks.length,
        appointments: appointments.length,
        projects: projects.length
      }
    };
  } catch (error) {
    console.error('Errore test Task & Calendar:', error);
    return {
      success: false,
      message: `Errore test Task & Calendar: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// ===== PROJECTS FUNCTIONS =====

// Tipi per Projects
export interface ProjectMain {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  planned_start_date?: string;
  planned_end_date?: string;
  budget?: number;
  actual_cost?: number;
  currency?: string;
  progress?: number;
  completion_percentage?: number;
  project_manager?: string;
  team_members?: string[];
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectObjective {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  objective_type: 'goal' | 'milestone' | 'deliverable' | 'kpi';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  target_date?: string;
  completed_date?: string;
  target_value?: number;
  actual_value?: number;
  unit_of_measure?: string;
  progress_percentage: number;
  success_criteria?: string;
  dependencies: string[];
  responsible_person?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectBudget {
  id: string;
  project_id: string;
  user_id: string;
  category: 'personnel' | 'equipment' | 'software' | 'marketing' | 'travel' | 'materials' | 'external' | 'other';
  item_name: string;
  description?: string;
  estimated_cost: number;
  actual_cost: number;
  currency: string;
  planned_date?: string;
  actual_date?: string;
  status: 'planned' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  vendor?: string;
  invoice_number?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTeam {
  id: string;
  project_id: string;
  user_id: string;
  member_name: string;
  role: string;
  department?: string;
  email?: string;
  allocation_percentage: number;
  hourly_rate?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'completed' | 'removed';
  skills: string[];
  responsibilities?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  milestone_type: 'milestone' | 'phase' | 'deliverable' | 'review' | 'decision';
  planned_date: string;
  actual_date?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  dependencies: string[];
  deliverables: string[];
  responsible_person?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRisk {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  risk_type: 'operational' | 'financial' | 'technical' | 'schedule' | 'resource' | 'external';
  probability: 'low' | 'medium' | 'high' | 'very-high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'resolved' | 'occurred';
  mitigation_strategy?: string;
  contingency_plan?: string;
  owner?: string;
  identified_date: string;
  target_resolution_date?: string;
  actual_resolution_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Funzioni per Projects Main
export const saveProjectMain = async (project: Omit<ProjectMain, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectMain> => {
  try {
    const { data, error } = await supabase
      .from('projects_main')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio project:', error);
      throw new Error(`Errore salvataggio project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio project:', error);
    throw error;
  }
};

export const loadProjectsMain = async (userId: string = 'default-user'): Promise<ProjectMain[]> => {
  try {
    const { data, error } = await supabase
      .from('projects_main')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento projects:', error);
      throw new Error(`Errore caricamento projects: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento projects:', error);
    throw error;
  }
};

export const updateProjectMain = async (id: string, updates: Partial<ProjectMain>): Promise<ProjectMain> => {
  try {
    const { data, error } = await supabase
      .from('projects_main')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento project:', error);
      throw new Error(`Errore aggiornamento project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore aggiornamento project:', error);
    throw error;
  }
};

export const deleteProjectMain = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects_main')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione project:', error);
      throw new Error(`Errore eliminazione project: ${error.message}`);
    }
  } catch (error) {
    console.error('Errore eliminazione project:', error);
    throw error;
  }
};

// Funzioni per Project Objectives
export const saveProjectObjective = async (objective: Omit<ProjectObjective, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectObjective> => {
  try {
    const { data, error } = await supabase
      .from('project_objectives')
      .insert([objective])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio objective:', error);
      throw new Error(`Errore salvataggio objective: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio objective:', error);
    throw error;
  }
};

export const loadProjectObjectives = async (projectId: string): Promise<ProjectObjective[]> => {
  try {
    const { data, error } = await supabase
      .from('project_objectives')
      .select('*')
      .eq('project_id', projectId)
      .order('target_date', { ascending: true });

    if (error) {
      console.error('Errore caricamento objectives:', error);
      throw new Error(`Errore caricamento objectives: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento objectives:', error);
    throw error;
  }
};

// Funzioni per Project Budget
export const saveProjectBudget = async (budget: Omit<ProjectBudget, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectBudget> => {
  try {
    const { data, error } = await supabase
      .from('project_budget')
      .insert([budget])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio budget:', error);
      throw new Error(`Errore salvataggio budget: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio budget:', error);
    throw error;
  }
};

export const loadProjectBudget = async (projectId: string): Promise<ProjectBudget[]> => {
  try {
    const { data, error } = await supabase
      .from('project_budget')
      .select('*')
      .eq('project_id', projectId)
      .order('planned_date', { ascending: true });

    if (error) {
      console.error('Errore caricamento budget:', error);
      throw new Error(`Errore caricamento budget: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento budget:', error);
    throw error;
  }
};

// Funzioni per Project Team
export const saveProjectTeam = async (team: Omit<ProjectTeam, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectTeam> => {
  try {
    const { data, error } = await supabase
      .from('project_team')
      .insert([team])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio team:', error);
      throw new Error(`Errore salvataggio team: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio team:', error);
    throw error;
  }
};

export const loadProjectTeam = async (projectId: string): Promise<ProjectTeam[]> => {
  try {
    const { data, error } = await supabase
      .from('project_team')
      .select('*')
      .eq('project_id', projectId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Errore caricamento team:', error);
      throw new Error(`Errore caricamento team: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento team:', error);
    throw error;
  }
};

// Funzioni per Project Milestones
export const saveProjectMilestone = async (milestone: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectMilestone> => {
  try {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert([milestone])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio milestone:', error);
      throw new Error(`Errore salvataggio milestone: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio milestone:', error);
    throw error;
  }
};

export const loadProjectMilestones = async (projectId: string): Promise<ProjectMilestone[]> => {
  try {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('planned_date', { ascending: true });

    if (error) {
      console.error('Errore caricamento milestones:', error);
      throw new Error(`Errore caricamento milestones: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento milestones:', error);
    throw error;
  }
};

// Funzioni per Project Risks
export const saveProjectRisk = async (risk: Omit<ProjectRisk, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectRisk> => {
  try {
    const { data, error } = await supabase
      .from('project_risks')
      .insert([risk])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio risk:', error);
      throw new Error(`Errore salvataggio risk: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio risk:', error);
    throw error;
  }
};

export const loadProjectRisks = async (projectId: string): Promise<ProjectRisk[]> => {
  try {
    const { data, error } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .order('risk_level', { ascending: false });

    if (error) {
      console.error('Errore caricamento risks:', error);
      throw new Error(`Errore caricamento risks: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento risks:', error);
    throw error;
  }
};

// Funzione per ottenere statistiche aggregate di un progetto
export const getProjectStats = async (projectId: string): Promise<{
  objectives: { total: number; completed: number; inProgress: number; pending: number };
  budget: { totalEstimated: number; totalActual: number; remaining: number; categories: any[] };
  team: { totalMembers: number; activeMembers: number; totalAllocation: number };
  milestones: { total: number; completed: number; upcoming: number; overdue: number };
  risks: { total: number; critical: number; high: number; medium: number; low: number };
}> => {
  try {
    const [objectives, budget, team, milestones, risks] = await Promise.all([
      loadProjectObjectives(projectId),
      loadProjectBudget(projectId),
      loadProjectTeam(projectId),
      loadProjectMilestones(projectId),
      loadProjectRisks(projectId)
    ]);

    // Statistiche Obiettivi
    const objectivesStats = {
      total: objectives.length,
      completed: objectives.filter(obj => obj.status === 'completed').length,
      inProgress: objectives.filter(obj => obj.status === 'in-progress').length,
      pending: objectives.filter(obj => obj.status === 'pending').length
    };

    // Statistiche Budget
    const totalEstimated = budget.reduce((sum, item) => sum + item.estimated_cost, 0);
    const totalActual = budget.reduce((sum, item) => sum + item.actual_cost, 0);
    const budgetCategories = budget.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { estimated: 0, actual: 0 };
      }
      acc[item.category].estimated += item.estimated_cost;
      acc[item.category].actual += item.actual_cost;
      return acc;
    }, {} as any);

    const budgetStats = {
      totalEstimated,
      totalActual,
      remaining: totalEstimated - totalActual,
      categories: Object.entries(budgetCategories).map(([category, amounts]: [string, any]) => ({
        category,
        estimated: amounts.estimated,
        actual: amounts.actual
      }))
    };

    // Statistiche Team
    const teamStats = {
      totalMembers: team.length,
      activeMembers: team.filter(member => member.status === 'active').length,
      totalAllocation: team.reduce((sum, member) => sum + member.allocation_percentage, 0)
    };

    // Statistiche Milestone
    const now = new Date();
    const milestonesStats = {
      total: milestones.length,
      completed: milestones.filter(m => m.status === 'completed').length,
      upcoming: milestones.filter(m => m.status === 'pending' && new Date(m.planned_date) > now).length,
      overdue: milestones.filter(m => m.status === 'pending' && new Date(m.planned_date) < now).length
    };

    // Statistiche Rischi
    const risksStats = {
      total: risks.length,
      critical: risks.filter(r => r.risk_level === 'critical').length,
      high: risks.filter(r => r.risk_level === 'high').length,
      medium: risks.filter(r => r.risk_level === 'medium').length,
      low: risks.filter(r => r.risk_level === 'low').length
    };

    return {
      objectives: objectivesStats,
      budget: budgetStats,
      team: teamStats,
      milestones: milestonesStats,
      risks: risksStats
    };
  } catch (error) {
    console.error('Errore nel calcolo statistiche progetto:', error);
    throw error;
  }
};

// Funzione per test connessione Projects
export const testProjectsConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // Test caricamento projects
    const projects = await loadProjectsMain();
    
    return {
      success: true,
      message: `Connessione Projects OK - Projects: ${projects.length}`,
      data: {
        projects: projects.length
      }
    };
  } catch (error) {
    console.error('Errore test Projects:', error);
    return {
      success: false,
      message: `Errore test Projects: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// ===== MARKETING INTERFACES =====
// Interfacce allineate con docs/database/02_MARKETING_TABLES.sql

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'digital' | 'print' | 'tv' | 'radio' | 'outdoor' | 'social' | 'email' | 'other';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Budget e Costi
  budget: number;
  spent_amount: number;
  currency: string;
  // Date
  start_date: string; // TIMESTAMP WITH TIME ZONE
  end_date?: string; // TIMESTAMP WITH TIME ZONE
  // Team
  campaign_manager?: string;
  creative_director?: string;
  account_manager?: string;
  // Metrics
  target_impressions: number;
  target_clicks: number;
  target_conversions: number;
  actual_impressions: number;
  actual_clicks: number;
  actual_conversions: number;
  // Metadata
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  // Informazioni Personali
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  // Lead Information
  source: 'website' | 'social' | 'email' | 'referral' | 'advertising' | 'event' | 'cold_call' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  // Campaign
  campaign_id?: string;
  // Location
  country?: string;
  city?: string;
  address?: string;
  // Notes
  notes?: string;
  tags: string[];
  // Dates
  first_contact_date: string; // TIMESTAMP WITH TIME ZONE
  last_contact_date?: string; // TIMESTAMP WITH TIME ZONE
  next_followup_date?: string; // TIMESTAMP WITH TIME ZONE
  created_at: string;
  updated_at: string;
}

// ===== MARKETING FUNCTIONS =====

// Campaign Functions
export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> => {
  try {
    console.log('🔍 Creating campaign:', campaign.name);
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('❌ Campaign creation error:', error);
      throw new Error(`Campaign creation failed: ${error.message}`);
    }

    console.log('✅ Campaign created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Campaign creation error:', error);
    throw error;
  }
};

export const loadCampaigns = async (userId: string = 'default-user'): Promise<Campaign[]> => {
  try {
    console.log('🔍 Tentativo caricamento campaigns per userId:', userId);
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      const errorDetails = {
        message: error.message || 'Nessun messaggio',
        details: error.details || 'Nessun dettaglio',
        hint: error.hint || 'Nessun hint',
        code: error.code || 'Nessun codice',
      };
      console.error('❌ Errore Supabase caricamento campaigns:', JSON.stringify(errorDetails, null, 2));
      throw new Error(`Errore caricamento campaigns: ${error.message || 'Errore sconosciuto'}`);
    }

    console.log('✅ Campaigns caricati con successo:', data?.length || 0, 'record');
    return data || [];
  } catch (error) {
    console.error('❌ Errore generale caricamento campaigns:', {
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
      stack: error instanceof Error ? error.stack : undefined,
      userId
    });
    throw error;
  }
};

export const updateCampaign = async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento campaign:', error);
      throw new Error(`Errore aggiornamento campaign: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore aggiornamento campaign:', error);
    throw error;
  }
};

export const deleteCampaign = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione campaign:', error);
      throw new Error(`Errore eliminazione campaign: ${error.message}`);
    }
  } catch (error) {
    console.error('Errore eliminazione campaign:', error);
    throw error;
  }
};

// Funzioni per Leads
export const saveLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
  try {
    console.log('🔍 saveLead - Input lead object:', lead);
    console.log('🔍 saveLead - Object keys:', Object.keys(lead));
    console.log('🔍 saveLead - Object values:', Object.values(lead));
    
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Errore salvataggio lead: ${error.message}`);
    }

    console.log('✅ Lead salvato con successo:', data);
    return data;
  } catch (error) {
    console.error('❌ Errore generale salvataggio lead:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);
    throw error;
  }
};

export const loadLeads = async (userId: string = 'default-user'): Promise<Lead[]> => {
  try {
    console.log('🔍 Tentativo caricamento leads per userId:', userId);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      const errorDetails = {
        message: error.message || 'Nessun messaggio',
        details: error.details || 'Nessun dettaglio',
        hint: error.hint || 'Nessun hint',
        code: error.code || 'Nessun codice',
      };
      console.error('❌ Errore Supabase caricamento leads:', JSON.stringify(errorDetails, null, 2));
      throw new Error(`Errore caricamento leads: ${error.message || 'Errore sconosciuto'}`);
    }

    console.log('✅ Leads caricati con successo:', data?.length || 0, 'record');
    return data || [];
  } catch (error) {
    console.error('❌ Errore generale caricamento leads:', {
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
      stack: error instanceof Error ? error.stack : undefined,
      userId
    });
    throw error;
  }
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Errore aggiornamento lead:', error);
      throw new Error(`Errore aggiornamento lead: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore aggiornamento lead:', error);
    throw error;
  }
};

export const deleteLead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione lead:', error);
      throw new Error(`Errore eliminazione lead: ${error.message}`);
    }
  } catch (error) {
    console.error('Errore eliminazione lead:', error);
    throw error;
  }
};

// Funzione per test connessione Marketing Dashboard
export const testMarketingDashboardConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // Test caricamento campaigns e leads
    const [campaigns, leads] = await Promise.all([
      loadCampaigns(),
      loadLeads()
    ]);
    
    return {
      success: true,
      message: `Connessione Marketing Dashboard OK - Campaigns: ${campaigns.length}, Leads: ${leads.length}`,
      data: {
        campaigns: campaigns.length,
        leads: leads.length
      }
    };
  } catch (error) {
    console.error('Errore test Marketing Dashboard:', error);
    return {
      success: false,
      message: `Errore test Marketing Dashboard: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// Tipi per Marketing
export interface SEOProject {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  technical_score: number;
  content_score: number;
  authority_score: number;
  local_score: number;
  primary_keywords: string[];
  secondary_keywords: string[];
  long_tail_keywords: string[];
  competitors: string[];
  competitor_analysis: any;
  target_traffic: number;
  target_rankings: any;
  target_conversions: number;
  monthly_budget: number;
  spent_amount: number;
  currency: string;
  seo_specialist?: string;
  content_writer?: string;
  link_builder?: string;
  start_date: string;
  next_review_date?: string;
  notes?: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export interface CRMCampaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  campaign_type: 'email' | 'sms' | 'push' | 'social' | 'retargeting' | 'lead_nurturing';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  target_audience: any;
  segment_criteria: any;
  estimated_reach: number;
  subject_line?: string;
  email_template?: string;
  call_to_action?: string;
  landing_page_url?: string;
  trigger_conditions: any;
  automation_rules: any;
  follow_up_sequence: any[];
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  converted_count: number;
  budget: number;
  cost_per_click: number;
  cost_per_conversion: number;
  scheduled_date?: string;
  start_date?: string;
  end_date?: string;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMContact {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: string;
  lead_score: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  country?: string;
  city?: string;
  industry?: string;
  company_size?: string;
  last_contact_date?: string;
  total_opens: number;
  total_clicks: number;
  total_conversions: number;
  custom_fields: any;
  tags: string[];
  consent_given: boolean;
  consent_date?: string;
  unsubscribe_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdCampaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  platform: 'google' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
  campaign_type: 'search' | 'display' | 'video' | 'shopping' | 'app' | 'lead_generation';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  target_audience: any;
  demographics: any;
  interests: any;
  locations: string[];
  daily_budget: number;
  total_budget: number;
  bid_strategy: string;
  bid_amount: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  start_date?: string;
  end_date?: string;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentCalendar {
  id: string;
  user_id: string;
  title: string;
  content_type: 'blog_post' | 'social_post' | 'video' | 'infographic' | 'ebook' | 'webinar' | 'podcast';
  status: 'idea' | 'draft' | 'review' | 'approved' | 'published' | 'archived';
  description?: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  target_keywords: string[];
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  publish_date?: string;
  author?: string;
  editor?: string;
  social_platforms: string[];
  social_copies: any;
  views: number;
  shares: number;
  comments: number;
  engagement_rate: number;
  tags: string[];
  categories: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_type: 'standard' | 'promotional' | 'educational' | 'announcement' | 'custom';
  subject_line: string;
  html_content?: string;
  text_content?: string;
  preview_text?: string;
  header_image_url?: string;
  footer_text?: string;
  brand_colors: any;
  fonts: any;
  is_default: boolean;
  is_active: boolean;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterCampaign {
  id: string;
  user_id: string;
  template_id?: string;
  name: string;
  subject_line: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  html_content?: string;
  text_content?: string;
  preview_text?: string;
  target_segments: string[];
  exclude_segments: string[];
  estimated_recipients: number;
  scheduled_date?: string;
  sent_date?: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  bounced_count: number;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuickQuote {
  id: string;
  user_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  company?: string;
  service_type: 'seo' | 'ads' | 'content' | 'social' | 'crm' | 'analytics' | 'package';
  project_description?: string;
  estimated_duration?: string;
  base_price: number;
  additional_services: any[];
  total_price: number;
  currency: string;
  payment_terms: string;
  validity_days: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  sent_date?: string;
  viewed_date?: string;
  response_date?: string;
  follow_up_scheduled?: string;
  follow_up_notes?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Funzioni per SEO Projects
export const saveSEOProject = async (project: Omit<SEOProject, 'id' | 'created_at' | 'updated_at'>): Promise<SEOProject> => {
  try {
    const { data, error } = await supabase
      .from('marketing_seo_projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio SEO project:', error);
      throw new Error(`Errore salvataggio SEO project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio SEO project:', error);
    throw error;
  }
};

export const loadSEOProjects = async (userId: string = 'default-user'): Promise<SEOProject[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_seo_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento SEO projects:', error);
      throw new Error(`Errore caricamento SEO projects: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento SEO projects:', error);
    throw error;
  }
};

// Funzioni per CRM Campaigns
export const saveCRMCampaign = async (campaign: Omit<CRMCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<CRMCampaign> => {
  try {
    const { data, error } = await supabase
      .from('marketing_crm_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio CRM campaign:', error);
      throw new Error(`Errore salvataggio CRM campaign: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio CRM campaign:', error);
    throw error;
  }
};

export const loadCRMCampaigns = async (userId: string = 'default-user'): Promise<CRMCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_crm_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento CRM campaigns:', error);
      throw new Error(`Errore caricamento CRM campaigns: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento CRM campaigns:', error);
    throw error;
  }
};

// Funzioni per CRM Contacts
export const saveCRMContact = async (contact: Omit<CRMContact, 'id' | 'created_at' | 'updated_at'>): Promise<CRMContact> => {
  try {
    const { data, error } = await supabase
      .from('marketing_crm_contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio CRM contact:', error);
      throw new Error(`Errore salvataggio CRM contact: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio CRM contact:', error);
    throw error;
  }
};

export const loadCRMContacts = async (userId: string = 'default-user'): Promise<CRMContact[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_crm_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento CRM contacts:', error);
      throw new Error(`Errore caricamento CRM contacts: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento CRM contacts:', error);
    throw error;
  }
};

// Funzioni per Ad Campaigns
export const saveAdCampaign = async (campaign: Omit<AdCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<AdCampaign> => {
  try {
    const { data, error } = await supabase
      .from('marketing_ad_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio Ad campaign:', error);
      throw new Error(`Errore salvataggio Ad campaign: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio Ad campaign:', error);
    throw error;
  }
};

export const loadAdCampaigns = async (userId: string = 'default-user'): Promise<AdCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_ad_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento Ad campaigns:', error);
      throw new Error(`Errore caricamento Ad campaigns: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento Ad campaigns:', error);
    throw error;
  }
};

// Funzioni per Content Calendar
export const saveContentCalendar = async (content: Omit<ContentCalendar, 'id' | 'created_at' | 'updated_at'>): Promise<ContentCalendar> => {
  try {
    const { data, error } = await supabase
      .from('marketing_content_calendar')
      .insert([content])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio Content calendar:', error);
      throw new Error(`Errore salvataggio Content calendar: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio Content calendar:', error);
    throw error;
  }
};

export const loadContentCalendar = async (userId: string = 'default-user'): Promise<ContentCalendar[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_content_calendar')
      .select('*')
      .eq('user_id', userId)
      .order('publish_date', { ascending: true });

    if (error) {
      console.error('Errore caricamento Content calendar:', error);
      throw new Error(`Errore caricamento Content calendar: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento Content calendar:', error);
    throw error;
  }
};

// Funzioni per Newsletter Templates
export const saveNewsletterTemplate = async (template: Omit<NewsletterTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NewsletterTemplate> => {
  try {
    const { data, error } = await supabase
      .from('marketing_newsletter_templates')
      .insert([template])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio Newsletter template:', error);
      throw new Error(`Errore salvataggio Newsletter template: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio Newsletter template:', error);
    throw error;
  }
};

export const loadNewsletterTemplates = async (userId: string = 'default-user'): Promise<NewsletterTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_newsletter_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento Newsletter templates:', error);
      throw new Error(`Errore caricamento Newsletter templates: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento Newsletter templates:', error);
    throw error;
  }
};

// Funzioni per Newsletter Campaigns
export const saveNewsletterCampaign = async (campaign: Omit<NewsletterCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<NewsletterCampaign> => {
  try {
    const { data, error } = await supabase
      .from('marketing_newsletter_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio Newsletter campaign:', error);
      throw new Error(`Errore salvataggio Newsletter campaign: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio Newsletter campaign:', error);
    throw error;
  }
};

export const loadNewsletterCampaigns = async (userId: string = 'default-user'): Promise<NewsletterCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_newsletter_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento Newsletter campaigns:', error);
      throw new Error(`Errore caricamento Newsletter campaigns: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento Newsletter campaigns:', error);
    throw error;
  }
};

// Funzioni per Quick Quotes
export const saveQuickQuote = async (quote: Omit<QuickQuote, 'id' | 'created_at' | 'updated_at'>): Promise<QuickQuote> => {
  try {
    const { data, error } = await supabase
      .from('marketing_quick_quotes')
      .insert([quote])
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio Quick quote:', error);
      throw new Error(`Errore salvataggio Quick quote: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore salvataggio Quick quote:', error);
    throw error;
  }
};

export const loadQuickQuotes = async (userId: string = 'default-user'): Promise<QuickQuote[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_quick_quotes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore caricamento Quick quotes:', error);
      throw new Error(`Errore caricamento Quick quotes: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Errore caricamento Quick quotes:', error);
    throw error;
  }
};

// Funzione per test connessione Marketing
export const testMarketingConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // Test caricamento di tutte le tabelle marketing
    const [seoProjects, crmCampaigns, crmContacts, adCampaigns, contentCalendar, newsletterTemplates, newsletterCampaigns, quickQuotes] = await Promise.all([
      loadSEOProjects(),
      loadCRMCampaigns(),
      loadCRMContacts(),
      loadAdCampaigns(),
      loadContentCalendar(),
      loadNewsletterTemplates(),
      loadNewsletterCampaigns(),
      loadQuickQuotes()
    ]);
    
    return {
      success: true,
      message: `Connessione Marketing OK - SEO: ${seoProjects.length}, CRM: ${crmCampaigns.length}, Ads: ${adCampaigns.length}, Content: ${contentCalendar.length}, Newsletter: ${newsletterCampaigns.length}, Quotes: ${quickQuotes.length}`,
      data: {
        seoProjects: seoProjects.length,
        crmCampaigns: crmCampaigns.length,
        crmContacts: crmContacts.length,
        adCampaigns: adCampaigns.length,
        contentCalendar: contentCalendar.length,
        newsletterTemplates: newsletterTemplates.length,
        newsletterCampaigns: newsletterCampaigns.length,
        quickQuotes: quickQuotes.length
      }
    };
  } catch (error) {
    console.error('Errore test Marketing:', error);
    return {
      success: false,
      message: `Errore test Marketing: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    };
  }
};

// Tipi per le attività ricorrenti
export interface RecurringActivity {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'task' | 'appointment' | 'reminder' | 'other';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  day_of_week?: number; // 0 = Sunday
  day_of_month?: number;
  time_of_day?: string; // TIME format
  duration_minutes: number;
  assigned_to?: string;
  template_id?: string;
  start_date?: string;
  end_date?: string;
  last_generated?: string;
  next_generation?: string;
  notes?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WeeklyTemplate {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  activities?: RecurringActivity[];
}

// Funzioni per le attività ricorrenti
export const recurringActivitiesService = {
  // Carica tutte le attività ricorrenti
  async loadActivities(): Promise<RecurringActivity[]> {
    try {
      const { data, error } = await supabase
        .from('recurring_activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        const errorDetails = {
          message: error.message || 'Nessun messaggio',
          details: error.details || 'Nessun dettaglio',
          hint: error.hint || 'Nessun hint',
          code: error.code || 'Nessun codice'
        };
        console.error('❌ Errore Supabase caricamento attività ricorrenti:', JSON.stringify(errorDetails, null, 2));
        throw new Error(`Errore caricamento attività ricorrenti: ${error.message || 'Errore sconosciuto'}`);
      }
      
      console.log('✅ Attività ricorrenti caricate con successo:', data?.length || 0, 'record');
      return data || [];
    } catch (error) {
      console.error('❌ Errore generale caricamento attività ricorrenti:', {
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  // Salva una nuova attività ricorrente
  async saveActivity(activity: Omit<RecurringActivity, 'id' | 'created_at' | 'updated_at'>): Promise<RecurringActivity> {
    try {
      const { data, error } = await supabase
        .from('recurring_activities')
        .insert([{
          ...activity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio attività ricorrente:', error);
      throw error;
    }
  },

  // Aggiorna un'attività ricorrente
  async updateActivity(id: string, activity: Partial<RecurringActivity>): Promise<RecurringActivity> {
    try {
      const { data, error } = await supabase
        .from('recurring_activities')
        .update({
          ...activity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento attività ricorrente:', error);
      throw error;
    }
  },

  // Elimina un'attività ricorrente
  async deleteActivity(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('recurring_activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione attività ricorrente:', error);
      throw error;
    }
  },

  // Carica tutti i template settimanali
  async loadTemplates(): Promise<WeeklyTemplate[]> {
    try {
      // Prima carica i template
      const { data: templates, error: templatesError } = await supabase
        .from('weekly_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (templatesError) {
        const errorDetails = {
          message: templatesError.message || 'Nessun messaggio',
          details: templatesError.details || 'Nessun dettaglio',
          hint: templatesError.hint || 'Nessun hint',
          code: templatesError.code || 'Nessun codice'
        };
        console.error('❌ Errore Supabase caricamento template:', JSON.stringify(errorDetails, null, 2));
        throw new Error(`Errore caricamento template: ${templatesError.message || 'Errore sconosciuto'}`);
      }

      if (!templates || templates.length === 0) {
        console.log('✅ Template caricati con successo: 0 record');
        return [];
      }

      // Poi carica le attività per ogni template usando la tabella di collegamento
      const templatesWithActivities = await Promise.all(
        templates.map(async (template) => {
          try {
            const { data: activities, error: activitiesError } = await supabase
              .from('template_activities')
              .select(`
                activity_id,
                recurring_activities(*)
              `)
              .eq('template_id', template.id);

            if (activitiesError) {
              console.warn(`Errore caricamento attività per template ${template.id}:`, activitiesError);
              return { ...template, activities: [] };
            }

            const templateActivities = activities?.map(ta => ta.recurring_activities).filter(Boolean) || [];
            return { ...template, activities: templateActivities };
          } catch (error) {
            console.warn(`Errore caricamento attività per template ${template.id}:`, error);
            return { ...template, activities: [] };
          }
        })
      );
      
      console.log('✅ Template caricati con successo:', templatesWithActivities.length, 'record');
      return templatesWithActivities;
    } catch (error) {
      console.error('❌ Errore generale caricamento template:', {
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  // Salva un nuovo template settimanale
  async saveTemplate(template: Omit<WeeklyTemplate, 'id' | 'created_at' | 'updated_at' | 'activities'>): Promise<WeeklyTemplate> {
    try {
      const { data, error } = await supabase
        .from('weekly_templates')
        .insert([{
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio template:', error);
      throw error;
    }
  },

  // Aggiorna un template settimanale
  async updateTemplate(id: string, template: Partial<WeeklyTemplate>): Promise<WeeklyTemplate> {
    try {
      const { data, error } = await supabase
        .from('weekly_templates')
        .update({
          ...template,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento template:', error);
      throw error;
    }
  },

  // Elimina un template settimanale
  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('weekly_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione template:', error);
      throw error;
    }
  },

  // Genera attività ricorrenti per un periodo
  async generateRecurringActivities(startDate: string, endDate: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('generate_recurring_activities', {
          p_start_date: startDate,
          p_end_date: endDate
        });
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Errore generazione attività ricorrenti:', error);
      throw error;
    }
  },

  // Genera settimana da template
  async generateWeekFromTemplate(templateId: string, weekStartDate: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('generate_week_from_template', {
          p_template_id: templateId,
          p_week_start_date: weekStartDate
        });
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Errore generazione settimana da template:', error);
      throw error;
    }
  },

  // Collega un'attività a un template
  async linkActivityToTemplate(templateId: string, activityId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('template_activities')
        .insert([{
          template_id: templateId,
          activity_id: activityId
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Errore collegamento attività a template:', error);
      throw error;
    }
  },

  // Scollega un'attività da un template
  async unlinkActivityFromTemplate(templateId: string, activityId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('template_activities')
        .delete()
        .eq('template_id', templateId)
        .eq('activity_id', activityId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Errore scollegamento attività da template:', error);
      throw error;
    }
  },

  // Carica le attività di un template specifico
  async getTemplateActivities(templateId: string): Promise<RecurringActivity[]> {
    try {
      const { data, error } = await supabase
        .from('template_activities')
        .select(`
          activity_id,
          recurring_activities(*)
        `)
        .eq('template_id', templateId);

      if (error) throw error;
      
      const activities = data?.flatMap(ta => ta.recurring_activities).filter(Boolean) || [];
      return activities;
    } catch (error) {
      console.error('Errore caricamento attività template:', error);
      throw error;
    }
  }
};

// ===== GESTIONE FINANZIARIA =====

// Tipi per la gestione finanziaria
export interface Department {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  budget_limit?: number;
  manager?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostDistribution {
  id: string;
  user_id: string;
  cost_id: string;
  cost_type: 'fixed' | 'variable';
  department_id: string;
  amount: number;
  percentage: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CostDistributionWithDepartment extends CostDistribution {
  department_name: string;
  department_color: string;
}

export interface FixedCost {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: 'office' | 'software' | 'marketing' | 'personnel' | 'utilities' | 'insurance' | 'legal' | 'other';
  start_date: string;
  end_date?: string;
  next_payment_date?: string;
  payment_day?: number;
  is_active: boolean;
  auto_generate: boolean;
  created_at: string;
  updated_at: string;
}

export interface VariableCost {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  category: 'marketing' | 'travel' | 'materials' | 'services' | 'equipment' | 'training' | 'other';
  date: string;
  vendor?: string;
  payment_method?: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  is_paid: boolean;
  payment_date?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  period_start: string;
  period_end: string;
  category: 'revenue' | 'expense' | 'investment' | 'operational' | 'marketing' | 'personnel' | 'other';
  department_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Revenue {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  source: 'sales' | 'services' | 'subscriptions' | 'investments' | 'grants' | 'other';
  date: string;
  client?: string;
  payment_method?: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  is_received: boolean;
  received_date?: string;
  invoice_number?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialAnalysis {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_fixed_costs: number;
  total_variable_costs: number;
  total_costs: number;
  net_profit: number;
  profit_margin: number;
  analysis_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface FinancialImport {
  id: string;
  user_id: string;
  source_table: string;
  source_id: string;
  import_type: 'project_cost' | 'marketing_cost' | 'campaign_cost';
  amount: number;
  description?: string;
  import_date: string;
  status: 'imported' | 'processed' | 'error';
  created_at: string;
}

// Servizi per la gestione finanziaria
export const financialService = {
  // Settori Aziendali
  async loadDepartments(): Promise<Department[]> {
    try {
      const { data, error } = await supabase
        .from('financial_departments')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento settori:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async saveDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    try {
      const { data, error } = await supabase
        .from('financial_departments')
        .insert([department])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio settore:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    try {
      const { data, error } = await supabase
        .from('financial_departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento settore:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async deleteDepartment(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione settore:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Generazione automatica costi ricorrenti
  async generateRecurringCosts(): Promise<void> {
    try {
      const { error } = await supabase.rpc('generate_recurring_costs');
      if (error) throw error;
      console.log('✅ Costi ricorrenti generati automaticamente');
    } catch (error) {
      console.error('Errore generazione costi ricorrenti:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Distribuzione costi
  async distributeCost(costId: string, costType: 'fixed' | 'variable', distributions: Array<{
    department_id: string;
    amount: number;
    percentage: number;
    description?: string;
  }>): Promise<void> {
    try {
      const { error } = await supabase.rpc('distribute_cost', {
        p_cost_id: costId,
        p_cost_type: costType,
        p_distributions: distributions
      });
      if (error) throw error;
      console.log('✅ Distribuzione costi salvata');
    } catch (error) {
      console.error('Errore distribuzione costi:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Ottieni distribuzione di un costo
  async getCostDistribution(costId: string, costType: 'fixed' | 'variable'): Promise<CostDistributionWithDepartment[]> {
    try {
      const { data, error } = await supabase.rpc('get_cost_distribution', {
        p_cost_id: costId,
        p_cost_type: costType
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento distribuzione costi:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Carica distribuzioni per un costo
  async loadCostDistributions(costId: string, costType: 'fixed' | 'variable'): Promise<CostDistribution[]> {
    try {
      const { data, error } = await supabase
        .from('financial_cost_distributions')
        .select('*')
        .eq('cost_id', costId)
        .eq('cost_type', costType);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento distribuzioni:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Salva distribuzione costo
  async saveCostDistribution(distribution: Omit<CostDistribution, 'id' | 'created_at' | 'updated_at'>): Promise<CostDistribution> {
    try {
      const { data, error } = await supabase
        .from('financial_cost_distributions')
        .insert([distribution])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio distribuzione:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Aggiorna distribuzione costo
  async updateCostDistribution(id: string, updates: Partial<CostDistribution>): Promise<CostDistribution> {
    try {
      const { data, error } = await supabase
        .from('financial_cost_distributions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento distribuzione:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Elimina distribuzione costo
  async deleteCostDistribution(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_cost_distributions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione distribuzione:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Costi Fissi
  async loadFixedCosts(): Promise<FixedCost[]> {
    try {
      const { data, error } = await supabase
        .from('financial_fixed_costs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento costi fissi:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async saveFixedCost(cost: Omit<FixedCost, 'id' | 'created_at' | 'updated_at'>): Promise<FixedCost> {
    try {
      const { data, error } = await supabase
        .from('financial_fixed_costs')
        .insert([cost])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio costo fisso:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async updateFixedCost(id: string, updates: Partial<FixedCost>): Promise<FixedCost> {
    try {
      const { data, error } = await supabase
        .from('financial_fixed_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento costo fisso:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async deleteFixedCost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_fixed_costs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione costo fisso:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Costi Variabili
  async loadVariableCosts(): Promise<VariableCost[]> {
    try {
      const { data, error } = await supabase
        .from('financial_variable_costs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento costi variabili:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async saveVariableCost(cost: Omit<VariableCost, 'id' | 'created_at' | 'updated_at'>): Promise<VariableCost> {
    try {
      const { data, error } = await supabase
        .from('financial_variable_costs')
        .insert([cost])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio costo variabile:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async updateVariableCost(id: string, updates: Partial<VariableCost>): Promise<VariableCost> {
    try {
      const { data, error } = await supabase
        .from('financial_variable_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento costo variabile:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async deleteVariableCost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_variable_costs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione costo variabile:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Budget
  async loadBudgets(): Promise<Budget[]> {
    try {
      const { data, error } = await supabase
        .from('financial_budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento budget:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async saveBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    try {
      const { data, error } = await supabase
        .from('financial_budgets')
        .insert([budget])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio budget:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    try {
      const { data, error } = await supabase
        .from('financial_budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento budget:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione budget:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Entrate
  async loadRevenues(): Promise<Revenue[]> {
    try {
      const { data, error } = await supabase
        .from('financial_revenues')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento entrate:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async saveRevenue(revenue: Omit<Revenue, 'id' | 'created_at' | 'updated_at'>): Promise<Revenue> {
    try {
      const { data, error } = await supabase
        .from('financial_revenues')
        .insert([revenue])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore salvataggio entrata:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async updateRevenue(id: string, updates: Partial<Revenue>): Promise<Revenue> {
    try {
      const { data, error } = await supabase
        .from('financial_revenues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento entrata:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async deleteRevenue(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_revenues')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Errore eliminazione entrata:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Importazioni da altre tabelle
  async importProjectCosts(): Promise<void> {
    try {
      // Carica progetti con budget
      const { data: projects, error: projectsError } = await supabase
        .from('task_calendar_projects')
        .select('id, name, budget, start_date, end_date')
        .not('budget', 'is', null);

      if (projectsError) throw projectsError;

      // Importa budget progetti
      for (const project of projects || []) {
        await this.saveBudget({
          user_id: 'default-user',
          name: `Budget ${project.name}`,
          description: `Budget importato dal progetto: ${project.name}`,
          amount: project.budget || 0,
          period_start: project.start_date || new Date().toISOString(),
          period_end: project.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'operational',
          is_active: true
        });
      }

      console.log('✅ Costi progetti importati con successo');
    } catch (error) {
      console.error('Errore importazione costi progetti:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async importMarketingCosts(): Promise<void> {
    try {
      // Carica campagne con budget
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, name, budget, start_date, end_date')
        .not('budget', 'is', null);

      if (campaignsError) throw campaignsError;

      // Importa budget campagne
      for (const campaign of campaigns || []) {
        await this.saveBudget({
          user_id: 'default-user',
          name: `Budget ${campaign.name}`,
          description: `Budget importato dalla campagna: ${campaign.name}`,
          amount: campaign.budget || 0,
          period_start: campaign.start_date || new Date().toISOString(),
          period_end: campaign.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'marketing',
          is_active: true
        });
      }

      console.log('✅ Costi marketing importati con successo');
    } catch (error) {
      console.error('Errore importazione costi marketing:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  // Analisi finanziaria
  async generateFinancialAnalysis(periodStart: string, periodEnd: string): Promise<FinancialAnalysis> {
    try {
      // Calcola totali per il periodo
      const [revenues, fixedCosts, variableCosts] = await Promise.all([
        this.loadRevenues(),
        this.loadFixedCosts(),
        this.loadVariableCosts()
      ]);

      // Filtra per periodo
      const periodRevenues = revenues.filter(r => 
        new Date(r.date) >= new Date(periodStart) && 
        new Date(r.date) <= new Date(periodEnd)
      );

      const periodFixedCosts = fixedCosts.filter(fc => 
        new Date(fc.start_date) <= new Date(periodEnd) &&
        (!fc.end_date || new Date(fc.end_date) >= new Date(periodStart))
      );

      const periodVariableCosts = variableCosts.filter(vc => 
        new Date(vc.date) >= new Date(periodStart) && 
        new Date(vc.date) <= new Date(periodEnd)
      );

      // Calcola totali
      const totalRevenue = periodRevenues.reduce((sum, r) => sum + r.amount, 0);
      const totalFixedCosts = periodFixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
      const totalVariableCosts = periodVariableCosts.reduce((sum, vc) => sum + vc.amount, 0);

      // Crea analisi
      const analysis = {
        user_id: 'default-user',
        period_start: periodStart,
        period_end: periodEnd,
        total_revenue: totalRevenue,
        total_fixed_costs: totalFixedCosts,
        total_variable_costs: totalVariableCosts,
        analysis_type: 'monthly' as const
      };

      const { data, error } = await supabase
        .from('financial_analysis')
        .insert([analysis])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore generazione analisi finanziaria:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
};
