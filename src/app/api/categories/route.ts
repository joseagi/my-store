import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      select: { category: true },
      where: { stock: { gt: 0 } },
      distinct: ['category'],
    })
    const categories = rows
      .map(r => r.category)
      .filter((c): c is string => c !== null)
    return NextResponse.json({ categories })
  } catch {
    return NextResponse.json({ categories: [] })
  }
}
