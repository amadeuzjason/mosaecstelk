import { getSubjectStats } from '../actions'
import MaterialCard from '@/components/latihan/MaterialCard'
import { GradeLevel } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pilih Materi - MOSAEC',
  description: 'Pilih materi pelajaran untuk latihan soal.',
}

export default async function MaterialPage({ params }: { params: { grade: string } }) {
  // Validate grade
  const grade = params.grade as GradeLevel;
  if (!Object.values(GradeLevel).includes(grade)) {
    redirect('/latihan');
  }

  const stats = await getSubjectStats(grade);

  const getGradeName = (g: GradeLevel) => {
    switch (g) {
      case 'CLASS_10': return 'Kelas 10';
      case 'CLASS_11': return 'Kelas 11';
      case 'CLASS_12': return 'Kelas 12';
      default: return g;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/latihan" className="hover:text-red-800 transition-colors">Latihan Soal</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{getGradeName(grade)}</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
              Materi {getGradeName(grade)}
            </h1>
            <p className="text-lg text-gray-600">
              Pilih materi untuk mulai mengerjakan latihan soal.
            </p>
          </div>

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <MaterialCard 
                  key={stat.subject}
                  grade={grade}
                  subject={stat.subject}
                  questionCount={stat.questionCount}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">Belum ada materi tersedia untuk kelas ini.</p>
              <Link href="/latihan" className="inline-block mt-4 text-red-700 font-medium hover:underline">
                Kembali ke daftar kelas
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
