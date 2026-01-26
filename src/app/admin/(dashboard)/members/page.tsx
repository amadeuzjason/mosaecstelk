import prisma from '@/lib/prisma'
import MemberManager from './MemberManager'

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { q?: string; period?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const periodId = searchParams.period ? parseInt(searchParams.period) : undefined
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10

  const where = {
    AND: [
      query ? { name: { contains: query, mode: 'insensitive' as const } } : {},
      periodId ? { periodId } : {},
    ],
  }

  const [members, totalCount, periods] = await Promise.all([
    prisma.member.findMany({
      where,
      include: {
        period: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.member.count({ where }),
    prisma.period.findMany({
      orderBy: {
        year: 'desc',
      },
    }),
  ])

  return (
    <MemberManager 
      members={members} 
      periods={periods} 
      totalPages={Math.ceil(totalCount / pageSize)}
      currentPage={page}
    />
  )
}
