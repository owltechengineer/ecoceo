import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: any) => {
  return builder.image(source)
}

export function getImageUrl(image: any): string {
  if (!image) return '/images/blog/blog-01.jpg'
  
  // If image is already a string, return it
  if (typeof image === 'string') {
    return image
  }
  
  // If image is an object with _type and _upload, it's a Sanity image
  if (image && typeof image === 'object' && image._type) {
    try {
      const url = urlFor(image).url()
      return url || '/images/blog/blog-01.jpg'
    } catch (error) {
      console.error('Error generating image URL:', error)
      return '/images/blog/blog-01.jpg'
    }
  }
  
  // If image has a url property, use it
  if (image && image.url) {
    return image.url
  }
  
  // If image has an asset property, try to use it
  if (image && image.asset) {
    try {
      const url = urlFor(image.asset).url()
      return url || '/images/blog/blog-01.jpg'
    } catch (error) {
      console.error('Error generating image URL from asset:', error)
      return '/images/blog/blog-01.jpg'
    }
  }
  
  // Fallback
  return '/images/blog/blog-01.jpg'
}

// Helper function to safely extract text from Sanity objects
export function getTextValue(value: any): string {
  if (!value) return ''
  
  // If it's already a string, return it
  if (typeof value === 'string') {
    return value
  }
  
  // If it's an object with a text property (like PortableText blocks)
  if (value && typeof value === 'object') {
    // Check for common text properties
    if (value.text) return value.text
    if (value.title) return value.title
    if (value.name) return value.name
    if (value.label) return value.label
    if (value.content) return value.content
    
    // If it's an array, try to extract text from the first item
    if (Array.isArray(value) && value.length > 0) {
      return getTextValue(value[0])
    }
    
    // If it has children (PortableText), try to extract text
    if (value.children && Array.isArray(value.children)) {
      const textParts = value.children
        .map((child: any) => getTextValue(child))
        .filter(Boolean)
      return textParts.join(' ')
    }
  }
  
  // Fallback: try to convert to string
  try {
    return String(value)
  } catch (error) {
    console.error('Error converting value to string:', error)
    return ''
  }
}
