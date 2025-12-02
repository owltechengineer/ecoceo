import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
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
      name: 'title',
      title: 'Nome del Servizio',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'name',
      title: 'Nome (per compatibilità)',
      type: 'string',
      description: 'Campo per compatibilità - compila solo se necessario, altrimenti usa il Nome del Servizio',
      fieldset: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Service Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Viene generato automaticamente dal nome del servizio (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      description: 'Descrizione breve del servizio',
      fieldset: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descrizione Breve (per compatibilità)',
      type: 'text',
      description: 'Campo per compatibilità - compila solo se necessario, altrimenti usa la Descrizione',
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
      name: 'image',
      title: 'Immagine del Servizio',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine per la card e la pagina del servizio (opzionale)',
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
      description: 'Crea sezioni personalizzate con testo e immagini. Sostituisce la descrizione completa.',
      fieldset: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title,
        media: media,
      }
    },
  },
})
