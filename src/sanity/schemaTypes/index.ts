import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import blockContent from './blockContent'
import feature from './feature'
import testimonial from './testimonial'
import hero from './hero'
import about from './about'
import contact from './contact'
import service from './service'
import project from './project'
import product from './product'
import siteSettings from './siteSettings'
import clientVideo from './clientArea/video'
import clientDocument from './clientArea/document'
import clientKnowledge from './clientArea/knowledge'
import clientPromotion from './clientArea/promotion'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post, 
    blockContent, 
    feature, 
    testimonial, 
    hero, 
    about, 
    contact, 
    service, 
    project, 
    product, 
    siteSettings,
    clientVideo,
    clientDocument,
    clientKnowledge,
    clientPromotion
  ],
}
