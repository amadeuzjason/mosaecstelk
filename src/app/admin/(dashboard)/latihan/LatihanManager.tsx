'use client'

import { useState, useEffect, useRef } from 'react'
import { createQuestion, deleteQuestion, updateQuestion } from './actions'
import { useFormState } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import {
  Plus, Search, Filter, Edit, Trash2, BookOpen, X, Save,
  AlertTriangle, CheckCircle, Upload, Eye, EyeOff,
  Bold, Italic, Strikethrough, Table, Image as ImageIcon, Loader2,
  Sigma, Subscript, Superscript, List, Minus, FileUp
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { SUBJECTS, GRADE_LEVELS } from '@/lib/constants'
import { uploadImage } from './upload-action'
import { normalizeMath } from '@/lib/utils'
import PdfImporter from './PdfImporter'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

const GradeLevels = GRADE_LEVELS
const Subjects = SUBJECTS
const Difficulties = ['EASY', 'MEDIUM', 'HARD']

type Option = {
  id: string
  content: string
  image: string | null
  isCorrect: boolean
}

type Question = {
  id: string
  content: string
  grade: string
  subject: string
  difficulty: string
  solution: string | null
  image: string | null
  options: Option[]
}

type FormOption = {
  content: string
  image: string | null
  imageFile: File | null
}

const initialState: { message?: string; error?: string } = { message: '', error: '' }

function MarkdownPreview({ content }: { content: string }) {
  if (!content) return null
  return (
    <div className="prose prose-sm max-w-none p-4 bg-blue-50/50 rounded-lg border border-blue-100 mt-2">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizeMath(content)}
      </ReactMarkdown>
    </div>
  )
}

// Rich text toolbar for a textarea
function RichToolbar({
  textareaRef,
  onInsert,
  onImageUpload,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onInsert: (text: string, cursorOffset?: number) => void
  onImageUpload: () => void
}) {
  const wrap = (before: string, after: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = el.value.slice(start, end) || 'teks'
    onInsert(
      el.value.slice(0, start) + before + selected + after + el.value.slice(end),
    )
    // restore cursor
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const insert = (snippet: string, offset = 0) => {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const newVal = el.value.slice(0, pos) + snippet + el.value.slice(pos)
    onInsert(newVal)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(pos + offset, pos + offset)
    }, 0)
  }

  const tools = [
    { icon: <Bold size={14} />, title: 'Bold', action: () => wrap('**', '**') },
    { icon: <Italic size={14} />, title: 'Italic', action: () => wrap('*', '*') },
    { icon: <Strikethrough size={14} />, title: 'Strikethrough', action: () => wrap('~~', '~~') },
    { icon: <span className="text-xs font-bold">H</span>, title: 'Heading', action: () => wrap('## ', '') },
    { icon: <List size={14} />, title: 'List', action: () => insert('\n- item\n', 3) },
    { icon: <Minus size={14} />, title: 'Horizontal Rule', action: () => insert('\n---\n', 5) },
    { icon: <Superscript size={14} />, title: 'Superscript (LaTeX)', action: () => wrap('$x^{', '}$') },
    { icon: <Subscript size={14} />, title: 'Subscript (LaTeX)', action: () => wrap('$x_{', '}$') },
    { icon: <Sigma size={14} />, title: 'Inline LaTeX', action: () => wrap('$', '$') },
    { icon: <span className="text-xs font-mono">∑</span>, title: 'Block LaTeX', action: () => insert('\n$$\n\n$$\n', 4) },
    {
      icon: <Table size={14} />, title: 'Insert Table', action: () => insert(
        '\n| Kolom 1 | Kolom 2 | Kolom 3 |\n|---------|---------|----------|\n| Data 1  | Data 2  | Data 3   |\n',
        2
      )
    },
    { icon: <ImageIcon size={14} />, title: 'Upload Image', action: onImageUpload },
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0">
      {tools.map((t, i) => (
        <button
          key={i}
          type="button"
          title={t.title}
          onClick={t.action}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
function RichTextArea({ label, name, value, onChange, placeholder, required = false, showPreview }: { label: string; name: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; showPreview: boolean }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const [uploading, setUploading] = useState(false)

  const handleInsert = (newValue: string) => {
    onChange(newValue)
  }

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be < 5MB", "error")
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const result = await uploadImage(fd)
      if (result.error || !result.url) throw new Error(result.error || "Upload failed")
      const el = textareaRef.current
      const pos = el ? el.selectionStart : value.length
      const snippet = `\n![image](${result.url})\n`
      onChange(value.slice(0, pos) + snippet + value.slice(pos))
      showToast("Image uploaded", "success")
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload failed", "error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
        <RichToolbar
          textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
          onInsert={handleInsert}
          onImageUpload={() => imageInputRef.current?.click()}
        />
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={5}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 border-0 focus:outline-none resize-y text-sm font-mono bg-white"
        />
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleImageUpload(f)
          e.target.value = ""
        }}
      />
      {uploading && <p className="text-xs text-blue-600 mt-1 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading image...</p>}
      {showPreview && value && <MarkdownPreview content={value} />}
    </div>
  )
}
export default function LatihanManager({
  questions,
  totalPages = 1,
  currentPage = 1
}: {
  questions: Question[]
  totalPages: number
  currentPage: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isPdfImporterOpen, setIsPdfImporterOpen] = useState(false)

  const [createState, createAction] = useFormState(createQuestion, initialState)
  const [updateState, updateAction] = useFormState(updateQuestion, initialState)

  const { showToast } = useToast()

  useEffect(() => {
    if (createState.message) { showToast(createState.message, "success"); setIsModalOpen(false) }
    if (createState.error) showToast(createState.error, "error")
  }, [createState, showToast])

  useEffect(() => {
    if (updateState.message) { showToast(updateState.message, "success"); setIsModalOpen(false) }
    if (updateState.error) showToast(updateState.error, "error")
  }, [updateState, showToast])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("page", "1")
    if (term) params.set("q", term); else params.delete("q")
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("page", "1")
    if (value) params.set(key, value); else params.delete(key)
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("page", page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const [formOptions, setFormOptions] = useState<FormOption[]>(
    Array(4).fill(null).map(() => ({ content: "", image: null, imageFile: null }))
  )
  const [correctOption, setCorrectOption] = useState<number>(0)
  const [showPreview, setShowPreview] = useState(true)
  const [subjectValue, setSubjectValue] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [contentValue, setContentValue] = useState("")
  const [solutionValue, setSolutionValue] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { showToast("Image size must be less than 5MB", "error"); return }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleOptionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { showToast("Image size must be less than 5MB", "error"); return }
      const newOptions = [...formOptions]
      newOptions[index] = { ...newOptions[index], imageFile: file, image: URL.createObjectURL(file) }
      setFormOptions(newOptions)
    }
  }

  const removeOptionImage = (index: number) => {
    const newOptions = [...formOptions]
    newOptions[index] = { ...newOptions[index], imageFile: null, image: null }
    setFormOptions(newOptions)
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setFormOptions(question.options.map(o => ({ content: o.content, image: o.image, imageFile: null })))
    const correctIndex = question.options.findIndex(o => o.isCorrect)
    setCorrectOption(correctIndex >= 0 ? correctIndex : 0)
    setSubjectValue(question.subject)
    setImagePreview(question.image)
    setImageFile(null)
    setContentValue(question.content)
    setSolutionValue(question.solution || "")
    setIsModalOpen(true)
  }

  const handleCreateOpen = () => {
    setEditingQuestion(null)
    setFormOptions(Array(4).fill(null).map(() => ({ content: "", image: null, imageFile: null })))
    setSubjectValue(Subjects[0])
    setImagePreview(null)
    setImageFile(null)
    setContentValue("")
    setSolutionValue("")
    setIsModalOpen(true)
  }

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (questionToDelete) {
      const formData = new FormData()
      formData.append("id", questionToDelete.id)
      const result = await deleteQuestion(formData)
      if (result?.message) showToast(result.message, "success")
      else if (result?.error) showToast(result.error, "error")
      setIsDeleteModalOpen(false)
      setQuestionToDelete(null)
    }
  }

  const handleClose = () => {
    setEditingQuestion(null)
    setFormOptions(Array(4).fill(null).map(() => ({ content: "", image: null, imageFile: null })))
    setCorrectOption(0)
    setImagePreview(null)
    setImageFile(null)
    setContentValue("")
    setSolutionValue("")
    setSubjectValue(Subjects[0])
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (formData: FormData) => {
    setIsUploading(true)
    setIsSubmitting(true)
    try {
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)
        const uploadResult = await uploadImage(imageFormData)
        if (uploadResult.error || !uploadResult.url) throw new Error(uploadResult.error || "Upload failed")
        formData.set("image", uploadResult.url)
      } else if (imagePreview && editingQuestion && imagePreview === editingQuestion.image) {
        formData.set("image", imagePreview)
      } else {
        formData.delete("image")
      }

      for (let i = 0; i < formOptions.length; i++) {
        const option = formOptions[i]
        let imageUrl = option.image
        if (option.imageFile) {
          const imageFormData = new FormData()
          imageFormData.append("file", option.imageFile)
          imageFormData.append("bucket", "option_img")
          const uploadResult = await uploadImage(imageFormData)
          if (uploadResult.error || !uploadResult.url) throw new Error(`Failed to upload option ${i + 1}: ${uploadResult.error}`)
          imageUrl = uploadResult.url
        }
        formData.set(`option_content_${i}`, option.content)
        if (imageUrl) formData.set(`option_image_${i}`, imageUrl)
        else formData.delete(`option_image_${i}`)
      }

      formData.set("subject", subjectValue)
      formData.set("content", contentValue)
      formData.set("solution", solutionValue)

      if (editingQuestion) updateAction(formData)
      else createAction(formData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image"
      showToast(errorMessage, "error")
    } finally {
      setIsUploading(false)
      setIsSubmitting(false)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formOptions]
    newOptions[index] = { ...newOptions[index], content: value }
    setFormOptions(newOptions)
  }

  const addOption = () => {
    if (formOptions.length < 5) setFormOptions([...formOptions, { content: "", image: null, imageFile: null }])
  }

  const removeOption = (index: number) => {
    if (formOptions.length > 2) {
      const newOptions = formOptions.filter((_, i) => i !== index)
      setFormOptions(newOptions)
      if (correctOption >= index && correctOption > 0) setCorrectOption(correctOption - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-red-800" />
            Latihan Soal
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola soal latihan, kelas, dan materi</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPdfImporterOpen(true)}
            className="flex items-center justify-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-lg hover:bg-purple-800 transition-colors shadow-sm font-medium flex-1 sm:flex-none"
          >
            <FileUp size={18} />
            Import PDF
          </button>
          <button
            onClick={handleCreateOpen}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-sm font-medium flex-1 sm:flex-none"
          >
            <Plus size={18} />
            Tambah Soal
          </button>
        </div>
      </div>

      {/* PDF Importer Modal */}
      <PdfImporter
        isOpen={isPdfImporterOpen}
        onClose={() => setIsPdfImporterOpen(false)}
        onImportDone={() => { setIsPdfImporterOpen(false); window.location.reload() }}
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari soal..."
            className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            defaultValue={searchParams?.get("q")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white w-full sm:w-44 appearance-none text-sm"
              defaultValue={searchParams?.get("grade")?.toString()}
              onChange={(e) => handleFilter("grade", e.target.value)}
            >
              <option value="">Semua Kelas</option>
              {GradeLevels.map(g => <option key={g} value={g}>{g.replace("_", " ")}</option>)}
            </select>
          </div>
          {/* Subject filter as searchable text input */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              list="filter-subject-list"
              placeholder="Semua Materi"
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white w-full sm:w-48 text-sm"
              defaultValue={searchParams?.get("subject")?.toString()}
              onChange={(e) => handleFilter("subject", e.target.value)}
            />
            <datalist id="filter-subject-list">
              <option value="">Semua Materi</option>
              {Subjects.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Soal</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Materi</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {questions.length > 0 ? questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm text-gray-900 line-clamp-2 font-medium">{question.content}</p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                      {question.grade.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{question.subject}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${
                      question.difficulty === "EASY" ? "bg-green-50 text-green-700 border-green-100" :
                      question.difficulty === "MEDIUM" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                      "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(question)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(question)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-10 w-10 text-gray-300" />
                      <p className="font-medium text-gray-700">Tidak ada soal ditemukan</p>
                      <p className="text-sm">Coba ubah filter atau pencarian</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Sebelumnya
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Selanjutnya
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingQuestion ? "Edit Soal" : "Tambah Soal Baru"}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form action={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto">
              {editingQuestion && <input type="hidden" name="id" value={editingQuestion.id} />}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Soal (opsional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
                      <Upload size={16} className="text-gray-400" />
                      {imageFile ? imageFile.name : "Klik untuk upload gambar"}
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 group shrink-0">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <select name="grade" defaultValue={editingQuestion?.grade || GradeLevels[0]} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none bg-white text-sm">
                    {GradeLevels.map(g => <option key={g} value={g}>{g.replace("_", " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                  <input
                    type="text"
                    name="subject"
                    list="subject-list"
                    value={subjectValue}
                    onChange={(e) => setSubjectValue(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white text-sm"
                    placeholder="Pilih atau ketik materi..."
                    required
                  />
                  <datalist id="subject-list">
                    {Subjects.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Kesulitan</label>
                  <select name="difficulty" defaultValue={editingQuestion?.difficulty || Difficulties[0]} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none bg-white text-sm">
                    {Difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mb-1">
                <button type="button" onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors">
                  {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPreview ? "Sembunyikan Preview" : "Tampilkan Preview"}
                </button>
              </div>

              <RichTextArea
                label="Pertanyaan"
                name="content"
                value={contentValue}
                onChange={setContentValue}
                placeholder="Tulis pertanyaan di sini... (Markdown & LaTeX didukung)"
                required
                showPreview={showPreview}
              />

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
                  <CheckCircle size={15} className="text-green-500" />
                  Pilihan Jawaban
                  <span className="text-xs font-normal text-gray-500 ml-1">(pilih jawaban yang benar)</span>
                </label>
                <div className="space-y-3 mt-3">
                  {formOptions.map((opt, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-xl bg-white">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="correctOption"
                          value={index}
                          checked={correctOption === index}
                          onChange={() => setCorrectOption(index)}
                          className="mt-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="rounded-lg overflow-hidden border border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
                            <RichToolbar
                              textareaRef={null as unknown as React.RefObject<HTMLTextAreaElement>}
                              onInsert={(v) => handleOptionChange(index, v)}
                              onImageUpload={() => {
                                const el = document.getElementById(`opt-img-${index}`) as HTMLInputElement
                                el?.click()
                              }}
                            />
                            <textarea
                              value={opt.content}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                              rows={2}
                              className="w-full px-3 py-2 border-0 focus:outline-none resize-y text-sm font-mono bg-white"
                            />
                          </div>
                          <input
                            id={`opt-img-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageChange(index, e)}
                            className="hidden"
                          />
                          {opt.image && (
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200 group mt-2">
                              <img src={opt.image} alt={`Option ${index + 1}`} className="h-full w-full object-cover" />
                              <button type="button" onClick={() => removeOptionImage(index)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={14} className="text-white" />
                              </button>
                            </div>
                          )}
                          {showPreview && opt.content && <MarkdownPreview content={opt.content} />}
                        </div>
                        <button type="button" onClick={() => removeOption(index)} disabled={formOptions.length <= 2} className="text-gray-300 hover:text-red-500 transition-colors p-1 mt-2 disabled:cursor-not-allowed shrink-0">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {formOptions.length < 5 && (
                  <button type="button" onClick={addOption} className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                    <Plus size={15} /> Tambah Pilihan
                  </button>
                )}
              </div>

              <RichTextArea
                label="Pembahasan / Solusi (opsional)"
                name="solution"
                value={solutionValue}
                onChange={setSolutionValue}
                placeholder="Jelaskan mengapa jawaban tersebut benar... (Markdown & LaTeX didukung)"
                showPreview={showPreview}
              />

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={handleClose} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isSubmitting}
                  className="px-5 py-2.5 bg-red-800 text-white rounded-lg hover:bg-red-900 font-medium flex items-center gap-2 transition-colors shadow-md disabled:opacity-60 text-sm"
                >
                  {(isUploading || isSubmitting) ? (
                    <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save size={16} /> Simpan Soal</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Soal?</h3>
              <p className="text-gray-500 mb-6 text-sm">Soal ini akan dihapus permanen dan tidak dapat dikembalikan.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm">
                  Batal
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors text-sm">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
