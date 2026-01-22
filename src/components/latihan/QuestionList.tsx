'use client'

import { Question, Option } from '@prisma/client'
import QuestionCard from './QuestionCard'
import { useState } from 'react'
import { Printer } from 'lucide-react'

interface QuestionListProps {
  questions: (Question & { options: Option[] })[]
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [score, setScore] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)

  const handleAnswer = (isCorrect: boolean) => {
    setAnsweredCount(prev => prev + 1)
    if (isCorrect) setScore(prev => prev + 1)
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">Tidak ada soal yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center sticky top-24 z-10 print:hidden">
        <div>
          <h3 className="font-semibold text-gray-900">Progress Latihan</h3>
          <p className="text-sm text-gray-600">Menampilkan {questions.length} soal</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Cetak Soal (PDF)"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Cetak</span>
          </button>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {score} <span className="text-gray-400 text-lg">/ {answeredCount}</span>
            </div>
            <p className="text-xs text-gray-500">Jawaban Benar</p>
          </div>
        </div>
      </div>

      {questions.map((question) => (
        <QuestionCard 
          key={question.id} 
          question={question} 
          onAnswer={handleAnswer}
        />
      ))}
    </div>
  )
}
