import prisma from '@/lib/prisma'
import LatihanManager from './LatihanManager'
import { GradeLevel, SubjectType } from '@prisma/client'

export default async function LatihanPage({
  searchParams,
}: {
  searchParams: { q?: string; grade?: string; subject?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const grade = searchParams.grade as GradeLevel | undefined
  const subject = searchParams.subject as SubjectType | undefined
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10

  const where = {
    AND: [
      query ? { content: { contains: query, mode: 'insensitive' as const } } : {},
      grade ? { grade } : {},
      subject ? { subject } : {},
    ],
  }

  const [questions, totalCount] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        options: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.question.count({ where }),
  ])

  return (
    <LatihanManager 
      questions={questions} 
      totalPages={Math.ceil(totalCount / pageSize)}
      currentPage={page}
    />
  )
}
