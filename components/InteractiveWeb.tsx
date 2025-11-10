'use client'

import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import {
    Atom, Cpu, Satellite, Brain, Microscope, FlaskConical, Rocket,
    CircuitBoard, TestTube, Beaker, Dna, Radar, GraduationCap,
    Lightbulb, Calculator, Telescope, BookOpen, Ruler, Gauge, Settings
} from 'lucide-react'

type Props = {
    /** overall node target; auto-scales a bit with hero size */
    points?: number
    /** px distance within which lines are drawn */
    linkDistance?: number
    /** local cursor warp intensity (0..1) */
    followStrength?: number
    /** RGBA for line color */
    lineColor?: string
    /** icon size in px */
    iconSize?: number
    /** ~1 icon per N nodes */
    iconEvery?: number
}

export default function InteractiveWeb({
    // balanced density (not insane)
    points = 220,
    linkDistance = 140,
    followStrength = 0.06,
    // Slate gray (scientific tone)
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
        // spatial hash cell size must exist before resize() touches it
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

        // Cursor (relative to hero)
        const mouse = { x: W / 2, y: H / 2 }
        const target = { x: mouse.x, y: mouse.y }
        const onMove = (e: MouseEvent) => {
            const r = parent.getBoundingClientRect()
            target.x = e.clientX - r.left
            target.y = e.clientY - r.top
        }
        window.addEventListener('mousemove', onMove, { passive: true })

        // Nodes
        type Node = {
            x: number; y: number; vx: number; vy: number
            ox: number; oy: number
            phase: number; speed: number
            iconIndex?: number; id?: string
        }
        const nodes: Node[] = []

        // Icons (20 STEM)
        const IconSet = [
            Atom, Cpu, Satellite, Brain, Microscope, FlaskConical, Rocket,
            CircuitBoard, TestTube, Beaker, Dna, Radar, GraduationCap,
            Lightbulb, Calculator, Telescope, BookOpen, Ruler, Gauge, Settings,
        ]

        const rebuild = () => {
            const isMobile = W < 768 // tailwind md breakpoint
            if (isMobile) {
                points = Math.floor(points * 0.002)      // 65% less points
                iconEvery = Math.floor(iconEvery * 3) // fewer icons
                linkDistance = Math.floor(linkDistance * 0.3)
            }
            nodes.length = 0
            overlay.innerHTML = ''
            const areaScale = Math.sqrt((W * H) / (1280 * 720))
            const count = Math.max(450, Math.floor(points * areaScale))

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
                wrap.style.opacity = '0.95' // icons DO NOT fade with edges
                wrap.style.willChange = 'transform'
                overlay.appendChild(wrap)

                const Icon = IconSet[iconIndex]
                const svg = ReactDOMServer.renderToStaticMarkup(
                    <Icon size={iconSize} color="#111" strokeWidth={1.75} />
                )
                wrap.innerHTML = svg
            }
        }
        rebuild()

        // Physics (medium engineering mesh)
        const friction = 0.985
        const homePull = 0.000055              // elastic to home keeps mesh even
        const localRadius = 160          // ONLY nearby nodes warp
        const localR2 = localRadius * localRadius
        const warp = followStrength * 0.00145 // melt intensity
        const maxSpeed = 1.1              // energetic but controlled

        // Idle drift (subtle “alive”)
        const driftAmp = 0.35
        const driftFreq = 0.0014

        // Spatial hashing for edges (O(n))
        const grid = new Map<string, number[]>() // key -> node indices
        const keyOf = (x: number, y: number) => {
            const cx = Math.floor(x / cellSize)
            const cy = Math.floor(y / cellSize)
            return `${cx},${cy}`
        }
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
            // cursor inertia (make faster by increasing 0.38)
            mouse.x += (target.x - mouse.x) * 1
            mouse.y += (target.y - mouse.y) * 1

            const t = performance.now() * 0.00025

            // update nodes
            for (const n of nodes) {
                // elastic return to home (prevents collapse)
                n.vx += (n.ox - n.x) * homePull
                n.vy += (n.oy - n.y) * homePull

                // breathing
                n.vx += Math.sin(t + n.ox * 0.02) * 0.001
                n.vy += Math.cos(t + n.oy * 0.05) * 0.001

                // subtle idle drift
                const s = n.speed
                n.vx += Math.sin(t * driftFreq + n.phase) * (driftAmp * 0.0005) * s
                n.vy += Math.cos(t * driftFreq + n.phase) * (driftAmp * 0.0005) * s

                // local cursor warp (bubble only)
                const dx = mouse.x - n.x
                const dy = mouse.y - n.y
                const d2 = dx * dx + dy * dy
                if (d2 < localR2) {
                    const fall = 1 - d2 / localR2
                    n.vx += dx * warp * fall
                    n.vy += dy * warp * fall
                }

                // integrate + clamp
                const sp = Math.hypot(n.vx, n.vy)
                if (sp > maxSpeed) {
                    n.vx = (n.vx / sp) * maxSpeed
                    n.vy = (n.vy / sp) * maxSpeed
                }
                n.x += n.vx
                n.y += n.vy
                n.vx *= friction
                n.vy *= friction

                // bounds
                if (n.x < 0) { n.x = 0; n.vx *= -0.8 }
                if (n.x > W) { n.x = W; n.vx *= -0.8 }
                if (n.y < 0) { n.y = 0; n.vy *= -0.8 }
                if (n.y > H) { n.y = H; n.vy *= -0.8 }
            }

            // rebuild grid
            grid.clear()
            for (let i = 0; i < nodes.length; i++) {
                const k = keyOf(nodes[i].x, nodes[i].y)
                const arr = grid.get(k)
                if (arr) arr.push(i)
                else grid.set(k, [i])
            }

            // draw
            ctx.setTransform(1, 0, 0, 1, 0, 0) // avoid scaling artifacts on clear
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.lineWidth = 1.5 // medium thickness
            ctx.strokeStyle = lineColor
            const linkDist2 = linkDistance * linkDistance

            // vertical fade (B/2): strong center band, fade top/bottom
            const cy = H * 0.5
            const maxY = cy
            const fadeY = (y: number) => {
                // 0..1 where 1 = center, 0 = far top/bottom (slightly eased)
                const f = 1 - Math.min(1, Math.abs(y - cy) / maxY)
                return Math.pow(f, 1.15)
            }

            // edges (lines) with vertical fade — icons unaffected
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
                        const edgeFade = (fadeY(a.y) + fadeY(b.y)) * 0.5
                        ctx.globalAlpha = Math.max(0, 0.9 * tt * edgeFade)
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }
            ctx.globalAlpha = 1

            // dots (non-icon nodes) — also vertical fade
            ctx.fillStyle = '#111'
            for (const n of nodes) {
                if (n.iconIndex === undefined) {
                    const f = fadeY(n.y)
                    ctx.globalAlpha = Math.max(0, 0.7 * f)
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 1.15, 0, Math.PI * 2)
                    ctx.fill()
                }
            }
            ctx.globalAlpha = 1

            // move overlay icons (fade + rotation drift exact same vertical fade logic)
            for (const n of nodes) {
                if (n.iconIndex !== undefined && n.id) {
                    const el = document.getElementById(n.id)
                    if (el) {
                        const f = fadeY(n.y)

                        // gentle rotation drift (scientific magnetic feel)
                        const rot = Math.sin(t * 0.00045 + n.phase) * 10 // +- 10deg

                        el.style.transform =
                            `translate(${n.x}px, ${n.y}px) translate(-50%, -50%) rotate(${rot}deg)`
                        el.style.opacity = String(Math.max(0, 0.85 * f))
                    }
                }
            }

            rafRef.current = requestAnimationFrame(step)
        }

        rafRef.current = requestAnimationFrame(step)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('mousemove', onMove)
            ro.disconnect()
            overlay.innerHTML = ''
        }
    }, [points, linkDistance, followStrength, lineColor, iconSize, iconEvery])

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            />
            {/* DOM overlay for crisp lucide icons */}
            <div
                ref={overlayRef}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            />
        </>
    )
}