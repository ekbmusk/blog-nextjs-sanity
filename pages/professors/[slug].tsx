import { client } from '@/lib/sanity.client'
import { professorBySlugQuery } from '@/lib/sanity.queries'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'

export default function ProfessorDetails({ professor }: { professor: any }) {
    if (!professor) {
        return <p className="text-center py-20">Профессор табылмады.</p>
    }

    return (
        <main className="max-w-4xl mx-auto py-24 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                {professor.photo && (
                    <Image
                        src={professor.photo}
                        alt={professor.name}
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-md object-cover"
                    />
                )}

                <div>
                    <h1 className="text-4xl font-bold mb-4">{professor.name}</h1>
                    <p className="text-lg text-gray-700 mb-2">{professor.degree}</p>
                    {professor.email && <p className="text-gray-600">✉️ {professor.email}</p>}
                    {professor.phonenumber && (
                        <p className="text-gray-600">📞 {professor.phonenumber}</p>
                    )}
                    <p className="mt-6 text-gray-700 leading-relaxed">{professor.bio}</p>

                    {professor.achievements?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-3">Жетістіктері</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {professor.achievements.map((a: string, i: number) => (
                                    <li key={i}>{a}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await client.fetch(`*[_type == "professor" && defined(slug.current)][].slug.current`)
    return {
        paths: slugs.map((slug: string) => ({ params: { slug } })),
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const professor = await client.fetch(professorBySlugQuery, { slug: params?.slug })
    return {
        props: { professor },
        revalidate: 60,
    }
}