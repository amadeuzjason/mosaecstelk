'use client'

import { useState, useRef, useCallback } from 'react'
import {
  FileText, Upload, X, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, Loader2, Plus, FileUp
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { SUBJECTS, GRADE_LEVELS } from '@/lib/constants'
import { createQuestion } from './actions'

type ParsedOption = { label: string; content: string; isCorrect: boolean }
type ParsedQuestion = {
  content: string
  options: ParsedOption[]
  solution: string
  selected: boolean
  importing: boolean
  imported: boolean
  error: string | null
}

// ── Math symbol normalization ─────────────────────────────────────────────────
function normalizeMathSymbols(text: string): string {
  return text
    .replace(/\uFB01/g, 'fi').replace(/\uFB02/g, 'fl').replace(/\uFB00/g, 'ff')
    .replace(/\u00B2/g, '^2').replace(/\u00B3/g, '^3').replace(/\u00B9/g, '^1')
    .replace(/\u00BD/g, '1/2').replace(/\u00BC/g, '1/4').replace(/\u00BE/g, '3/4')
    .replace(/\u00D7/g, '\\times').replace(/\u00F7/g, '\\div').replace(/\u00B1/g, '\\pm')
    .replace(/\u2264/g, '\\leq').replace(/\u2265/g, '\\geq').replace(/\u2260/g, '\\neq')
    .replace(/\u2248/g, '\\approx').replace(/\u221E/g, '\\infty')
    .replace(/\u221A/g, '\\sqrt').replace(/\u2211/g, '\\sum').replace(/\u222B/g, '\\int')
    .replace(/\u2202/g, '\\partial').replace(/\u03B1/g, '\\alpha').replace(/\u03B2/g, '\\beta')
    .replace(/\u03B3/g, '\\gamma').replace(/\u03B4/g, '\\delta').replace(/\u03B8/g, '\\theta')
    .replace(/\u03BB/g, '\\lambda').replace(/\u03C3/g, '\\sigma').replace(/\u03BC/g, '\\mu')
    .replace(/\u03C0/g, '\\pi').replace(/\u03C6/g, '\\phi').replace(/\u03C9/g, '\\omega')
    .trim()
}

// ── Fast PDF text extraction ──────────────────────────────────────────────────
async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise

  const pagePromises = Array.from({ length: pdf.numPages }, async (_, i) => {
    const page = await pdf.getPage(i + 1)
    const textContent = await page.getTextContent({ includeMarkedContent: false } as any)
    const items = textContent.items as any[]

    // Group items by y-position (same line = same y within tolerance)
    // Sort by y descending (PDF y=0 is bottom), then x ascending within each line
    const sorted = items
      .filter((it: any) => 'str' in it && it.str.trim())
      .map((it: any) => ({
        str: it.str as string,
        x: (it.transform?.[4] ?? 0) as number,
        y: (it.transform?.[5] ?? 0) as number,
      }))
      .sort((a, b) => b.y - a.y || a.x - b.x)

    const lines: string[] = []
    let curY: number | null = null
    let curLine = ''

    for (const item of sorted) {
      if (curY === null || Math.abs(item.y - curY) > 3) {
        if (curLine.trim()) lines.push(curLine.trim())
        curLine = item.str
        curY = item.y
      } else {
        // Same line — add space if needed
        const needsSpace = curLine.length > 0 && !curLine.endsWith(' ') && !item.str.startsWith(' ')
        curLine += (needsSpace ? ' ' : '') + item.str
      }
    }
    if (curLine.trim()) lines.push(curLine.trim())

    return lines.join('\n')
  })

  const results = await Promise.all(pagePromises)
  return normalizeMathSymbols(results.join('\n'))
}

// ── Question parser ───────────────────────────────────────────────────────────
function parseQuestions(rawText: string): ParsedQuestion[] {
  // Normalize whitespace but preserve newlines
  const text = rawText.replace(/[ \t]+/g, ' ').replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const questions: ParsedQuestion[] = []

  // Split by question number at start of line: "1.", "1)", "Soal 1.", "No. 1", "No 1."
  const qSplitRe = /(?:^|\n)[ \t]*(?:(?:soal|no\.?|pertanyaan|question)[ \t]+)?(\d{1,3})[.):][ \t]+/gim
  const splits = [...text.matchAll(qSplitRe)]

  if (splits.length === 0) {
    const q = parseBlock(text)
    if (q) questions.push(q)
    return questions
  }

  for (let i = 0; i < splits.length; i++) {
    const start = splits[i].index! + splits[i][0].length
    const end = i + 1 < splits.length ? splits[i + 1].index! : text.length
    const block = text.slice(start, end).trim()
    const q = parseBlock(block)
    if (q) questions.push(q)
  }

  return questions
}

function parseBlock(block: string): ParsedQuestion | null {
  if (!block || block.length < 8) return null

  // ── Option detection ──────────────────────────────────────────────────────
  // Strategy: find ALL occurrences of option labels (A-E) in the block.
  // An option marker is: A. A) A: a. a) a:
  // It can appear:
  //   - At start of a line:  \n A.
  //   - After whitespace:    "  A."  (inline, same line as previous option)
  //   - After newline+space: "\n  A."
  //
  // We use a single regex that matches both cases.
  // The key insight: option labels must appear in order A→B→C→D→E
  // so we validate the sequence after matching.

  // Match: (start-of-line or whitespace) + (A-E) + (. or ) or :) + (space or tab)
  const optRe = /(?:(?:^|\n)[ \t]*|[ \t]{2,})([A-Ea-e])[.):][ \t]+/g
  const allMatches = [...block.matchAll(optRe)]

  // Filter to only keep matches that form a valid ascending sequence A,B,C,D,E
  // (allowing gaps, e.g. A,B,C,D or A,B,C,D,E)
  const LABELS = ['A','B','C','D','E']
  const validMatches: RegExpMatchArray[] = []
  let expectedIdx = 0

  for (const m of allMatches) {
    const label = m[1].toUpperCase()
    const labelIdx = LABELS.indexOf(label)
    if (labelIdx >= expectedIdx) {
      validMatches.push(m)
      expectedIdx = labelIdx + 1
    }
  }

  let questionContent = block
  const options: ParsedOption[] = []

  if (validMatches.length >= 2) {
    questionContent = block.slice(0, validMatches[0].index!).trim()

    for (let i = 0; i < validMatches.length; i++) {
      const label = validMatches[i][1].toUpperCase()
      const contentStart = validMatches[i].index! + validMatches[i][0].length
      const contentEnd = i + 1 < validMatches.length ? validMatches[i + 1].index! : block.length
      const content = block
        .slice(contentStart, contentEnd)
        .replace(/(?:jawaban|kunci|answer)[:\s]+[A-Ea-e]/gi, '')
        .trim()
      options.push({ label, content, isCorrect: false })
    }
  }

  // Detect answer key
  const answerRe = /(?:jawaban|kunci jawaban|kunci|answer key|answer)[:\s]+([A-Ea-e])/i
  const answerMatch = block.match(answerRe)
  if (answerMatch) {
    const correct = answerMatch[1].toUpperCase()
    options.forEach(o => { o.isCorrect = o.label === correct })
    questionContent = questionContent.replace(answerRe, '').trim()
  } else if (options.length > 0) {
    options[0].isCorrect = true
  }

  // Extract solution/pembahasan
  let solution = ''
  const solRe = /(?:pembahasan|solusi|solution|penyelesaian|jawab)[:\s]+([\s\S]+?)(?=(?:^|\n)[ \t]*\d+[.):]|$)/im
  const solMatch = block.match(solRe)
  if (solMatch) {
    solution = solMatch[1].trim()
    questionContent = questionContent.replace(solMatch[0], '').trim()
  }

  questionContent = questionContent
    .replace(/(?:jawaban|kunci jawaban|kunci|answer)[:\s]+[A-Ea-e]/gi, '')
    .trim()

  if (!questionContent || questionContent.length < 4) return null

  const defaultOptions: ParsedOption[] = [
    { label: 'A', content: '', isCorrect: true },
    { label: 'B', content: '', isCorrect: false },
    { label: 'C', content: '', isCorrect: false },
    { label: 'D', content: '', isCorrect: false },
  ]

  return {
    content: questionContent,
    options: options.length >= 2 ? options : defaultOptions,
    solution,
    selected: true,
    importing: false,
    imported: false,
    error: null,
  }
}

// ── Component (slate-800 color scheme, matching sidebar) ─────────────────────
interface PdfImporterProps {
  isOpen: boolean
  onClose: () => void
  onImportDone?: () => void
}

export default function PdfImporter({ isOpen, onClose, onImportDone }: PdfImporterProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [grade, setGrade] = useState(GRADE_LEVELS[0])
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM')
  const [importingAll, setImportingAll] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Hanya file PDF yang didukung', 'error')
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      showToast('File terlalu besar (maks 30MB)', 'error')
      return
    }
    setIsProcessing(true)
    setParsedQuestions([])
    setExpandedIdx(null)
    try {
      setProcessingStep('Membaca file PDF...')
      const rawText = await extractTextFromPdf(file)
      setProcessingStep('Menganalisis soal...')
      await new Promise(r => setTimeout(r, 30))
      const questions = parseQuestions(rawText)
      if (questions.length === 0) {
        showToast('Tidak ada soal ditemukan. Pastikan PDF memiliki nomor soal dan pilihan A/B/C/D.', 'error')
      } else {
        setParsedQuestions(questions)
        showToast(`Berhasil mengekstrak ${questions.length} soal`, 'success')
      }
    } catch (err: any) {
      showToast('Gagal memproses PDF: ' + (err?.message || 'Unknown error'), 'error')
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }, [showToast])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const updateQuestion = (idx: number, updates: Partial<ParsedQuestion>) =>
    setParsedQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...updates } : q))

  const updateOption = (qIdx: number, oIdx: number, content: string) =>
    setParsedQuestions(prev => prev.map((q, i) => i !== qIdx ? q : {
      ...q, options: q.options.map((o, j) => j === oIdx ? { ...o, content } : o)
    }))

  const setCorrectOption = (qIdx: number, oIdx: number) =>
    setParsedQuestions(prev => prev.map((q, i) => i !== qIdx ? q : {
      ...q, options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIdx }))
    }))

  const importQuestion = async (idx: number) => {
    const q = parsedQuestions[idx]
    if (!q.selected || q.imported) return
    updateQuestion(idx, { importing: true, error: null })
    try {
      const fd = new FormData()
      fd.set('content', q.content)
      fd.set('grade', grade)
      fd.set('subject', subject)
      fd.set('difficulty', difficulty)
      fd.set('solution', q.solution || '')
      fd.set('correctOption', q.options.findIndex(o => o.isCorrect).toString())
      q.options.forEach((opt, i) => fd.set(`option_content_${i}`, opt.content))
      const result = await createQuestion(undefined, fd)
      if (result?.error) throw new Error(result.error)
      updateQuestion(idx, { importing: false, imported: true })
    } catch (err) {
      updateQuestion(idx, { importing: false, error: err instanceof Error ? err.message : 'Gagal mengimpor' })
    }
  }

  const importSelected = async () => {
    setImportingAll(true)
    const idxs = parsedQuestions.map((q, i) => q.selected && !q.imported ? i : -1).filter(i => i >= 0)
    for (const idx of idxs) await importQuestion(idx)
    setImportingAll(false)
    showToast('Selesai mengimpor soal', 'success')
    onImportDone?.()
  }

  const handleClose = () => {
    if (importingAll) return
    setParsedQuestions([])
    setExpandedIdx(null)
    onClose()
  }

  const selectedCount = parsedQuestions.filter(q => q.selected && !q.imported).length
  const importedCount = parsedQuestions.filter(q => q.imported).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header — slate-900 like sidebar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Soal dari PDF</h2>
              <p className="text-xs text-slate-400">Ekstrak soal otomatis — teks & simbol matematika</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={importingAll}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kelas</label>
              <select value={grade} onChange={e => setGrade(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 bg-white">
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Materi</label>
              <input type="text" list="pdf-subject-list" value={subject}
                onChange={e => setSubject(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 bg-white"
                placeholder="Pilih atau ketik materi..." />
              <datalist id="pdf-subject-list">
                {SUBJECTS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kesulitan</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 bg-white">
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isProcessing ? 'cursor-default border-slate-300 bg-slate-50' :
              isDragging ? 'border-slate-600 bg-slate-50 cursor-copy' :
              'border-gray-200 hover:border-slate-500 hover:bg-slate-50/50 cursor-pointer'
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-slate-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">{processingStep}</p>
                <p className="text-xs text-gray-500">Hanya membutuhkan beberapa detik...</p>
              </div>
            ) : parsedQuestions.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <FileUp className="w-8 h-8 text-slate-400" />
                <p className="text-sm font-medium text-gray-600">Upload PDF lain untuk mengganti</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Drag & drop file PDF di sini</p>
                  <p className="text-xs text-gray-500 mt-1">atau klik untuk memilih file (maks 30MB)</p>
                </div>
                <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2.5 text-left space-y-1 w-full max-w-sm">
                  <p className="font-semibold text-gray-500 mb-1">Format yang didukung:</p>
                  <p>• Nomor soal: <code className="bg-gray-100 px-1 rounded">1.</code> <code className="bg-gray-100 px-1 rounded">1)</code> <code className="bg-gray-100 px-1 rounded">Soal 1.</code></p>
                  <p>• Pilihan: <code className="bg-gray-100 px-1 rounded">A.</code> <code className="bg-gray-100 px-1 rounded">A)</code> <code className="bg-gray-100 px-1 rounded">a.</code> (A–E)</p>
                  <p>• Kunci: <code className="bg-gray-100 px-1 rounded">Jawaban: A</code> <code className="bg-gray-100 px-1 rounded">Kunci: B</code></p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="text-slate-800">{parsedQuestions.length}</span> soal ditemukan
                  {importedCount > 0 && <span className="text-green-600 ml-2">· {importedCount} diimpor</span>}
                </p>
                <button type="button"
                  onClick={() => setParsedQuestions(prev => prev.map(q => ({ ...q, selected: !q.imported })))}
                  className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Pilih Semua
                </button>
              </div>

              <div className="space-y-2">
                {parsedQuestions.map((q, idx) => (
                  <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${
                    q.imported ? 'border-green-200 bg-green-50/40' :
                    q.error ? 'border-red-200 bg-red-50/30' :
                    q.selected ? 'border-slate-300 bg-slate-50/40' : 'border-gray-100 bg-gray-50/30'
                  }`}>
                    {/* Row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <input type="checkbox" checked={q.selected && !q.imported} disabled={q.imported}
                        onChange={e => updateQuestion(idx, { selected: e.target.checked })}
                        className="h-4 w-4 text-slate-700 rounded border-gray-300 focus:ring-slate-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          <span className="text-slate-700 font-bold mr-1">#{idx + 1}</span>
                          {q.content.slice(0, 90)}{q.content.length > 90 ? '...' : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {q.options.filter(o => o.content).length} pilihan
                          {q.options.find(o => o.isCorrect)
                            ? ` · Kunci: ${q.options.find(o => o.isCorrect)?.label}` : ''}
                          {q.solution ? ' · Ada pembahasan' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {q.importing && <Loader2 size={15} className="animate-spin text-slate-600" />}
                        {q.imported && <CheckCircle size={15} className="text-green-600" />}
                        {q.error && <span title={q.error}><AlertCircle size={15} className="text-red-600" /></span>}
                        <button type="button"
                          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded">
                          {expandedIdx === idx ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded editor */}
                    {expandedIdx === idx && (
                      <div className="border-t border-gray-100 p-4 space-y-4 bg-white">
                        {/* Question text */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Pertanyaan</label>
                          <textarea value={q.content}
                            onChange={e => updateQuestion(idx, { content: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 resize-y font-mono" />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-2 block">
                            Pilihan Jawaban
                            <span className="font-normal text-gray-400 ml-1">(klik radio = jawaban benar)</span>
                          </label>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                  opt.isCorrect
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}>
                                <input type="radio" name={`correct-${idx}`} checked={opt.isCorrect}
                                  onChange={() => setCorrectOption(idx, oIdx)}
                                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500 shrink-0" />
                                <span className={`text-xs font-bold w-5 shrink-0 ${opt.isCorrect ? 'text-green-700' : 'text-gray-400'}`}>
                                  {opt.label}.
                                </span>
                                <input type="text" value={opt.content}
                                  onChange={e => updateOption(idx, oIdx, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 font-mono bg-white"
                                  placeholder={`Pilihan ${opt.label}`} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Solution */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Pembahasan
                            <span className="font-normal text-gray-400 ml-1">(opsional)</span>
                          </label>
                          <textarea value={q.solution}
                            onChange={e => updateQuestion(idx, { solution: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 resize-y font-mono" />
                        </div>

                        {q.error && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} /> {q.error}
                          </p>
                        )}

                        {!q.imported && (
                          <button type="button" onClick={() => importQuestion(idx)} disabled={q.importing}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                            {q.importing ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            Import Soal Ini
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {parsedQuestions.length > 0
              ? `${selectedCount} soal dipilih · ${importedCount} sudah diimpor`
              : 'Upload PDF untuk mulai mengekstrak soal'}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} disabled={importingAll}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50">
              Tutup
            </button>
            {parsedQuestions.length > 0 && (
              <button type="button" onClick={importSelected}
                disabled={selectedCount === 0 || importingAll}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                {importingAll ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                Import {selectedCount > 0 ? `(${selectedCount})` : 'Semua'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
