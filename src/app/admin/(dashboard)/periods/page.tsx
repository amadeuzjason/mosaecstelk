import prisma from '@/lib/prisma'
import PeriodManager from './PeriodManager'

export default async function PeriodsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10

  const numQuery = parseInt(query)
  const isNum = !isNaN(numQuery)

  const where = query ? {
    OR: [
        isNum ? { year: numQuery } : {},
        isNum ? { period: numQuery } : {},
    ]
  } : {}

  const [periods, totalCount] = await Promise.all([
    prisma.period.findMany({
      where,
      orderBy: {
        period: 'asc',
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.period.count({ where }),
  ])

  return <PeriodManager periods={periods} totalPages={Math.ceil(totalCount / pageSize)} currentPage={page} />
}
