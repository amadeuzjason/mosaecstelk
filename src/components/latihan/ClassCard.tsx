'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GradeLevel } from '@prisma/client';

interface ClassCardProps {
  grade: GradeLevel;
  subjectCount: number;
  questionCount: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ grade, subjectCount, questionCount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate total progress across all subjects in this grade
    // This is an estimation based on stored keys
    // Key format: mosaec_progress_{grade}_{subject} -> { [questionId]: answerId }
    
    // Ideally we would need to know the total questions to calculate accurate percentage
    // For now, let's just count how many questions are answered in this grade
    
    let answeredCount = 0;
    
    // We iterate through localStorage keys (not efficient but works for simple client-side only)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`mosaec_progress_${grade}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          answeredCount += Object.keys(data).length;
        } catch (e) {
          console.error('Error parsing progress', e);
        }
      }
    }

    if (questionCount > 0) {
      setProgress(Math.round((answeredCount / questionCount) * 100));
    }
  }, [grade, questionCount]);

  const getDisplayName = (grade: GradeLevel) => {
    switch (grade) {
      case 'CLASS_10': return 'Kelas 10';
      case 'CLASS_11': return 'Kelas 11';
      case 'CLASS_12': return 'Kelas 12';
      default: return grade;
    }
  };

  return (
    <Link 
      href={`/latihan/${grade}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="h-2 bg-gradient-to-r from-red-600 to-red-800" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-red-800 transition-colors">
            {getDisplayName(grade)}
          </h3>
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-100">
            {subjectCount} Materi
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          {questionCount} Soal Tersedia
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Progress</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-red-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
