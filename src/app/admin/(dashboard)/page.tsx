import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Users, CalendarRange, Calendar, BookOpen, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const [memberCount, eventCount, questionCount, periodCount] = await Promise.all([
    prisma.member.count(),
    prisma.event.count(),
    prisma.question.count(),
    prisma.period.count(),
  ])

  const stats = [
    {
      title: 'Members',
      count: memberCount,
      href: '/admin/members',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Periods',
      count: periodCount,
      href: '/admin/periods',
      icon: CalendarRange,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Events',
      count: eventCount,
      href: '/admin/events',
      icon: Calendar,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Latihan Soal',
      count: questionCount,
      href: '/admin/latihan',
      icon: BookOpen,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block group">
            <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${stat.borderColor} h-full relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <stat.icon size={64} className={stat.textColor} />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                  <stat.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
              </div>
              
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                <div className={`flex items-center text-sm font-medium ${stat.textColor} opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-200`}>
                  Manage <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/members?action=new" className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 text-center">
                <span className="block font-medium text-gray-700">Add Member</span>
             </Link>
             <Link href="/admin/events?action=new" className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 text-center">
                <span className="block font-medium text-gray-700">Add Event</span>
             </Link>
             <Link href="/admin/periods?action=new" className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 text-center">
                <span className="block font-medium text-gray-700">Add Period</span>
             </Link>
             <Link href="/admin/latihan?action=new" className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 text-center">
                <span className="block font-medium text-gray-700">Add Question</span>
             </Link>
          </div>
        </div>

        <div className="bg-linear-to-br from-red-800 to-red-900 p-6 rounded-xl shadow-md text-white">
          <h3 className="text-xl font-semibold mb-2">Welcome to Mosaec Admin</h3>
          <p className="text-red-100 mb-6">
            Manage your organization's data efficiently. Use the sidebar to navigate between different modules.
          </p>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-medium">System Status: <span className="text-green-300">Active</span></p>
            <p className="text-xs text-red-200 mt-1">Last login: Just now</p>
          </div>
        </div>
      </div>
    </div>
  )
}
