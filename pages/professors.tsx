import { client } from '@/lib/sanity.client'
import { indexQuery } from '@/lib/sanity.queries'
import ContentCard from '@/components/ContentCard'

export default async function ProjectsPage() {
    const posts = await client.fetch(indexQuery)

    return (
        <main className="max-w-6xl mx-auto py-24 px-6">
            <h1 className="text-4xl font-bold text-center mb-12">Біздің жобалар</h1>

            {posts.length === 0 ? (
                <p className="text-center text-gray-600">Жобалар табылмады.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {posts.map((post: any) => (
                        <ContentCard
                            key={post._id}
                            title={post.title}
                            href={`/posts/${post.slug}`}
                            coverImage={post.coverImage}
                            excerpt={post.excerpt}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}