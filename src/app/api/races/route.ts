import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const raceSchema = z.object({
  name: z.string().min(1, 'Numele concursului este obligatoriu'),
  organizer: z.string().optional(),
  club: z.string().optional(),
  date: z.string(),
  releaseTime: z.string().optional(),
  releaseLocation: z.string().optional(),
  releaseLatitude: z.number().optional().nullable(),
  releaseLongitude: z.number().optional().nullable(),
  distanceKm: z.number().optional().nullable(),
  category: z.enum(['SPEED', 'SEMI_DISTANCE', 'DISTANCE', 'MARATHON', 'GENERAL']).default('GENERAL'),
  weather: z.string().optional(),
  wind: z.string().optional(),
  status: z.enum(['PLANNED', 'ONGOING', 'FINISHED', 'CANCELLED']).default('PLANNED'),
  notes: z.string().optional(),
  pigeonIds: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const races = await prisma.race.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: {
      results: { include: { pigeon: { select: { id: true, ringNumber: true, name: true } } } },
    },
  })
  return NextResponse.json(races)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = raceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const { pigeonIds, date, releaseTime, ...rest } = parsed.data
  const loft = await prisma.loft.findUnique({ where: { userId: session.user.id } })

  const race = await prisma.race.create({
    data: {
      ...rest,
      userId: session.user.id,
      loftId: loft?.id || null,
      date: new Date(date),
      releaseTime: releaseTime ? new Date(releaseTime) : null,
    },
  })

  if (pigeonIds && pigeonIds.length > 0) {
    await prisma.raceResult.createMany({
      data: pigeonIds.map(pigeonId => ({ raceId: race.id, pigeonId, status: 'ARRIVED' as const })),
    })
  }

  return NextResponse.json(race, { status: 201 })
}
