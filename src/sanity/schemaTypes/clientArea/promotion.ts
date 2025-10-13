import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientPromotion',
  title: 'Promozione Area Clienti',
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
      name: 'content',
      title: 'Contenuto Dettagliato',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
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
        }
      ]
    }),
    defineField({
      name: 'image',
      title: 'Immagine/Flyer',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'startDate',
      title: 'Data di Inizio',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'endDate',
      title: 'Data di Scadenza',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Percentuale di Sconto',
      type: 'number',
      validation: Rule => Rule.min(0).max(100)
    }),
    defineField({
      name: 'discountAmount',
      title: 'Importo Sconto (€)',
      type: 'number',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'promoCode',
      title: 'Codice Promozionale',
      type: 'string'
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tutti i Clienti', value: 'all' },
          { title: 'Clienti Premium', value: 'premium' },
          { title: 'Nuovi Clienti', value: 'new' },
          { title: 'Clienti Fidelizzati', value: 'loyal' }
        ]
      }
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sconto', value: 'sconto' },
          { title: 'Offerta Speciale', value: 'offerta-speciale' },
          { title: 'Pacchetto', value: 'pacchetto' },
          { title: 'Servizio Gratuito', value: 'servizio-gratuito' },
          { title: 'Upgrade', value: 'upgrade' }
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
      name: 'isFeatured',
      title: 'In Evidenza',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'ctaText',
      title: 'Testo CTA',
      type: 'string',
      initialValue: 'Scopri di più'
    }),
    defineField({
      name: 'ctaUrl',
      title: 'URL CTA',
      type: 'url'
    })
  ],
  orderings: [
    {
      title: 'In Evidenza e Data',
      name: 'featuredAndDate',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'endDate', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'endDate'
    },
    prepare(selection) {
      const { title, media, subtitle } = selection
      const endDate = new Date(subtitle).toLocaleDateString('it-IT')
      return {
        title,
        media,
        subtitle: `Scade il ${endDate}`
      }
    }
  }
})
