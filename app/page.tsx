import fs from 'fs/promises'
import path from 'path'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Portfolio from '@/components/Portfolio'
import Recognition from '@/components/Recognition'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import type { FestivalData } from '@/components/Recognition'

async function getFestivalData(): Promise<FestivalData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'festivals.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as FestivalData
  } catch {
    return { updated: '', films: [] }
  }
}

export default async function Home() {
  const festivalData = await getFestivalData()

  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Recognition festivalData={festivalData} />
      <Contact />
      <Footer />
    </main>
  )
}
