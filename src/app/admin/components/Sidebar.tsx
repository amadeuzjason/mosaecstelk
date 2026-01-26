'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Calendar, 
  BookOpen, 
  LogOut 
} from 'lucide-react'
import { logout } from '../actions'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/periods', label: 'Periods', icon: CalendarRange },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/latihan', label: 'Latihan Soal', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean = false) => {
    if (!pathname) return false
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive(item.href, item.exact)
                ? 'bg-red-800 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={`${isActive(item.href, item.exact) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <form action={logout} onSubmit={(e) => {
          if (!confirm('Apakah Anda yakin untuk logout?')) {
            e.preventDefault();
          }
        }}>
          <button className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 border border-red-600/20 hover:border-red-600">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
