import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Yujie "Logan" Luo | Editor & Cinematographer',
  description:
    'Film editor and cinematographer based in Los Angeles. AFI Conservatory. Crafting visually engaging stories that challenge stereotypes and spotlight diverse perspectives.',
  keywords: ['film editor', 'cinematographer', 'Los Angeles', 'AFI Conservatory', 'portfolio'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
