export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  shortDescription: string;
  fullDescription?: any[];
  mainImage: {
    asset: {
      _ref: string;
    };
  };
  gallery?: Array<{
    asset: {
      _ref: string;
    };
  }>;
  client?: string;
  completionDate?: string;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  isActive: boolean;
  order: number;
  service: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    shortDescription?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
}

export interface ProjectGridProps {
  projects?: Project[];
  title?: string;
  subtitle?: string;
}
