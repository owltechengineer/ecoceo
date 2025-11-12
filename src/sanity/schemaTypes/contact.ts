import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Section',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Contenuto Base',
      options: { collapsible: false, collapsed: false },
    },
    {
      name: 'contact',
      title: 'Informazioni di Contatto',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'social',
      title: 'Social Media',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'newsletter',
      title: 'Newsletter',
      options: { collapsible: true, collapsed: true },
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
      name: 'contactInfo',
      title: 'Informazioni di Contatto',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Indirizzo',
          type: 'text',
          description: 'Indirizzo completo (opzionale)',
        },
        {
          name: 'phone',
          title: 'Numero di Telefono',
          type: 'string',
          description: 'Numero di telefono (opzionale)',
        },
        {
          name: 'email',
          title: 'Indirizzo Email',
          type: 'email',
          description: 'Indirizzo email (opzionale)',
        },
      ],
      fieldset: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Link Social Media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Nome Piattaforma',
              type: 'string',
              description: 'Nome della piattaforma social (es. Facebook, Instagram)',
            },
            {
              name: 'url',
              title: 'URL Profilo',
              type: 'url',
              description: 'Link al profilo social',
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
      description: 'Lista dei link ai social media (opzionale)',
      fieldset: 'social',
    }),
    defineField({
      name: 'newsletter',
      title: 'Impostazioni Newsletter',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titolo Newsletter',
          type: 'string',
          description: 'Titolo per la sezione newsletter (opzionale)',
        },
        {
          name: 'description',
          title: 'Descrizione Newsletter',
          type: 'text',
          description: 'Descrizione per la sezione newsletter (opzionale)',
        },
        {
          name: 'placeholder',
          title: 'Placeholder Email',
          type: 'string',
          description: 'Testo placeholder per il campo email (opzionale)',
        },
        {
          name: 'buttonText',
          title: 'Testo Pulsante Iscrizione',
          type: 'string',
          description: 'Testo del pulsante di iscrizione (opzionale)',
        },
      ],
      fieldset: 'newsletter',
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      description: 'Mostra questa sezione contatti sul sito',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})
