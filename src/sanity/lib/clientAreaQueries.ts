// GROQ queries per l'Area Clienti

// Query per tutti i video
export const clientVideosQuery = `
  *[_type == "clientVideo" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    videoType,
    videoUrl,
    videoFile {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    thumbnail {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query per video per categoria
export const clientVideosByCategoryQuery = (category: string) => `
  *[_type == "clientVideo" && isActive == true && "${category}" in categories] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    videoType,
    videoUrl,
    videoFile {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    thumbnail {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    order,
    _createdAt
  }
`;

// Query per tutti i documenti
export const clientDocumentsQuery = `
  *[_type == "clientDocument" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    file {
      asset->{
        _id,
        url,
        originalFilename,
        size
      }
    },
    fileType,
    fileSize,
    previewImage {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    order,
    downloadCount,
    _createdAt,
    _updatedAt
  }
`;

// Query per documenti per categoria
export const clientDocumentsByCategoryQuery = (category: string) => `
  *[_type == "clientDocument" && isActive == true && "${category}" in categories] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    file {
      asset->{
        _id,
        url,
        originalFilename,
        size
      }
    },
    fileType,
    fileSize,
    previewImage {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    order,
    downloadCount,
    _createdAt
  }
`;

// Query per tutte le nozioni
export const clientKnowledgeQuery = `
  *[_type == "clientKnowledge" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    content,
    markdownContent,
    useMarkdown,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    difficulty,
    estimatedReadTime,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Query per nozioni per categoria
export const clientKnowledgeByCategoryQuery = (category: string) => `
  *[_type == "clientKnowledge" && isActive == true && "${category}" in categories] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    content,
    markdownContent,
    useMarkdown,
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    },
    categories,
    tags,
    difficulty,
    estimatedReadTime,
    order,
    _createdAt
  }
`;

// Query per tutte le promozioni attive
export const clientPromotionsQuery = `
  *[_type == "clientPromotion" && isActive == true && endDate > now()] | order(isFeatured desc, endDate asc) {
    _id,
    title,
    description,
    content,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    startDate,
    endDate,
    discountPercentage,
    discountAmount,
    promoCode,
    targetAudience,
    categories,
    tags,
    isFeatured,
    order,
    ctaText,
    ctaUrl,
    _createdAt
  }
`;

// Query per promozioni in evidenza
export const featuredPromotionsQuery = `
  *[_type == "clientPromotion" && isActive == true && isFeatured == true && endDate > now()] | order(endDate asc) {
    _id,
    title,
    description,
    content,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    startDate,
    endDate,
    discountPercentage,
    discountAmount,
    promoCode,
    targetAudience,
    categories,
    tags,
    ctaText,
    ctaUrl,
    _createdAt
  }
`;

// Query per promozioni per categoria
export const clientPromotionsByCategoryQuery = (category: string) => `
  *[_type == "clientPromotion" && isActive == true && endDate > now() && "${category}" in categories] | order(isFeatured desc, endDate asc) {
    _id,
    title,
    description,
    content,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    startDate,
    endDate,
    discountPercentage,
    discountAmount,
    promoCode,
    targetAudience,
    categories,
    tags,
    isFeatured,
    order,
    ctaText,
    ctaUrl,
    _createdAt
  }
`;

// Query per statistiche generali
export const clientAreaStatsQuery = `
  {
    "totalVideos": count(*[_type == "clientVideo" && isActive == true]),
    "totalDocuments": count(*[_type == "clientDocument" && isActive == true]),
    "totalKnowledge": count(*[_type == "clientKnowledge" && isActive == true]),
    "activePromotions": count(*[_type == "clientPromotion" && isActive == true && endDate > now()]),
    "featuredPromotions": count(*[_type == "clientPromotion" && isActive == true && isFeatured == true && endDate > now()])
  }
`;
