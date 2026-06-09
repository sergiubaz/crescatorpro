import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { loftSchema } from '@/lib/validations'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const loft = await prisma.loft.findUnique({ where: { userId: session.user.id } })
  return NextResponse.json(loft)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = loftSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.loft.findUnique({ where: { userId: session.user.id } })
  if (existing) return NextResponse.json({ error: 'Ai deja o crescătorie configurată.' }, { status: 400 })

  const loft = await prisma.loft.create({
    data: { ...parsed.data, userId: session.user.id, publicEmail: parsed.data.publicEmail || null, website: parsed.data.website || null },
  })
  return NextResponse.json(loft, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()
  const parsed = loftSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })

  const loft = await prisma.loft.upsert({
    where: { userId: session.user.id },
    update: { ...parsed.data, publicEmail: parsed.data.publicEmail || null, website: parsed.data.website || null },
    create: { ...parsed.data, userId: session.user.id, publicEmail: parsed.data.publicEmail || null, website: parsed.data.website || null },
  })
  return NextResponse.json(loft)
}
