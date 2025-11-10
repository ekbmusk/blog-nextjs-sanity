import { client } from '@/lib/sanity.client'
import { indexQuery } from '@/lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsPage({ posts }: { posts: any[] }) {
    return (
        <main className="max-w-6xl mx-auto py-24 px-6">
            <h1 className="text-4xl font-bold text-center mb-12">Біздің жобалар</h1>

            {posts.length === 0 ? (
                <p className="text-center text-gray-600">Жобалар табылмады.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {posts.map((post: any) => (
                        <div
                            key={post._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
                        >
                            {post.coverImage && (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                <p className="text-gray-600 mb-4">
                                    {post.excerpt || 'Сипаттама берілмеген.'}~
                                </p>

                                {post.fileUrl && (
                                    <a
                                        href={post.fileUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition mb-2"
                                    >
                                        Жобаны жүктеу
                                    </a>
                                )}

                                {post.slug && (
                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="text-blue-600 font-medium hover:underline ml-3"
                                    >
                                        Толығырақ →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export async function getStaticProps() {
    const posts = await client.fetch(indexQuery)

    return {
        props: { posts },
        revalidate: 60,
    }
}