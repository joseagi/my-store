import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/ui/products/ProductDetail'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return notFound()
  return <ProductDetail product={product} />
}
