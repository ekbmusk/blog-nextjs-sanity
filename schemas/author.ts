import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Автор',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Аты',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'picture',
      title: 'Суреті',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Қосымша текст',
          description: '',
        },
      ],
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
})
