import { PrismaClient } from '@prisma/client'
import { PrismaPg} from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
  log: ['error'],
})

const products = [
  {
    name: 'Classic White Tee',
    slug: 'classic-white-tee',
    description: 'A timeless crew-neck essential in 100% organic cotton. Relaxed fit, pre-washed for softness.',
    price: 29.99,
    stock: 150,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/White%20Tee.jpeg'],
  },
  {
    name: 'Grey Joggers',
    slug: 'grey-joggers',
    description: 'Tapered slim fit in stretch denim. Mid-rise with a clean, minimal finish.',
    price: 79.99,
    stock: 80,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/Grey%20Joggers.jpeg'],
  },
  {
    name: 'Black Longsleeves',
    slug: 'black-longsleeves',
    description: 'Full-grain leather with an adjustable strap and three interior pockets.',
    price: 49.99,
    stock: 40,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/Black%20longsleeves.jpeg'],
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
    name: 'Black Jorts',
    slug: 'black-jorts',
    description: 'Double-breasted overcoat in 80% wool. Notch lapels and a structured shoulder.',
    price: 29.99,
    stock: 25,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/Black%20longsleeves.jpeg'],
  },
  {
    name: 'Black and White Jorts',
    slug: 'black-and-white-jorts',
    description: 'Hand-thrown stoneware mug, 350ml. Dishwasher safe with a matte glaze.',
    price: 24.99,
    stock: 200,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/Black%20and%20white%20Jorts.jpeg'],
  },
  {
    name: 'Black and Red Beanie',
    slug: 'black-and-red-beanie',
    description: 'Stonewashed linen cover with a feather insert. 50×50cm.',
    price: 39.99,
    stock: 90,
    category: 'Clothing',
    images: ['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/Black%20and%20Red%20Beanie.jpeg'],
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
    console.log('\n Seeded ${product.name}')
  }
  console.log(`Seeded ${products.length} products successfully`)
}

main()
  .catch((e) => {
    console.error('\n Seed failed:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })