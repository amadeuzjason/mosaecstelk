'use client';

import React, { useState, useEffect } from 'react';
import { Question, Option, GradeLevel } from '@prisma/client';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { normalizeMath } from '@/lib/utils';

interface QuizInterfaceProps {
  questions: (Question & { options: Option[] })[];
  grade: GradeLevel;
  subject: string;
}

function RenderContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizeMath(content)}
      </ReactMarkdown>
    </div>
  );
}

function RenderOptionContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({node, ...props}) => <span {...props} />
      }}
    >
      {normalizeMath(content)}
    </ReactMarkdown>
  );
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, grade, subject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const key = `mosaec_progress_${grade}_${subject}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading progress', e);
    }
  }, [grade, subject]);

  const handleAnswer = (questionId: string, optionId: string) => {
    if (isSubmitted) return; // Prevent changing answers after submit
    
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    // Save to localStorage
    const key = `mosaec_progress_${grade}_${subject}`;
    localStorage.setItem(key, JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    if (!window.confirm('Apakah Anda yakin ingin menyelesaikan latihan ini?')) return;

    let correctCount = 0;
    questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(opt => opt.isCorrect);
      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (!window.confirm('Ulangi latihan? Progress saat ini akan dihapus.')) return;
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCurrentIndex(0);
    const key = `mosaec_progress_${grade}_${subject}`;
    localStorage.removeItem(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = questions[currentIndex];
  const hasNext = currentIndex < questions.length - 1;
  const hasPrev = currentIndex > 0;

  if (!isClient) return <div className="p-8 text-center">Loading...</div>;

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Tidak ada soal tersedia untuk materi ini.</p>
        <Link href={`/latihan/${grade}`} className="text-red-700 hover:underline mt-4 inline-block">
          Kembali ke Materi
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {isSubmitted && (
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Latihan Selesai!</h2>
          <p className="text-gray-600 mb-6">Anda telah menyelesaikan latihan soal ini.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Total Soal</div>
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-600 mb-1">Benar</div>
              <div className="text-2xl font-bold text-green-700">{score}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-sm text-red-600 mb-1">Salah</div>
              <div className="text-2xl font-bold text-red-700">{Object.keys(answers).length - score}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-blue-600 mb-1">Nilai</div>
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((score / questions.length) * 100)}
              </div>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Ulangi Latihan
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Question Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Soal No. {currentIndex + 1}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex-grow">
              {currentQuestion.image && (
                <div className="mb-6 rounded-xl overflow-hidden border border-gray-100">
                  <img 
                    src={currentQuestion.image} 
                    alt="Question Image" 
                    className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                  />
                </div>
              )}
              <div className="mb-8 text-gray-800 text-lg">
                <RenderContent content={currentQuestion.content} />
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  let optionClass = "border-gray-100 hover:border-red-200 hover:bg-gray-50";
                  let indicatorClass = "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-700";
                  
                  if (isSubmitted) {
                    if (option.isCorrect) {
                      optionClass = "border-green-500 bg-green-50";
                      indicatorClass = "bg-green-600 text-white";
                    } else if (isSelected && !option.isCorrect) {
                      optionClass = "border-red-500 bg-red-50";
                      indicatorClass = "bg-red-600 text-white";
                    } else {
                      optionClass = "border-gray-100 opacity-60";
                    }
                  } else if (isSelected) {
                    optionClass = "border-red-800 bg-red-50";
                    indicatorClass = "bg-red-800 text-white";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start group ${optionClass}`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 shrink-0 transition-colors ${indicatorClass}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-base ${isSelected || (isSubmitted && option.isCorrect) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        <RenderOptionContent content={option.content} />
                      </span>
                      {isSubmitted && option.isCorrect && (
                        <CheckCircle className="ml-auto w-5 h-5 text-green-600" />
                      )}
                      {isSubmitted && isSelected && !option.isCorrect && (
                        <XCircle className="ml-auto w-5 h-5 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {isSubmitted && currentQuestion.solution && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2">Pembahasan:</h4>
                  <div className="text-blue-800">
                    <RenderContent content={currentQuestion.solution} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Navigation */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={!hasPrev}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  hasPrev 
                    ? 'text-gray-700 hover:bg-white hover:shadow-sm' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </button>
              
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={!hasNext}
                className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  hasNext 
                    ? 'bg-red-800 text-white hover:bg-red-900 shadow-sm hover:shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Grid */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              Navigasi Soal
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                
                let btnClass = "";
                
                if (isSubmitted) {
                   // Check if answer is correct
                   const selectedOptionId = answers[q.id];
                   const correctOption = q.options.find(opt => opt.isCorrect);
                   const isCorrect = selectedOptionId && correctOption && selectedOptionId === correctOption.id;
                   
                   if (isCorrect) {
                     btnClass = "bg-green-600 text-white border-2 border-green-600";
                   } else if (selectedOptionId) {
                     btnClass = "bg-red-600 text-white border-2 border-red-600";
                   } else {
                     btnClass = "bg-gray-100 text-gray-400 border-2 border-gray-200";
                   }
                   
                   if (isCurrent) {
                     btnClass += " ring-2 ring-blue-500 ring-offset-2";
                   }
                } else {
                  if (isCurrent) {
                    btnClass = 'ring-2 ring-red-800 ring-offset-2 bg-white text-red-800 border-2 border-red-800';
                  } else if (isAnswered) {
                    btnClass = 'bg-red-800 text-white border-2 border-red-800';
                  } else {
                    btnClass = 'bg-gray-50 text-gray-500 border-2 border-gray-100 hover:border-gray-300';
                  }
                }
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 text-sm text-gray-500 border-t border-gray-100 pt-4">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-800 mr-3" />
                    <span>Sudah dikerjakan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-red-800 mr-3" />
                    <span>Sedang dikerjakan</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 mr-3" />
                    <span>Belum dikerjakan</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-600 mr-3" />
                    <span>Benar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 mr-3" />
                    <span>Salah</span>
                  </div>
                </>
              )}
            </div>
            
            {!isSubmitted && (
              <button 
                className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                onClick={handleSubmit}
              >
                Selesai Mengerjakan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
