'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_CREDENTIALS = {
  username: '544231086',
  password: '544231086',
}

const SESSION_COOKIE_NAME = 'admin_session'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    cookies().set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })
    redirect('/admin')
  } else {
    return { error: 'Invalid credentials' }
  }
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME)
  redirect('/admin/login')
}
