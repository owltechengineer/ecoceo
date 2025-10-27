'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { supabaseHelpers, Campaign, Lead } from '@/lib/supabase';
import { useSupabase } from '@/hooks/useSupabase';

// Tipi per i dati della dashboard
export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  expectedRevenue: number;
  actualRevenue: number; // Aggiunto
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'planning';
  progress: number;
  roi: number;
  margin: number;
  variance: number;
  // Dati previsti vs effettivi
  plannedCost: number; // Costo pianificato
  plannedRevenue: number; // Ricavo pianificato
  plannedProgress: number; // Progresso pianificato
  // Nuovi campi per gestione dettagliata
  objectives?: any[];
  teamMembers?: any[];
  milestones?: any[];
  risks?: any[];
  description?: string;
  tags?: string[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: 'consulting' | 'development' | 'design' | 'marketing' | 'support' | 'other';
  status: 'active' | 'inactive' | 'archived' | 'discontinued';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  base_price: number;
  currency: string;
  pricing_model: 'fixed' | 'hourly' | 'monthly' | 'project' | 'other';
  delivery_time_days: number;
  delivery_method: 'remote' | 'onsite' | 'hybrid';
  service_manager?: string;
  team_members: string[];
  requirements: string[];
  deliverables: string[];
  notes?: string;
  tags: string[];
}

export interface Budget {
  id: string;
  year: number;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  category: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  expectedReturn: number;
  actualReturn: number; // Aggiunto
  roi: number;
  status: 'pending' | 'received' | 'lost';
  // Dati previsti vs effettivi
  plannedReturn: number; // Ritorno pianificato
  plannedROI: number; // ROI pianificato
}

export interface RDProject {
  id: string;
  name: string;
  description: string;
  trl: number;
  hours: number;
  cost: number;
  expectedReturn: number;
  actualReturn: number; // Aggiunto
  status: 'research' | 'development' | 'completed' | 'suspended';
  startDate: string;
  endDate: string;
  team: string[];
  progress: number; // Aggiunto
  roi: number; // Aggiunto
  // Dati previsti vs effettivi
  plannedCost: number; // Costo pianificato
  plannedReturn: number; // Ritorno pianificato
  plannedProgress: number; // Progresso pianificato
  actualProgress: number; // Progresso effettivo
}

// Campaign interface moved to @/lib/supabase.ts

// Lead interface moved to @/lib/supabase.ts

// Nuove interfacce per Task e Calendario
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
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'meeting' | 'call' | 'presentation' | 'workshop' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  attendees: string[];
  location: string;
  client?: string; // ID del cliente
  project?: string; // ID del progetto
  notes: string;
  reminder: boolean;
  reminderTime: number; // Minuti prima dell'appuntamento
}

export interface WeeklyPlan {
  id: string;
  weekStart: string; // Data inizio settimana (lunedì)
  weekEnd: string; // Data fine settimana (domenica)
  tasks: string[]; // ID dei task per la settimana
  goals: string[];
  notes: string;
  completedTasks: string[]; // ID dei task completati
  totalPlannedHours: number;
  totalActualHours: number;
  efficiency: number; // Percentuale di completamento
}

export interface TimeEntry {
  id: string;
  taskId: string;
  projectId?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // In minuti
  description: string;
  billable: boolean;
  rate: number; // Tariffa oraria
  totalAmount: number; // Importo totale
}

export interface WebsiteAnalytics {
  id: string;
  date: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  source: 'direct' | 'organic' | 'social' | 'email' | 'referral' | 'paid';
  page: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location: string;
  timestamp: string;
}

export interface Conversion {
  id: string;
  visitorId: string;
  type: 'lead' | 'signup' | 'download' | 'contact' | 'purchase';
  source: string;
  page: string;
  value: number;
  status: 'pending' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  convertedAt?: string;
  notes: string;
}

export interface ShopOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | 'crypto';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  conversionId?: string; // Link to conversion
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  source: 'contact_form' | 'email' | 'phone' | 'chat' | 'social' | 'referral';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  conversionId?: string; // Link to conversion
  notes: string;
}

// Stato iniziale
interface DashboardState {
  projects: Project[];
  services: Service[];
  budgets: Budget[];
  investments: Investment[];
  rdProjects: RDProject[];
  campaigns: Campaign[];
  leads: Lead[];
  tasks: Task[];
  appointments: Appointment[];
  weeklyPlans: WeeklyPlan[];
  timeEntries: TimeEntry[];
  websiteAnalytics: WebsiteAnalytics[];
  conversions: Conversion[];
  shopOrders: ShopOrder[];
  contactRequests: ContactRequest[];
}

// Azioni
type DashboardAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'ADD_RD_PROJECT'; payload: RDProject }
  | { type: 'UPDATE_RD_PROJECT'; payload: RDProject }
  | { type: 'DELETE_RD_PROJECT'; payload: string }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: Campaign }
  | { type: 'DELETE_CAMPAIGN'; payload: string }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'DELETE_LEAD'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'ADD_WEEKLY_PLAN'; payload: WeeklyPlan }
  | { type: 'UPDATE_WEEKLY_PLAN'; payload: WeeklyPlan }
  | { type: 'DELETE_WEEKLY_PLAN'; payload: string }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'DELETE_TIME_ENTRY'; payload: string }
  | { type: 'ADD_WEBSITE_ANALYTICS'; payload: WebsiteAnalytics }
  | { type: 'UPDATE_WEBSITE_ANALYTICS'; payload: WebsiteAnalytics }
  | { type: 'DELETE_WEBSITE_ANALYTICS'; payload: string }
  | { type: 'ADD_CONVERSION'; payload: Conversion }
  | { type: 'UPDATE_CONVERSION'; payload: Conversion }
  | { type: 'DELETE_CONVERSION'; payload: string }
  | { type: 'ADD_SHOP_ORDER'; payload: ShopOrder }
  | { type: 'UPDATE_SHOP_ORDER'; payload: ShopOrder }
  | { type: 'DELETE_SHOP_ORDER'; payload: string }
  | { type: 'ADD_CONTACT_REQUEST'; payload: ContactRequest }
  | { type: 'UPDATE_CONTACT_REQUEST'; payload: ContactRequest }
  | { type: 'DELETE_CONTACT_REQUEST'; payload: string }
  | { type: 'LOAD_DATA'; payload: Partial<DashboardState> };

// Stato iniziale con dati di esempio
const initialState: any = {
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      client: 'TechCorp',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      budget: 50000,
      actualCost: 35000,
      expectedRevenue: 75000,
      actualRevenue: 70000, // Aggiunto
      status: 'active',
      progress: 65,
      roi: 1.14,
      margin: 43.75,
      variance: 5000,
      // Dati previsti vs effettivi
      plannedCost: 40000,
      plannedRevenue: 80000,
      plannedProgress: 70,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      startDate: '2024-02-01',
      endDate: '2024-08-15',
      budget: 80000,
      actualCost: 45000,
      expectedRevenue: 120000,
      actualRevenue: 115000, // Aggiunto
      status: 'active',
      progress: 45,
      roi: 1.67,
      margin: 40,
      variance: 5000,
      // Dati previsti vs effettivi
      plannedCost: 70000,
      plannedRevenue: 130000,
      plannedProgress: 55,
    },
  ],
  services: [
    {
      id: '1',
      name: 'Sviluppo Web',
      price: 80,
      cost: 45,
      hoursSold: 120,
      revenue: 9600,
      margin: 43.75,
      variance: 0,
      // Dati previsti vs effettivi
      plannedHours: 100,
      plannedRevenue: 8000,
      actualHours: 120,
    },
    {
      id: '2',
      name: 'App Mobile',
      price: 100,
      cost: 60,
      hoursSold: 80,
      revenue: 8000,
      margin: 40,
      variance: 0,
      // Dati previsti vs effettivi
      plannedHours: 70,
      plannedRevenue: 8000,
      actualHours: 80,
    },
  ],
  budgets: [
    {
      id: '1',
      year: 2024,
      plannedAmount: 50000,
      actualAmount: 52000,
      variance: 2000,
      category: 'Ricavi Operativi',
    },
    {
      id: '2',
      year: 2024,
      plannedAmount: 0,
      actualAmount: 0,
      variance: 0,
      category: 'Costi Personale',
    },
  ],
  investments: [
    {
      id: '1',
      name: 'Angel Investor A',
      amount: 50000,
      expectedReturn: 100000,
      actualReturn: 105000, // Aggiunto
      status: 'received',
      roi: 1.1,
      // Dati previsti vs effettivi
      plannedReturn: 100000,
      plannedROI: 1.1,
    },
    {
      id: '2',
      name: 'Venture Capital B',
      amount: 100000,
      expectedReturn: 150000,
      actualReturn: 145000, // Aggiunto
      status: 'pending',
      roi: 1.45,
      // Dati previsti vs effettivi
      plannedReturn: 150000,
      plannedROI: 1.45,
    },
  ],
  rdProjects: [
    {
      id: '1',
      name: 'AI-Powered Analytics Platform',
      description: 'Sviluppo di un sistema di analisi dati basato su machine learning',
      trl: 6,
      hours: 240,
      cost: 35000,
      expectedReturn: 150000,
      actualReturn: 145000, // Aggiunto
      status: 'development',
      startDate: '2024-01-01',
      endDate: '2024-08-31',
      team: ['Marco Rossi', 'Anna Bianchi', 'Luca Verdi'],
      progress: 65,
      roi: 3.14,
      // Dati previsti vs effettivi
      plannedCost: 30000,
      plannedReturn: 140000,
      plannedProgress: 60,
      actualProgress: 65,
    },
  ],
  campaigns: [
    {
      id: '1',
      name: 'Google Ads - Sviluppo Web',
      channel: 'Google Ads',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 15000,
      spent: 8500,
      leads: 120,
      conversions: 18,
      revenue: 45000,
      status: 'active',
      cac: 472,
      ltv: 2500,
      ltvCacRatio: 5.3,
      // Dati previsti vs effettivi
      plannedLeads: 100,
      plannedConversions: 15,
      plannedRevenue: 40000,
      actualLeads: 120,
      actualConversions: 18,
    },
  ],
  leads: [
    {
      id: '1',
      name: 'Mario Rossi',
      email: 'mario.rossi@azienda.com',
      source: 'Google Ads',
      campaign: 'Google Ads - Sviluppo Web',
      status: 'converted',
      value: 2500,
      date: '2024-03-15',
      roi: 0.25,
      // Dati previsti vs effettivi
      plannedValue: 2000,
      actualValue: 2500,
    },
  ],
  tasks: [
    {
      id: '1',
      title: 'Setup Database E-commerce',
      description: 'Configurazione database per il progetto e-commerce',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Marco Rossi',
      project: '1',
      dueDate: '2024-04-15',
      estimatedHours: 8,
      actualHours: 6,
      tags: ['database', 'e-commerce', 'setup'],
      createdAt: '2024-04-01T10:00:00Z',
      updatedAt: '2024-04-03T14:30:00Z',
      plannedHours: 8,
      plannedCompletion: '2024-04-15',
    },
    {
      id: '2',
      title: 'Design Homepage',
      description: 'Creazione design responsive per homepage',
      status: 'todo',
      priority: 'medium',
      assignee: 'Anna Bianchi',
      project: '2',
      dueDate: '2024-04-20',
      estimatedHours: 12,
      actualHours: 0,
      tags: ['design', 'frontend', 'responsive'],
      createdAt: '2024-04-02T09:00:00Z',
      updatedAt: '2024-04-02T09:00:00Z',
      plannedHours: 12,
      plannedCompletion: '2024-04-20',
    },
  ],
  appointments: [
    {
      id: '1',
      title: 'Kickoff Progetto E-commerce',
      description: 'Riunione iniziale per definire obiettivi e timeline',
      startDate: '2024-04-05T10:00:00Z',
      endDate: '2024-04-05T11:30:00Z',
      type: 'meeting',
      status: 'confirmed',
      attendees: ['Marco Rossi', 'Anna Bianchi', 'Cliente A'],
      location: 'Sala Riunioni',
      client: 'Cliente A',
      project: '1',
      notes: 'Preparare presentazione progetto e budget',
      reminder: true,
      reminderTime: 15,
    },
    {
      id: '2',
      title: 'Call Tecnica API',
      description: 'Discussione tecnica per integrazione API',
      startDate: '2024-04-08T14:00:00Z',
      endDate: '2024-04-08T15:00:00Z',
      type: 'call',
      status: 'scheduled',
      attendees: ['Marco Rossi', 'Team Tecnico'],
      location: 'Zoom',
      project: '1',
      notes: 'Verificare documentazione API',
      reminder: true,
      reminderTime: 30,
    },
  ],
  weeklyPlans: [
    {
      id: '1',
      weekStart: '2024-04-01',
      weekEnd: '2024-04-07',
      tasks: ['1', '2'],
      goals: ['Completare setup database', 'Iniziare design homepage'],
      notes: 'Settimana di avvio progetti principali',
      completedTasks: ['1'],
      totalPlannedHours: 20,
      totalActualHours: 18,
      efficiency: 90,
    },
  ],
  timeEntries: [
    {
      id: '1',
      taskId: '1',
      projectId: '1',
      date: '2024-04-03',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180,
      description: 'Setup database e configurazione tabelle',
      billable: true,
      rate: 80,
      totalAmount: 240,
    },
    {
      id: '2',
      taskId: '1',
      projectId: '1',
      date: '2024-04-03',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      description: 'Test e ottimizzazione database',
      billable: true,
      rate: 80,
      totalAmount: 240,
    },
  ],
  websiteAnalytics: [],
  conversions: [],
  shopOrders: [],
  contactRequests: [],
};

// Reducer
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'ADD_SERVICE':
      return {
        ...state,
        services: [...state.services, action.payload],
      };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        ),
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload),
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(investment =>
          investment.id === action.payload.id ? action.payload : investment
        ),
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(investment => investment.id !== action.payload),
      };
    case 'ADD_RD_PROJECT':
      return {
        ...state,
        rdProjects: [...state.rdProjects, action.payload],
      };
    case 'UPDATE_RD_PROJECT':
      return {
        ...state,
        rdProjects: state.rdProjects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_RD_PROJECT':
      return {
        ...state,
        rdProjects: state.rdProjects.filter(project => project.id !== action.payload),
      };
    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload],
      };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id ? action.payload : campaign
        ),
      };
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload),
      };
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [...state.leads, action.payload],
      };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
      };
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload),
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
      };
    case 'ADD_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlans: [...state.weeklyPlans, action.payload],
      };
    case 'UPDATE_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlans: state.weeklyPlans.map(plan =>
          plan.id === action.payload.id ? action.payload : plan
        ),
      };
    case 'DELETE_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlans: state.weeklyPlans.filter(plan => plan.id !== action.payload),
      };
    case 'ADD_TIME_ENTRY':
      return {
        ...state,
        timeEntries: [...state.timeEntries, action.payload],
      };
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter(entry => entry.id !== action.payload),
      };
    case 'ADD_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: [...state.websiteAnalytics, action.payload],
      };
    case 'UPDATE_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: state.websiteAnalytics.map(analytics =>
          analytics.id === action.payload.id ? action.payload : analytics
        ),
      };
    case 'DELETE_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: state.websiteAnalytics.filter(analytics => analytics.id !== action.payload),
      };
    case 'ADD_CONVERSION':
      return {
        ...state,
        conversions: [...state.conversions, action.payload],
      };
    case 'UPDATE_CONVERSION':
      return {
        ...state,
        conversions: state.conversions.map(conversion =>
          conversion.id === action.payload.id ? action.payload : conversion
        ),
      };
    case 'DELETE_CONVERSION':
      return {
        ...state,
        conversions: state.conversions.filter(conversion => conversion.id !== action.payload),
      };
    case 'ADD_SHOP_ORDER':
      return {
        ...state,
        shopOrders: [...state.shopOrders, action.payload],
      };
    case 'UPDATE_SHOP_ORDER':
      return {
        ...state,
        shopOrders: state.shopOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_SHOP_ORDER':
      return {
        ...state,
        shopOrders: state.shopOrders.filter(order => order.id !== action.payload),
      };
    case 'ADD_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: [...state.contactRequests, action.payload],
      };
    case 'UPDATE_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: state.contactRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        ),
      };
    case 'DELETE_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: state.contactRequests.filter(request => request.id !== action.payload),
      };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context
interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  // Stato sincronizzazione
  isOnline: boolean;
  isLoading: boolean;
  // Le singole sezioni gestiscono il loro salvataggio nelle tabelle specifiche
  // Utility functions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  addRDProject: (project: Omit<RDProject, 'id'>) => void;
  updateRDProject: (project: RDProject) => void;
  deleteRDProject: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addWeeklyPlan: (plan: Omit<WeeklyPlan, 'id'>) => void;
  updateWeeklyPlan: (plan: WeeklyPlan) => void;
  deleteWeeklyPlan: (id: string) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;
  addWebsiteAnalytics: (analytics: Omit<WebsiteAnalytics, 'id'>) => void;
  updateWebsiteAnalytics: (analytics: WebsiteAnalytics) => void;
  deleteWebsiteAnalytics: (id: string) => void;
  addConversion: (conversion: Omit<Conversion, 'id'>) => void;
  updateConversion: (conversion: Conversion) => void;
  deleteConversion: (id: string) => void;
  addShopOrder: (order: Omit<ShopOrder, 'id'>) => void;
  updateShopOrder: (order: ShopOrder) => void;
  deleteShopOrder: (id: string) => void;
  addContactRequest: (request: Omit<ContactRequest, 'id'>) => void;
  updateContactRequest: (request: ContactRequest) => void;
  deleteContactRequest: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [userId, setUserId] = useState<string>('default-user'); // Per ora usiamo un ID fisso
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Funzione per ottenere l'ID utente (in futuro sarà da auth)
  const getUserId = () => {
    // Per ora usiamo un ID fisso, in futuro sarà da Supabase Auth
    return userId;
  };

  // I dati vengono caricati dalle singole sezioni dalle loro tabelle specifiche
  // Manteniamo solo il caricamento di eventuali preferenze UI da LocalStorage
  useEffect(() => {
    const loadUIPreferences = () => {
      setIsLoading(true);
      try {
        // Carica solo configurazioni UI se esistono
        const uiData = localStorage.getItem('dashboard-ui-preferences');
        if (uiData) {
          const parsedData = JSON.parse(uiData);
          // Qui potresti caricare preferenze UI specifiche se necessario
          console.log('Preferenze UI caricate da LocalStorage');
        }
      } catch (error) {
        console.error('Errore nel caricamento preferenze UI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUIPreferences();
  }, [userId]);

  // NUOVO SISTEMA DI GESTIONE DATI:
  // - Ogni sezione (Projects, Tasks, Marketing, etc.) gestisce il proprio salvataggio nelle tabelle specifiche
  // - Il DashboardContext mantiene lo stato in memoria per la reattività dell'UI
  // - Non salviamo più l'intero stato della dashboard come singolo oggetto JSON
  // - Questo migliora performance, scalabilità e riduce problemi di sincronizzazione

  // Monitora lo stato della connessione
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Utility functions
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      roi: project.expectedRevenue > 0 ? (project.expectedRevenue - project.actualCost) / project.actualCost : 0,
      margin: project.expectedRevenue > 0 ? ((project.expectedRevenue - project.actualCost) / project.expectedRevenue) * 100 : 0,
      variance: project.expectedRevenue > 0 ? (project.expectedRevenue - project.actualRevenue) : 0,
      // Dati previsti vs effettivi
      plannedCost: project.budget,
      plannedRevenue: project.expectedRevenue,
      plannedProgress: project.progress,
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (project: Project) => {
    const updatedProject: Project = {
      ...project,
      roi: project.expectedRevenue > 0 ? (project.expectedRevenue - project.actualCost) / project.actualCost : 0,
      margin: project.expectedRevenue > 0 ? ((project.expectedRevenue - project.actualCost) / project.expectedRevenue) * 100 : 0,
      variance: project.expectedRevenue > 0 ? (project.expectedRevenue - project.actualRevenue) : 0,
      // Dati previsti vs effettivi
      plannedCost: project.budget,
      plannedRevenue: project.expectedRevenue,
      plannedProgress: project.progress,
    };
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const addService = (service: any) => {
    const newService: any = {
      ...service,
      id: Date.now().toString(),
      margin: service.price > 0 ? ((service.price - service.cost) / service.price) * 100 : 0,
      revenue: service.price * service.hoursSold,
      variance: service.price > 0 ? ((service.price - service.cost) / service.price) * 100 : 0,
      // Dati previsti vs effettivi
      plannedHours: service.hoursSold,
      plannedRevenue: service.price * service.hoursSold,
      actualHours: service.hoursSold,
    };
    dispatch({ type: 'ADD_SERVICE', payload: newService });
  };

  const updateService = (service: any) => {
    const updatedService: any = {
      ...service,
      margin: service.price > 0 ? ((service.price - service.cost) / service.price) * 100 : 0,
      revenue: service.price * service.hoursSold,
      variance: service.price > 0 ? ((service.price - service.cost) / service.price) * 100 : 0,
      // Dati previsti vs effettivi
      plannedHours: service.hoursSold,
      plannedRevenue: service.price * service.hoursSold,
      actualHours: service.hoursSold,
    };
    dispatch({ type: 'UPDATE_SERVICE', payload: updatedService });
  };

  const deleteService = (id: string) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      variance: (budget.actualAmount - budget.plannedAmount),
    };
    dispatch({ type: 'ADD_BUDGET', payload: newBudget });
  };

  const updateBudget = (budget: Budget) => {
    const updatedBudget: Budget = {
      ...budget,
      variance: (budget.actualAmount - budget.plannedAmount),
    };
    dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: id });
  };

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      roi: investment.expectedReturn > 0 ? (investment.actualReturn - investment.amount) / investment.amount : 0,
      // Dati previsti vs effettivi
      plannedReturn: investment.expectedReturn,
      plannedROI: investment.expectedReturn > 0 ? (investment.expectedReturn - investment.amount) / investment.amount : 0,
    };
    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
  };

  const updateInvestment = (investment: Investment) => {
    const updatedInvestment: Investment = {
      ...investment,
      roi: investment.expectedReturn > 0 ? (investment.actualReturn - investment.amount) / investment.amount : 0,
      // Dati previsti vs effettivi
      plannedReturn: investment.expectedReturn,
      plannedROI: investment.expectedReturn > 0 ? (investment.expectedReturn - investment.amount) / investment.amount : 0,
    };
    dispatch({ type: 'UPDATE_INVESTMENT', payload: updatedInvestment });
  };

  const deleteInvestment = (id: string) => {
    dispatch({ type: 'DELETE_INVESTMENT', payload: id });
  };

  const addRDProject = (project: Omit<RDProject, 'id'>) => {
    const newProject: RDProject = {
      ...project,
      id: Date.now().toString(),
      roi: project.expectedReturn > 0 ? (project.actualReturn - project.cost) / project.cost : 0,
      // Dati previsti vs effettivi
      plannedCost: project.cost,
      plannedReturn: project.expectedReturn,
      plannedProgress: project.progress,
      actualProgress: project.progress,
    };
    dispatch({ type: 'ADD_RD_PROJECT', payload: newProject });
  };

  const updateRDProject = (project: RDProject) => {
    const updatedProject: RDProject = {
      ...project,
      roi: project.expectedReturn > 0 ? (project.actualReturn - project.cost) / project.cost : 0,
      // Dati previsti vs effettivi
      plannedCost: project.cost,
      plannedReturn: project.expectedReturn,
      plannedProgress: project.progress,
      actualProgress: project.progress,
    };
    dispatch({ type: 'UPDATE_RD_PROJECT', payload: updatedProject });
  };

  const deleteRDProject = (id: string) => {
    dispatch({ type: 'DELETE_RD_PROJECT', payload: id });
  };

  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      cac: campaign.leads > 0 ? campaign.spent / campaign.leads : 0,
      ltv: campaign.conversions > 0 ? campaign.revenue / campaign.conversions : 0,
      ltvCacRatio: campaign.leads > 0 && campaign.spent > 0 ? 
        (campaign.revenue / campaign.conversions) / (campaign.spent / campaign.leads) : 0,
      // Dati previsti vs effettivi
      plannedLeads: campaign.leads,
      plannedConversions: campaign.conversions,
      plannedRevenue: campaign.revenue,
      actualLeads: campaign.leads,
      actualConversions: campaign.conversions,
    };
    dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
  };

  const updateCampaign = (campaign: Campaign) => {
    const updatedCampaign: Campaign = {
      ...campaign,
      cac: campaign.leads > 0 ? campaign.spent / campaign.leads : 0,
      ltv: campaign.conversions > 0 ? campaign.revenue / campaign.conversions : 0,
      ltvCacRatio: campaign.leads > 0 && campaign.spent > 0 ? 
        (campaign.revenue / campaign.conversions) / (campaign.spent / campaign.leads) : 0,
      // Dati previsti vs effettivi
      plannedLeads: campaign.leads,
      plannedConversions: campaign.conversions,
      plannedRevenue: campaign.revenue,
      actualLeads: campaign.leads,
      actualConversions: campaign.conversions,
    };
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });
  };

  const deleteCampaign = (id: string) => {
    dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      roi: lead.plannedValue > 0 ? (lead.actualValue - lead.plannedValue) / lead.plannedValue : 0,
      // Dati previsti vs effettivi
      plannedValue: lead.value,
      actualValue: lead.value,
    };
    dispatch({ type: 'ADD_LEAD', payload: newLead });
  };

  const updateLead = (lead: Lead) => {
    const updatedLead: Lead = {
      ...lead,
      roi: lead.plannedValue > 0 ? (lead.actualValue - lead.plannedValue) / lead.plannedValue : 0,
      // Dati previsti vs effettivi
      plannedValue: lead.value,
      actualValue: lead.value,
    };
    dispatch({ type: 'UPDATE_LEAD', payload: updatedLead });
  };

  const deleteLead = (id: string) => {
    dispatch({ type: 'DELETE_LEAD', payload: id });
  };

  // Funzioni per Task
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  // Funzioni per Appointment
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
  };

  const updateAppointment = (appointment: Appointment) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
  };

  const deleteAppointment = (id: string) => {
    dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
  };

  // Funzioni per WeeklyPlan
  const addWeeklyPlan = (plan: Omit<WeeklyPlan, 'id'>) => {
    const newPlan: WeeklyPlan = {
      ...plan,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_WEEKLY_PLAN', payload: newPlan });
  };

  const updateWeeklyPlan = (plan: WeeklyPlan) => {
    dispatch({ type: 'UPDATE_WEEKLY_PLAN', payload: plan });
  };

  const deleteWeeklyPlan = (id: string) => {
    dispatch({ type: 'DELETE_WEEKLY_PLAN', payload: id });
  };

  // Funzioni per TimeEntry
  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TIME_ENTRY', payload: newEntry });
  };

  const updateTimeEntry = (entry: TimeEntry) => {
    dispatch({ type: 'UPDATE_TIME_ENTRY', payload: entry });
  };

  const deleteTimeEntry = (id: string) => {
    dispatch({ type: 'DELETE_TIME_ENTRY', payload: id });
  };

  const addWebsiteAnalytics = (analytics: Omit<WebsiteAnalytics, 'id'>) => {
    const newAnalytics: WebsiteAnalytics = {
      ...analytics,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_WEBSITE_ANALYTICS', payload: newAnalytics });
  };

  const updateWebsiteAnalytics = (analytics: WebsiteAnalytics) => {
    dispatch({ type: 'UPDATE_WEBSITE_ANALYTICS', payload: analytics });
  };

  const deleteWebsiteAnalytics = (id: string) => {
    dispatch({ type: 'DELETE_WEBSITE_ANALYTICS', payload: id });
  };

  const addConversion = (conversion: Omit<Conversion, 'id'>) => {
    const newConversion: Conversion = {
      ...conversion,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONVERSION', payload: newConversion });
  };

  const updateConversion = (conversion: Conversion) => {
    dispatch({ type: 'UPDATE_CONVERSION', payload: conversion });
  };

  const deleteConversion = (id: string) => {
    dispatch({ type: 'DELETE_CONVERSION', payload: id });
  };

  const addShopOrder = (order: Omit<ShopOrder, 'id'>) => {
    const newOrder: ShopOrder = {
      ...order,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SHOP_ORDER', payload: newOrder });
  };

  const updateShopOrder = (order: ShopOrder) => {
    dispatch({ type: 'UPDATE_SHOP_ORDER', payload: order });
  };

  const deleteShopOrder = (id: string) => {
    dispatch({ type: 'DELETE_SHOP_ORDER', payload: id });
  };

  const addContactRequest = (request: Omit<ContactRequest, 'id'>) => {
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONTACT_REQUEST', payload: newRequest });
  };

  const updateContactRequest = (request: ContactRequest) => {
    dispatch({ type: 'UPDATE_CONTACT_REQUEST', payload: request });
  };

  const deleteContactRequest = (id: string) => {
    dispatch({ type: 'DELETE_CONTACT_REQUEST', payload: id });
  };

  // Le funzioni di sincronizzazione sono state rimosse
  // Ogni sezione gestisce il proprio salvataggio nelle tabelle specifiche

  const value: DashboardContextType = {
    state,
    dispatch,
    // Stato sincronizzazione
    isOnline,
    isLoading,
    // Utility functions
    addProject,
    updateProject,
    deleteProject,
    addService,
    updateService,
    deleteService,
    addBudget,
    updateBudget,
    deleteBudget,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addRDProject,
    updateRDProject,
    deleteRDProject,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addLead,
    updateLead,
    deleteLead,
    addTask,
    updateTask,
    deleteTask,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addWeeklyPlan,
    updateWeeklyPlan,
    deleteWeeklyPlan,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    addWebsiteAnalytics,
    updateWebsiteAnalytics,
    deleteWebsiteAnalytics,
    addConversion,
    updateConversion,
    deleteConversion,
    addShopOrder,
    updateShopOrder,
    deleteShopOrder,
    addContactRequest,
    updateContactRequest,
    deleteContactRequest,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
