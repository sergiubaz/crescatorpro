'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2, GitBranch, Bird, ArrowLeft } from 'lucide-react'
import { SEX_LABELS, STATUS_LABELS, formatDate, RACE_CATEGORY_LABELS } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  BREEDER: 'bg-blue-50 text-blue-700',
  LOST: 'bg-red-50 text-red-700',
  SOLD: 'bg-gray-100 text-gray-600',
  DECEASED: 'bg-gray-100 text-gray-500',
  YOUNG: 'bg-amber-50 text-amber-700',
}

export default function PigeonDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [pigeon, setPigeon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetch(`/api/pigeons/${id}`).then(r => r.json()).then(d => {
      setPigeon(d)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!confirm(`Ștergi porumbelul "${pigeon?.name || pigeon?.ringNumber}"? Acțiunea nu poate fi anulată.`)) return
    await fetch(`/api/pigeons/${id}`, { method: 'DELETE' })
    router.push('/pigeons')
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>
  if (!pigeon || pigeon.error) return <div className="text-center py-20 text-gray-400">Porumbel negăsit.</div>

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'results', label: `Rezultate (${pigeon.raceResults?.length || 0})` },
    { id: 'trainings', label: `Antrenamente (${pigeon.trainingResults?.length || 0})` },
    { id: 'health', label: 'Sănătate' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {pigeon.name || pigeon.ringNumber}
          </h1>
          <p className="text-sm text-gray-500">{pigeon.ringNumber}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/pigeons/${id}/pedigree`} className="flex items-center gap-2 text-sm border border-gray-200 hover:border-sage-300 hover:bg-sage-50 text-gray-700 hover:text-sage-700 px-3 py-2 rounded-lg transition-colors">
            <GitBranch size={14} /> Pedigree
          </Link>
          <Link href={`/pigeons/${id}/edit`} className="flex items-center gap-2 text-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors">
            <Edit size={14} /> Editează
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-2 text-sm border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg transition-colors">
            <Trash2 size={14} /> Șterge
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sex', value: SEX_LABELS[pigeon.sex] },
          { label: 'An', value: pigeon.ringYear },
          { label: 'Culoare', value: pigeon.color || '—' },
          { label: 'Status', value: STATUS_LABELS[pigeon.status], colored: true, status: pigeon.status },
        ].map(({ label, value, colored, status }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            {colored ? (
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[status!]}`}>{value}</span>
            ) : (
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-sage-600 border-b-2 border-sage-500 bg-sage-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Serie inel" value={pigeon.ringNumber} />
                <InfoRow label="Linie / Sânge" value={pigeon.bloodline} />
                <InfoRow label="Data nașterii" value={formatDate(pigeon.birthDate)} />
                <InfoRow label="Vizibil public" value={pigeon.isPublic ? 'Da' : 'Nu'} />
                <InfoRow label="Tată" value={pigeon.father ? `${pigeon.father.ringNumber}${pigeon.father.name ? ` — ${pigeon.father.name}` : ''}` : '—'} link={pigeon.father ? `/pigeons/${pigeon.father.id}` : undefined} />
                <InfoRow label="Mamă" value={pigeon.mother ? `${pigeon.mother.ringNumber}${pigeon.mother.name ? ` — ${pigeon.mother.name}` : ''}` : '—'} link={pigeon.mother ? `/pigeons/${pigeon.mother.id}` : undefined} />
              </div>
              {pigeon.importantResults && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rezultate importante</p>
                  <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-3">{pigeon.importantResults}</p>
                </div>
              )}
              {pigeon.notes && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Observații</p>
                  <p className="text-sm text-gray-700">{pigeon.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              {pigeon.raceResults?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Niciun rezultat înregistrat.</p>
                  <Link href="/races/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă un concurs</Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Concurs</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Dată</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Distanță</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Viteză</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Loc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pigeon.raceResults?.map((r: any) => (
                      <tr key={r.id}>
                        <td className="py-2"><Link href={`/races/${r.raceId}`} className="text-sage-600 hover:underline">{r.race?.name}</Link></td>
                        <td className="py-2 text-gray-500">{formatDate(r.race?.date)}</td>
                        <td className="py-2 text-gray-500">{r.race?.distanceKm ? `${r.race.distanceKm} km` : '—'}</td>
                        <td className="py-2 text-gray-500">{r.speedMetersPerMinute ? `${Math.round(r.speedMetersPerMinute)} m/min` : '—'}</td>
                        <td className="py-2 font-medium">{r.loftRank ? `#${r.loftRank}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'trainings' && (
            <div>
              {pigeon.trainingResults?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Niciun antrenament înregistrat.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Data</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Locul lansării</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Distanță</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Viteză</th>
                      <th className="pb-2 text-left text-xs text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pigeon.trainingResults?.map((r: any) => (
                      <tr key={r.id}>
                        <td className="py-2">{formatDate(r.training?.date)}</td>
                        <td className="py-2 text-gray-500">{r.training?.releaseLocation || '—'}</td>
                        <td className="py-2 text-gray-500">{r.training?.distanceKm ? `${r.training.distanceKm} km` : '—'}</td>
                        <td className="py-2 text-gray-500">{r.speedMetersPerMinute ? `${Math.round(r.speedMetersPerMinute)} m/min` : '—'}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'ARRIVED' ? 'bg-green-50 text-green-700' : r.status === 'LOST' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                            {r.status === 'ARRIVED' ? 'Sosit' : r.status === 'LOST' ? 'Pierdut' : 'Întârziat'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tratamente</h3>
                {pigeon.treatments?.length === 0 ? (
                  <p className="text-sm text-gray-400">Niciun tratament înregistrat.</p>
                ) : (
                  <div className="space-y-2">
                    {pigeon.treatments?.map((t: any) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="font-medium">{t.treatment?.name}</span>
                        <span className="text-gray-500">{formatDate(t.treatment?.startDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Vaccinări</h3>
                {pigeon.vaccinations?.length === 0 ? (
                  <p className="text-sm text-gray-400">Nicio vaccinare înregistrată.</p>
                ) : (
                  <div className="space-y-2">
                    {pigeon.vaccinations?.map((v: any) => (
                      <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="font-medium">{v.vaccination?.name}</span>
                        <span className="text-gray-500">{formatDate(v.vaccination?.vaccinationDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {link ? (
        <Link href={link} className="text-sm font-medium text-sage-600 hover:underline">{value}</Link>
      ) : (
        <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
      )}
    </div>
  )
}
