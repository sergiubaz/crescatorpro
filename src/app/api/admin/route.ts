import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }

  const [totalUsers, totalLofts, totalPigeons, totalRaces, totalResults, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.loft.count(),
    prisma.pigeon.count(),
    prisma.race.count(),
    prisma.raceResult.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        loft: { select: { name: true } },
        _count: { select: { pigeons: true, races: true } },
      },
    }),
  ])

  return NextResponse.json({
    stats: { totalUsers, totalLofts, totalPigeons, totalRaces, totalResults },
    users: recentUsers,
  })
}
