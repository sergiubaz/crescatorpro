'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PedigreeNode {
  id: string
  ringNumber: string
  ringCountry: string
  ringYear: number
  name?: string
  sex: string
  color?: string
  importantResults?: string
  father?: PedigreeNode | null
  mother?: PedigreeNode | null
}

function PigeonCard({ pigeon, label, isMain = false }: { pigeon: PedigreeNode | null; label: string; isMain?: boolean }) {
  if (!pigeon) return (
    <div className="border border-dashed border-gray-300 rounded-lg p-3 min-w-36 bg-gray-50">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-400 italic">Necunoscut</p>
    </div>
  )

  return (
    <Link href={`/pigeons/${pigeon.id}`} className={`block rounded-lg p-3 min-w-36 transition-all hover:shadow-md ${isMain ? 'border-2 border-sage-500 bg-sage-50' : 'border border-gray-200 bg-white hover:border-sage-300'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{pigeon.ringNumber}</p>
      {pigeon.name && <p className="text-xs text-gray-600">{pigeon.name}</p>}
      <p className="text-xs text-gray-400">{pigeon.color || ''} · {pigeon.ringYear}</p>
      {pigeon.importantResults && (
        <p className="text-xs text-sage-600 mt-1 truncate">{pigeon.importantResults}</p>
      )}
    </Link>
  )
}

export default function PedigreePage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<PedigreeNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pigeons/${id}/pedigree`).then(r => r.json()).then(d => {
      setData(d)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă pedigree-ul...</div>
  if (!data || (data as any).error) return <div className="text-center py-20 text-gray-400">Porumbel negăsit.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Pedigree — {data.name || data.ringNumber}</h1>
          <p className="text-sm text-gray-500">Arbore genealogic pe 3 generații</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max">
          {/* Generația 0 — porumbelul principal */}
          <div className="flex flex-col justify-center">
            <PigeonCard pigeon={data} label="Porumbel" isMain />
          </div>

          {/* Linie conectare */}
          <div className="flex flex-col gap-8">
            <svg width="30" height="160" className="shrink-0">
              <line x1="0" y1="40" x2="15" y2="40" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="40" x2="15" y2="120" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="120" x2="30" y2="120" stroke="#CBD5E0" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Generația 1 — părinți */}
          <div className="flex flex-col gap-8">
            <PigeonCard pigeon={data.father || null} label="Tată" />
            <PigeonCard pigeon={data.mother || null} label="Mamă" />
          </div>

          {/* Linie conectare gen 2 */}
          <div className="flex flex-col gap-2">
            <svg width="30" height="320">
              <line x1="0" y1="30" x2="15" y2="30" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="30" x2="15" y2="80" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="80" x2="30" y2="80" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="0" y1="160" x2="15" y2="160" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="160" x2="15" y2="210" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="210" x2="30" y2="210" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="0" y1="250" x2="15" y2="250" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="250" x2="15" y2="300" stroke="#CBD5E0" strokeWidth="1.5"/>
              <line x1="15" y1="300" x2="30" y2="300" stroke="#CBD5E0" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Generația 2 — bunici */}
          <div className="flex flex-col gap-4">
            <PigeonCard pigeon={data.father?.father || null} label="Bunic patern" />
            <PigeonCard pigeon={data.father?.mother || null} label="Bunică paternă" />
            <PigeonCard pigeon={data.mother?.father || null} label="Bunic matern" />
            <PigeonCard pigeon={data.mother?.mother || null} label="Bunică maternă" />
          </div>

          {/* Generația 3 — străbunici */}
          <div className="flex flex-col gap-2">
            <svg width="30" height="640">
              {[30, 110, 190, 270, 350, 430, 510, 590].map((y, i) => (
                <g key={i}>
                  <line x1="0" y1={y} x2="15" y2={y} stroke="#CBD5E0" strokeWidth="1"/>
                  <line x1="15" y1={y} x2="15" y2={y + 40} stroke="#CBD5E0" strokeWidth="1"/>
                  <line x1="15" y1={y + 40} x2="30" y2={y + 40} stroke="#CBD5E0" strokeWidth="1"/>
                </g>
              ))}
            </svg>
          </div>

          {/* Generația 3 */}
          <div className="flex flex-col gap-2">
            <PigeonCard pigeon={data.father?.father?.father || null} label="Stră-bunic" />
            <PigeonCard pigeon={data.father?.father?.mother || null} label="Stră-bunică" />
            <PigeonCard pigeon={data.father?.mother?.father || null} label="Stră-bunic" />
            <PigeonCard pigeon={data.father?.mother?.mother || null} label="Stră-bunică" />
            <PigeonCard pigeon={data.mother?.father?.father || null} label="Stră-bunic" />
            <PigeonCard pigeon={data.mother?.father?.mother || null} label="Stră-bunică" />
            <PigeonCard pigeon={data.mother?.mother?.father || null} label="Stră-bunic" />
            <PigeonCard pigeon={data.mother?.mother?.mother || null} label="Stră-bunică" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-sage-500 rounded bg-sage-50 inline-block"></span> Porumbel principal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-300 rounded bg-white inline-block"></span> Ascendent cunoscut</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 border border-dashed border-gray-300 rounded bg-gray-50 inline-block"></span> Necunoscut</span>
        </div>
      </div>
    </div>
  )
}
