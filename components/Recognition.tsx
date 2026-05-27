'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

// ── Types (exported so page.tsx can import them) ──────────────────────────────
export interface Festival {
  name: string
  status: 'winner' | 'finalist' | 'honorable_mention' | 'selected'
  label: string
}
export interface Film {
  title: string
  festivals: Festival[]
}
export type FilmEntry = Film   // alias used by FestivalCurator
export interface FestivalData {
  updated: string
  films: Film[]
}

// ── Status styling ─────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  winner: 'text-violet-300',
  finalist: 'text-violet-400/60',
  honorable_mention: 'text-violet-400/50',
  selected: 'text-gray-500',
}
const statusDot: Record<string, string> = {
  winner: 'bg-violet-400',
  finalist: 'bg-violet-600',
  honorable_mention: 'bg-violet-800',
  selected: 'bg-gray-700',
}

// ── Static skills data ─────────────────────────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────────────────────────
export default function Recognition({ festivalData }: { festivalData: FestivalData }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section ref={ref} className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ── Festival Selections (dynamic from JSON) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10">
            Festival Selections
          </p>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {festivalData.films.map((film, fi) => (
              <motion.div
                key={film.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + fi * 0.12 }}
              >
                <p className="text-white font-semibold text-sm tracking-wide mb-4 pb-3 border-b border-white/[0.08]">
                  {film.title}
                </p>
                <div className="space-y-2.5">
                  {film.festivals.map((fest, i) => (
                    <motion.div
                      key={fest.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + fi * 0.12 + i * 0.07 }}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${statusDot[fest.status] ?? 'bg-gray-700'}`} />
                        <p className="text-gray-400 text-xs leading-snug truncate">{fest.name}</p>
                      </div>
                      <p className={`text-[10px] tracking-wider flex-shrink-0 ${statusColor[fest.status] ?? 'text-gray-600'}`}>
                        {fest.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Skills + Languages + Avid ── */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">

          {/* Avid + Technical */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">
                Technical Skills
              </p>

              {/* Avid badge */}
              <a
                href="https://www.credly.com/badges/bdec437c-94c6-4a46-a98c-af357dec3112/public_url"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/[0.08] px-4 py-3 mb-5 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 group"
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
                  <p className="text-gray-300 text-[10px] tracking-[0.15em] uppercase group-hover:text-violet-300 transition-colors">
                    Avid Certified Specialist
                  </p>
                  <p className="text-gray-600 text-[9px] mt-0.5">View credential ↗</p>
                </div>
              </a>

              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="px-3.5 py-2 border border-white/[0.1] text-gray-400 text-[10px] tracking-[0.12em] uppercase hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">
              Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="px-3.5 py-2 border border-violet-900/40 text-violet-300/70 text-[10px] tracking-[0.12em] uppercase hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                >
                  {lang}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
