'use server'

import { prisma } from '@/lib/prisma'
import { GradeLevel, SubjectType, Difficulty, Prisma } from '@prisma/client'

export type GetQuestionsParams = {
  grade?: GradeLevel[]
  subject?: SubjectType[]
  search?: string
  difficulty?: Difficulty
  sort?: string
}

export async function getQuestions({ grade, subject, search, difficulty, sort }: GetQuestionsParams) {
  const where: Prisma.QuestionWhereInput = {}

  if (grade && grade.length > 0) {
    where.grade = { in: grade }
  }

  if (subject && subject.length > 0) {
    where.subject = { in: subject }
  }

  if (difficulty) {
    where.difficulty = difficulty
  }

  if (search) {
    where.content = { contains: search, mode: 'insensitive' }
  }

  let orderBy: Prisma.QuestionOrderByWithRelationInput = { createdAt: 'desc' }
  
  if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' }
  }

  const questions = await prisma.question.findMany({
    where,
    include: {
      options: true
    },
    orderBy: (sort === 'difficulty_asc' || sort === 'difficulty_desc') ? undefined : orderBy
  })

  if (sort === 'difficulty_asc') {
    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 }
    questions.sort((a, b) => difficultyMap[a.difficulty] - difficultyMap[b.difficulty])
  } else if (sort === 'difficulty_desc') {
    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 }
    questions.sort((a, b) => difficultyMap[b.difficulty] - difficultyMap[a.difficulty])
  }

  return questions
}
