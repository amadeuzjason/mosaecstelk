'use client'

import { useState, useEffect } from 'react'
import { createPeriod, deletePeriod, updatePeriod } from './actions'
import { useFormState } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Search, CalendarRange, Edit, Trash2, X, Save, AlertTriangle } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

type Period = {
  id: number
  period: number
  year: number
  image: string | null
  _count?: {
    members: number
  }
}

const initialState: { message?: string; error?: string } = {
  message: '',
  error: '',
}

export default function PeriodManager({ 
  periods,
  totalPages = 1,
  currentPage = 1
}: { 
  periods: Period[],
  totalPages: number,
  currentPage: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null)
  
  const [createState, createAction] = useFormState(createPeriod, initialState)
  const [updateState, updateAction] = useFormState(updatePeriod, initialState)
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
      setEditingPeriod(null)
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const handleEdit = (period: Period) => {
    setEditingPeriod(period)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (period: Period) => {
    setPeriodToDelete(period)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (periodToDelete) {
      const formData = new FormData()
      formData.append('id', periodToDelete.id.toString())
      const result = await deletePeriod(formData)
      if (result?.message) showToast(result.message, 'success')
      if (result?.error) showToast(result.error, 'error')

      setIsDeleteModalOpen(false)
      setPeriodToDelete(null)
    }
  }

  const handleClose = () => {
    setEditingPeriod(null)
    setIsModalOpen(false)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CalendarRange className="h-8 w-8 text-red-800" />
                Periods Management
            </h1>
            <p className="text-gray-500 mt-1">Manage membership periods and years</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Period
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              placeholder="Search by period number..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams?.get('q')?.toString()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 placeholder-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Period</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Year</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Team Photo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Members</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {periods.length > 0 ? (
                periods.map((period) => (
                  <tr key={period.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-800 font-bold text-sm">
                        {period.period}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{period.year}</td>
                    <td className="px-6 py-4">
                      {period.image ? (
                        <img 
                          src={period.image} 
                          alt={`Team Photo Period ${period.period}`} 
                          className="w-16 h-10 object-cover rounded shadow-sm border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs italic">No photo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {period._count?.members || 0} members
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(period)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(period)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">No periods found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-100 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-red-50 border-red-500 text-red-800'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPeriod ? 'Edit Period' : 'Add New Period'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form action={editingPeriod ? updateAction : createAction} className="p-6 space-y-4">
              {editingPeriod && <input type="hidden" name="id" value={editingPeriod.id} />}
              {editingPeriod && <input type="hidden" name="currentImage" value={editingPeriod.image || ''} />}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Period Number</label>
                <input
                  name="period"
                  type="number"
                  defaultValue={editingPeriod?.period}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="e.g. 1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <input
                  name="year"
                  type="number"
                  defaultValue={editingPeriod?.year || new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="e.g. 2024"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Team Photo</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {editingPeriod?.image && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                )}
              </div>

              {(createState?.error || updateState?.error) && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {createState?.error || updateState?.error}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2 font-medium shadow-md shadow-red-800/20"
                >
                  <Save size={18} />
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
             <div className="p-6 text-center">
               <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Period?</h3>
               <p className="text-gray-500 mb-6">
                 Are you sure you want to delete period <span className="font-semibold text-gray-800">{periodToDelete?.period}</span>? This action cannot be undone.
               </p>
               <div className="flex gap-3 justify-center">
                 <button 
                   onClick={() => setIsDeleteModalOpen(false)}
                   className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/30"
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
