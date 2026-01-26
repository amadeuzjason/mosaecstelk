import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // If trying to access admin pages (excluding login)
  if (request.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If trying to access login page while authenticated
  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
