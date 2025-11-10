'use client'

import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import CoverImage from '@/components/CoverImage'
import Date from '@/components/PostDate'

export default function NewsHeader({
    title,
    coverImage,
    date,
    slug,
}: {
    title: string
    coverImage?: string
    date?: string
    slug?: string
}) {
    const y = useParallax(0.06)

    return (
        <motion.section
            style={{ y }}
            className="relative w-full h-[50vh] md:h-[60vh] mb-12 rounded-xl overflow-hidden"
        >
            {/* BACKGROUND IMAGE */}
            <div className="absolute inset-0">
                <CoverImage
                    title={title}
                    image={coverImage}
                    priority
                    slug={slug}
                    className="object-cover w-full h-full"
                    fill
                />
            </div>

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80 backdrop-blur-[0px]" />

            {/* TEXT BLOCK */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    {title}
                </h1>

                <div className="text-lg opacity-90 mt-2">
                    <Date dateString={date} />
                </div>
            </div>
        </motion.section>
    )
}