import ContentCard from '@/components/ContentCard'
import { client } from '@/lib/sanity.client'
import { newsListQuery } from '@/lib/sanity.queries'

export default function NewsPage({ news }: { news: any[] }) {
    return (
        <main className="max-w-6xl mx-auto py-24 px-6">
            <h1 className="text-4xl font-bold text-center mb-12">Жаңалықтар</h1>

            {news.length === 0 ? (
                <p className="text-center text-gray-600">Жаңалықтар табылмады.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {news.map((n: any) => (
                        <ContentCard
                            key={n._id}
                            title={n.title}
                            href={`/news/${n.slug}`}
                            coverImage={n.coverImage}
                            // Prefer description; ContentCard will truncate automatically
                            excerpt={n.description}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}

export async function getStaticProps() {
    const news = await client.fetch(newsListQuery)
    return { props: { news }, revalidate: 60 }
}