import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getPigeonWithAncestors(id: string | null, depth: number): Promise<any> {
  if (!id || depth === 0) return null

  const pigeon = await prisma.pigeon.findUnique({
    where: { id },
    select: {
      id: true, ringNumber: true, ringCountry: true, ringYear: true,
      name: true, sex: true, color: true, importantResults: true,
      fatherId: true, motherId: true,
    },
  })
  if (!pigeon) return null

  const [father, mother] = await Promise.all([
    getPigeonWithAncestors(pigeon.fatherId, depth - 1),
    getPigeonWithAncestors(pigeon.motherId, depth - 1),
  ])

  return { ...pigeon, father, mother }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const { id } = await params

  const pigeon = await prisma.pigeon.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!pigeon) return NextResponse.json({ error: 'Porumbel negăsit' }, { status: 404 })

  const pedigree = await getPigeonWithAncestors(id, 3)
  return NextResponse.json(pedigree)
}
