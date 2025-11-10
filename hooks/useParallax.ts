'use client'

import { useScroll, useTransform } from 'framer-motion'

export function useParallax(strength = 0.06) {
    const { scrollY } = useScroll()
    return useTransform(scrollY, [0, 1000], [0, 1000 * strength])
}