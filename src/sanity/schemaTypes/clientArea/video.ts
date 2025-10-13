import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientVideo',
  title: 'Video Area Clienti',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'videoType',
      title: 'Tipo Video',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'File Locale', value: 'file' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL Video (YouTube/Vimeo)',
      type: 'url',
      hidden: ({ parent }) => parent?.videoType !== 'youtube' && parent?.videoType !== 'vimeo'
    }),
    defineField({
      name: 'videoFile',
      title: 'File Video',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.videoType !== 'file'
    }),
    defineField({
      name: 'thumbnail',
      title: 'Anteprima',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Presentazione', value: 'presentazione' },
          { title: 'Demo', value: 'demo' },
          { title: 'Formazione', value: 'formazione' }
        ]
      }
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Ordine di Visualizzazione',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      subtitle: 'videoType'
    }
  }
})
