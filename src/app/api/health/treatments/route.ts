import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const treatmentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['ANTIBIOTIC', 'ANTIPARASITIC', 'VACCINE', 'VITAMINS', 'RECOVERY', 'PREVENTIVE', 'OTHER']).default('OTHER'),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  dosage: z.string().optional(),
  notes: z.string().optional(),
  applyToAll: z.boolean().default(false),
  pigeonIds: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const treatments = await prisma.treatment.findMany({
    where: { userId: session.user.id },
    orderBy: { startDate: 'desc' },
    include: {
      pigeons: { include: { pigeon: { select: { id: true, ringNumber: true, name: true } } } },
    },
  })
  return NextResponse.json(treatments)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = treatmentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 })

  const { pigeonIds, startDate, endDate, ...rest } = parsed.data

  const treatment = await prisma.treatment.create({
    data: {
      ...rest,
      userId: session.user.id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  })

  if (pigeonIds && pigeonIds.length > 0) {
    await prisma.treatmentPigeon.createMany({
      data: pigeonIds.map(pigeonId => ({ treatmentId: treatment.id, pigeonId })),
      skipDuplicates: true,
    })
  }

  return NextResponse.json(treatment, { status: 201 })
}
