import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const userId = session.user.id

  const [
    totalPigeons,
    pigeonsByStatus,
    pigeonsByYear,
    totalRaces,
    totalTrainings,
    raceResults,
    topPigeons,
    racesByCategory,
  ] = await Promise.all([
    prisma.pigeon.count({ where: { userId } }),

    prisma.pigeon.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    }),

    prisma.pigeon.groupBy({
      by: ['ringYear'],
      where: { userId },
      _count: { ringYear: true },
      orderBy: { ringYear: 'asc' },
    }),

    prisma.race.count({ where: { userId } }),

    prisma.training.count({ where: { userId } }),

    prisma.raceResult.findMany({
      where: { pigeon: { userId } },
      include: {
        race: { select: { name: true, date: true, distanceKm: true, category: true } },
        pigeon: { select: { id: true, ringNumber: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

    // Top 10 pigeons by best rank
    prisma.raceResult.groupBy({
      by: ['pigeonId'],
      where: { pigeon: { userId }, status: 'ARRIVED', loftRank: { not: null } },
      _min: { loftRank: true },
      _avg: { speedMetersPerMinute: true },
      _count: { pigeonId: true },
      orderBy: { _min: { loftRank: 'asc' } },
      take: 10,
    }),

    prisma.race.groupBy({
      by: ['category'],
      where: { userId },
      _count: { category: true },
    }),
  ])

  // Arrival rate per pigeon
  const arrivedCount = raceResults.filter(r => r.status === 'ARRIVED').length
  const arrivalRate = raceResults.length > 0 ? Math.round((arrivedCount / raceResults.length) * 100) : 0

  // Top pigeons with names
  const topPigeonIds = topPigeons.map(p => p.pigeonId)
  const topPigeonDetails = await prisma.pigeon.findMany({
    where: { id: { in: topPigeonIds } },
    select: { id: true, ringNumber: true, name: true },
  })

  const topPigeonsWithDetails = topPigeons.map(p => ({
    ...p,
    pigeon: topPigeonDetails.find(d => d.id === p.pigeonId),
  }))

  // Results by month for chart
  const resultsByMonth = raceResults.reduce((acc: any, r) => {
    const month = new Date(r.race.date).toISOString().slice(0, 7)
    if (!acc[month]) acc[month] = { month, total: 0, arrived: 0 }
    acc[month].total++
    if (r.status === 'ARRIVED') acc[month].arrived++
    return acc
  }, {})

  return NextResponse.json({
    totalPigeons,
    pigeonsByStatus,
    pigeonsByYear,
    totalRaces,
    totalTrainings,
    totalResults: raceResults.length,
    arrivalRate,
    racesByCategory,
    topPigeons: topPigeonsWithDetails,
    resultsByMonth: Object.values(resultsByMonth).sort((a: any, b: any) => a.month.localeCompare(b.month)),
    recentResults: raceResults.slice(0, 10),
  })
}
