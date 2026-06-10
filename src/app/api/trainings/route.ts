import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const trainingSchema = z.object({
  date: z.string(),
  releaseTime: z.string().optional().nullable(),
  releaseLocation: z.string().optional(),
  releaseLatitude: z.number().optional().nullable(),
  releaseLongitude: z.number().optional().nullable(),
  distanceKm: z.number().optional().nullable(),
  weather: z.string().optional(),
  wind: z.string().optional(),
  notes: z.string().optional(),
  pigeonIds: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const trainings = await prisma.training.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: {
      results: { include: { pigeon: { select: { id: true, ringNumber: true, name: true } } } },
    },
  })
  return NextResponse.json(trainings)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = trainingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const { pigeonIds, date, releaseTime, ...rest } = parsed.data
  const loft = await prisma.loft.findUnique({ where: { userId: session.user.id } })

  const training = await prisma.training.create({
    data: {
      ...rest,
      userId: session.user.id,
      loftId: loft?.id || null,
      date: new Date(date),
      releaseTime: releaseTime ? new Date(releaseTime) : null,
    },
  })

  if (pigeonIds && pigeonIds.length > 0) {
    await prisma.trainingResult.createMany({
      data: pigeonIds.map(pigeonId => ({ trainingId: training.id, pigeonId, status: 'ARRIVED' as const })),
    })
  }

  return NextResponse.json(training, { status: 201 })
}
