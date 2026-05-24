'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GradeLevel } from '@prisma/client';
import { BookOpen, ChevronRight } from 'lucide-react';

interface ClassCardProps {
  grade: GradeLevel;
  subjectCount: number;
  questionCount: number;
}

const GRADE_META: Record<string, { label: string; desc: string; icon: string; color: string }> = {
  CLASS_10: {
    label: 'Kelas 10',
    desc: 'Materi dasar matematika SMA — aljabar, geometri, trigonometri, dan statistika.',
    icon: '①',
    color: 'from-blue-600 to-blue-800',
  },
  CLASS_11: {
    label: 'Kelas 11',
    desc: 'Materi lanjutan — matriks, kalkulus, peluang, dan statistika bivariat.',
    icon: '②',
    color: 'from-red-700 to-red-900',
  },
  CLASS_12: {
    label: 'Kelas 12',
    desc: 'Persiapan ujian — logaritma, lingkaran, dan evaluasi komprehensif.',
    icon: '③',
    color: 'from-emerald-600 to-emerald-800',
  },
};

const ClassCard: React.FC<ClassCardProps> = ({ grade, subjectCount, questionCount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let answeredCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`mosaec_progress_${grade}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          answeredCount += Object.keys(data).length;
        } catch (e) { /* ignore */ }
      }
    }
    if (questionCount > 0) setProgress(Math.round((answeredCount / questionCount) * 100));
  }, [grade, questionCount]);

  const meta = GRADE_META[grade] || { label: grade, desc: '', icon: '?', color: 'from-gray-600 to-gray-800' };
  const isComplete = progress >= 100;

  return (
    <Link
      href={`/latihan/${grade}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Gradient top bar */}
      <div className={`h-2 bg-gradient-to-r ${meta.color}`} />

      <div className="p-8">
        {/* Icon + badge */}
        <div className="flex justify-between items-start mb-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}>
            <span className="text-3xl font-bold text-white">{meta.icon}</span>
          </div>
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
            {subjectCount} Materi
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-gray-800 group-hover:text-red-800 transition-colors mb-2 font-playfair">
          {meta.label}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">{meta.desc}</p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-gray-700">{questionCount}</span> Soal
          </span>
          {isComplete && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
              Selesai ✓
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Progress</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-red-600'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between text-red-700 font-semibold text-sm group-hover:text-red-900 transition-colors">
          <span>Mulai Belajar</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
