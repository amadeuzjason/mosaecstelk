'use client'

import { useState, useEffect } from 'react'
import { createEvent, deleteEvent, updateEvent } from './actions'
import { useFormState } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Search, Calendar, MapPin, Users as UsersIcon, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

type Event = {
  id: string
  title: string
  date: string
  description: string
  image: string
  details: string | null
  location: string | null
  participants: string | null
}

const initialState: { message?: string; error?: string } = {
  message: '',
  error: '',
}

export default function EventManager({ 
  events, 
  totalPages = 1, 
  currentPage = 1 
}: { 
  events: Event[],
  totalPages: number,
  currentPage: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  
  const [createState, createAction] = useFormState(createEvent, initialState)
  const [updateState, updateAction] = useFormState(updateEvent, initialState)
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
      setEditingEvent(null)
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

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      const formData = new FormData()
      formData.append('id', eventToDelete.id)
      const result = await deleteEvent(formData)
      if (result?.message) showToast(result.message, 'success')
      if (result?.error) showToast(result.error, 'error')
      
      setIsDeleteModalOpen(false)
      setEventToDelete(null)
    }
  }

  const handleClose = () => {
    setEditingEvent(null)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
          <p className="text-gray-500 text-sm mt-1">Organize and schedule your upcoming events</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-800 text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-colors shadow-md shadow-red-800/20 font-medium"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events by title or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-700"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams?.get('q')?.toString()}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 relative">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:text-red-900 shadow-sm transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(event)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:text-red-900 shadow-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-red-600 font-medium mb-2">
                  <Calendar size={14} className="mr-1" />
                  {(() => {
                    const date = new Date(event.date);
                    return isNaN(date.getTime()) 
                      ? <span className="text-red-500">Invalid Date</span>
                      : date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
                  })()}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                  {event.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      {event.location}
                    </div>
                  )}
                  {event.participants && (
                    <div className="flex items-center text-xs text-gray-500">
                      <UsersIcon size={14} className="mr-2 text-gray-400" />
                      {event.participants}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">No events found</p>
              <p className="text-sm text-gray-500">Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>
        
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form action={editingEvent ? updateAction : createAction} className="p-6 space-y-4">
              {editingEvent && <input type="hidden" name="id" value={editingEvent.id} />}
              {editingEvent && editingEvent.image && (
                <input type="hidden" name="currentImage" value={editingEvent.image} />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Event Title</label>
                  <input
                    name="title"
                    defaultValue={editingEvent?.title}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                    required
                    placeholder="e.g. Annual Meeting"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={(() => {
                      if (!editingEvent?.date) return '';
                      const date = new Date(editingEvent.date);
                      return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
                    })()}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description (Short)</label>
                <textarea
                  name="description"
                  defaultValue={editingEvent?.description}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 h-20 resize-none"
                  required
                  placeholder="Brief summary of the event"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Details (Full Content)</label>
                <textarea
                  name="details"
                  defaultValue={editingEvent?.details || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 h-32"
                  placeholder="Detailed information about the event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      name="location"
                      defaultValue={editingEvent?.location || ''}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                      placeholder="e.g. Conference Room A"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Participants</label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      name="participants"
                      defaultValue={editingEvent?.participants || ''}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800"
                      placeholder="e.g. All Members"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Event Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                <p className="text-xs text-gray-500">Leave empty to keep existing image (if editing)</p>
              </div>

              {(createState?.error || updateState?.error) && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {createState?.error || updateState?.error}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
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
                  Save Event
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
               <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event?</h3>
               <p className="text-gray-500 mb-6">
                 Are you sure you want to delete <span className="font-semibold text-gray-800">{eventToDelete?.title}</span>? This action cannot be undone.
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
