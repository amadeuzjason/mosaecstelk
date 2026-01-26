import Sidebar from '../components/Sidebar'
import { ToastProvider } from '@/context/ToastContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="bg-white shadow-sm z-10 p-4 md:hidden flex justify-between items-center border-b border-gray-200">
             <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
             {/* Mobile menu toggle could go here */}
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
