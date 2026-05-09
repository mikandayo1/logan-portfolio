'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const awards = [
  {
    festival: 'Student Los Angeles Film Awards',
    honor: 'Official Selection',
    year: '2024',
  },
  {
    festival: 'Milan Shorts Film Festival',
    honor: 'Official Selection',
    year: '2024',
  },
]

const skills = [
  'Avid Media Composer',
  'Adobe Premiere Pro',
  'DaVinci Resolve',
  'Final Cut Pro',
  'After Effects',
  'Narrative Editing',
  'Documentary',
  'Cinematography',
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
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                  className="flex items-start gap-5 py-6 border-b border-white/[0.07] first:border-t first:border-white/[0.07]"
                >
                  <div className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-medium leading-snug">{award.festival}</p>
                      <p className="text-gray-500 text-xs tracking-wide mt-1">{award.honor}</p>
                    </div>
                    <span className="text-gray-600 text-xs tracking-widest flex-shrink-0">
                      {award.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Avid badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 inline-flex items-center gap-3 border border-white/10 px-5 py-3"
            >
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-gray-400 text-xs tracking-[0.15em] uppercase">
                Avid Media Composer Certified
              </span>
            </motion.div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-10">
              Tools & Expertise
            </p>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="px-4 py-2 border border-white/[0.1] text-gray-400 text-[10px] tracking-[0.15em] uppercase hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
