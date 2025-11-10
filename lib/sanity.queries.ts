import groq from 'groq'

// ===================== POSTS =====================

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  "coverImage": coverImage.asset->url,
  "slug": slug.current,
  "author": author->{name, picture},
  "fileUrl": projectFile.asset->url
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
  *[_type == "post"] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    content
  }
`

// ===================== NEWS =====================

export const newsListQuery = groq`
  *[_type == "news"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    description,
    date
  }
`

export const newsSlugsQuery = groq`
  *[_type == "news" && defined(slug.current)][].slug.current
`

export const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    description,
    content,
    date
  }
`

// ===================== TS Types =====================

export interface Author {
  name?: string
  picture?: any
}

export interface Post {
  _id: string
  title?: string
  coverImage?: string
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
  fileUrl?: string
}

export interface News {
  _id: string
  title?: string
  coverImage?: string
  slug?: string
  description?: string
  date?: string
  content?: any
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}