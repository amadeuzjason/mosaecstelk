import { getQuestions } from '@/app/latihan/actions'
import QuizInterface from '@/components/latihan/QuizInterface'
import { GradeLevel, SubjectType } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Latihan Soal - MOSAEC',
  description: 'Kerjakan soal latihan matematika.',
}

export default async function QuizPage({ 
  params 
}: { 
  params: { grade: string, subject: string } 
}) {
  // Validate params
  const grade = params.grade as GradeLevel;
  const subject = params.subject as SubjectType;

  if (!Object.values(GradeLevel).includes(grade) || !Object.values(SubjectType).includes(subject)) {
    redirect('/latihan');
  }

  const questions = await getQuestions({
    grade: [grade],
    subject: [subject],
    sort: 'oldest' // Maintain consistent order for quiz
  });

  const getGradeName = (g: GradeLevel) => {
    switch (g) {
      case 'CLASS_10': return 'Kelas 10';
      case 'CLASS_11': return 'Kelas 11';
      case 'CLASS_12': return 'Kelas 12';
      default: return g;
    }
  };

  const getSubjectName = (s: SubjectType) => s.replace(/_/g, ' ');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm font-medium text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/latihan" className="hover:text-red-800 transition-colors">Latihan Soal</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/latihan/${grade}`} className="hover:text-red-800 transition-colors">{getGradeName(grade)}</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{getSubjectName(subject)}</span>
          </nav>

          <QuizInterface 
            questions={questions}
            grade={grade}
            subject={subject}
          />
        </div>
      </main>
    </div>
  )
}
