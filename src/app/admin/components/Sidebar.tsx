'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { logout } from '../actions'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/angkatan', label: 'Angkatan & Member', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/latihan', label: 'Latihan Soal', icon: BookOpen },
]

function LogoBlock() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-red-700 shadow-lg shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/mosaec.jpg" alt="MOSAEC" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-wide leading-tight">Admin Panel</h1>
        <p className="text-xs text-slate-500">MOSAEC STELK</p>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact: boolean = false) => {
    if (!pathname) return false
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              active
                ? 'bg-red-800 text-white shadow-lg shadow-red-900/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon
              size={20}
              className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'}
            />
            <span className="font-medium">{item.label}</span>
            {active && <ChevronRight size={16} className="ml-auto text-red-300" />}
          </Link>
        )
      })}
    </nav>
  )

  const LogoutBtn = ({ onSubmit }: { onSubmit?: () => void }) => (
    <div className="p-4 border-t border-slate-800">
      <form
        action={logout}
        onSubmit={(e) => {
          if (!confirm('Apakah Anda yakin untuk logout?')) e.preventDefault()
          onSubmit?.()
        }}
      >
        <button className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 border border-red-600/20 hover:border-red-600">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col min-h-screen shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <LogoBlock />
        </div>
        <NavLinks />
        <LogoutBtn />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-red-700 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo/mosaec.jpg" alt="MOSAEC" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <LogoBlock />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 ml-2"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks onClose={() => setMobileOpen(false)} />
            <LogoutBtn onSubmit={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
