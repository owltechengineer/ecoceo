import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Progetti',
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
      title: 'Nome del Progetto',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'title',
      title: 'Titolo (per compatibilità)',
      type: 'string',
      description: 'Campo per compatibilità - compila solo se necessario',
      fieldset: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 3,
      description: 'Descrizione breve del progetto',
      fieldset: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descrizione Breve (per compatibilità)',
      type: 'text',
      description: 'Campo per compatibilità - compila solo se necessario',
      fieldset: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine Principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine principale del progetto (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descrizione Completa (Legacy)',
      type: 'blockContent',
      description: 'Campo legacy - usa le Sezioni Contenuto invece',
      fieldset: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Sezioni Contenuto',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titolo Sezione',
              type: 'string',
              description: 'Titolo della sezione (opzionale)',
            },
            {
              name: 'content',
              title: 'Contenuto Testuale',
              type: 'blockContent',
              description: 'Contenuto testuale formattato della sezione',
            },
            {
              name: 'images',
              title: 'Immagini',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      title: 'Testo Alternativo',
                      type: 'string',
                      description: 'Descrizione dell\'immagine per accessibilità',
                    },
                    {
                      name: 'caption',
                      title: 'Didascalia',
                      type: 'string',
                      description: 'Didascalia opzionale per l\'immagine',
                    },
                  ],
                },
              ],
              description: 'Immagini da mostrare in questa sezione',
            },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Testo e Immagini Separate', value: 'separate' },
                  { title: 'Testo sopra, Immagini sotto', value: 'text-top' },
                  { title: 'Immagini sopra, Testo sotto', value: 'images-top' },
                  { title: 'Solo Testo', value: 'text-only' },
                  { title: 'Solo Immagini', value: 'images-only' },
                ],
              },
              initialValue: 'separate',
              description: 'Come disporre testo e immagini nella sezione',
            },
          ],
          preview: {
            select: {
              title: 'title',
              hasContent: 'content',
              imagesCount: 'images',
            },
            prepare({ title, hasContent, imagesCount }) {
              const contentText = hasContent ? '📝' : '';
              const imagesText = imagesCount && imagesCount.length > 0 ? `🖼️ ${imagesCount.length}` : '';
              return {
                title: title || 'Sezione senza titolo',
                subtitle: [contentText, imagesText].filter(Boolean).join(' ') || 'Vuota',
              }
            },
          },
        },
      ],
      description: 'Crea sezioni personalizzate con testo e immagini. Sostituisce la descrizione completa e la galleria.',
      fieldset: 'content',
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      description: 'Nome del cliente (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'completionDate',
      title: 'Data di Completamento',
      type: 'date',
      description: 'Data di completamento del progetto (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'technologies',
      title: 'Tecnologie Utilizzate',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista delle tecnologie utilizzate (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'projectUrl',
      title: 'URL del Progetto',
      type: 'url',
      description: 'Link al progetto live (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'githubUrl',
      title: 'URL GitHub',
      type: 'url',
      description: 'Link al repository GitHub (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'service',
      title: 'Servizio Associato',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Servizio associato a questo progetto (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'assignedServices',
      title: 'Servizi Assegnati',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      description: 'Servizi assegnati a questo progetto (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      description: 'Ordine in cui appare il progetto (numeri più bassi prima)',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Progetto in Evidenza',
      type: 'boolean',
      description: 'Mostra questo progetto come progetto in evidenza',
      initialValue: false,
    }),
    defineField({
      name: 'isPublic',
      title: 'Pubblico',
      type: 'boolean',
      description: 'Se il progetto è visibile pubblicamente',
      initialValue: true,
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description: 'Titolo SEO per la pagina del progetto (opzionale)',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      description: 'Descrizione SEO per la pagina del progetto (opzionale)',
    }),
    defineField({
      name: 'status',
      title: 'Stato del Progetto',
      type: 'string',
      options: {
        list: [
          { title: 'Attivo', value: 'active' },
          { title: 'Completato', value: 'completed' },
          { title: 'In Pausa', value: 'on-hold' },
          { title: 'Cancellato', value: 'cancelled' },
        ],
      },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      status: 'status',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, status, media } = selection
      return {
        title: title,
        subtitle: status || 'N/A',
        media: media,
      }
    },
  },
})
