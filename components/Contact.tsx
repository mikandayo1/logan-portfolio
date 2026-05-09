'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" ref={ref} className="py-40 px-6 border-t border-white/[0.05]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-violet-400 text-[10px] tracking-[0.35em] uppercase mb-6">Contact</p>
          <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold leading-tight mb-4">
            Let&apos;s fix it
          </h2>
          <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold leading-tight mb-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-white">
            in post.
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-400 text-base mb-3 max-w-md mx-auto leading-relaxed font-light"
          >
            Seeking opportunities as Assistant Editor or DIT.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-600 text-sm mb-12 max-w-md mx-auto leading-relaxed font-light"
          >
            Available for short film and freelance editing projects. Reach out anytime.
          </motion.p>

          <motion.a
            href="mailto:yujieloganluo@gmail.com"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="inline-block bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white px-12 py-4 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105 mb-12"
          >
            yujieloganluo@gmail.com
          </motion.a>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            <a
              href="https://www.instagram.com/mi_kan_dayo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-violet-400 text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
            >
              Instagram
            </a>
            <span className="w-px h-3 bg-white/15" />
            <a
              href="tel:6573331228"
              className="text-gray-600 hover:text-violet-400 text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
            >
              657-333-1228
            </a>
            <span className="w-px h-3 bg-white/15" />
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-violet-400 text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
            >
              Resume ↗
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
