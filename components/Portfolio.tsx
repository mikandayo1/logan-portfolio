'use client'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import VideoModal from './VideoModal'

// ── Types ─────────────────────────────────────────────────────────────────────
type Tag = 'Narrative Short' | 'Music Video' | 'Commercial' | 'Promotional' | 'Cantonese' | 'Mandarin'
type Status = 'published' | 'coming_soon'

interface VideoItem {
  uid: string
  id: string | null
  title: string
  tags: Tag[]
  role: string
  year: string
  director?: string
  status: Status
  protected?: boolean
}

// ── Data ──────────────────────────────────────────────────────────────────────
const videos: VideoItem[] = [
  // ── Published ──────────────────────────────────────────────────────────────
  {
    uid: 'lpj',
    id: 'sCV1W7zGhpI',
    title: 'Love! Peace! Joy!',
    tags: ['Narrative Short'],
    role: 'Editor',
    year: '2024',
    director: 'dir. Evan Korycki',
    status: 'published',
  },
  {
    uid: 'almi',
    id: 'JIraNgXvPIA',
    title: 'A Little Minor Issue',
    tags: ['Narrative Short'],
    role: 'Editor',
    year: '2025',
    director: 'dir. Harry Chiao',
    status: 'published',
  },
  {
    uid: 'contact',
    id: 'dn3oMdXs_OE',
    title: 'Contact',
    tags: ['Narrative Short', 'Cantonese'],
    role: 'Editor & Cinematographer',
    year: '2023',
    director: 'dir. Yujie Logan Luo',
    status: 'published',
  },
  {
    uid: 'stuck',
    id: 'TxYoXras3WI',
    title: "I'm Stuck",
    tags: ['Narrative Short'],
    role: 'Editor',
    year: '2025',
    director: 'dir. Zishu Zhou',
    status: 'published',
  },
  {
    uid: 'reel23',
    id: 'EzriLrAqcOU',
    title: 'Cinematography Reel 2023',
    tags: ['Narrative Short'],
    role: 'Cinematographer',
    year: '2023',
    status: 'published',
  },
  {
    uid: 'maque',
    id: 'RB1H9MYnQJ4',
    title: '麻雀 Flying in the Grey',
    tags: ['Narrative Short', 'Cantonese'],
    role: 'Editor',
    year: '2023',
    status: 'published',
  },
  {
    uid: 'nightlife',
    id: '8zm5zsqbvzs',
    title: '帶我去找夜生活',
    tags: ['Music Video', 'Mandarin'],
    role: 'Editor',
    year: '2022',
    status: 'published',
  },
  {
    uid: 'among-us',
    id: 'h5V6_88U7c0',
    title: 'Among Us',
    tags: ['Music Video'],
    role: 'Editor',
    year: '2026',
    status: 'published',
    protected: true,
  },
  {
    uid: 'valley-boys',
    id: '0YL0jBYZjzE',
    title: 'Valley Boys',
    tags: ['Music Video'],
    role: 'Editor',
    year: '2026',
    status: 'published',
    protected: true,
  },
  {
    uid: 'ace-pilot',
    id: 'Ql34ddY8Hv0',
    title: 'TV Pilot · Selected Scenes',
    tags: ['Narrative Short'],
    role: 'Editor',
    year: '2025',
    status: 'published',
    protected: true,
  },
  {
    uid: 'art',
    id: 'tpw9OzTOhRg',
    title: '藝術為你而來',
    tags: ['Promotional', 'Mandarin'],
    role: 'Editor',
    year: '2021',
    status: 'published',
    protected: true,
  },
  {
    uid: 'census',
    id: '6MBpZOOot10',
    title: '數說人口 · 普查數據中的澳門模樣',
    tags: ['Promotional', 'Cantonese'],
    role: 'Editor',
    year: '2022',
    status: 'published',
    protected: true,
  },
  // ── Coming Soon ────────────────────────────────────────────────────────────
  {
    uid: 'little-egypt',
    id: null,
    title: 'Little Egypt',
    tags: ['Narrative Short'],
    role: 'Editor',
    year: '2026',
    director: 'dir. Jason Wolfmiller',
    status: 'coming_soon',
  },
  {
    uid: 'mv-2026-a',
    id: null,
    title: 'Music Video',
    tags: ['Music Video'],
    role: 'Editor',
    year: '2026',
    status: 'coming_soon',
  },
  {
    uid: 'commercial-2026',
    id: null,
    title: 'Commercial Project',
    tags: ['Commercial'],
    role: 'Editor',
    year: '2026',
    status: 'coming_soon',
  },
]

// ── AE & Script Supervisor credits ────────────────────────────────────────────
const aeCredits = [
  { title: 'Old Habits Die Hard',            director: 'dir. Jason Wolfmiller',        year: '2025' },
  { title: 'Captain Marisol and Peach Tree', director: 'dir. Sahej Singh Nandrajog',  year: '2025' },
  { title: 'Mr. Wrong',                      director: 'dir. Kaylin Allshouse',        year: '2025' },
  { title: 'Paper House',                    director: 'dir. Harry Chiao',             year: '2025' },
  { title: 'Federal Crisis',                 director: 'dir. Hannah Pike',             year: '2024' },
  { title: 'Breakfast',                      director: 'dir. Tamás Hevér',             year: '2024' },
]
const ssCredits = [
  { title: 'The Day She Arrives', director: 'dir. Jiaxin (Kristal) Li', year: '2026' },
  { title: 'Ghost House',         director: 'dir. Harry Chiao',         year: '2025' },
  { title: 'Sweetheart',          director: 'dir. Tamás Hevér',         year: '2025' },
]

// ── Password modal ────────────────────────────────────────────────────────────
const PASSWORD = '123456'

function PasswordModal({
  title,
  onSuccess,
  onClose,
}: {
  title: string
  onSuccess: () => void
  onClose: () => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-sm border border-white/10 bg-[#0d0d0d] p-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 text-xs tracking-widest"
        >
          ✕
        </button>

        <div className="mb-6">
          <p className="text-violet-400 text-[9px] tracking-[0.35em] uppercase mb-2">Private Content</p>
          <h3 className="text-white font-medium text-sm leading-snug">{title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            autoFocus
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            placeholder="Enter password"
            className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition-colors"
          />
          {error && (
            <p className="text-red-400/70 text-[10px] tracking-wider">Incorrect password.</p>
          )}
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            View
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Tag chip ──────────────────────────────────────────────────────────────────
const tagStyle: Partial<Record<Tag, string>> = {
  Cantonese: 'text-sky-400/70',
  Mandarin:  'text-amber-400/70',
}

function TagPill({ tag }: { tag: Tag }) {
  return (
    <span className={`text-[9px] tracking-[0.18em] uppercase ${tagStyle[tag] ?? 'text-violet-400/60'}`}>
      {tag}
    </span>
  )
}

// ── Published card ─────────────────────────────────────────────────────────────
function PublishedCard({
  item,
  onClick,
}: {
  item: VideoItem
  onClick: () => void
}) {
  const langTags = item.tags.filter(t => t === 'Cantonese' || t === 'Mandarin')
  const typeTags = item.tags.filter(t => t !== 'Cantonese' && t !== 'Mandarin')

  return (
    <motion.div
      layout
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

        {/* Lock badge */}
        {item.protected && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1">
            <svg className="w-2.5 h-2.5 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span className="text-violet-400 text-[9px] tracking-widest uppercase">Private</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            {item.protected
              ? <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              : <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            }
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {typeTags.map(t => <TagPill key={t} tag={t} />)}
                {langTags.map(t => <TagPill key={t} tag={t} />)}
                <span className="text-gray-500 text-[9px] tracking-[0.18em] uppercase">{item.role}</span>
              </div>
              <h3 className="text-white font-semibold text-sm leading-tight">{item.title}</h3>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative aspect-video bg-[#0c0c0c] border border-white/[0.05]">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg,#fff 0px,#fff 1px,transparent 1px,transparent 14px)` }}
        />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
          </span>
          <span className="text-violet-400/50 text-[9px] tracking-[0.25em] uppercase">In Production</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-violet-400/30 text-[9px] tracking-[0.18em] uppercase mb-1">{item.role}</p>
          <h3 className="text-gray-600 font-semibold text-sm">{item.title}</h3>
          {item.director && <p className="text-gray-700 text-[10px] mt-0.5">{item.director}</p>}
          <span className="text-gray-700 text-[10px] tracking-widest mt-1 block">{item.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Credit row ────────────────────────────────────────────────────────────────
function CreditRow({ credit, delay, inView }: { credit: { title: string; director: string; year: string }; delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex items-baseline justify-between gap-4 py-3.5 border-b border-white/[0.06] first:border-t first:border-white/[0.06]"
    >
      <div className="min-w-0">
        <span className="text-white text-sm font-medium tracking-wide block">{credit.title}</span>
        <span className="text-gray-600 text-[10px] tracking-wide mt-0.5 block">{credit.director}</span>
      </div>
      <span className="text-gray-700 text-[10px] tracking-widest flex-shrink-0">{credit.year}</span>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const ref = useRef(null)
  const aeRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const aeInView = useInView(aeRef, { once: true, margin: '-80px' })

  const [selected, setSelected] = useState<VideoItem | null>(null)
  const [pendingProtected, setPendingProtected] = useState<VideoItem | null>(null)

  const byStatus = (a: VideoItem, b: VideoItem) => {
    if (a.status === b.status) return 0
    return a.status === 'published' ? -1 : 1
  }
  const narrative = videos.filter(v => v.tags.includes('Narrative Short')).sort(byStatus)
  const otherWork = videos.filter(v => !v.tags.includes('Narrative Short')).sort(byStatus)

  function handleCardClick(item: VideoItem) {
    if (item.protected) {
      setPendingProtected(item)
    } else {
      setSelected(item)
    }
  }

  return (
    <section id="portfolio" className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">

        {/* Narrative */}
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-4">Selected Work</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Narrative</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {narrative.map(item =>
            item.status === 'published' ? (
              <PublishedCard key={item.uid} item={item} onClick={() => handleCardClick(item)} />
            ) : (
              <ComingSoonCard key={item.uid} item={item} />
            )
          )}
        </div>

        {/* Other Work */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-4">Music Videos · Commercial · More</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Other Work</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherWork.map(item =>
              item.status === 'published' ? (
                <PublishedCard key={item.uid} item={item} onClick={() => handleCardClick(item)} />
              ) : (
                <ComingSoonCard key={item.uid} item={item} />
              )
            )}
          </div>
        </div>

        {/* Credits */}
        <div ref={aeRef} className="mt-20 pt-16 border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={aeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10">Credits</p>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              <div>
                <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mb-6">Assistant Editor</p>
                {aeCredits.map((c, i) => <CreditRow key={c.title} credit={c} delay={0.1 + i * 0.07} inView={aeInView} />)}
              </div>
              <div>
                <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mb-6">Script Supervisor</p>
                {ssCredits.map((c, i) => <CreditRow key={c.title} credit={c} delay={0.2 + i * 0.07} inView={aeInView} />)}
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {pendingProtected && (
          <PasswordModal
            key="pw-modal"
            title={pendingProtected.title}
            onSuccess={() => {
              setSelected(pendingProtected)
              setPendingProtected(null)
            }}
            onClose={() => setPendingProtected(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selected?.id && (
          <VideoModal key="video-modal" videoId={selected.id} title={selected.title} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
