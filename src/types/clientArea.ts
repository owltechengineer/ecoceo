// Tipi TypeScript per l'Area Clienti

export interface ClientVideo {
  _id: string;
  title: string;
  description?: string;
  videoType: 'youtube' | 'vimeo' | 'file';
  videoUrl?: string;
  videoFile?: {
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
    };
  };
  thumbnail?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  categories?: string[];
  tags?: string[];
  order: number;
  _createdAt: string;
  _updatedAt?: string;
}

export interface ClientDocument {
  _id: string;
  title: string;
  description?: string;
  file: {
    asset: {
      _id: string;
      url: string;
      originalFilename: string;
      size?: number;
    };
  };
  fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'image' | 'other';
  fileSize?: number;
  previewImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  categories?: string[];
  tags?: string[];
  order: number;
  downloadCount: number;
  _createdAt: string;
  _updatedAt?: string;
}

export interface ClientKnowledge {
  _id: string;
  title: string;
  description?: string;
  content?: any[]; // Sanity block content
  markdownContent?: string;
  useMarkdown: boolean;
  featuredImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  categories?: string[];
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
  order: number;
  _createdAt: string;
  _updatedAt?: string;
}

export interface ClientPromotion {
  _id: string;
  title: string;
  description?: string;
  content?: any[]; // Sanity block content
  image: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  discountAmount?: number;
  promoCode?: string;
  targetAudience?: string[];
  categories?: string[];
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  ctaText?: string;
  ctaUrl?: string;
  _createdAt: string;
}

export interface ClientAreaStats {
  totalVideos: number;
  totalDocuments: number;
  totalKnowledge: number;
  activePromotions: number;
  featuredPromotions: number;
}

export interface ClientAreaTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export interface ClientAreaFilters {
  category?: string;
  search?: string;
  difficulty?: string;
  sortBy?: string;
}
