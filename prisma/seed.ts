import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.ADMIN_USER || 'ronald'
  const adminPassword = process.env.ADMIN_PASSWORD || 'lasrosas_2026'
  
  const passwordHash = await bcrypt.hash(adminPassword, 10)
  
  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash,
      role: Role.ADMIN,
    },
  })

  console.log('Seed completado: usuario administrador creado/actualizado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
