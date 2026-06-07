import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const images = await prisma.lookbookImage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ images: [] })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const { url, caption } = await req.json() as { url: string; caption?: string }
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const image = await prisma.lookbookImage.create({ data: { url, caption } })
  return NextResponse.json({ image }, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.lookbookImage.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
