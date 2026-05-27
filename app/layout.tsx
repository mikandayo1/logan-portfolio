import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Yujie "Logan" Luo | Editor',
  description:
    'Film editor based in Los Angeles. MFA in Editing, AFI Conservatory. Narrative short films, Assistant Editor.',
  keywords: ['film editor', 'assistant editor', 'DIT', 'Los Angeles', 'AFI Conservatory', 'portfolio'],
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
