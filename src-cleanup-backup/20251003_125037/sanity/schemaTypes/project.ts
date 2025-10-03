import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Progetti',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome del Progetto',
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
      name: 'assignedServices',
      title: 'Servizi Assegnati',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      description: 'Servizi assegnati a questo progetto',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
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
      name: 'client',
      title: 'Cliente',
      type: 'string',
    }),
    defineField({
      name: 'completionDate',
      title: 'Data di Completamento',
      type: 'date',
    }),
    defineField({
      name: 'technologies',
      title: 'Tecnologie Utilizzate',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'projectUrl',
      title: 'URL del Progetto',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'URL GitHub',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Progetto in Evidenza',
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
      name: 'priority',
      title: 'Priorità',
      type: 'string',
      options: {
        list: [
          { title: 'Alta', value: 'high' },
          { title: 'Media', value: 'medium' },
          { title: 'Bassa', value: 'low' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Membri del team assegnati al progetto',
    }),
    defineField({
      name: 'notes',
      title: 'Note',
      type: 'text',
      rows: 4,
      description: 'Note aggiuntive sul progetto',
    }),
    defineField({
      name: 'isPublic',
      title: 'Pubblico',
      type: 'boolean',
      initialValue: true,
      description: 'Se il progetto è visibile pubblicamente',
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
    // ===== DASHBOARD FIELDS =====
    defineField({
      name: 'budget',
      title: 'Budget (€)',
      type: 'number',
      description: 'Budget allocato per il progetto',
      initialValue: 0,
    }),
    defineField({
      name: 'actualCost',
      title: 'Costi Attuali (€)',
      type: 'number',
      description: 'Costi effettivamente sostenuti',
      initialValue: 0,
    }),
    defineField({
      name: 'expectedRevenue',
      title: 'Ricavi Attesi (€)',
      type: 'number',
      description: 'Ricavi attesi dal progetto',
      initialValue: 0,
    }),
    defineField({
      name: 'progress',
      title: 'Progresso (%)',
      type: 'number',
      description: 'Percentuale di completamento del progetto',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(100),
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
    defineField({
      name: 'startDate',
      title: 'Data di Inizio',
      type: 'date',
      description: 'Data di inizio del progetto',
    }),
    defineField({
      name: 'endDate',
      title: 'Data di Fine',
      type: 'date',
      description: 'Data di fine prevista del progetto',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      status: 'status',
      progress: 'progress',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, status, progress, media } = selection
      return {
        title: title,
        subtitle: `${status} - ${progress}% completato`,
        media: media,
      }
    },
  },
})
