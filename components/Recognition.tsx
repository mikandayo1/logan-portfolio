'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Festival {
  name: string
  status: 'winner' | 'finalist' | 'honorable_mention' | 'selected'
  label: string
}
export interface Film {
  title: string
  festivals: Festival[]
}
export type FilmEntry = Film
export interface FestivalData {
  updated: string
  films: Film[]
}

// ── Status rank for sorting ───────────────────────────────────────────────────
const STATUS_RANK = ['winner', 'finalist', 'honorable_mention', 'selected']

const statusColor: Record<string, string> = {
  winner:            'text-violet-300',
  finalist:          'text-violet-400/70',
  honorable_mention: 'text-gray-400',
  selected:          'text-gray-600',
}

// ── Skills ────────────────────────────────────────────────────────────────────
const technicalSkills = [
  'Avid Media Composer',
  'Adobe Premiere Pro',
  'DaVinci Resolve',
  'After Effects',
  'Photoshop',
  'Final Cut Pro',
  'Pro Tools',
  'Media Management',
  'Workflow Coordination',
]
const languages = [
  'Mandarin Chinese (Native)',
  'English (Fluent)',
  'Cantonese (Fluent)',
  'Japanese (Basic)',
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Recognition({ festivalData }: { festivalData: FestivalData }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  // Flatten all festivals across films, sorted by status
  const flatFestivals = festivalData.films
    .flatMap(film => film.festivals)
    .sort((a, b) => STATUS_RANK.indexOf(a.status) - STATUS_RANK.indexOf(b.status))

  return (
    <section ref={ref} className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">

          {/* ── Festival list ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10 font-light">
              Recognition
            </p>

            <div>
              {flatFestivals.map((fest, i) => (
                <motion.div
                  key={fest.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.07 }}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-white/[0.06] first:border-t first:border-white/[0.06]"
                >
                  <p className="text-white font-light text-sm leading-snug tracking-wide">
                    {fest.name}
                  </p>
                  <p className={`text-[10px] tracking-[0.15em] uppercase flex-shrink-0 font-light ${statusColor[fest.status] ?? 'text-gray-600'}`}>
                    {fest.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Avid badge */}
            <motion.a
              href="https://www.credly.com/badges/bdec437c-94c6-4a46-a98c-af357dec3112/public_url"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 inline-flex items-center gap-3 border border-white/[0.08] px-4 py-3 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 group"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/avid-badge.png"
                  alt="Avid Media Composer Certified"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-gray-300 text-[10px] tracking-[0.18em] uppercase font-light group-hover:text-violet-300 transition-colors">
                  Avid Certified Specialist
                </p>
                <p className="text-gray-600 text-[9px] mt-0.5 font-light tracking-wider">View credential ↗</p>
              </div>
            </motion.a>
          </motion.div>

          {/* ── Skills + Languages ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-12"
          >
            <div>
              <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6 font-light">
                Technical Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    className="px-3.5 py-1.5 border border-white/[0.1] text-gray-400 text-[10px] tracking-[0.15em] uppercase font-light hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6 font-light">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                    className="px-3.5 py-1.5 border border-violet-900/40 text-violet-300/60 text-[10px] tracking-[0.15em] uppercase font-light hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
