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
          {/* Spacer for mobile top bar */}
          <div className="h-14 md:hidden shrink-0" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
