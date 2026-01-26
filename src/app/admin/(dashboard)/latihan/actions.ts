'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { GradeLevel, SubjectType, Difficulty } from '@prisma/client'

export async function createQuestion(prevState: any, formData: FormData) {
  try {
    const content = formData.get('content') as string
    const grade = formData.get('grade') as GradeLevel
    const subject = formData.get('subject') as SubjectType
    const difficulty = formData.get('difficulty') as Difficulty
    const solution = formData.get('solution') as string

    // Parse options
    // Expecting option_content_{i} and correct_option radio value
    const optionsData: { content: string; isCorrect: boolean }[] = []
    const correctOptionIndex = parseInt(formData.get('correctOption') as string)

    for (let i = 0; i < 5; i++) {
      const optionContent = formData.get(`option_content_${i}`) as string
      if (optionContent && optionContent.trim() !== '') {
        optionsData.push({
          content: optionContent,
          isCorrect: i === correctOptionIndex
        })
      }
    }

    if (optionsData.length < 2) {
        return { error: 'At least 2 options are required' }
    }

    await prisma.question.create({
      data: {
        content,
        grade,
        subject,
        difficulty,
        solution,
        options: {
          create: optionsData
        }
      },
    })

    revalidatePath('/admin/latihan')
    return { message: 'Question created successfully' }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create question' }
  }
}

export async function deleteQuestion(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.question.delete({
      where: { id },
    })
    revalidatePath('/admin/latihan')
    return { message: 'Question deleted successfully' }
  } catch (e) {
    console.error('Failed to delete question', e)
    return { error: 'Failed to delete question' }
  }
}

export async function updateQuestion(prevState: any, formData: FormData) {
    try {
      const id = formData.get('id') as string
      const content = formData.get('content') as string
      const grade = formData.get('grade') as GradeLevel
      const subject = formData.get('subject') as SubjectType
      const difficulty = formData.get('difficulty') as Difficulty
      const solution = formData.get('solution') as string
  
      // For update, it's easier to delete existing options and recreate them
      // OR update them if we track IDs. For simplicity, delete and recreate is often used but changes IDs.
      // Let's try transaction or just deleteMany then create.
      
      const optionsData: { content: string; isCorrect: boolean }[] = []
      const correctOptionIndex = parseInt(formData.get('correctOption') as string)
  
      for (let i = 0; i < 5; i++) {
        const optionContent = formData.get(`option_content_${i}`) as string
        if (optionContent && optionContent.trim() !== '') {
          optionsData.push({
            content: optionContent,
            isCorrect: i === correctOptionIndex
          })
        }
      }

      if (optionsData.length < 2) {
        return { error: 'At least 2 options are required' }
      }
  
      // Transaction to update question and replace options
      await prisma.$transaction(async (tx) => {
        await tx.question.update({
            where: { id },
            data: {
                content,
                grade,
                subject,
                difficulty,
                solution,
            }
        })

        // Delete old options
        await tx.option.deleteMany({
            where: { questionId: id }
        })

        // Create new options
        for (const opt of optionsData) {
            await tx.option.create({
                data: {
                    content: opt.content,
                    isCorrect: opt.isCorrect,
                    questionId: id
                }
            })
        }
      })
  
      revalidatePath('/admin/latihan')
      return { message: 'Question updated successfully' }
    } catch (e) {
      console.error(e)
      return { error: 'Failed to update question' }
    }
  }
