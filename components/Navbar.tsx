'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
    const router = useRouter()
    const pathname = router.pathname
    const isHome = pathname === '/'
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Transparent only on the homepage at the very top
    const transparent = pathname === '/' && !scrolled

    const linkBase =
        'transition-colors font-medium'
    const linkColor = transparent
        ? 'text-white/90 hover:text-white'
        : 'text-gray-800 hover:text-blue-600'

    const navItems = [
        { href: '/', label: 'Басты бет' },
        { href: '/projects', label: 'Жобалар' },
        { href: '/professors', label: 'Профессорлар' },
        { href: '/news', label: 'Жаңалықтар' },
        { href: '/about', label: 'Біз туралы' },
    ]

    return (
        <nav
            className={[
                'fixed top-0 left-0 w-full z-50 transition-colors duration-300',
                transparent
                    ? 'bg-transparent border-b border-transparent'
                    : 'bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm',
            ].join(' ')}
            aria-label="Primary"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link
                    href="/"
                    className={[
                        'text-lg md:text-xl font-semibold tracking-tight',
                        transparent ? 'text-white' : 'text-gray-900',
                    ].join(' ')}
                >
                    STEM and Creativity
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${linkBase} ${linkColor}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile toggle */}
                <button
                    aria-label="Open menu"
                    onClick={() => setOpen((v) => !v)}
                    className={[
                        'md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                        transparent
                            ? 'text-white focus:ring-white/40 focus:ring-offset-transparent'
                            : 'text-gray-800 focus:ring-blue-600 focus:ring-offset-white',
                    ].join(' ')}
                >
                    {/* Simple hamburger / close */}
                    <span className="sr-only">Toggle menu</span>
                    <div className="relative w-6 h-6">
                        <span
                            className={[
                                'absolute inset-x-0 top-1 block h-[2px] transition',
                                transparent ? 'bg-white' : 'bg-gray-900',
                                open ? 'translate-y-2 rotate-45' : '',
                            ].join(' ')}
                        />
                        <span
                            className={[
                                'absolute inset-x-0 top-1/2 -mt-[1px] block h-[2px] transition',
                                transparent ? 'bg-white' : 'bg-gray-900',
                                open ? 'opacity-0' : 'opacity-100',
                            ].join(' ')}
                        />
                        <span
                            className={[
                                'absolute inset-x-0 bottom-1 block h-[2px] transition',
                                transparent ? 'bg-white' : 'bg-gray-900',
                                open ? '-translate-y-2 -rotate-45' : '',
                            ].join(' ')}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobile"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-gray-200 bg-white"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block text-gray-800 hover:text-blue-600 font-medium"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}