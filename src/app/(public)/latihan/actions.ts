'use server'

import { prisma } from '@/lib/prisma'
import { GradeLevel, Difficulty, Prisma } from '@prisma/client'
import { SubjectType } from '@/lib/constants'

export type GetQuestionsParams = {
  grade?: GradeLevel[]
  subject?: SubjectType[]
  search?: string
  difficulty?: Difficulty
  sort?: string
}

export async function getQuestions({ grade, subject, search, difficulty, sort }: GetQuestionsParams) {
  try {
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
  } catch (error) {
    console.error('Error in getQuestions:', error)
    return []
  }
}

export async function getClassStats() {
  try {
    // Get all questions to aggregate
    const questions = await prisma.question.findMany({
      select: {
        grade: true,
        subject: true,
      }
    });

    // Group by grade
    const stats = questions.reduce((acc, curr) => {
      if (!acc[curr.grade]) {
        acc[curr.grade] = {
          grade: curr.grade,
          questionCount: 0,
          subjects: new Set<SubjectType>()
        };
      }
      acc[curr.grade].questionCount++;
      acc[curr.grade].subjects.add(curr.subject as SubjectType);
      return acc;
    }, {} as Record<GradeLevel, { grade: GradeLevel, questionCount: number, subjects: Set<SubjectType> }>);

    return Object.values(stats).map(({ subjects, ...rest }) => ({
      ...rest,
      subjectCount: subjects.size,
    }));
  } catch (error) {
    console.error('Error in getClassStats:', error)
    return []
  }
}

export async function getSubjectStats(grade: GradeLevel) {
  try {
    const questions = await prisma.question.findMany({
      where: { grade },
      select: {
        subject: true,
      }
    });

    const stats = questions.reduce((acc, curr) => {
      const subject = curr.subject as SubjectType;
      if (!acc[subject]) {
        acc[subject] = {
          subject: subject,
          questionCount: 0
        };
      }
      acc[subject].questionCount++;
      return acc;
    }, {} as Record<SubjectType, { subject: SubjectType, questionCount: number }>);

    return Object.values(stats);
  } catch (error) {
    console.error('Error in getSubjectStats:', error)
    return []
  }
}
