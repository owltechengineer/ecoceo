import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Contenuto Base',
      options: { collapsible: false, collapsed: false },
    },
    {
      name: 'content',
      title: 'Contenuto Aggiuntivo',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Sezione',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sottotitolo',
      type: 'string',
      description: 'Sottotitolo opzionale',
      fieldset: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      description: 'Descrizione principale della sezione (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'image',
      title: 'Immagine About',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine per la sezione about (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'features',
      title: 'Lista Caratteristiche',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titolo Caratteristica',
              type: 'string',
              description: 'Titolo della caratteristica',
            },
            {
              name: 'description',
              title: 'Descrizione',
              type: 'text',
              description: 'Descrizione della caratteristica (opzionale)',
            },
            {
              name: 'icon',
              title: 'Icona',
              type: 'string',
              description: 'Nome icona o emoji (opzionale)',
            },
          ],
        },
      ],
      description: 'Lista delle caratteristiche da mostrare (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'stats',
      title: 'Statistiche',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'number',
              title: 'Numero',
              type: 'string',
              description: 'Numero da mostrare (es. "100+", "50")',
            },
            {
              name: 'label',
              title: 'Etichetta',
              type: 'string',
              description: 'Etichetta descrittiva (es. "Clienti", "Progetti")',
            },
          ],
        },
      ],
      description: 'Statistiche da mostrare (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      description: 'Mostra questa sezione about sul sito',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
  },
})
