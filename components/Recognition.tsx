'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const awards = [
  { festival: 'Los Angeles Movie Awards', year: '2025' },
  { festival: 'New York HiCine Film Festival', year: '2025' },
  { festival: 'ARFF Berlin International Film Festival', year: '2025' },
  { festival: 'Macau International Film Festival', year: '2024' },
  { festival: 'Milan Shorts Film Festival', year: '2024' },
  { festival: 'Student Los Angeles Film Awards', year: '2024' },
]

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

export default function Recognition() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section ref={ref} className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10">
              Recognition
            </p>
            <div className="space-y-0">
              {awards.map((award, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-5 py-5 border-b border-white/[0.07] first:border-t first:border-white/[0.07]"
                >
                  <div className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <p className="text-white font-medium leading-snug text-sm">{award.festival}</p>
                    <span className="text-gray-600 text-xs tracking-widest flex-shrink-0">
                      {award.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Avid badge — links to Credly */}
            <motion.a
              href="https://www.credly.com/badges/bdec437c-94c6-4a46-a98c-af357dec3112/public_url"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 inline-flex items-center gap-3 border border-white/10 px-4 py-3 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 group"
            >
              {/* Badge image — put avid-badge.png in /public folder */}
              <div className="w-8 h-8 relative flex-shrink-0">
                <Image
                  src="/avid-badge.png"
                  alt="Avid Certified"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // fallback dot if image not found yet
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <div>
                <p className="text-gray-300 text-xs tracking-[0.12em] uppercase group-hover:text-violet-300 transition-colors">
                  Avid Media Composer Certified
                </p>
                <p className="text-gray-600 text-[10px] mt-0.5">View on Credly ↗</p>
              </div>
            </motion.a>
          </motion.div>

          {/* Skills + Languages */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-10"
          >
            {/* Technical */}
            <div>
              <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">
                Technical Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    className="px-3.5 py-2 border border-white/[0.1] text-gray-400 text-[10px] tracking-[0.12em] uppercase hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                    className="px-3.5 py-2 border border-violet-900/40 text-violet-300/70 text-[10px] tracking-[0.12em] uppercase hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
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
