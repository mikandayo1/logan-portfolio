'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const stats = [
  { value: 'AFI', label: "Conservatory '26" },
  { value: '10+', label: 'Film Festivals' },
  { value: 'LA', label: 'Based' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section id="about" ref={ref} className="py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: Statement */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">
              About
            </p>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
              Sharp eyes.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-violet-200">
                Honest stories.
              </span>
            </h2>
          </motion.div>

          {/* Right: Bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-7"
          >
            <p className="text-gray-400 leading-relaxed text-base">
              I&apos;m Yujie &ldquo;Logan&rdquo; Luo, an editor based in Los Angeles, currently
              studying at AFI Conservatory &apos;26. Originally from Nanchang, China, with
              undergraduate film training in Macau, I bring a cross-cultural perspective to
              every frame.
            </p>
            <p className="text-gray-400 leading-relaxed text-base">
              Certified in Avid Media Composer, I specialize in crafting visually engaging
              narratives that challenge stereotypes, explore social issues, and spotlight
              diverse perspectives — work recognized at the Student Los Angeles Film Awards
              and Milan Shorts Film Festival.
            </p>

            {/* Stats */}
            <div className="flex gap-10 pt-6 border-t border-white/[0.07]">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.1 }}
                >
                  <p className="text-2xl font-bold text-violet-400">{stat.value}</p>
                  <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mt-1">
                    {stat.label}
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
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-flex items-center gap-3 border border-white/[0.08] px-4 py-3 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 group"
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
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
