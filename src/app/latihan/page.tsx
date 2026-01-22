import { getClassStats } from './actions'
import ClassCard from '@/components/latihan/ClassCard'

export const metadata = {
  title: 'Latihan Soal - MOSAEC',
  description: 'Pilih kelas untuk memulai latihan soal matematika.',
}

export default async function LatihanPage() {
  const stats = await getClassStats();

  // Ensure we have entries for all grades even if no questions exist yet
  const allGrades = ['CLASS_10', 'CLASS_11', 'CLASS_12'] as const;
  const displayStats = allGrades.map(grade => {
    const stat = stats.find(s => s.grade === grade);
    return stat || { grade, questionCount: 0, subjectCount: 0 };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
            <span className="text-gray-900">Latihan Soal</span>
          </nav>

          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
              Pilih Kelas
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Silakan pilih jenjang kelas untuk melihat materi dan kumpulan soal latihan yang tersedia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayStats.map((stat) => (
              <ClassCard 
                key={stat.grade}
                grade={stat.grade}
                subjectCount={stat.subjectCount}
                questionCount={stat.questionCount}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
