'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { Bird, Trophy, Dumbbell, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { STATUS_LABELS, RACE_CATEGORY_LABELS, formatDate } from '@/lib/utils'

const STATUS_COLORS_MAP: Record<string, string> = {
  ACTIVE: '#2F6B4A',
  BREEDER: '#2B6CB0',
  LOST: '#C53030',
  SOLD: '#718096',
  DECEASED: '#A0AEC0',
  YOUNG: '#C9A227',
}

const CATEGORY_COLORS = ['#2F6B4A', '#2B6CB0', '#C9A227', '#9F7AEA', '#ED8936']

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă rapoartele...</div>
  if (!data) return null

  const statusData = data.pigeonsByStatus.map((s: any) => ({
    name: STATUS_LABELS[s.status] || s.status,
    value: s._count.status,
    color: STATUS_COLORS_MAP[s.status] || '#718096',
  }))

  const yearData = data.pigeonsByYear.map((y: any) => ({
    an: y.ringYear,
    porumbei: y._count.ringYear,
  }))

  const categoryData = data.racesByCategory.map((c: any, i: number) => ({
    name: RACE_CATEGORY_LABELS[c.category] || c.category,
    concursuri: c._count.category,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }))

  const monthData = data.resultsByMonth.map((m: any) => ({
    luna: m.month,
    total: m.total,
    sosit: m.arrived,
    'rată (%)': m.total > 0 ? Math.round((m.arrived / m.total) * 100) : 0,
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Rapoarte de performanță</h1>
        <p className="text-sm text-gray-500 mt-1">Statistici și analize crescătorie</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total porumbei', value: data.totalPigeons, icon: Bird, color: 'bg-sage-50 text-sage-600' },
          { label: 'Concursuri', value: data.totalRaces, icon: Trophy, color: 'bg-blue-50 text-blue-600' },
          { label: 'Antrenamente', value: data.totalTrainings, icon: Dumbbell, color: 'bg-amber-50 text-amber-600' },
          { label: 'Rată sosire', value: `${data.arrivalRate}%`, icon: TrendingUp, color: data.arrivalRate >= 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shrink-0`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pigeons by status */}
        {statusData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Distribuție porumbei după status</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pigeons by year */}
        {yearData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Porumbei pe ani</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="an" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="porumbei" fill="#2F6B4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Results by month */}
        {monthData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Evoluție rezultate în timp</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="luna" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2B6CB0" strokeWidth={2} dot={false} name="Total angajați" />
                <Line type="monotone" dataKey="sosit" stroke="#2F6B4A" strokeWidth={2} dot={false} name="Sosiți" />
                <Line type="monotone" dataKey="rată (%)" stroke="#C9A227" strokeWidth={2} dot={false} name="Rată sosire %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Races by category */}
        {categoryData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Concursuri pe categorii</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="concursuri" fill="#2B6CB0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top pigeons */}
        {data.topPigeons?.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Top porumbei (cel mai bun loc)</h2>
            <div className="space-y-2">
              {data.topPigeons.slice(0, 8).map((p: any, i: number) => (
                <div key={p.pigeonId} className="flex items-center gap-3 py-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/pigeons/${p.pigeonId}`} className="text-sm font-medium text-sage-600 hover:underline truncate block">
                      {p.pigeon?.ringNumber}{p.pigeon?.name ? ` — ${p.pigeon.name}` : ''}
                    </Link>
                    <p className="text-xs text-gray-400">{p._count.pigeonId} concursuri · Viteză medie: {p._avg.speedMetersPerMinute ? Math.round(p._avg.speedMetersPerMinute) + ' m/min' : '—'}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Loc {p._min.loftRank}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent results */}
      {data.recentResults?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Rezultate recente</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Porumbel</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Concurs</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Dată</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Distanță</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Viteză</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Loc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentResults.map((r: any) => (
                <tr key={r.id}>
                  <td className="py-2">
                    <Link href={`/pigeons/${r.pigeonId}`} className="text-sage-600 hover:underline font-medium">
                      {r.pigeon?.ringNumber}{r.pigeon?.name ? ` — ${r.pigeon.name}` : ''}
                    </Link>
                  </td>
                  <td className="py-2 text-gray-600">{r.race?.name}</td>
                  <td className="py-2 text-gray-500">{formatDate(r.race?.date)}</td>
                  <td className="py-2 text-gray-500">{r.race?.distanceKm ? `${r.race.distanceKm} km` : '—'}</td>
                  <td className="py-2 text-gray-500">{r.speedMetersPerMinute ? `${Math.round(r.speedMetersPerMinute)} m/min` : '—'}</td>
                  <td className="py-2 font-medium">{r.loftRank ? `#${r.loftRank}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.totalResults === 0 && data.totalRaces === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <TrendingUp size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Nu există date suficiente pentru rapoarte</p>
          <p className="text-gray-400 text-sm mt-1">Adaugă concursuri și rezultate pentru a vedea statisticile</p>
          <Link href="/races/new" className="text-sage-600 text-sm hover:underline mt-2 inline-block">Adaugă primul concurs →</Link>
        </div>
      )}
    </div>
  )
}
