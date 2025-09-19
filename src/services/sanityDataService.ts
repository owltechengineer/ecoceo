import { client } from '@/sanity/lib/client';

export interface SanityProject {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  startDate: string;
  endDate: string;
  plannedBudget?: number;
  actualBudget?: number;
  team?: string[];
  technologies?: string[];
  notes?: string;
  assignedServices?: string[];
  isPublic?: boolean;
}

export interface SanityService {
  _id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  category?: 'development' | 'design' | 'marketing' | 'consulting' | 'support';
  price?: number;
  priceType?: 'hour' | 'day' | 'project' | 'month';
  duration?: string;
  deliverables?: string;
  availability?: string;
  plannedRevenue?: number;
  actualRevenue?: number;
  cost?: number;
  features?: string[];
  technologies?: string[];
  requirements?: string[];
  notes?: string;
  isPublic?: boolean;
}

class SanityDataService {
  private static instance: SanityDataService;

  private constructor() {}

  static getInstance(): SanityDataService {
    if (!SanityDataService.instance) {
      SanityDataService.instance = new SanityDataService();
    }
    return SanityDataService.instance;
  }

  // Carica tutti i progetti da Sanity
  async getProjects(includePrivate: boolean = false): Promise<SanityProject[]> {
    try {
      const query = `
        *[_type == "project" ${!includePrivate ? '&& isPublic == true' : ''}] {
          _id,
          name,
          description,
          status,
          priority,
          progress,
          startDate,
          endDate,
          plannedBudget,
          actualBudget,
          team,
          technologies,
          notes,
          assignedServices[]->{_id, title},
          isPublic
        } | order(name asc)
      `;

      const projects = await client.fetch(query);
      
      // Verifica se i progetti sono validi
      if (!projects || !Array.isArray(projects)) {
        console.warn('Sanity ha restituito dati non validi per i progetti');
        return [];
      }
      
      // Trasforma i dati per compatibilità con il frontend
      return projects.map((project: any) => ({
        ...project,
        id: project._id,
        assignedServices: project.assignedServices?.map((service: any) => service._id) || []
      }));
    } catch (error) {
      console.error('Errore nel caricamento progetti da Sanity:', error);
      console.error('Dettagli errore:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return [];
    }
  }

  // Carica tutti i servizi da Sanity
  async getServices(includePrivate: boolean = false): Promise<SanityService[]> {
    try {
      const query = `
        *[_type == "service" ${!includePrivate ? '&& isPublic == true' : ''}] {
          _id,
          title,
          description,
          status,
          category,
          price,
          priceType,
          duration,
          deliverables,
          availability,
          plannedRevenue,
          actualRevenue,
          cost,
          features,
          technologies,
          requirements,
          notes,
          isPublic
        } | order(title asc)
      `;

      const services = await client.fetch(query);
      
      // Verifica se i servizi sono validi
      if (!services || !Array.isArray(services)) {
        console.warn('Sanity ha restituito dati non validi per i servizi');
        return [];
      }
      
      // Trasforma i dati per compatibilità con il frontend
      return services.map((service: any) => ({
        ...service,
        id: service._id
      }));
    } catch (error) {
      console.error('Errore nel caricamento servizi da Sanity:', error);
      return [];
    }
  }

  // Carica un singolo progetto
  async getProject(id: string): Promise<SanityProject | null> {
    try {
      const query = `
        *[_type == "project" && _id == $id][0] {
          _id,
          name,
          description,
          status,
          priority,
          progress,
          startDate,
          endDate,
          plannedBudget,
          actualBudget,
          team,
          technologies,
          notes,
          assignedServices[]->{_id, title},
          isPublic
        }
      `;

      const project = await client.fetch(query, { id });
      
      if (!project) return null;

      return {
        ...project,
        id: project._id,
        assignedServices: project.assignedServices?.map((service: any) => service._id) || []
      };
    } catch (error) {
      console.error('Errore nel caricamento progetto da Sanity:', error);
      return null;
    }
  }

  // Carica un singolo servizio
  async getService(id: string): Promise<SanityService | null> {
    try {
      const query = `
        *[_type == "service" && _id == $id][0] {
          _id,
          title,
          description,
          status,
          category,
          price,
          priceType,
          duration,
          deliverables,
          availability,
          plannedRevenue,
          actualRevenue,
          cost,
          features,
          technologies,
          requirements,
          notes,
          isPublic
        }
      `;

      const service = await client.fetch(query, { id });
      
      if (!service) return null;

      return {
        ...service,
        id: service._id
      };
    } catch (error) {
      console.error('Errore nel caricamento servizio da Sanity:', error);
      return null;
    }
  }

  // Carica progetti e servizi insieme
  async getProjectsAndServices(includePrivate: boolean = false): Promise<{
    projects: SanityProject[];
    services: SanityService[];
  }> {
    try {
      const [projects, services] = await Promise.all([
        this.getProjects(includePrivate),
        this.getServices(includePrivate)
      ]);

      return { projects, services };
    } catch (error) {
      console.error('Errore nel caricamento dati da Sanity:', error);
      return { projects: [], services: [] };
    }
  }

  // Aggiorna un progetto
  async updateProject(id: string, updates: Partial<SanityProject>): Promise<boolean> {
    try {
      const updateData = updates;
      
      await client
        .patch(id)
        .set(updateData)
        .commit();

      return true;
    } catch (error) {
      console.error('Errore nell\'aggiornamento progetto su Sanity:', error);
      return false;
    }
  }

  // Aggiorna un servizio
  async updateService(id: string, updates: Partial<SanityService>): Promise<boolean> {
    try {
      const updateData = updates;
      
      await client
        .patch(id)
        .set(updateData)
        .commit();

      return true;
    } catch (error) {
      console.error('Errore nell\'aggiornamento servizio su Sanity:', error);
      return false;
    }
  }

  // Crea un nuovo progetto
  async createProject(project: Omit<SanityProject, '_id' | 'id'>): Promise<string | null> {
    try {
      const doc = await client.create({
        _type: 'project',
        ...project
      });

      return doc._id;
    } catch (error) {
      console.error('Errore nella creazione progetto su Sanity:', error);
      return null;
    }
  }

  // Crea un nuovo servizio
  async createService(service: Omit<SanityService, '_id' | 'id'>): Promise<string | null> {
    try {
      const doc = await client.create({
        _type: 'service',
        ...service
      });

      return doc._id;
    } catch (error) {
      console.error('Errore nella creazione servizio su Sanity:', error);
      return null;
    }
  }

  // Elimina un progetto
  async deleteProject(id: string): Promise<boolean> {
    try {
      await client.delete(id);
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione progetto su Sanity:', error);
      return false;
    }
  }

  // Elimina un servizio
  async deleteService(id: string): Promise<boolean> {
    try {
      await client.delete(id);
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione servizio su Sanity:', error);
      return false;
    }
  }
}

export const sanityDataService = SanityDataService.getInstance();

