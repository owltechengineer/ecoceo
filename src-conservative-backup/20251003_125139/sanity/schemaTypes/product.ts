import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Prodotti',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome Prodotto',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descrizione Breve',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Descrizione Completa',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Immagine Principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galleria Immagini',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Prezzo',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Prezzo di Confronto (scontato)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU (Codice Prodotto)',
      type: 'string',
    }),
    defineField({
      name: 'stock',
      title: 'Quantità Disponibile',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'weight',
      title: 'Peso (grammi)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensioni',
      type: 'object',
      fields: [
        { name: 'length', title: 'Lunghezza (cm)', type: 'number' },
        { name: 'width', title: 'Larghezza (cm)', type: 'number' },
        { name: 'height', title: 'Altezza (cm)', type: 'number' },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Caratteristiche',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Prodotto in Evidenza',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Attivo',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Ordine di Visualizzazione',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      price: 'price',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, category, price, media } = selection
      return {
        title: title,
        subtitle: `${category ? `Categoria: ${category}` : 'Nessuna categoria'} - €${price || 0}`,
        media: media,
      }
    },
  },
})
