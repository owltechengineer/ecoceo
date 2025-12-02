import { groq } from 'next-sanity'

// Query to get all posts with specified fields, ordered by publishedAt descending
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body,
    categories
  }
`

// Query to get a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body
  }
`

// Query to get posts with author and categories
export const postsWithAuthorAndCategoriesQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body,
    author,
    categories
  }
`



// Query to get all features ordered by display order
export const featuresQuery = groq`
  *[_type == "feature"] | order(order asc) {
    _id,
    title,
    paragraph,
    icon
  }
`

// Query to get all testimonials ordered by display order
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    designation,
    image,
    content,
    star
  }
`



// Query to get all active services
export const servicesQuery = groq`
  *[_type == "service"] | order(title asc) {
    _id,
    title,
    name,
    slug,
    description,
    shortDescription,
    image
  }
`

// Query to get services for navbar dropdown
export const navbarServicesQuery = groq`
  *[_type == "service"] | order(title asc) {
    _id,
    name,
    slug,
    shortDescription
  }
`

// Query to get services for homepage
export const homepageServicesQuery = groq`
  *[_type == "service"] | order(title asc) {
    _id,
    title,
    name,
    slug,
    description,
    shortDescription,
    image
  }
`

// Query to get a single service by slug
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    name,
    slug,
    description,
    shortDescription,
    fullDescription,
    sections[]{
      title,
      content,
      layout,
      images[]{
        ...,
        asset->{
          _id,
          url
        }
      }
    },
    image
  }
`

// Query to get the active hero section
export const heroQuery = groq`
  *[_type == "hero" && isActive == true][0] {
    _id,
    title,
    paragraph,
    primaryButton,
    secondaryButton,
    backgroundVideo {
      asset-> {
        _id,
        url,
        mimeType,
        size
      }
    },
    backgroundImage,
    heroImage
  }
`

// Query to get the active about section
export const aboutQuery = groq`
  *[_type == "about" && isActive == true][0] {
    _id,
    title,
    subtitle,
    description,
    image,
    features,
    stats
  }
`



// Query to get the active contact section
export const contactQuery = groq`
  *[_type == "contact" && isActive == true][0] {
    _id,
    title,
    subtitle,
    description,
    contactInfo,
    socialLinks,
    newsletter
  }
`

// Query to get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    logo,
    logoDark,
    favicon,
    typography,
    contactInfo,
    socialLinks,
    footer,
    legal
  }
`



// Query to get all active projects
export const projectsQuery = groq`
  *[_type == "project"] | order(name asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      name,
      slug
    }
  }
`

// Query to get projects by service slug
export const projectsByServiceQuery = groq`
  *[_type == "project" && service->slug.current == $serviceSlug] | order(name asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      name,
      slug
    }
  }
`

// Query to get featured projects
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(name asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    service->{
      _id,
      name,
      slug
    }
  }
`

// Query to get a single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    title,
    slug,
    description,
    shortDescription,
    fullDescription,
    descriptionSections,
    sections[]{
      title,
      content,
      layout,
      images[]{
        ...,
        asset->{
          _id,
          url
        }
      }
    },
    mainImage,
    gallery,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      name,
      slug,
      shortDescription
    }
  }
`

// Query to get all active products ordered by order
export const productsQuery = groq`
  *[_type == "product" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    price,
    comparePrice,
    stock,
    featured,
    category
  }
`



// Query to get featured products
export const featuredProductsQuery = groq`
  *[_type == "product" && isActive == true && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    price,
    comparePrice,
    stock,
    category
  }
`

// Query to get a single product by slug
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    shortDescription,
    fullDescription,
    mainImage,
    gallery,
    price,
    comparePrice,
    sku,
    stock,
    weight,
    dimensions,
    features,
    tags,
    featured,
    category
  }
`

// ===== DASHBOARD QUERIES =====

// Query to get all services for dashboard with financial data
export const dashboardServicesQuery = groq`
  *[_type == "service" && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    shortDescription,
    icon,
    order,
    isActive,
    // Campi per dati finanziari (da aggiungere allo schema se necessario)
    "price": coalesce(price, 0),
    "cost": coalesce(cost, 0),
    "hoursSold": coalesce(hoursSold, 0),
    "revenue": coalesce(revenue, 0),
    "margin": coalesce(margin, 0)
  }
`

// Query to get all projects for dashboard with financial data
export const dashboardProjectsQuery = groq`
  *[_type == "project" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    client,
    completionDate,
    technologies,
    featured,
    service->{
      _id,
      name,
      slug
    },
    // Campi per dati finanziari (da aggiungere allo schema se necessario)
    "budget": coalesce(budget, 0),
    "actualCost": coalesce(actualCost, 0),
    "expectedRevenue": coalesce(expectedRevenue, 0),
    "progress": coalesce(progress, 0),
    "status": coalesce(status, "active"),
    "startDate": coalesce(startDate, completionDate),
    "endDate": coalesce(endDate, completionDate)
  }
`

// Query to get projects by service for dashboard
export const dashboardProjectsByServiceQuery = groq`
  *[_type == "project" && isActive == true && service->slug.current == $serviceSlug] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    client,
    completionDate,
    technologies,
    featured,
    service->{
      _id,
      name,
      slug
    },
    "budget": coalesce(budget, 0),
    "actualCost": coalesce(actualCost, 0),
    "expectedRevenue": coalesce(expectedRevenue, 0),
    "progress": coalesce(progress, 0),
    "status": coalesce(status, "active"),
    "startDate": coalesce(startDate, completionDate),
    "endDate": coalesce(endDate, completionDate)
  }
`

// Query to get dashboard statistics
export const dashboardStatsQuery = groq`
  {
    "totalServices": count(*[_type == "service" && isActive == true]),
    "totalProjects": count(*[_type == "project" && isActive == true]),
    "activeProjects": count(*[_type == "project" && isActive == true && status == "active"]),
    "completedProjects": count(*[_type == "project" && isActive == true && status == "completed"]),
    "projects": *[_type == "project" && isActive == true] {
      expectedRevenue,
      actualCost,
      budget
    }
  }
`


