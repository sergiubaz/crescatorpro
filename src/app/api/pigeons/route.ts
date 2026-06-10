import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { pigeonSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const sex = searchParams.get('sex') || ''
  const status = searchParams.get('status') || ''
  const year = searchParams.get('year') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: any = { userId: session.user.id }
  if (search) where.ringNumber = { contains: search, mode: 'insensitive' }
  if (sex) where.sex = sex
  if (status) where.status = status
  if (year) where.ringYear = parseInt(year)

  const [pigeons, total] = await Promise.all([
    prisma.pigeon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        father: { select: { id: true, ringNumber: true, name: true } },
        mother: { select: { id: true, ringNumber: true, name: true } },
      },
    }),
    prisma.pigeon.count({ where }),
  ])

  return NextResponse.json({ pigeons, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = pigeonSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const { ringNumber, ringYear, fatherId, motherId, birthDate, ...rest } = parsed.data

  // Check unique ring per user
  const existing = await prisma.pigeon.findUnique({
    where: { userId_ringNumber: { userId: session.user.id, ringNumber } },
  })
  if (existing) return NextResponse.json({ error: 'Există deja un porumbel cu această serie de inel.' }, { status: 400 })

  // Validate father/mother
  if (fatherId) {
    const father = await prisma.pigeon.findFirst({ where: { id: fatherId, userId: session.user.id } })
    if (!father) return NextResponse.json({ error: 'Tatăl selectat nu există.' }, { status: 400 })
    if (father.sex === 'FEMALE') return NextResponse.json({ error: 'Tatăl trebuie să fie mascul.' }, { status: 400 })
  }
  if (motherId) {
    const mother = await prisma.pigeon.findFirst({ where: { id: motherId, userId: session.user.id } })
    if (!mother) return NextResponse.json({ error: 'Mama selectată nu există.' }, { status: 400 })
    if (mother.sex === 'MALE') return NextResponse.json({ error: 'Mama trebuie să fie femelă.' }, { status: 400 })
  }

  const loft = await prisma.loft.findUnique({ where: { userId: session.user.id } })

  const pigeon = await prisma.pigeon.create({
    data: {
      ...rest,
      ringNumber,
      ringYear,
      userId: session.user.id,
      loftId: loft?.id || null,
      fatherId: fatherId || null,
      motherId: motherId || null,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  })

  return NextResponse.json(pigeon, { status: 201 })
}
