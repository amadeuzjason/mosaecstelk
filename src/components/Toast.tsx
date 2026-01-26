
'use client'

import React from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all animate-in slide-in-from-right ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
