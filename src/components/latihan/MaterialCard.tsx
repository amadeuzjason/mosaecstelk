'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GradeLevel, SubjectType } from '@prisma/client';

interface MaterialCardProps {
  grade: GradeLevel;
  subject: SubjectType;
  questionCount: number;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ grade, subject, questionCount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress for this specific subject
    // Key format: mosaec_progress_{grade}_{subject} -> { [questionId]: answerId }
    const key = `mosaec_progress_${grade}_${subject}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      const answeredCount = Object.keys(data).length;
      
      if (questionCount > 0) {
        setProgress(Math.round((answeredCount / questionCount) * 100));
      }
    } catch (e) {
      console.error('Error parsing progress', e);
    }
  }, [grade, subject, questionCount]);

  const getDisplayName = (subject: SubjectType) => {
    // You can map enum to nicer names if needed, or just capitalize
    return subject.replace(/_/g, ' ');
  };

  const isComplete = progress === 100;

  return (
    <Link 
      href={`/latihan/${grade}/${subject}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
            {/* Simple icon placeholder based on subject first letter */}
            <span className="text-xl font-bold text-red-700">
              {subject.charAt(0)}
            </span>
          </div>
          {isComplete && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
              Selesai
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-800 transition-colors">
          {getDisplayName(subject)}
        </h3>
        
        <p className="text-gray-500 text-sm mb-6">
          {questionCount} Soal
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>{Math.min(progress, 100)}% Selesai</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-red-600'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MaterialCard;
