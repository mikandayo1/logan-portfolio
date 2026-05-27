'use client'
import { useState, useMemo } from 'react'
import type { FestivalData, Festival, FilmEntry } from '@/components/Recognition'

// ── Types ──────────────────────────────────────────────────────────────────

interface SelectableEntry {
  film: string
  festName: string
  status: Festival['status']
  label: string
  key: string
  checked: boolean
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
  winner:            { badge: 'bg-amber-950/60 text-amber-400 border-amber-500/40',    dot: 'bg-amber-400' },
  finalist:          { badge: 'bg-violet-950/60 text-violet-300 border-violet-500/40', dot: 'bg-violet-400' },
  honorable_mention: { badge: 'bg-sky-950/60 text-sky-300 border-sky-500/40',          dot: 'bg-sky-400' },
  selected:          { badge: 'bg-white/[0.03] text-gray-400 border-white/10',         dot: 'bg-gray-500' },
  not_accepted:      { badge: 'bg-red-950/40 text-red-400/60 border-red-800/30',       dot: 'bg-red-700' },
  withdrawn:         { badge: 'bg-white/[0.02] text-gray-600 border-white/5',          dot: 'bg-gray-700' },
}

const STATUS_LABEL: Record<string, string> = {
  winner:            '🏆 Award Winner',
  finalist:          '🥈 Finalist',
  honorable_mention: '🎖 Honorable Mention',
  selected:          '✅ Official Selection',
  not_accepted:      '✗ Not Accepted',
  withdrawn:         '— Withdrawn',
}

const STATUS_RANK = ['winner', 'finalist', 'honorable_mention', 'selected', 'not_accepted', 'withdrawn']

function makeKey(film: string, fest: string) {
  return `${film}|||${fest}`
}

function buildEntries(allData: FestivalData, currentData: FestivalData): SelectableEntry[] {
  const checkedKeys: Record<string, boolean> = {}
  for (const film of currentData.films) {
    for (const f of film.festivals) {
      checkedKeys[makeKey(film.title, f.name)] = true
    }
  }

  const entries: SelectableEntry[] = []
  for (const film of allData.films) {
    for (const f of film.festivals) {
      const key = makeKey(film.title, f.name)
      entries.push({
        film: film.title,
        festName: f.name,
        status: f.status,
        label: f.label,
        key,
        checked: !!checkedKeys[key],
      })
    }
  }
  return entries
}

function buildExportData(entries: SelectableEntry[]): FestivalData {
  const filmOrder: string[] = []
  const filmMap: Record<string, Festival[]> = {}
  for (const e of entries) {
    if (!e.checked) continue
    if (!filmMap[e.film]) {
      filmMap[e.film] = []
      filmOrder.push(e.film)
    }
    filmMap[e.film].push({ name: e.festName, status: e.status, label: e.label })
  }
  const films: FilmEntry[] = filmOrder.map(title => {
    const festivals = filmMap[title].sort(
      (a: Festival, b: Festival) => STATUS_RANK.indexOf(a.status) - STATUS_RANK.indexOf(b.status)
    )
    return { title, festivals }
  })
  return { updated: new Date().toISOString(), films }
}

// ── Main Component ─────────────────────────────────────────────────────────

interface Props {
  allData: FestivalData
  currentData: FestivalData
}

export default function FestivalCurator({ allData, currentData }: Props) {
  const [entries, setEntries] = useState<SelectableEntry[]>(() =>
    buildEntries(allData, currentData)
  )
  const [filter, setFilter] = useState<string>('all')
  const [downloaded, setDownloaded] = useState(false)

  const filmTitles = useMemo(() => {
    const seen: Record<string, boolean> = {}
    return entries.map(e => e.film).filter(f => seen[f] ? false : (seen[f] = true))
  }, [entries])

  const stats = useMemo(() => {
    const checked = entries.filter(e => e.checked)
    return {
      total: entries.length,
      selected: checked.length,
      winner: checked.filter(e => e.status === 'winner').length,
      finalist: checked.filter(e => e.status === 'finalist').length,
      honorable: checked.filter(e => e.status === 'honorable_mention').length,
      official: checked.filter(e => e.status === 'selected').length,
    }
  }, [entries])

  const visibleEntries = useMemo(() => {
    if (filter === 'all') return entries
    if (filter === 'checked') return entries.filter(e => e.checked)
    return entries.filter(e => e.film === filter)
  }, [entries, filter])

  function toggle(key: string) {
    setEntries(prev => prev.map(e => e.key === key ? { ...e, checked: !e.checked } : e))
    setDownloaded(false)
  }

  function selectByStatus(...statuses: string[]) {
    setEntries(prev => prev.map(e => ({
      ...e,
      checked: statuses.includes(e.status) ? true : e.checked,
    })))
    setDownloaded(false)
  }

  function uncheckByStatus(...statuses: string[]) {
    setEntries(prev => prev.map(e => ({
      ...e,
      checked: statuses.includes(e.status) ? false : e.checked,
    })))
    setDownloaded(false)
  }

  function downloadJSON() {
    const data = buildExportData(entries)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'festivals.json'
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-lg tracking-[0.2em] uppercase text-white">
              Festival Curator
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-wider">
              只在本地 localhost 可用 · 数据来源: festivals_all.json
            </p>
          </div>
          <div className="text-[10px] text-gray-600 tracking-wider">
            最后更新: {new Date(allData.updated).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

        {/* How-to instructions */}
        <div className="border border-violet-500/20 bg-violet-950/10 px-6 py-5 text-sm leading-7 text-gray-300">
          <p className="text-violet-400 text-[10px] tracking-[0.3em] uppercase mb-3">使用方法</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400 tracking-wide">
            <li>在下方表格里，<strong className="text-white">打勾</strong>选择你想在网站上展示的电影节</li>
            <li>点击底部的 <strong className="text-violet-300">「下载 festivals.json」</strong> 按钮</li>
            <li>把下载的文件拖拽到 <code className="text-amber-400 bg-white/5 px-1">public/data/</code> 文件夹，替换掉旧的</li>
            <li>在 GitHub Desktop 里 Commit 并 Push → 网站自动更新</li>
          </ol>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '总条目', value: stats.total, color: 'text-gray-400' },
            { label: '已选中', value: stats.selected, color: 'text-violet-300' },
            { label: 'Award Winner', value: stats.winner, color: 'text-amber-400' },
            { label: 'Finalist', value: stats.finalist, color: 'text-violet-300' },
          ].map(s => (
            <div key={s.label} className="border border-white/10 px-4 py-3">
              <div className={`text-2xl font-light ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick-select buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] text-gray-600 tracking-widest uppercase self-center mr-2">快速选择:</span>
          <button
            onClick={() => selectByStatus('winner')}
            className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-amber-500/30 text-amber-400 hover:bg-amber-950/30 transition-colors"
          >
            + 全部 Winner
          </button>
          <button
            onClick={() => selectByStatus('finalist')}
            className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-violet-500/30 text-violet-300 hover:bg-violet-950/30 transition-colors"
          >
            + 全部 Finalist
          </button>
          <button
            onClick={() => selectByStatus('honorable_mention')}
            className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-sky-500/30 text-sky-300 hover:bg-sky-950/30 transition-colors"
          >
            + 全部 Honorable Mention
          </button>
          <button
            onClick={() => uncheckByStatus('not_accepted', 'withdrawn')}
            className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-white/10 text-gray-500 hover:bg-white/5 transition-colors"
          >
            − 取消未入选
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <span className="text-[10px] text-gray-600 tracking-widest uppercase self-center mr-2">筛选:</span>
          {[
            { key: 'all', label: '全部' },
            { key: 'checked', label: '已选中' },
            ...filmTitles.map(t => ({ key: t, label: t })),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1 text-[10px] tracking-wider uppercase border transition-colors ${
                filter === tab.key
                  ? 'border-violet-500/60 text-violet-300 bg-violet-950/20'
                  : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-0 border border-white/[0.07]">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_3fr_1fr_40px] gap-4 px-4 py-2 bg-white/[0.02] border-b border-white/[0.07]">
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">影片</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">电影节</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">状态</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600 text-right">展示</span>
          </div>

          {visibleEntries.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-600 text-sm">暂无数据</div>
          )}

          {visibleEntries.map((entry) => {
            const s = STATUS_STYLE[entry.status] ?? STATUS_STYLE.selected
            return (
              <label
                key={entry.key}
                className={`grid grid-cols-[2fr_3fr_1fr_40px] gap-4 px-4 py-3 border-b border-white/[0.05] cursor-pointer transition-colors ${
                  entry.checked ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.015]'
                }`}
              >
                <span className={`text-xs truncate ${entry.checked ? 'text-gray-300' : 'text-gray-600'}`}>
                  {entry.film}
                </span>
                <span className={`text-xs truncate ${entry.checked ? 'text-white' : 'text-gray-500'}`}>
                  {entry.festName}
                </span>
                <span>
                  <span className={`inline-block text-[9px] tracking-[0.12em] uppercase border px-2 py-0.5 ${s.badge}`}>
                    {STATUS_LABEL[entry.status] ?? entry.label}
                  </span>
                </span>
                <div className="flex justify-end items-center">
                  <input
                    type="checkbox"
                    checked={entry.checked}
                    onChange={() => toggle(entry.key)}
                    className="w-4 h-4 accent-violet-500 cursor-pointer"
                  />
                </div>
              </label>
            )
          })}
        </div>

        {/* Download button */}
        <div className="flex items-center gap-4 pt-2 pb-16">
          <button
            onClick={downloadJSON}
            className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white text-sm tracking-[0.15em] uppercase transition-colors"
          >
            下载 festivals.json ({stats.selected} 条)
          </button>
          {downloaded && (
            <div className="text-xs text-emerald-400 tracking-wider">
              ✓ 文件已下载 — 把它拖到 public/data/ 替换旧文件，然后 Commit &amp; Push
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
