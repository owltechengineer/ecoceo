import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Informazioni Base',
      options: { collapsible: false, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Feature',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'paragraph',
      title: 'Descrizione Feature',
      type: 'text',
      description: 'Descrizione della feature (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'icon',
      title: 'Icona Feature',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Icona per questa feature (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      description: 'Ordine in cui mostrare questa feature (numeri più bassi prima)',
      initialValue: 0,
      fieldset: 'basic',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
    },
  },
})
