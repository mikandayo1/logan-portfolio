'use client'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import VideoModal from './VideoModal'

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = 'published' | 'coming_soon'
type Category = 'All' | 'Narrative Short' | 'Music Video' | 'Commercial'

interface VideoItem {
  uid: string                      // unique key — never changes
  id: string | null                // YouTube ID, null if not released
  title: string
  category: Exclude<Category, 'All'>
  role: string
  year: string
  director?: string
  status: Status
}

// ── Data ──────────────────────────────────────────────────────────────────────
const videos: VideoItem[] = [
  // ── Published ──────────────────────────────────────────────────────────────
  {
    uid: 'lpj',
    id: 'sCV1W7zGhpI',
    title: 'Love! Peace! Joy!',
    category: 'Narrative Short',
    role: 'Editor',
    year: '2024',
    director: 'dir. Evan Korycki',
    status: 'published',
  },
  {
    uid: 'almi',
    id: 'JIraNgXvPIA',
    title: 'A Little Minor Issue',
    category: 'Narrative Short',
    role: 'Editor',
    year: '2025',
    director: 'dir. Harry Chiao',
    status: 'published',
  },
  {
    uid: 'contact',
    id: 'dn3oMdXs_OE',
    title: 'Contact',
    category: 'Narrative Short',
    role: 'Editor & Cinematographer',
    year: '2023',
    director: 'dir. Yujie Logan Luo',
    status: 'published',
  },
  {
    uid: 'stuck',
    id: 'TxYoXras3WI',
    title: "I'm Stuck",
    category: 'Narrative Short',
    role: 'Editor',
    year: '2025',
    director: 'dir. Zishu Zhou',
    status: 'published',
  },
  {
    uid: 'reel23',
    id: 'EzriLrAqcOU',
    title: 'Cinematography Reel 2023',
    category: 'Narrative Short',
    role: 'Cinematographer',
    year: '2023',
    status: 'published',
  },
  // ── Coming Soon ────────────────────────────────────────────────────────────
  {
    uid: 'little-egypt',
    id: null,
    title: 'Little Egypt',
    category: 'Narrative Short',
    role: 'Editor',
    year: '2026',
    director: 'dir. Jason Wolfmiller',
    status: 'coming_soon',
  },
  {
    uid: 'mv-2023',
    id: null,
    title: 'Music Video',
    category: 'Music Video',
    role: 'Editor',
    year: '2023',
    status: 'coming_soon',
  },
  {
    uid: 'mv-2026-a',
    id: null,
    title: 'Music Video',
    category: 'Music Video',
    role: 'Editor',
    year: '2026',
    status: 'coming_soon',
  },
  {
    uid: 'mv-2026-b',
    id: null,
    title: 'Music Video',
    category: 'Music Video',
    role: 'Editor',
    year: '2026',
    status: 'coming_soon',
  },
  {
    uid: 'commercial-2026',
    id: null,
    title: 'Commercial Project',
    category: 'Commercial',
    role: 'Editor',
    year: '2026',
    status: 'coming_soon',
  },
]

// ── AE credits ────────────────────────────────────────────────────────────────
const aeCredits = [
  { title: 'Old Habits Die Hard',            director: 'dir. Jason Wolfmiller',       year: '2025' },
  { title: 'Captain Marisol and Peach Tree', director: 'dir. Sahej Singh Nandrajog', year: '2025' },
  { title: 'Mr. Wrong',                      director: 'dir. Kaylin Allshouse',       year: '2025' },
  { title: 'Federal Crisis',                 director: 'dir. Hannah Pike',            year: '2024' },
  { title: 'Breakfast',                      director: 'dir. Tamás Hevér',            year: '2024' },
]

// ── Script Supervisor credits ─────────────────────────────────────────────────
const ssCredits = [
  { title: 'The Day She Arrives', director: 'dir. Jiaxin (Kristal) Li', year: '2026' },
  { title: 'Ghost House',         director: 'dir. Harry Chiao',         year: '2025' },
  { title: 'Sweetheart',          director: 'dir. Tamás Hevér',         year: '2025' },
]

const CATEGORIES: Category[] = ['All', 'Narrative Short', 'Music Video', 'Commercial']

// ── Published card ─────────────────────────────────────────────────────────────
function PublishedCard({ item, onClick }: { item: VideoItem; onClick: () => void }) {
  return (
    <motion.div
      layout
      key={item.uid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-950">
        <Image
          src={`https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`}
          alt={item.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-50"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/15 transition-colors duration-500" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-violet-400 text-[9px] tracking-[0.22em] uppercase mb-1">{item.role}</p>
              <h3 className="text-white font-semibold text-sm leading-tight truncate">{item.title}</h3>
              {item.director && (
                <p className="text-gray-500 text-[10px] mt-0.5 tracking-wide">{item.director}</p>
              )}
            </div>
            <span className="text-gray-600 text-[10px] tracking-widest flex-shrink-0">{item.year}</span>
          </div>
        </div>

        <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/25 transition-colors duration-500" />
      </div>
    </motion.div>
  )
}

// ── Coming Soon card ───────────────────────────────────────────────────────────
function ComingSoonCard({ item }: { item: VideoItem }) {
  return (
    <motion.div
      layout
      key={item.uid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative aspect-video bg-[#0c0c0c] border border-white/[0.05]">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)`,
          }}
        />
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
          </span>
          <span className="text-violet-400/50 text-[9px] tracking-[0.25em] uppercase">In Production</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-violet-400/30 text-[9px] tracking-[0.22em] uppercase mb-1">{item.role}</p>
          <h3 className="text-gray-600 font-semibold text-sm">{item.title}</h3>
          {item.director && (
            <p className="text-gray-700 text-[10px] mt-0.5 tracking-wide">{item.director}</p>
          )}
          <span className="text-gray-700 text-[10px] tracking-widest mt-1 block">{item.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const ref = useRef(null)
  const aeRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const aeInView = useInView(aeRef, { once: true, margin: '-80px' })

  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [selected, setSelected] = useState<VideoItem | null>(null)

  // published first, coming_soon after
  const filtered = videos
    .filter(v => activeCategory === 'All' || v.category === activeCategory)
    .sort((a, b) => {
      if (a.status === b.status) return 0
      return a.status === 'published' ? -1 : 1
    })

  const counts: Record<Category, number> = {
    All: videos.length,
    'Narrative Short': videos.filter(v => v.category === 'Narrative Short').length,
    'Music Video': videos.filter(v => v.category === 'Music Video').length,
    Commercial: videos.filter(v => v.category === 'Commercial').length,
  }

  return (
    <section id="portfolio" className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-4">Selected Work</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Portfolio</h2>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex items-center gap-0 mb-10 border-b border-white/[0.08]"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                  activeCategory === cat ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[9px] ${activeCategory === cat ? 'text-violet-400' : 'text-gray-700'}`}>
                  {counts[cat]}
                </span>
                {activeCategory === cat && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-violet-500"
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(item =>
              item.status === 'published' ? (
                <PublishedCard key={item.uid} item={item} onClick={() => setSelected(item)} />
              ) : (
                <ComingSoonCard key={item.uid} item={item} />
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── AE Credits ─────────────────────────────────────────────────────── */}
        <div ref={aeRef} className="mt-20 pt-16 border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={aeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10">Credits</p>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">

              {/* Assistant Editor */}
              <div>
                <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mb-6">Assistant Editor</p>
                {aeCredits.map((credit, i) => (
                  <motion.div
                    key={credit.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={aeInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                    className="flex items-baseline justify-between gap-4 py-3.5 border-b border-white/[0.06] first:border-t first:border-white/[0.06]"
                  >
                    <div className="min-w-0">
                      <span className="text-white text-sm font-medium tracking-wide block">{credit.title}</span>
                      <span className="text-gray-600 text-[10px] tracking-wide mt-0.5 block">{credit.director}</span>
                    </div>
                    <span className="text-gray-700 text-[10px] tracking-widest flex-shrink-0">{credit.year}</span>
                  </motion.div>
                ))}
              </div>

              {/* Script Supervisor */}
              <div>
                <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mb-6">Script Supervisor</p>
                {ssCredits.map((credit, i) => (
                  <motion.div
                    key={credit.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={aeInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                    className="flex items-baseline justify-between gap-4 py-3.5 border-b border-white/[0.06] first:border-t first:border-white/[0.06]"
                  >
                    <div className="min-w-0">
                      <span className="text-white text-sm font-medium tracking-wide block">{credit.title}</span>
                      <span className="text-gray-600 text-[10px] tracking-wide mt-0.5 block">{credit.director}</span>
                    </div>
                    <span className="text-gray-700 text-[10px] tracking-widest flex-shrink-0">{credit.year}</span>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        </div>

      </div>

      <AnimatePresence>
        {selected?.id && (
          <VideoModal videoId={selected.id} title={selected.title} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
