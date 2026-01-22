'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    router.push(`?${createQueryString('sort', value)}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Urutkan:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="difficulty_asc">Kesulitan (Mudah-Sulit)</option>
        <option value="difficulty_desc">Kesulitan (Sulit-Mudah)</option>
      </select>
    </div>
  )
}
