import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
    name: 'professor',
    title: 'Профессорлар',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Толық аты',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'degree',
            title: 'Академикалық деңгей',
            type: 'string',
            description: 'PhD, Профессор, т.б.',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Адрес',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'photo',
            title: 'Фото',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'bio',
            title: 'Қысқаша өмірбаяны',
            type: 'text',
            rows: 3,
            description: 'Профессор туралы қысқаша ақпарат.',
        }),
        defineField({
            name: 'email',
            title: 'Эл. почта',
            type: 'string',
        }),
        defineField({
            name: 'phonenumber',
            title: 'Телефон нөмірі',
            type: 'number',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'degree',
        },
    },
})