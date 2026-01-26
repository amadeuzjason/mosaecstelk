'use client'

import { useFormState } from 'react-dom'
import { login } from '../actions'
import { Lock } from 'lucide-react'

const initialState: { error: string } = {
  error: '',
}

export default function AdminLogin() {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red-200/20 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl z-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-800/30">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
          <p className="text-slate-500 mt-1">Please enter your credentials to continue</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-800"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-800"
              placeholder="Enter your password"
            />
          </div>
          
          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium animate-pulse">
              {state.error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-red-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-red-800/20"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Mosaec. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
