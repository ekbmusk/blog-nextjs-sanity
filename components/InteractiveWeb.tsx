'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactDOMServer from 'react-dom/server'
import {
    Atom, Cpu, Satellite, Brain, Microscope, FlaskConical, Rocket,
    CircuitBoard, TestTube, Beaker, Dna, Radar, GraduationCap,
    Lightbulb, Calculator, Telescope, BookOpen, Ruler, Gauge, Settings
} from 'lucide-react'

type Props = {
    points?: number
    linkDistance?: number
    lineColor?: string
    iconSize?: number
    iconEvery?: number
}

export default function InteractiveWeb({
    points = 220,
    linkDistance = 140,
    lineColor = 'rgba(100,116,139,0.22)',
    iconSize = 22,
    iconEvery = 14,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const overlay = overlayRef.current!
        const ctx = canvas.getContext('2d')!
        const parent = canvas.parentElement as HTMLElement
        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        let W = 0, H = 0
        let cellSize = linkDistance

        const resize = () => {
            const bw = parent.clientWidth
            const bh = parent.clientHeight
            W = bw
            H = bh
            canvas.width = Math.floor(bw * dpr)
            canvas.height = Math.floor(bh * dpr)
            canvas.style.width = `${bw}px`
            canvas.style.height = `${bh}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            cellSize = linkDistance
        }

        const ro = new ResizeObserver(resize)
        ro.observe(parent)
        resize()

        type Node = {
            x: number; y: number; vx: number; vy: number
            ox: number; oy: number
            phase: number; speed: number
            iconIndex?: number; id?: string
        }

        const nodes: Node[] = []
        const IconSet = [
            Atom, Cpu, Satellite, Brain, Microscope, FlaskConical, Rocket,
            CircuitBoard, TestTube, Beaker, Dna, Radar, GraduationCap,
            Lightbulb, Calculator, Telescope, BookOpen, Ruler, Gauge, Settings,
        ]

        const rebuild = () => {
            nodes.length = 0
            overlay.innerHTML = ''
            const areaScale = Math.sqrt((W * H) / (1280 * 720))
            const count = Math.max(280, Math.floor(points * areaScale))

            for (let i = 0; i < count; i++) {
                const x = Math.random() * W
                const y = Math.random() * H
                nodes.push({
                    x, y, ox: x, oy: y,
                    vx: 0, vy: 0,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.4 + Math.random() * 0.6,
                })
            }

            const iconCount = Math.max(8, Math.floor(nodes.length / iconEvery))
            const used = new Set<number>()
            for (let k = 0; k < iconCount; k++) {
                let idx = Math.floor(Math.random() * nodes.length)
                while (used.has(idx)) idx = Math.floor(Math.random() * nodes.length)
                used.add(idx)
                const iconIndex = Math.floor(Math.random() * IconSet.length)
                const n = nodes[idx]
                n.iconIndex = iconIndex
                n.id = `iw-icon-${k}`

                const wrap = document.createElement('div')
                wrap.id = n.id
                wrap.style.position = 'absolute'
                wrap.style.left = '0'
                wrap.style.top = '0'
                wrap.style.width = `${iconSize}px`
                wrap.style.height = `${iconSize}px`
                wrap.style.transform = `translate(${n.x}px, ${n.y}px) translate(-50%, -50%)`
                wrap.style.pointerEvents = 'none'
                overlay.appendChild(wrap)

                const Icon = IconSet[iconIndex]
                const svg = ReactDOMServer.renderToStaticMarkup(
                    <Icon size={iconSize} color="#111" strokeWidth={1.75} />
                )
                wrap.innerHTML = svg
            }
        }

        rebuild()

        const friction = 0.985
        const homePull = 0.000055
        const maxSpeed = 1.1
        const driftAmp = 0.35
        const driftFreq = 0.0014

        const grid = new Map<string, number[]>()
        const keyOf = (x: number, y: number) =>
            `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`

        const neighborsOf = (x: number, y: number) => {
            const cx = Math.floor(x / cellSize)
            const cy = Math.floor(y / cellSize)
            const list: number[] = []
            for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                    const arr = grid.get(`${cx + ox},${cy + oy}`)
                    if (arr) list.push(...arr)
                }
            }
            return list
        }

        const step = () => {
            const t = performance.now() * 0.00025

            for (const n of nodes) {
                n.vx += (n.ox - n.x) * homePull
                n.vy += (n.oy - n.y) * homePull
                n.vx += Math.sin(t + n.ox * 0.02) * 0.001
                n.vy += Math.cos(t + n.oy * 0.05) * 0.001
                const s = n.speed
                n.vx += Math.sin(t * driftFreq + n.phase) * (driftAmp * 0.0005) * s
                n.vy += Math.cos(t * driftFreq + n.phase) * (driftAmp * 0.0005) * s

                const sp = Math.hypot(n.vx, n.vy)
                if (sp > maxSpeed) {
                    n.vx = (n.vx / sp) * maxSpeed
                    n.vy = (n.vy / sp) * maxSpeed
                }
                n.x += n.vx
                n.y += n.vy
                n.vx *= friction
                n.vy *= friction

                if (n.x < 0) { n.x = 0; n.vx *= -0.8 }
                if (n.x > W) { n.x = W; n.vx *= -0.8 }
                if (n.y < 0) { n.y = 0; n.vx *= -0.8 }
                if (n.y > H) { n.y = H; n.vy *= -0.8 }
            }

            grid.clear()
            for (let i = 0; i < nodes.length; i++) {
                const k = keyOf(nodes[i].x, nodes[i].y)
                const arr = grid.get(k)
                if (arr) arr.push(i)
                else grid.set(k, [i])
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.lineWidth = 1.5
            ctx.strokeStyle = lineColor
            const linkDist2 = linkDistance * linkDistance

            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i]
                const neigh = neighborsOf(a.x, a.y)
                for (const j of neigh) {
                    if (j <= i) continue
                    const b = nodes[j]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const d2 = dx * dx + dy * dy
                    if (d2 < linkDist2) {
                        const tt = 1 - d2 / linkDist2
                        ctx.globalAlpha = 0.9 * tt
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }

            ctx.globalAlpha = 1
            ctx.fillStyle = '#111'
            for (const n of nodes) {
                if (n.iconIndex === undefined) {
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 1.15, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            for (const n of nodes) {
                if (n.iconIndex !== undefined && n.id) {
                    const el = document.getElementById(n.id)
                    if (el) {
                        const rot = Math.sin(t * 0.00045 + n.phase) * 10
                        el.style.transform = `translate(${n.x}px, ${n.y}px) translate(-50%, -50%) rotate(${rot}deg)`
                    }
                }
            }

            rafRef.current = requestAnimationFrame(step)
        }

        rafRef.current = requestAnimationFrame(step)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            ro.disconnect()
            overlay.innerHTML = ''
        }
    }, [points, linkDistance, lineColor, iconSize, iconEvery])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
            <div ref={overlayRef} className="absolute inset-0 pointer-events-none" />
        </motion.div>
    )
}