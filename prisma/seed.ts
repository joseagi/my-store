import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const products = [
  {
    name: 'Classic White Tee',
    slug: 'classic-white-tee',
    description: 'A timeless crew-neck essential in 100% organic cotton. Relaxed fit, pre-washed for softness.',
    price: 29.99,
    stock: 150,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
  },
  {
    name: 'Slim Black Jeans',
    slug: 'slim-black-jeans',
    description: 'Tapered slim fit in stretch denim. Mid-rise with a clean, minimal finish.',
    price: 79.99,
    stock: 80,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'],
  },
  {
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Full-grain leather with an adjustable strap and three interior pockets.',
    price: 149.99,
    stock: 40,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
  },
  {
    name: 'White Sneakers',
    slug: 'white-sneakers',
    description: 'Clean court-style sneakers with a vulcanised sole and padded collar.',
    price: 89.99,
    stock: 60,
    category: 'Shoes',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'],
  },
  {
    name: 'Wool Overcoat',
    slug: 'wool-overcoat',
    description: 'Double-breasted overcoat in 80% wool. Notch lapels and a structured shoulder.',
    price: 299.99,
    stock: 25,
    category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'],
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description: 'Hand-thrown stoneware mug, 350ml. Dishwasher safe with a matte glaze.',
    price: 24.99,
    stock: 200,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
  },
  {
    name: 'Linen Throw Pillow',
    slug: 'linen-throw-pillow',
    description: 'Stonewashed linen cover with a feather insert. 50×50cm.',
    price: 39.99,
    stock: 90,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80'],
  },
  {
    name: 'Minimalist Watch',
    slug: 'minimalist-watch',
    description: '38mm brushed steel case, sapphire crystal glass, genuine leather strap.',
    price: 199.99,
    stock: 30,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
  },
]

async function main() {
  console.log('Seeding database...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`Seeded ${products.length} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())