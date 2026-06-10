import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const resultSchema = z.object({
  pigeonId: z.string(),
  arrivalTime: z.string().optional().nullable(),
  loftRank: z.number().optional().nullable(),
  clubRank: z.number().optional().nullable(),
  regionalRank: z.number().optional().nullable(),
  nationalRank: z.number().optional().nullable(),
  totalPigeons: z.number().optional().nullable(),
  status: z.enum(['ARRIVED', 'NOT_ARRIVED', 'LOST', 'DISQUALIFIED']).default('ARRIVED'),
  notes: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params

  const race = await prisma.race.findFirst({
    where: { id, userId: session.user.id },
    include: {
      results: {
        include: { pigeon: true },
        orderBy: { loftRank: 'asc' },
      },
    },
  })

  if (!race) return NextResponse.json({ error: 'Concurs negăsit' }, { status: 404 })
  return NextResponse.json(race)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const existing = await prisma.race.findFirst({ where: { id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Concurs negăsit' }, { status: 404 })

  const { results, pigeonIds, date, releaseTime, ...rest } = body

  const race = await prisma.race.update({
    where: { id },
    data: {
      ...rest,
      date: date ? new Date(date) : existing.date,
      releaseTime: releaseTime ? new Date(releaseTime) : null,
    },
  })

  // Update results if provided
  if (results && Array.isArray(results)) {
    for (const result of results) {
      const parsed = resultSchema.safeParse(result)
      if (!parsed.success) continue

      const { pigeonId, arrivalTime, ...resultData } = parsed.data

      // Calculate speed and flight time if arrival time provided
      let flightTimeMinutes: number | null = null
      let speedMetersPerMinute: number | null = null

      if (arrivalTime && race.releaseTime && race.distanceKm) {
        const arrival = new Date(arrivalTime)
        const release = new Date(race.releaseTime)
        flightTimeMinutes = (arrival.getTime() - release.getTime()) / 60000
        if (flightTimeMinutes > 0) {
          speedMetersPerMinute = Math.round((race.distanceKm * 1000) / flightTimeMinutes)
        }
      }

      // Calculate classification percent
      let classificationPercent: number | null = null
      if (resultData.loftRank && resultData.totalPigeons) {
        classificationPercent = parseFloat(((resultData.loftRank / resultData.totalPigeons) * 100).toFixed(2))
      }

      await prisma.raceResult.upsert({
        where: { raceId_pigeonId: { raceId: id, pigeonId } },
        update: {
          ...resultData,
          arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
          flightTimeMinutes,
          speedMetersPerMinute,
          classificationPercent,
        },
        create: {
          raceId: id,
          pigeonId,
          ...resultData,
          arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
          flightTimeMinutes,
          speedMetersPerMinute,
          classificationPercent,
        },
      })
    }
  }

  return NextResponse.json(race)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.race.findFirst({ where: { id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Concurs negăsit' }, { status: 404 })

  await prisma.race.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
