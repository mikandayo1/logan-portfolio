'use client'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface VideoModalProps {
  videoId: string
  title: string
  onClose: () => void
}

export default function VideoModal({ videoId, title, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-16"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/96 backdrop-blur-lg" />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-500 hover:text-white text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 flex items-center gap-2"
        >
          <span>Close</span>
          <span className="text-base leading-none">×</span>
        </button>

        {/* Video */}
        <div className="relative aspect-video border border-white/[0.08] bg-gray-950">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
            title={title}
          />
        </div>

        <p className="mt-4 text-gray-500 text-xs tracking-wider">{title}</p>
      </motion.div>
    </motion.div>
  )
}
