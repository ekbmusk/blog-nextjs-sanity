import { client } from '@/lib/sanity.client'
import { professorsQuery } from '@/lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfessorsPage({ professors }: { professors: any[] }) {
    return (
        <main className="max-w-6xl mx-auto py-24 px-6">
            <h1 className="text-4xl font-bold text-center mb-12">Біздің профессорлар</h1>

            {professors.length === 0 ? (
                <p className="text-center text-gray-600">Профессорлар табылмады.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {professors.map((prof: any) => (
                        <div
                            key={prof._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden text-center"
                        >
                            {prof.photo && (
                                <Image
                                    src={prof.photo}
                                    alt={prof.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-64 object-cover rounded-t-xl"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{prof.name}</h3>
                                <p className="text-gray-600 mb-2">{prof.degree}</p>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {prof.bio || 'Қысқаша ақпарат жоқ.'}
                                </p>

                                {prof.slug?.current ? (
                                    <Link
                                        href={`/professors/${prof.slug.current}`}
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Толығырақ →
                                    </Link>
                                ) : (
                                    <span className="text-gray-400 text-sm">Slug орнатылмаған</span>
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
    const professors = await client.fetch(professorsQuery)

    return {
        props: { professors },
        revalidate: 60, // revalidate every minute
    }
}