'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import VideoModal from './VideoModal'

const videos = [
  {
    id: 'TxYoXras3WI',
    title: 'I am Stuck',
    category: 'Short Film',
    role: 'Editor',
    featured: true,
  },
  {
    id: 'JIraNgXvPIA',
    title: 'A Little Minor Issue',
    category: 'Short Film',
    role: 'Editor',
    featured: false,
  },
  {
    id: 'EzriLrAqcOU',
    title: 'Cinematography Reel 2023',
    category: 'DP Reel',
    role: 'Cinematographer',
    featured: false,
  },
  {
    id: 'sCV1W7zGhpI',
    title: 'Love! Peace! Joy!',
    category: 'Short Film',
    role: 'Editor',
    featured: false,
  },
  {
    id: 'dn3oMdXs_OE',
    title: 'Contact',
    category: 'Independent Project',
    role: 'Editor & Cinematographer',
    featured: false,
  },
]

function VideoCard({
  video,
  index,
  isInView,
  onClick,
}: {
  video: (typeof videos)[0]
  index: number
  isInView: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative cursor-pointer overflow-hidden ${
        video.featured ? 'md:col-span-2' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-950">
        <Image
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
          alt={video.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-60"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Hover purple wash */}
        <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/20 transition-colors duration-500" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Info — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-violet-400 text-[9px] tracking-[0.25em] uppercase mb-1.5">
            {video.category} · {video.role}
          </p>
          <h3 className="text-white font-semibold text-base leading-tight">{video.title}</h3>
        </div>

        {/* Thin purple border on hover */}
        <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/30 transition-colors duration-500" />
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selected, setSelected] = useState<(typeof videos)[0] | null>(null)

  return (
    <section id="portfolio" ref={ref} className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-4">
              Selected Work
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Portfolio</h2>
          </div>
          <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
            Click any project to watch. Titles are placeholders — update them in the code.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              isInView={isInView}
              onClick={() => setSelected(video)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <VideoModal
            videoId={selected.id}
            title={selected.title}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
