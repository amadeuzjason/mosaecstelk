import prisma from '@/lib/prisma'
import EventManager from './EventManager'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10

  const where = {
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
    ],
  }

  const [events, totalCount] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ])

  return (
    <EventManager 
      events={events} 
      totalPages={Math.ceil(totalCount / pageSize)}
      currentPage={page}
    />
  )
}
