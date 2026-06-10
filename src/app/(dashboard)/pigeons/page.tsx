'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Bird } from 'lucide-react'
import { SEX_LABELS, STATUS_LABELS, formatDate } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  BREEDER: 'bg-blue-50 text-blue-700',
  LOST: 'bg-red-50 text-red-700',
  SOLD: 'bg-gray-100 text-gray-600',
  DECEASED: 'bg-gray-100 text-gray-500',
  YOUNG: 'bg-amber-50 text-amber-700',
}

const SEX_ICON: Record<string, string> = {
  MALE: '♂',
  FEMALE: '♀',
  UNKNOWN: '?',
}

const SEX_COLOR: Record<string, string> = {
  MALE: 'text-blue-500',
  FEMALE: 'text-pink-500',
  UNKNOWN: 'text-gray-400',
}

export default function PigeonsPage() {
  const [pigeons, setPigeons] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sex, setSex] = useState('')
  const [status, setStatus] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPigeons = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (sex) params.set('sex', sex)
    if (status) params.set('status', status)
    const res = await fetch(`/api/pigeons?${params}`)
    const data = await res.json()
    setPigeons(data.pigeons || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { fetchPigeons() }, [page, sex, status])
  useEffect(() => {
    const t = setTimeout(fetchPigeons, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ștergi porumbelul "${name}"? Acțiunea nu poate fi anulată.`)) return
    setDeleting(id)
    await fetch(`/api/pigeons/${id}`, { method: 'DELETE' })
    fetchPigeons()
    setDeleting(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Registru porumbei</h1>
          <p className="text-sm text-gray-500 mt-1">{total} porumbei înregistrați</p>
        </div>
        <Link href="/pigeons/new" className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Adaugă porumbel
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Caută după serie inel..."
            className="text-sm outline-none bg-transparent flex-1"
          />
        </div>
        <select value={sex} onChange={e => { setSex(e.target.value); setPage(1) }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">Toate sexele</option>
          <option value="MALE">Masculin</option>
          <option value="FEMALE">Femelă</option>
          <option value="UNKNOWN">Necunoscut</option>
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">Toate statusurile</option>
          <option value="ACTIVE">Activ</option>
          <option value="BREEDER">Reproducător</option>
          <option value="LOST">Pierdut</option>
          <option value="SOLD">Vândut</option>
          <option value="DECEASED">Decedat</option>
          <option value="YOUNG">Pui</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Se încarcă...</div>
        ) : pigeons.length === 0 ? (
          <div className="text-center py-16">
            <Bird size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Niciun porumbel găsit</p>
            <Link href="/pigeons/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă primul porumbel</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Inel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Nume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Sex</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">An</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Culoare</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Tată</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Mamă</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pigeons.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/pigeons/${p.id}`} className="font-medium text-sage-600 hover:underline text-sm">
                      {p.ringNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-lg font-bold ${SEX_COLOR[p.sex]}`}>{SEX_ICON[p.sex]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.ringYear}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.color || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.father?.ringNumber || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.mother?.ringNumber || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/pigeons/${p.id}`} className="text-xs text-gray-500 hover:text-sage-600 px-2 py-1 rounded hover:bg-sage-50">
                        Vezi
                      </Link>
                      <Link href={`/pigeons/${p.id}/edit`} className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50">
                        Editează
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name || p.ringNumber)}
                        disabled={deleting === p.id}
                        className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Pagina {page} din {pages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">← Prev</button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Următor →</button>
          </div>
        </div>
      )}
    </div>
  )
}
