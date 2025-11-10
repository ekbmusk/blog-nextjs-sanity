'use client'

import { motion } from 'framer-motion'
import { Atom, Cpu, Satellite, Brain } from 'lucide-react'
import React from 'react'

type Props = {
    /** 0–1 overlay darkness (default 0.35) */
    backdrop?: number
    /** orbit radius in px (default 84) */
    radius?: number
}

/**
 * Fullscreen STEM loader: orbiting icons around a pulsing core.
 * Icons: Atom, CPU, Satellite, Brain (lucide)
 * Palette: white + academic blue accents
 */
export default function StemOrbitLoader({ backdrop = 0.35, radius = 84 }: Props) {
    // slightly slow rotation
    const duration = 5

    // helper: rotate the carrier 360deg; place child at radius; keep icon upright
    const Orbiter = ({
        angle,
        delay = 0,
        children,
    }: { angle: number; delay?: number; children: React.ReactNode }) => (
        <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ width: 0, height: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: 'linear', duration, delay }}
        >
            <div
                style={{
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                }}
            >
                {children}
            </div>
        </motion.div>
    )

    const glow = 'drop-shadow-[0_0_12px_rgba(59,130,246,0.65)]' // Tailwind-style drop shadow
    const Blue = '#1e3a8a' // academic navy accent

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-label="Loading"
            className="fixed inset-0 z-[2000] flex items-center justify-center"
            style={{ background: `rgba(0,0,0,${backdrop})` }}
        >
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
                {/* rings */}
                <div className="absolute inset-0 rounded-full border border-white/15" />
                <div className="absolute w-[180px] h-[180px] rounded-full border border-white/10" />
                <div className="absolute w-[120px] h-[120px] rounded-full border border-white/10" />

                {/* pulsing core */}
                <motion.div
                    className="w-6 h-6 rounded-full"
                    style={{ background: Blue }}
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
                />

                {/* orbiters */}
                <Orbiter angle={0}>
                    <IconFrame><Atom size={22} strokeWidth={1.75} color="#ffffff" /></IconFrame>
                </Orbiter>
                <Orbiter angle={90} delay={0.15}>
                    <IconFrame><Cpu size={22} strokeWidth={1.75} color="#ffffff" /></IconFrame>
                </Orbiter>
                <Orbiter angle={180} delay={0.3}>
                    <IconFrame><RocketMark /></IconFrame>
                </Orbiter>
                <Orbiter angle={270} delay={0.45}>
                    <IconFrame><Satellite size={22} strokeWidth={1.75} color="#ffffff" /></IconFrame>
                </Orbiter>

                {/* subtle rotating glow ring */}
                <motion.div
                    className={`absolute w-[210px] h-[210px] rounded-full ${glow}`}
                    style={{ boxShadow: `0 0 22px 2px ${Blue}40 inset` }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                />
            </div>
        </motion.div>
    )
}

/** circular frosted icon button */
function IconFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 flex items-center justify-center">
            {children}
        </div>
    )
}

/** tiny rocket mark drawn in SVG to keep palette consistent */
function RocketMark() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M7 14l3 3c3-1 6-4 7-7l-3-3c-3 1-6 4-7 7z" stroke="#fff" strokeWidth="1.75" />
            <circle cx="14" cy="10" r="1.25" fill="#ffffff" />
            <path d="M6 18l1.4-1.4M5 16l1.4-1.4" stroke="#1e3a8a" strokeWidth="1.75" />
        </svg>
    )
}