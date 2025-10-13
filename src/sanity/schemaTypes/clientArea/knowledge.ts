import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientKnowledge',
  title: 'Nozione Area Clienti',
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
      title: 'Descrizione Breve',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'content',
      title: 'Contenuto',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    }),
    defineField({
      name: 'markdownContent',
      title: 'Contenuto Markdown (Alternativo)',
      type: 'text',
      rows: 10
    }),
    defineField({
      name: 'useMarkdown',
      title: 'Usa Markdown',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'featuredImage',
      title: 'Immagine in Evidenza',
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
          { title: 'FAQ', value: 'faq' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Best Practice', value: 'best-practice' },
          { title: 'Troubleshooting', value: 'troubleshooting' },
          { title: 'Aggiornamenti', value: 'aggiornamenti' }
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
      name: 'difficulty',
      title: 'Livello di Difficoltà',
      type: 'string',
      options: {
        list: [
          { title: 'Principiante', value: 'beginner' },
          { title: 'Intermedio', value: 'intermediate' },
          { title: 'Avanzato', value: 'advanced' }
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Tempo di Lettura Stimato (minuti)',
      type: 'number'
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
      media: 'featuredImage',
      subtitle: 'categories.0'
    }
  }
})
