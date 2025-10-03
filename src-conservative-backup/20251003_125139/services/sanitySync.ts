import { client } from '@/sanity/lib/client';
import { 
  dashboardServicesQuery, 
  dashboardProjectsQuery, 
  dashboardStatsQuery 
} from '@/sanity/lib/queries';
import { 
  Project as SanityProject, 
  Service as SanityService 
} from '@/contexts/DashboardContext';

// Tipi per i dati di Sanity
export interface SanityServiceData {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  icon?: string;
  order: number;
  isActive: boolean;
  price: number;
  cost: number;
  hoursSold: number;
  revenue: number;
  margin: number;
}

export interface SanityProjectData {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  client?: string;
  completionDate?: string;
  technologies?: string[];
  featured: boolean;
  service?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  budget: number;
  actualCost: number;
  expectedRevenue: number;
  progress: number;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalServices: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  totalCost: number;
  totalBudget: number;
}

// Funzione per convertire i dati di Sanity nel formato della dashboard
export function convertSanityServiceToDashboard(sanityService: SanityServiceData): SanityService {
  return {
    id: sanityService._id,
    name: sanityService.name,
    price: sanityService.price || 0,
    cost: sanityService.cost || 0,
    margin: sanityService.margin || 0,
    hoursSold: sanityService.hoursSold || 0,
    revenue: sanityService.revenue || 0,
    variance: 0,
    plannedHours: sanityService.hoursSold || 0,
    plannedRevenue: sanityService.revenue || 0,
    actualHours: sanityService.hoursSold || 0,
  };
}

export function convertSanityProjectToDashboard(sanityProject: SanityProjectData): SanityProject {
  return {
    id: sanityProject._id,
    name: sanityProject.title,
    client: sanityProject.client || 'Cliente non specificato',
    startDate: sanityProject.startDate || sanityProject.completionDate || new Date().toISOString().split('T')[0],
    endDate: sanityProject.endDate || sanityProject.completionDate || new Date().toISOString().split('T')[0],
    budget: sanityProject.budget || 0,
    actualCost: sanityProject.actualCost || 0,
    expectedRevenue: sanityProject.expectedRevenue || 0,
    actualRevenue: sanityProject.expectedRevenue || 0,
    status: sanityProject.status as 'active' | 'completed' | 'on-hold' | 'cancelled' || 'active',
    progress: sanityProject.progress || 0,
    roi: 0, // Sarà calcolato automaticamente dal context
    margin: 0,
    variance: 0,
    plannedCost: sanityProject.budget || 0,
    plannedRevenue: sanityProject.expectedRevenue || 0,
    plannedProgress: sanityProject.progress || 0,
  };
}

// Funzione per recuperare tutti i servizi da Sanity
export async function fetchSanityServices(): Promise<SanityService[]> {
  try {
    const sanityServices = await client.fetch<SanityServiceData[]>(dashboardServicesQuery);
    return sanityServices.map(convertSanityServiceToDashboard);
  } catch (error) {
    console.error('Errore nel recupero dei servizi da Sanity:', error);
    return [];
  }
}

// Funzione per recuperare tutti i progetti da Sanity
export async function fetchSanityProjects(): Promise<SanityProject[]> {
  try {
    const sanityProjects = await client.fetch<SanityProjectData[]>(dashboardProjectsQuery);
    return sanityProjects.map(convertSanityProjectToDashboard);
  } catch (error) {
    console.error('Errore nel recupero dei progetti da Sanity:', error);
    return [];
  }
}

// Funzione per recuperare le statistiche della dashboard
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const rawStats = await client.fetch(dashboardStatsQuery);
    
    // Calcola le somme lato client
    const totalRevenue = rawStats.projects?.reduce((sum: number, project: any) => 
      sum + (project.expectedRevenue || 0), 0) || 0;
    const totalCost = rawStats.projects?.reduce((sum: number, project: any) => 
      sum + (project.actualCost || 0), 0) || 0;
    const totalBudget = rawStats.projects?.reduce((sum: number, project: any) => 
      sum + (project.budget || 0), 0) || 0;

    return {
      totalServices: rawStats.totalServices || 0,
      totalProjects: rawStats.totalProjects || 0,
      activeProjects: rawStats.activeProjects || 0,
      completedProjects: rawStats.completedProjects || 0,
      totalRevenue,
      totalCost,
      totalBudget,
    };
  } catch (error) {
    console.error('Errore nel recupero delle statistiche da Sanity:', error);
    return {
      totalServices: 0,
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalBudget: 0,
    };
  }
}

// Funzione per sincronizzare tutti i dati di Sanity con la dashboard
export async function syncSanityData() {
  try {
    const [services, projects, stats] = await Promise.all([
      fetchSanityServices(),
      fetchSanityProjects(),
      fetchDashboardStats(),
    ]);

    return {
      services,
      projects,
      stats,
    };
  } catch (error) {
    console.error('Errore nella sincronizzazione dei dati di Sanity:', error);
    return {
      services: [],
      projects: [],
      stats: {
        totalServices: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalBudget: 0,
      },
    };
  }
}
