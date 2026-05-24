'use client'

import { useState, useTransition } from 'react'
import {
  Plus, Edit, Trash2, X, Save, ChevronDown, ChevronUp,
  Users, CalendarRange, AlertTriangle, Loader2, Image as ImageIcon
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import {
  createPeriod, updatePeriod, deletePeriod,
  createMember, updateMember, deleteMember,
} from './actions'

type Member = {
  id: string
  name: string
  ig: string
  image: string | null
  position: string
  periodId: number
}

type Period = {
  id: number
  period: number
  year: number
  image: string | null
  members: Member[]
  _count: { members: number }
}

type ModalState =
  | { type: 'none' }
  | { type: 'addPeriod' }
  | { type: 'editPeriod'; period: Period }
  | { type: 'deletePeriod'; period: Period }
  | { type: 'addMember'; periodId: number; periodYear: number }
  | { type: 'editMember'; member: Member; periodYear: number }
  | { type: 'deleteMember'; member: Member }

export default function AngkatanManager({ periods: initialPeriods }: { periods: Period[] }) {
  const [periods, setPeriods] = useState<Period[]>(initialPeriods)
  const [expandedPeriods, setExpandedPeriods] = useState<Set<number>>(new Set())
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  // Image preview states
  const [periodImagePreview, setPeriodImagePreview] = useState<string | null>(null)
  const [memberImagePreview, setMemberImagePreview] = useState<string | null>(null)

  const toggleExpand = (periodId: number) => {
    setExpandedPeriods(prev => {
      const next = new Set(prev)
      if (next.has(periodId)) next.delete(periodId)
      else next.add(periodId)
      return next
    })
  }

  const openModal = (state: ModalState) => {
    setPeriodImagePreview(null)
    setMemberImagePreview(null)
    setModal(state)
  }

  const closeModal = () => setModal({ type: 'none' })

  // ── Period CRUD ──────────────────────────────────────────────────────────────

  const handlePeriodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let result: { message?: string; error?: string } | undefined

      if (modal.type === 'editPeriod') {
        formData.set('id', modal.period.id.toString())
        formData.set('currentImage', modal.period.image || '')
        result = await updatePeriod(undefined, formData)
      } else {
        result = await createPeriod(undefined, formData)
      }

      if (result?.message) {
        showToast(result.message, 'success')
        closeModal()
        // Refresh data
        window.location.reload()
      } else if (result?.error) {
        showToast(result.error, 'error')
      }
    })
  }

  const handleDeletePeriod = async () => {
    if (modal.type !== 'deletePeriod') return
    const formData = new FormData()
    formData.set('id', modal.period.id.toString())

    startTransition(async () => {
      const result = await deletePeriod(formData)
      if (result?.message) {
        showToast(result.message, 'success')
        closeModal()
        window.location.reload()
      } else if (result?.error) {
        showToast(result.error, 'error')
      }
    })
  }

  // ── Member CRUD ──────────────────────────────────────────────────────────────

  const handleMemberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let result: { message?: string; error?: string } | undefined

      if (modal.type === 'editMember') {
        formData.set('id', modal.member.id)
        formData.set('currentImage', modal.member.image || '')
        result = await updateMember(undefined, formData)
      } else if (modal.type === 'addMember') {
        formData.set('periodId', modal.periodId.toString())
        result = await createMember(undefined, formData)
      }

      if (result?.message) {
        showToast(result.message, 'success')
        closeModal()
        window.location.reload()
      } else if (result?.error) {
        showToast(result.error, 'error')
      }
    })
  }

  const handleDeleteMember = async () => {
    if (modal.type !== 'deleteMember') return
    const formData = new FormData()
    formData.set('id', modal.member.id)

    startTransition(async () => {
      const result = await deleteMember(formData)
      if (result?.message) {
        showToast(result.message, 'success')
        closeModal()
        window.location.reload()
      } else if (result?.error) {
        showToast(result.error, 'error')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-7 w-7 text-red-800" />
            Angkatan & Member
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola periode angkatan dan anggota kepengurusan</p>
        </div>
        <button
          onClick={() => openModal({ type: 'addPeriod' })}
          className="flex items-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Tambah Angkatan
        </button>
      </div>

      {/* Periods list */}
      {periods.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
          <CalendarRange className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-700">Belum ada angkatan</p>
          <p className="text-sm mt-1">Klik "Tambah Angkatan" untuk memulai</p>
        </div>
      ) : (
        <div className="space-y-4">
          {periods.map((period) => {
            const isExpanded = expandedPeriods.has(period.id)
            return (
              <div key={period.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Period header row */}
                <div className="flex items-center gap-4 p-4 sm:p-5">
                  {/* Team photo */}
                  <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    {period.image ? (
                      <img src={period.image} alt={`Angkatan ${period.period}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-gray-900">Angkatan {period.period}</span>
                      <span className="text-sm text-gray-500">— {period.year}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full mt-1">
                      <Users size={11} />
                      {period._count.members} anggota
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openModal({ type: 'addMember', periodId: period.id, periodYear: period.year })}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Tambah Member"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => openModal({ type: 'editPeriod', period })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Angkatan"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openModal({ type: 'deletePeriod', period })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Angkatan"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => toggleExpand(period.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-1"
                      title={isExpanded ? 'Sembunyikan' : 'Tampilkan member'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Members table */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {period.members.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        Belum ada anggota. Klik <span className="text-green-600 font-medium">+</span> untuk menambahkan.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Nama</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Jabatan</th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Instagram</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {period.members.map((member) => (
                              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    {member.image ? (
                                      <img src={member.image} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-xs shrink-0">
                                        {member.name.charAt(0)}
                                      </div>
                                    )}
                                    <span className="font-medium text-gray-900 truncate max-w-[140px]">{member.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{member.position}</td>
                                <td className="px-4 py-3 text-red-600 hidden sm:table-cell">@{member.ig}</td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end gap-1">
                                    <button
                                      onClick={() => openModal({ type: 'editMember', member, periodYear: period.year })}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={15} />
                                    </button>
                                    <button
                                      onClick={() => openModal({ type: 'deleteMember', member })}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Period Modal ─────────────────────────────────────────────────────── */}
      {(modal.type === 'addPeriod' || modal.type === 'editPeriod') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {modal.type === 'editPeriod' ? 'Edit Angkatan' : 'Tambah Angkatan'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePeriodSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nomor Angkatan</label>
                <input
                  name="period"
                  type="number"
                  defaultValue={modal.type === 'editPeriod' ? modal.period.period : ''}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="mis. 32"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tahun</label>
                <input
                  name="year"
                  type="number"
                  defaultValue={modal.type === 'editPeriod' ? modal.period.year : new Date().getFullYear()}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="mis. 2025"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Foto Tim</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setPeriodImagePreview(URL.createObjectURL(f))
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all"
                />
                {(periodImagePreview || (modal.type === 'editPeriod' && (modal as { type: 'editPeriod'; period: Period }).period.image)) && (
                  <img
                    src={periodImagePreview || (modal as { type: 'editPeriod'; period: Period }).period.image!}
                    alt="Preview"
                    className="mt-2 w-full h-28 object-cover rounded-lg border border-gray-200"
                  />
                )}
                {modal.type === 'editPeriod' && (modal as { type: 'editPeriod'; period: Period }).period.image && !periodImagePreview && (
                  <p className="text-xs text-gray-400">Biarkan kosong untuk mempertahankan foto saat ini</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2 font-medium shadow-md disabled:opacity-60"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Member Modal ─────────────────────────────────────────────────────── */}
      {(modal.type === 'addMember' || modal.type === 'editMember') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">
                {modal.type === 'editMember' ? 'Edit Member' : `Tambah Member — Angkatan ${modal.periodYear}`}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  name="name"
                  defaultValue={modal.type === 'editMember' ? modal.member.name : ''}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="mis. Budi Santoso"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Instagram</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input
                      name="ig"
                      defaultValue={modal.type === 'editMember' ? modal.member.ig : ''}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                      required
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Jabatan</label>
                  <input
                    name="position"
                    defaultValue={modal.type === 'editMember' ? modal.member.position : ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                    required
                    placeholder="mis. Ketua"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Foto Profil</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setMemberImagePreview(URL.createObjectURL(f))
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all"
                />
                {(memberImagePreview || (modal.type === 'editMember' && (modal as { type: 'editMember'; member: Member; periodYear: number }).member.image)) && (
                  <img
                    src={memberImagePreview || (modal as { type: 'editMember'; member: Member; periodYear: number }).member.image!}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                )}
                {modal.type === 'editMember' && (modal as { type: 'editMember'; member: Member; periodYear: number }).member.image && !memberImagePreview && (
                  <p className="text-xs text-gray-400">Biarkan kosong untuk mempertahankan foto saat ini</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2 font-medium shadow-md disabled:opacity-60"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Period Modal ───────────────────────────────────────────────── */}
      {modal.type === 'deletePeriod' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Angkatan?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Angkatan <span className="font-semibold text-gray-800">{modal.period.period}</span> dan semua anggotanya akan dihapus permanen.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={closeModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleDeletePeriod}
                  disabled={isPending}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isPending ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Member Modal ───────────────────────────────────────────────── */}
      {modal.type === 'deleteMember' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Member?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                <span className="font-semibold text-gray-800">{modal.member.name}</span> akan dihapus permanen.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={closeModal} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleDeleteMember}
                  disabled={isPending}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isPending ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
