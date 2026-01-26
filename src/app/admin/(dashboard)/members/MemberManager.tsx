'use client'

import { useState, useEffect } from 'react'
import { createMember, deleteMember, updateMember } from './actions'
import { useFormState } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Search, Filter, Edit, Trash2, X, Save } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

type Member = {
  id: string
  name: string
  ig: string
  image: string | null
  position: string
  periodId: number
  period: {
    year: number
  }
}

type Period = {
  id: number
  year: number
}

const initialState: { message?: string; error?: string } = {
  message: '',
  error: '',
}

export default function MemberManager({ 
  members, 
  periods, 
  totalPages = 1, 
  currentPage = 1 
}: { 
  members: Member[], 
  periods: Period[],
  totalPages: number,
  currentPage: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  
  const [createState, createAction] = useFormState(createMember, initialState)
  const [updateState, updateAction] = useFormState(updateMember, initialState)
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
      setEditingMember(null)
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

  const handleFilter = (periodId: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', '1')
    if (periodId) {
      params.set('period', periodId)
    } else {
      params.delete('period')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (memberToDelete) {
      const formData = new FormData()
      formData.append('id', memberToDelete.id)
      const result = await deleteMember(formData)
      if (result?.message) showToast(result.message, 'success')
      if (result?.error) showToast(result.error, 'error')

      setIsDeleteModalOpen(false)
      setMemberToDelete(null)
    }
  }

  const handleClose = () => {
    setEditingMember(null)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Members Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team members and their roles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-800 text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-md shadow-red-800/20 font-medium"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-700"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams?.get('q')?.toString()}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-700 appearance-none bg-white"
            onChange={(e) => handleFilter(e.target.value)}
            defaultValue={searchParams?.get('period')?.toString()}
          >
            <option value="">All Periods</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Instagram</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold mr-3">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {member.period.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 hover:underline cursor-pointer">
                      @{member.ig}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-red-600 hover:text-red-900 mr-4 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(member)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
                      <p className="text-lg font-medium text-gray-900">No members found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form action={editingMember ? updateAction : createAction} className="p-6 space-y-4">
              {editingMember && <input type="hidden" name="id" value={editingMember.id} />}
              {editingMember && <input type="hidden" name="currentImage" value={editingMember.image || ''} />}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  defaultValue={editingMember?.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Instagram Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input
                      name="ig"
                      defaultValue={editingMember?.ig}
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                      required
                      placeholder="username"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <input
                    name="position"
                    defaultValue={editingMember?.position}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                    required
                    placeholder="e.g. Chairman"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Period</label>
                <div className="relative">
                   <select
                    name="periodId"
                    defaultValue={editingMember?.periodId}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 appearance-none bg-white"
                    required
                  >
                    <option value="">Select Period</option>
                    {periods.map((period) => (
                      <option key={period.id} value={period.id}>
                        {period.year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Profile Photo</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {editingMember?.image && (
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
                  Save Member
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
               <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Member?</h3>
               <p className="text-gray-500 mb-6">
                 Are you sure you want to delete <span className="font-semibold text-gray-800">{memberToDelete?.name}</span>? This action cannot be undone.
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
