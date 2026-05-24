import prisma from '@/lib/prisma'
import AngkatanManager from './AngkatanManager'

export default async function AngkatanPage() {
  const periods = await prisma.period.findMany({
    orderBy: { period: 'desc' },
    include: {
      members: {
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: { members: true },
      },
    },
  })

  return <AngkatanManager periods={periods} />
}
