'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* YouTube video background */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '177.78vh', minWidth: '100%', minHeight: '100%', height: '56.25vw' }}
          src="https://www.youtube.com/embed/TxYoXras3WI?autoplay=1&mute=1&loop=1&playlist=TxYoXras3WI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
          allow="autoplay; fullscreen"
          frameBorder="0"
          title="Showreel"
        />
        {/* Layered overlays for cinematic feel */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/25 via-transparent to-violet-950/15" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ delay: 0.6, duration: 1.4 }}
          className="text-violet-400 text-[10px] md:text-xs tracking-[0.35em] uppercase mb-6 font-light"
        >
          Editor · Cinematographer · AFI Conservatory
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[4rem] sm:text-[7rem] md:text-[10rem] font-bold tracking-tighter leading-none"
          >
            LOGAN
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.05, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[4rem] sm:text-[7rem] md:text-[10rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-violet-400"
          >
            LUO
          </motion.h1>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.9 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent my-7"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="text-gray-400 text-sm md:text-base font-light tracking-wide max-w-xs md:max-w-sm"
        >
          Based in Los Angeles · Crafting stories that matter
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <a
            href="#portfolio"
            className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white px-9 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="border border-white/20 hover:border-violet-500/60 text-gray-300 hover:text-white px-9 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
      >
        <span className="text-gray-600 text-[9px] tracking-[0.35em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-violet-500/70 to-transparent"
        />
      </motion.div>
    </section>
  )
}
