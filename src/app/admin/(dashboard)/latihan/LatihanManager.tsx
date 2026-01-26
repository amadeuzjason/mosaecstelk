'use client'

import { useState, useEffect } from 'react'
import { createQuestion, deleteQuestion, updateQuestion } from './actions'
import { useFormState } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Search, Filter, Edit, Trash2, BookOpen, X, Save, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

// Mirroring Prisma Enums
const GradeLevels = ['CLASS_10', 'CLASS_11', 'CLASS_12']
const Subjects = ['SPLDV', 'MATRIKS', 'KALKULUS', 'ALJABAR', 'GEOMETRI', 'TRIGONOMETRI', 'STATISTIKA', 'PELUANG']
const Difficulties = ['EASY', 'MEDIUM', 'HARD']

type Option = {
  id: string
  content: string
  isCorrect: boolean
}

type Question = {
  id: string
  content: string
  grade: string
  subject: string
  difficulty: string
  solution: string | null
  options: Option[]
}

const initialState: { message?: string; error?: string } = {
  message: '',
  error: '',
}

export default function LatihanManager({ 
  questions,
  totalPages = 1,
  currentPage = 1
}: { 
  questions: Question[],
  totalPages: number,
  currentPage: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  
  const [createState, createAction] = useFormState(createQuestion, initialState)
  const [updateState, updateAction] = useFormState(updateQuestion, initialState)

  const { showToast } = useToast()

  useEffect(() => {
    if (createState.message) {
      showToast(createState.message, 'success')
      setIsModalOpen(false)
    }
    if (createState.error) {
      showToast(createState.error, 'error')
    }
  }, [createState, showToast])

  useEffect(() => {
    if (updateState.message) {
      showToast(updateState.message, 'success')
      setIsModalOpen(false)
    }
    if (updateState.error) {
      showToast(updateState.error, 'error')
    }
  }, [updateState, showToast])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', '1')
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', '1')
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  // Temporary state for options in the form
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', ''])
  const [correctOption, setCorrectOption] = useState<number>(0)

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setFormOptions(question.options.map(o => o.content))
    const correctIndex = question.options.findIndex(o => o.isCorrect)
    setCorrectOption(correctIndex >= 0 ? correctIndex : 0)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (questionToDelete) {
      const formData = new FormData()
      formData.append('id', questionToDelete.id)
      const result = await deleteQuestion(formData)
      
      if (result?.message) {
        showToast(result.message, 'success')
      } else if (result?.error) {
        showToast(result.error, 'error')
      }

      setIsDeleteModalOpen(false)
      setQuestionToDelete(null)
    }
  }

  const handleClose = () => {
    setEditingQuestion(null)
    setFormOptions(['', '', '', ''])
    setCorrectOption(0)
    setIsModalOpen(false)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formOptions]
    newOptions[index] = value
    setFormOptions(newOptions)
  }

  const addOption = () => {
    if (formOptions.length < 5) {
        setFormOptions([...formOptions, ''])
    }
  }

  const removeOption = (index: number) => {
    if (formOptions.length > 2) {
        const newOptions = formOptions.filter((_, i) => i !== index)
        setFormOptions(newOptions)
        if (correctOption >= index && correctOption > 0) {
            setCorrectOption(correctOption - 1)
        }
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-red-800" />
                Latihan Soal Management
            </h1>
            <p className="text-gray-500 mt-1">Manage practice questions, grades, and subjects</p>
        </div>
        <button
            onClick={() => {
              setEditingQuestion(null)
              setFormOptions(['', '', '', ''])
              setIsModalOpen(true)
            }}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Question
          </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
            type="text"
            placeholder="Search question content..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            defaultValue={searchParams?.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
        <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white w-full sm:w-48 appearance-none"
                defaultValue={searchParams?.get('grade')?.toString()}
                onChange={(e) => handleFilter('grade', e.target.value)}
                >
                <option value="">All Grades</option>
                {GradeLevels.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
                </select>
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white w-full sm:w-48 appearance-none"
                defaultValue={searchParams?.get('subject')?.toString()}
                onChange={(e) => handleFilter('subject', e.target.value)}
                >
                <option value="">All Subjects</option>
                {Subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.length > 0 ? questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 line-clamp-2 font-medium">{question.content}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        {question.grade.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{question.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border
                        ${question.difficulty === 'EASY' ? 'bg-green-50 text-green-700 border-green-100' : 
                          question.difficulty === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                          'bg-red-50 text-red-700 border-red-100'}`}>
                        {question.difficulty}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleEdit(question)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(question)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <BookOpen className="h-10 w-10 text-gray-300" />
                            <p className="text-lg font-medium">No questions found</p>
                            <p className="text-sm">Try adjusting your filters or search</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
          </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h2>
                <button 
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <form action={async (formData) => {
                if (editingQuestion) {
                    await updateAction(formData);
                } else {
                    await createAction(formData);
                }
                handleClose();
            }} className="p-6 space-y-6">
              {editingQuestion && <input type="hidden" name="id" value={editingQuestion.id} />}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <div className="relative">
                        <select name="grade" defaultValue={editingQuestion?.grade || GradeLevels[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none bg-white">
                            {GradeLevels.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="relative">
                        <select name="subject" defaultValue={editingQuestion?.subject || Subjects[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none bg-white">
                            {Subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <div className="relative">
                        <select name="difficulty" defaultValue={editingQuestion?.difficulty || Difficulties[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none bg-white">
                            {Difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <HelpCircle size={16} className="text-red-500" />
                    Question Content
                </label>
                <textarea
                  name="content"
                  defaultValue={editingQuestion?.content}
                  required
                  rows={4}
                  placeholder="Enter your question here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    Answer Options
                    <span className="text-xs font-normal text-gray-500 ml-2">(Select the correct answer)</span>
                </label>
                <div className="space-y-3">
                    {formOptions.map((opt, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input 
                                type="radio" 
                                name="correctOption" 
                                value={index} 
                                checked={correctOption === index} 
                                onChange={() => setCorrectOption(index)}
                                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    name={`option_content_${index}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeOption(index)} 
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                disabled={formOptions.length <= 2}
                                title={formOptions.length <= 2 ? "Minimum 2 options required" : "Remove option"}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                {formOptions.length < 5 && (
                    <button 
                        type="button" 
                        onClick={addOption} 
                        className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Option
                    </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution (Explanation)</label>
                <textarea
                  name="solution"
                  defaultValue={editingQuestion?.solution || ''}
                  rows={3}
                  placeholder="Explain why the answer is correct..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 font-medium flex items-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Question?</h3>
                    <p className="text-gray-500 mb-6">
                        Are you sure you want to delete this question? This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
