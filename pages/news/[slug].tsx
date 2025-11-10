import NewsHeader from '@/components/NewsHeader'
import Container from '@/components/BlogContainer'
import PostBody from '@/components/PostBody' 
import { client } from '@/lib/sanity.client'
import { newsBySlugQuery, newsSlugsQuery } from '@/lib/sanity.queries'
import Head from 'next/head'
import type { GetStaticProps } from 'next'

export default function NewsArticle({ news }: { news: any }) {
    if (!news) return null

    return (
        <>
            <Head>
                <title>{news.title} — STEM and Creativity</title>
                <meta name="description" content={news.description || ''} />
            </Head>

            <main>
                <NewsHeader
                    title={news.title}
                    coverImage={news.coverImage}
                    date={news.date}
                    slug={news.slug}
                />

                <Container>
                    <article className="max-w-6xl mx-auto px-6 lg:px-12 pb-16">
                        {/* Optional short dek/standfirst */}
                        {news.description && (
                            <p className="text-lg text-gray-600 mb-8">{news.description}</p>
                        )}

                        {/* Full rich content */}
                        {news.content && (
                            <div className="prose prose-lg max-w-none">
                                <PostBody content={news.content} />
                            </div>
                        )}
                    </article>
                </Container>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string
    const news = await client.fetch(newsBySlugQuery, { slug })

    if (!news) return { notFound: true }

    return {
        props: { news },
        revalidate: 60,
    }
}

export async function getStaticPaths() {
    const slugs: string[] = await client.fetch(newsSlugsQuery)
    return {
        paths: slugs.map((slug) => `/news/${slug}`),
        fallback: 'blocking',
    }
}