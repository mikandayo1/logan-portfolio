import { readFileSync } from 'fs'
import { join } from 'path'
import FestivalCurator from '@/components/FestivalCurator'
import type { FestivalData } from '@/components/Recognition'

export default function AdminPage() {
  const allData: FestivalData = JSON.parse(
    readFileSync(join(process.cwd(), 'public/data/festivals_all.json'), 'utf-8')
  )
  const currentData: FestivalData = JSON.parse(
    readFileSync(join(process.cwd(), 'public/data/festivals.json'), 'utf-8')
  )

  return <FestivalCurator allData={allData} currentData={currentData} />
}
