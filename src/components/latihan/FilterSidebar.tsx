'use client'

import { GradeLevel } from '@prisma/client'
import { SubjectType } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '')
      const current = params.get(name)?.split(',') || []
      
      if (current.includes(value)) {
        const next = current.filter(v => v !== value)
        if (next.length === 0) {
          params.delete(name)
        } else {
          params.set(name, next.join(','))
        }
      } else {
        current.push(value)
        params.set(name, current.join(','))
      }
      
      return params.toString()
    },
    [searchParams]
  )

  const handleFilter = (type: 'grade' | 'subject', value: string) => {
    router.push(`?${createQueryString(type, value)}`)
  }

  const isChecked = (type: 'grade' | 'subject', value: string) => {
    const params = searchParams?.get(type)?.split(',') || []
    return params.includes(value)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Filter Soal</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Tingkat Kelas</h4>
        {Object.values(GradeLevel).map((grade) => (
          <div key={grade} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={grade}
              checked={isChecked('grade', grade)}
              onChange={() => handleFilter('grade', grade)}
              className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={grade} className="text-sm text-gray-600 cursor-pointer">
              {grade.replace('CLASS_', 'Kelas ')}
            </label>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Materi Pembelajaran</h4>
        {Object.values(SubjectType).map((subject) => (
          <div key={subject} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={subject}
              checked={isChecked('subject', subject)}
              onChange={() => handleFilter('subject', subject)}
              className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={subject} className="text-sm text-gray-600 capitalize cursor-pointer">
              {subject.toLowerCase()}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
