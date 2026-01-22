import { getQuestions } from './actions'
import FilterSidebar from '@/components/latihan/FilterSidebar'
import QuestionList from '@/components/latihan/QuestionList'
import SearchBar from '@/components/latihan/SearchBar'
import SortDropdown from '@/components/latihan/SortDropdown'
import { GradeLevel, SubjectType, Difficulty } from '@prisma/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Latihan Soal - MOSAEC',
  description: 'Kumpulan soal latihan matematika untuk siswa SMK Telkom Makassar',
}

export default async function LatihanPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const grade = typeof searchParams.grade === 'string' 
    ? searchParams.grade.split(',') as GradeLevel[] 
    : undefined
    
  const subject = typeof searchParams.subject === 'string' 
    ? searchParams.subject.split(',') as SubjectType[] 
    : undefined
    
  const search = typeof searchParams.search === 'string' 
    ? searchParams.search 
    : undefined

  const difficulty = typeof searchParams.difficulty === 'string'
    ? searchParams.difficulty as Difficulty
    : undefined

  const sort = typeof searchParams.sort === 'string'
    ? searchParams.sort
    : undefined

  const questions = await getQuestions({
    grade,
    subject,
    search,
    difficulty,
    sort,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Latihan Soal</h1>
          <p className="text-gray-600">
            Asah kemampuan matematikamu dengan kumpulan soal latihan yang tersedia.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 print:hidden">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 print:hidden">
              <div className="flex-grow">
                <SearchBar />
              </div>
              <div className="flex-shrink-0">
                <SortDropdown />
              </div>
            </div>
            <QuestionList questions={questions} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
