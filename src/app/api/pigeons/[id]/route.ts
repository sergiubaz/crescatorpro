import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { pigeonSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const pigeon = await prisma.pigeon.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      father: true,
      mother: true,
      images: true,
      raceResults: {
        include: { race: true },
        orderBy: { createdAt: 'desc' },
      },
      trainingResults: {
        include: { training: true },
        orderBy: { training: { date: 'desc' } },
      },
      treatments: {
        include: { treatment: true },
      },
      vaccinations: {
        include: { vaccination: true },
      },
    },
  })

  if (!pigeon) return NextResponse.json({ error: 'Porumbel negăsit' }, { status: 404 })
  return NextResponse.json(pigeon)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = pigeonSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.pigeon.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Porumbel negăsit' }, { status: 404 })

  const { ringNumber, ringYear, fatherId, motherId, birthDate, ...rest } = parsed.data

  // Check ring uniqueness (exclude self)
  const duplicate = await prisma.pigeon.findFirst({
    where: { userId: session.user.id, ringNumber, id: { not: params.id } },
  })
  if (duplicate) return NextResponse.json({ error: 'Există deja un porumbel cu această serie de inel.' }, { status: 400 })

  // Prevent circular ancestry
  if (fatherId === params.id || motherId === params.id) {
    return NextResponse.json({ error: 'Un porumbel nu poate fi propriul părinte.' }, { status: 400 })
  }

  const pigeon = await prisma.pigeon.update({
    where: { id: params.id },
    data: {
      ...rest,
      ringNumber,
      ringYear,
      fatherId: fatherId || null,
      motherId: motherId || null,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  })

  return NextResponse.json(pigeon)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const existing = await prisma.pigeon.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ error: 'Porumbel negăsit' }, { status: 404 })

  await prisma.pigeon.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
