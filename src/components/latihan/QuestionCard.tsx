'use client'

import { useState } from 'react'
import { Question, Option } from '@prisma/client'
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface QuestionCardProps {
  question: Question & { options: Option[] }
  onAnswer?: (isCorrect: boolean) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption) return
    setIsSubmitted(true)
    
    const isCorrect = question.options.find(o => o.id === selectedOption)?.isCorrect || false
    if (onAnswer) {
      onAnswer(isCorrect)
    }
  }

  const isCorrect = selectedOption 
    ? question.options.find(o => o.id === selectedOption)?.isCorrect 
    : false

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {question.grade.replace('CLASS_', 'Kelas ')}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {question.subject}
          </span>
          <span className={`inline-block text-xs px-2 py-1 rounded-full ${
            question.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-800' :
            question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      <div className="text-lg font-medium text-gray-800 mb-6 whitespace-pre-line">
        {question.content}
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          let optionClass = "w-full text-left p-3 rounded-lg border transition-all "
          
          if (isSubmitted) {
            if (option.isCorrect) {
              optionClass += "bg-green-50 border-green-500 text-green-700"
            } else if (selectedOption === option.id) {
              optionClass += "bg-red-50 border-red-500 text-red-700"
            } else {
              optionClass += "border-gray-200 opacity-60"
            }
          } else {
            if (selectedOption === option.id) {
              optionClass += "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
            } else {
              optionClass += "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={optionClass}
              disabled={isSubmitted}
            >
              <div className="flex items-center justify-between">
                <span>{option.content}</span>
                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {isSubmitted && !option.isCorrect && selectedOption === option.id && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t pt-4 print:hidden">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Jawab
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah'}
            </span>
          </div>
        )}

        {isSubmitted && question.solution && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            {showSolution ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
            {showSolution ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        )}
      </div>

      {showSolution && question.solution && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <h4 className="font-semibold text-gray-900">Pembahasan</h4>
          </div>
          <p className="text-gray-700 whitespace-pre-line text-sm pl-7">
            {question.solution}
          </p>
        </div>
      )}
    </div>
  )
}
