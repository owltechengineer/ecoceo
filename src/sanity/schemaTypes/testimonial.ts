import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Informazioni Base',
      options: { collapsible: false, collapsed: false },
    },
    {
      name: 'content',
      title: 'Contenuto',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nome Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'designation',
      title: 'Ruolo/Posizione',
      type: 'string',
      description: 'Titolo di lavoro o ruolo del cliente (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'Immagine Cliente',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine profilo del cliente (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'content',
      title: 'Contenuto Testimonial',
      type: 'text',
      description: 'Testo della testimonianza',
      fieldset: 'content',
    }),
    defineField({
      name: 'star',
      title: 'Valutazione Stelle',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
      description: 'Valutazione da 1 a 5 stelle (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      description: 'Ordine in cui mostrare questa testimonianza (numeri più bassi prima)',
      initialValue: 0,
      fieldset: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'designation',
      media: 'image',
    },
  },
})
