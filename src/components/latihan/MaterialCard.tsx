'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GradeLevel } from '@prisma/client';
import { SubjectType } from '@/lib/constants';
import { BookOpen, Play } from 'lucide-react';

interface MaterialCardProps {
  grade: GradeLevel;
  subject: SubjectType;
  questionCount: number;
}

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  SPLDV: 'Sistem Persamaan Linear Dua Variabel — substitusi, eliminasi, dan grafik.',
  MATRIKS: 'Matriks — operasi, determinan, invers, dan sistem persamaan.',
  KALKULUS: 'Kalkulus — limit, turunan, dan integral beserta penerapannya.',
  ALJABAR: 'Aljabar — faktorisasi, persamaan kuadrat, dan fungsi polinomial.',
  GEOMETRI: 'Geometri — bangun datar & ruang, Pythagoras, transformasi.',
  TRIGONOMETRI: 'Trigonometri — sin, cos, tan, dan identitas trigonometri.',
  STATISTIKA: 'Statistika — ukuran pemusatan, penyebaran, dan penyajian data.',
  PELUANG: 'Peluang — ruang sampel, kejadian, dan perhitungan peluang.',
  MOSAEC_EVALUATION: 'Evaluasi MOSAEC — soal komprehensif berbagai materi matematika.',
  LOGARITMA: 'Logaritma — sifat-sifat, persamaan, dan penerapan logaritma.',
  'STATISTIKA BIVARIAT': 'Statistika Bivariat — korelasi dan regresi linear dua variabel.',
  LINGKARAN: 'Lingkaran — unsur, persamaan, dan hubungan garis dengan lingkaran.',
};

const SUBJECT_ICONS: Record<string, string> = {
  SPLDV: '⚖️', MATRIKS: '🔢', KALKULUS: '∫', ALJABAR: '𝑥',
  GEOMETRI: '📐', TRIGONOMETRI: '📊', STATISTIKA: '📈', PELUANG: '🎲',
  MOSAEC_EVALUATION: '📝', LOGARITMA: 'log', 'STATISTIKA BIVARIAT': '📉', LINGKARAN: '⭕',
};

const MaterialCard: React.FC<MaterialCardProps> = ({ grade, subject, questionCount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const key = `mosaec_progress_${grade}_${subject}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      const answeredCount = Object.keys(data).length;
      if (questionCount > 0) setProgress(Math.round((answeredCount / questionCount) * 100));
    } catch (e) { /* ignore */ }
  }, [grade, subject, questionCount]);

  const getDisplayName = (s: string) => s.replace(/_/g, ' ');
  const isComplete = progress === 100;
  const description = SUBJECT_DESCRIPTIONS[subject] || `Latihan soal materi ${getDisplayName(subject)}.`;
  const icon = SUBJECT_ICONS[subject] || subject.charAt(0);
  const btnLabel = progress > 0 && !isComplete ? 'Lanjutkan' : isComplete ? 'Ulangi' : 'Kerjakan';

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors w-12 h-12 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-red-700 leading-none">{icon}</span>
          </div>
          {isComplete && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
              Selesai ✓
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-red-800 transition-colors">
          {getDisplayName(subject)}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{description}</p>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <BookOpen className="w-4 h-4" />
          <span>{questionCount} Soal</span>
        </div>

        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Progress</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-red-600'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <Link
          href={`/latihan/${grade}/${subject}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-800 hover:bg-red-900 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-red-800/20 text-sm"
        >
          <Play className="w-4 h-4 fill-current" />
          {btnLabel}
        </Link>
      </div>
    </div>
  );
};

export default MaterialCard;
