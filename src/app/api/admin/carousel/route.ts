import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const images = await prisma.carouselImage.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json({ images })
}

export async function POST(req: Request) {
  const { url } = await req.json() as { url: string }
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })
  const image = await prisma.carouselImage.create({ data: { id: crypto.randomUUID(), url } })
  return NextResponse.json({ image }, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.carouselImage.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
