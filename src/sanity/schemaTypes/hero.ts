import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Contenuto Base',
      options: { collapsible: false, collapsed: false },
    },
    {
      name: 'buttons',
      title: 'Pulsanti',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'images',
      title: 'Immagini',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Hero',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'paragraph',
      title: 'Descrizione Hero',
      type: 'text',
      description: 'Testo descrittivo principale (opzionale)',
      fieldset: 'basic',
    }),
    defineField({
      name: 'primaryButton',
      title: 'Pulsante Principale',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Testo del Pulsante',
          type: 'string',
          description: 'Testo da mostrare sul pulsante',
        },
        {
          name: 'url',
          title: 'URL del Pulsante',
          type: 'url',
          description: 'Link di destinazione',
        },
      ],
      fieldset: 'buttons',
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Pulsante Secondario',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Testo del Pulsante',
          type: 'string',
          description: 'Testo da mostrare sul pulsante',
        },
        {
          name: 'url',
          title: 'URL del Pulsante',
          type: 'url',
          description: 'Link di destinazione',
        },
      ],
      fieldset: 'buttons',
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Video di Sfondo',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Video di sfondo per la sezione hero (opzionale, ha priorità sull\'immagine)',
      fieldset: 'images',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Immagine di Sfondo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine di sfondo per la sezione hero (opzionale, usata se non c\'è video)',
      fieldset: 'images',
    }),
    defineField({
      name: 'heroImage',
      title: 'Immagine Hero',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine principale mostrata nella colonna destra (opzionale)',
      fieldset: 'images',
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      description: 'Mostra questa sezione hero sul sito',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'paragraph',
      media: 'heroImage',
    },
  },
})
