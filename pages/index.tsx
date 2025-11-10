import Image from "next/image"
import InteractiveWeb from "@/components/InteractiveWeb"
import Link from "next/link"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import { client } from '@/lib/sanity.client'
import ContentCard from '@/components/ContentCard'
import { indexQuery, newsListQuery } from '@/lib/sanity.queries'

export default function Home({ posts, news }: { posts: any, news: any }) {
  const y = useParallax(0.06)
  return (
    <main className="flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-white">
        {/* DARK STEM BACKDROP */}
        <div className="absolute inset-0 bg-white" />

        {/* INTERACTIVE WEB */}
        <InteractiveWeb
          points={120}
          linkDistance={150}
          followStrength={0.09}
          color="#60a5fa"
          opacity={0.35}
        />
        <SpeedInsights />

        {/* Animated text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center text-white px-6 pointer-events-none"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            STEM and Creativity
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
            Бұл біздің университеттің ғылыми жобалар блогы. Мұнда профессорлар мен
            студенттердің соңғы зерттеулері мен жаңалықтары жарияланады.
          </p>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* OTHER PROJECTS */}
      <section className="max-w-6xl w-full py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Соңғы жобалар
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post: any) => (
            <ContentCard
              key={post._id}
              title={post.title}
              href={`/posts/${post.slug}`}
              coverImage={post.coverImage}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="max-w-6xl w-full py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Соңғы жаңалықтар
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((n: any) => (
            <ContentCard
              key={n._id}
              title={n.title}
              href={`/news/${n.slug}`}
              coverImage={n.coverImage}
              excerpt={n.description}
            />
          ))}
        </div>
      </section>

      {/* PROFESSORS */}
      <section className="bg-gray-50 w-full py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Біздің профессорлар
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Image
                src={`https://picsum.photos/200/200?random=${i + 10}`}
                width={200}
                height={200}
                alt="Professor photo"
                className="rounded-full mx-auto mb-4"
              />
              <h4 className="font-semibold text-gray-700">Профессор {i}</h4>
              <p className="text-sm text-gray-500">Ғылыми жетекші</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-gray-900 text-gray-300 py-8 text-center">
        <p>© 2025 Университет Блог Жобасы. Барлық құқықтар қорғалған.</p>
      </footer>
    </main>
  )
}

export async function getStaticProps() {
  const posts = await client.fetch(indexQuery)
  const news = await client.fetch(newsListQuery)

  return {
    props: { posts, news },
    revalidate: 60
  }
}