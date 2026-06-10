import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const vaccinationSchema = z.object({
  name: z.string().min(1),
  disease: z.string().optional(),
  vaccinationDate: z.string(),
  boosterDate: z.string().optional().nullable(),
  notes: z.string().optional(),
  pigeonIds: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const vaccinations = await prisma.vaccination.findMany({
    where: { userId: session.user.id },
    orderBy: { vaccinationDate: 'desc' },
    include: {
      pigeons: { include: { pigeon: { select: { id: true, ringNumber: true, name: true } } } },
    },
  })
  return NextResponse.json(vaccinations)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = vaccinationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 })

  const { pigeonIds, vaccinationDate, boosterDate, ...rest } = parsed.data

  const vaccination = await prisma.vaccination.create({
    data: {
      ...rest,
      userId: session.user.id,
      vaccinationDate: new Date(vaccinationDate),
      boosterDate: boosterDate ? new Date(boosterDate) : null,
    },
  })

  if (pigeonIds && pigeonIds.length > 0) {
    await prisma.vaccinationPigeon.createMany({
      data: pigeonIds.map(pigeonId => ({ vaccinationId: vaccination.id, pigeonId })),
      skipDuplicates: true,
    })
  }

  return NextResponse.json(vaccination, { status: 201 })
}
