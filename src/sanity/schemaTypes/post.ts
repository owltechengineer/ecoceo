import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
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
    {
      name: 'metadata',
      title: 'Metadati',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'basic',
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine Principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Immagine principale dell\'articolo (opzionale)',
      fieldset: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Contenuto',
      type: 'blockContent',
      description: 'Contenuto principale dell\'articolo',
      fieldset: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Autore',
      type: 'string',
      description: 'Nome dell\'autore (opzionale)',
      fieldset: 'metadata',
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Categorie dell\'articolo (opzionale)',
      fieldset: 'metadata',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data di Pubblicazione',
      type: 'datetime',
      description: 'Data e ora di pubblicazione (opzionale)',
      fieldset: 'metadata',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `di ${author}` }
    },
  },
})
