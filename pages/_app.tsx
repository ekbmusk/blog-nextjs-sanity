import '../tailwind.css'
import Navbar from 'components/Navbar'
import { VisualEditing } from '@sanity/visual-editing/next-pages-router'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import StemOrbitLoader from '@/components/StemOrbitLoader'
import React, { useState, useEffect } from 'react'

// Lazy load your Sanity preview provider
const PreviewProvider = dynamic(() => import('components/PreviewProvider'))

export interface SharedPageProps {
  previewMode: boolean
  previewPerspective: string | null
  token: string
}

export default function App({ Component, pageProps }: AppProps<SharedPageProps>) {
  const [loading, setLoading] = useState(false)
  const { previewMode, previewPerspective, token } = pageProps
  const router = useRouter()

  useEffect(() => {
    let t: any = null

    const start = () => {
      setLoading(true)
      clearTimeout(t)
      // optional: delay start small to avoid flicker
      t = setTimeout(() => { }, 50)
    }

    const end = () => {
      clearTimeout(t)
      // force minimum visible loader 500ms
      t = setTimeout(() => setLoading(false), 500)
    }


    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', end)
    router.events.on('routeChangeError', end)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', end)
      router.events.off('routeChangeError', end)
    }
  }, [router])

  return (
    <>
      <Navbar />
      {loading && <StemOrbitLoader backdrop={0.35} />}


      {/* Animated page transitions */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="min-h-screen"
          >
            {previewMode ? (
              <PreviewProvider perspective={previewPerspective} token={token}>
                <Component {...pageProps} />
              </PreviewProvider>
            ) : (
              <Component {...pageProps} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {previewMode && <VisualEditing />}
    </>
  )
}