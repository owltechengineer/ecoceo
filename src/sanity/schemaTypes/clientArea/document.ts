import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientDocument',
  title: 'Documento Area Clienti',
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
      name: 'file',
      title: 'File Documento',
      type: 'file',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'fileType',
      title: 'Tipo File',
      type: 'string',
      options: {
        list: [
          { title: 'PDF', value: 'pdf' },
          { title: 'Word', value: 'doc' },
          { title: 'Excel', value: 'xls' },
          { title: 'PowerPoint', value: 'ppt' },
          { title: 'Immagine', value: 'image' },
          { title: 'Altro', value: 'other' }
        ]
      }
    }),
    defineField({
      name: 'fileSize',
      title: 'Dimensione File (MB)',
      type: 'number'
    }),
    defineField({
      name: 'previewImage',
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
          { title: 'Manuali', value: 'manuali' },
          { title: 'Contratti', value: 'contratti' },
          { title: 'Fatturazione', value: 'fatturazione' },
          { title: 'Moduli', value: 'moduli' },
          { title: 'Guide', value: 'guide' }
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
    }),
    defineField({
      name: 'downloadCount',
      title: 'Numero Download',
      type: 'number',
      readOnly: true,
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
      media: 'previewImage',
      subtitle: 'fileType'
    }
  }
})
