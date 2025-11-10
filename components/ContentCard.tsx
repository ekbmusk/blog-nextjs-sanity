'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ContentCardProps {
    title: string
    href: string
    coverImage?: string
    excerpt?: string
}

export default function ContentCard({ title, href, coverImage, excerpt }: ContentCardProps) {
    // auto excerpt fallback logic
    let preview = excerpt || ''
    if (preview.length > 140) preview = preview.slice(0, 140) + '…'

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl bg-white shadow-sm hover:shadow-xl transition overflow-hidden"
        >
            <Link href={href} className="block">
                {coverImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                        <Image
                            src={coverImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                )}

                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                    {preview && <p className="text-gray-600 text-sm leading-relaxed">{preview}</p>}
                </div>
            </Link>
        </motion.div>
    )
}