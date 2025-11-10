import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'news',
    title: 'News',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Тақырыбы',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Адрес',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'coverImage',
            title: 'Превью',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'description',
            title: 'Ақпарат',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'content',
            title: 'Мәтін',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', type: 'string', title: 'Alt' },
                        { name: 'caption', type: 'string', title: 'Caption' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'date',
            title: 'Күні',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: { title: 'title', media: 'coverImage', date: 'date' },
        prepare({ title, media, date }) {
            return {
                title,
                subtitle: date ? new Date(date).toLocaleDateString('kk-KZ') : '',
                media,
            }
        },
    },
})