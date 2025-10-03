import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'logoDark',
      title: 'Site Logo (Dark Mode)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),

    defineField({
      name: 'typography',
      title: 'Typography Settings',
      type: 'object',
      fields: [
        {
          name: 'headingFont',
          title: 'Heading Font',
          type: 'string',
          options: {
            list: [
              { title: 'Inter', value: 'Inter' },
              { title: 'Poppins', value: 'Poppins' },
              { title: 'Roboto', value: 'Roboto' },
              { title: 'Open Sans', value: 'Open Sans' },
              { title: 'Montserrat', value: 'Montserrat' },
              { title: 'Lato', value: 'Lato' },
            ],
          },
          initialValue: 'Inter',
        },
        {
          name: 'bodyFont',
          title: 'Body Font',
          type: 'string',
          options: {
            list: [
              { title: 'Inter', value: 'Inter' },
              { title: 'Poppins', value: 'Poppins' },
              { title: 'Roboto', value: 'Roboto' },
              { title: 'Open Sans', value: 'Open Sans' },
              { title: 'Montserrat', value: 'Montserrat' },
              { title: 'Lato', value: 'Lato' },
            ],
          },
          initialValue: 'Inter',
        },
      ],
    }),

    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
        },
        {
          name: 'workingHours',
          title: 'Working Hours',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer Settings',
      type: 'object',
      fields: [
        {
          name: 'quickLinksTitle',
          title: 'Quick Links Section Title',
          type: 'string',
          initialValue: 'Quick Links',
        },
        {
          name: 'quickLinks',
          title: 'Quick Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Link Title',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'Link URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
        {
          name: 'servicesTitle',
          title: 'Services Section Title',
          type: 'string',
          initialValue: 'Services',
        },
        {
          name: 'services',
          title: 'Footer Services',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Service Title',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'Service URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
        {
          name: 'contactTitle',
          title: 'Contact Section Title',
          type: 'string',
          initialValue: 'Contact Info',
        },
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          initialValue: 'All rights reserved.',
        },
        {
          name: 'developerCredit',
          title: 'Developer Credit',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Credit Text',
              type: 'string',
              initialValue: 'Designed and Developed by',
            },
            {
              name: 'companyName',
              title: 'Company Name',
              type: 'string',
              initialValue: 'TailGrids',
            },
            {
              name: 'companyUrl',
              title: 'Company URL',
              type: 'url',
              initialValue: 'https://tailgrids.com',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'legal',
      title: 'Legal Pages',
      type: 'object',
      fields: [
        {
          name: 'privacyPolicy',
          title: 'Privacy Policy',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Page Title',
              type: 'string',
              initialValue: 'Privacy Policy',
            },
            {
              name: 'slug',
              title: 'Page Slug',
              type: 'slug',
              initialValue: 'privacy-policy',
            },
            {
              name: 'content',
              title: 'Privacy Policy Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' },
              ],
            },
            {
              name: 'lastUpdated',
              title: 'Last Updated Date',
              type: 'date',
            },
          ],
        },
        {
          name: 'termsOfService',
          title: 'Terms of Service',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Page Title',
              type: 'string',
              initialValue: 'Terms of Service',
            },
            {
              name: 'slug',
              title: 'Page Slug',
              type: 'slug',
              initialValue: 'terms-of-service',
            },
            {
              name: 'content',
              title: 'Terms of Service Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' },
              ],
            },
            {
              name: 'lastUpdated',
              title: 'Last Updated Date',
              type: 'date',
            },
          ],
        },
        {
          name: 'cookiePolicy',
          title: 'Cookie Policy',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Page Title',
              type: 'string',
              initialValue: 'Cookie Policy',
            },
            {
              name: 'slug',
              title: 'Page Slug',
              type: 'slug',
              initialValue: 'cookie-policy',
            },
            {
              name: 'content',
              title: 'Cookie Policy Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' },
              ],
            },
            {
              name: 'lastUpdated',
              title: 'Last Updated Date',
              type: 'date',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
})
