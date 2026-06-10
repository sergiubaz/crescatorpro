import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const resultSchema = z.object({
  pigeonId: z.string(),
  arrivalTime: z.string().optional().nullable(),
  status: z.enum(['ARRIVED', 'DELAYED', 'LOST']).default('ARRIVED'),
  notes: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params

  const training = await prisma.training.findFirst({
    where: { id, userId: session.user.id },
    include: {
      results: {
        include: { pigeon: true },
      },
    },
  })

  if (!training) return NextResponse.json({ error: 'Antrenament negăsit' }, { status: 404 })
  return NextResponse.json(training)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const existing = await prisma.training.findFirst({ where: { id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Antrenament negăsit' }, { status: 404 })

  const { results, date, releaseTime, ...rest } = body

  const training = await prisma.training.update({
    where: { id },
    data: {
      ...rest,
      date: date ? new Date(date) : existing.date,
      releaseTime: releaseTime ? new Date(releaseTime) : null,
    },
  })

  if (results && Array.isArray(results)) {
    for (const result of results) {
      const parsed = resultSchema.safeParse(result)
      if (!parsed.success) continue

      const { pigeonId, arrivalTime, ...resultData } = parsed.data

      let flightTimeMinutes: number | null = null
      let speedMetersPerMinute: number | null = null

      if (arrivalTime && training.releaseTime && training.distanceKm) {
        const arrival = new Date(arrivalTime)
        const release = new Date(training.releaseTime)
        flightTimeMinutes = (arrival.getTime() - release.getTime()) / 60000
        if (flightTimeMinutes > 0) {
          speedMetersPerMinute = Math.round((training.distanceKm * 1000) / flightTimeMinutes)
        }
      }

      await prisma.trainingResult.upsert({
        where: { id: (await prisma.trainingResult.findFirst({ where: { trainingId: id, pigeonId } }))?.id || 'new' },
        update: { ...resultData, arrivalTime: arrivalTime ? new Date(arrivalTime) : null, flightTimeMinutes, speedMetersPerMinute },
        create: { trainingId: id, pigeonId, ...resultData, arrivalTime: arrivalTime ? new Date(arrivalTime) : null, flightTimeMinutes, speedMetersPerMinute },
      })
    }
  }

  return NextResponse.json(training)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.training.findFirst({ where: { id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Antrenament negăsit' }, { status: 404 })

  await prisma.training.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
