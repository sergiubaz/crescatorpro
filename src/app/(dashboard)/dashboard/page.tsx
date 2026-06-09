import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Bird, Trophy, Dumbbell, AlertTriangle, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, SEX_LABELS, STATUS_LABELS } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [pigeonCount, raceCount, trainingCount, recentPigeons, recentResults, upcomingVaccinations, activeTreatments] = await Promise.all([
    prisma.pigeon.count({ where: { userId } }),
    prisma.race.count({ where: { userId } }),
    prisma.training.count({ where: { userId } }),
    prisma.pigeon.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, include: { loft: true } }),
    prisma.raceResult.findMany({
      where: { pigeon: { userId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { race: true, pigeon: true },
    }),
    prisma.vaccination.findMany({
      where: {
        userId,
        boosterDate: { gte: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      },
      take: 3,
    }),
    prisma.treatment.findMany({
      where: { userId, endDate: { gte: new Date() } },
      take: 3,
    }),
  ])

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-50 text-green-700',
    BREEDER: 'bg-blue-50 text-blue-700',
    LOST: 'bg-red-50 text-red-700',
    SOLD: 'bg-gray-100 text-gray-600',
    DECEASED: 'bg-gray-100 text-gray-500',
    YOUNG: 'bg-amber-50 text-amber-700',
  }

  const alerts = [
    ...upcomingVaccinations.map(v => ({
      type: 'warning' as const,
      message: `Rapel vaccin "${v.name}" — ${formatDate(v.boosterDate)}`,
    })),
    ...activeTreatments.map(t => ({
      type: 'info' as const,
      message: `Tratament activ: "${t.name}" — până la ${formatDate(t.endDate)}`,
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Bun venit, {session?.user.name}</p>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Link href="/pigeons/new" className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Adaugă porumbel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total porumbei', value: pigeonCount, icon: Bird, color: 'bg-sage-50 text-sage-600', href: '/pigeons' },
          { label: 'Concursuri', value: raceCount, icon: Trophy, color: 'bg-blue-50 text-blue-600', href: '/races' },
          { label: 'Antrenamente', value: trainingCount, icon: Dumbbell, color: 'bg-amber-50 text-amber-600', href: '/trainings' },
          { label: 'Alerte active', value: alerts.length, icon: AlertTriangle, color: alerts.length > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400', href: '#alerts' },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shrink-0`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent pigeons */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Ultimii porumbei adăugați</h2>
            <Link href="/pigeons" className="text-sm text-sage-600 hover:underline flex items-center gap-1">
              Vezi toți <ChevronRight size={14} />
            </Link>
          </div>
          {recentPigeons.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bird size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nu ai adăugat niciun porumbel încă.</p>
              <Link href="/pigeons/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă primul porumbel</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentPigeons.map(p => (
                <Link key={p.id} href={`/pigeons/${p.id}`} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 group">
                  <div className="w-9 h-9 rounded-lg bg-sage-50 flex items-center justify-center text-sage-600 shrink-0">
                    🕊
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {p.ringCountry}-{p.ringYear}-{p.ringNumber.split('-').pop()}
                      {p.name && <span className="text-gray-500 font-normal"> · {p.name}</span>}
                    </p>
                    <p className="text-xs text-gray-500">{SEX_LABELS[p.sex]} · {p.ringYear}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[p.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent results */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Rezultate recente</h2>
            <Link href="/races" className="text-sm text-sage-600 hover:underline flex items-center gap-1">
              Toate <ChevronRight size={14} />
            </Link>
          </div>
          {recentResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Trophy size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nu există rezultate înregistrate.</p>
              <Link href="/races/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă un concurs</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentResults.map(r => (
                <Link key={r.id} href={`/races/${r.raceId}`} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${r.loftRank === 1 ? 'bg-amber-400 text-white' : 'bg-amber-50 text-amber-700'}`}>
                    {r.loftRank ?? '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.race.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.pigeon.name ?? r.pigeon.ringNumber} ·
                      {r.race.distanceKm && ` ${r.race.distanceKm} km ·`}
                      {r.speedMetersPerMinute && ` ${Math.round(r.speedMetersPerMinute)} m/min`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(r.race.date)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div id="alerts" className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alerte</h2>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${a.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                <AlertTriangle size={16} className={a.type === 'warning' ? 'text-amber-500 shrink-0' : 'text-blue-500 shrink-0'} />
                <span className={a.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}>{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Acțiuni rapide</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Adaugă porumbel', href: '/pigeons/new' },
            { label: 'Adaugă concurs', href: '/races/new' },
            { label: 'Adaugă antrenament', href: '/trainings/new' },
            { label: 'Adaugă tratament', href: '/health/treatments/new' },
            { label: 'Generează raport', href: '/reports' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="flex items-center gap-2 text-sm font-medium border border-gray-200 hover:border-sage-300 hover:bg-sage-50 text-gray-700 hover:text-sage-700 px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} /> {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
