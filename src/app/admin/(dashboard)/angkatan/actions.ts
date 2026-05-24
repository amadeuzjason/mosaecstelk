'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

// ── Period Actions ────────────────────────────────────────────────────────────

export async function createPeriod(prevState: any, formData: FormData) {
  try {
    const period = parseInt(formData.get('period') as string)
    const year = parseInt(formData.get('year') as string)

    const existing = await prisma.period.findUnique({ where: { period } })
    if (existing) return { error: 'Nomor angkatan sudah ada' }

    const imageFile = formData.get('image') as File
    let imagePath = ''

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const { error } = await supabase.storage.from('period_img').upload(filename, buffer, { contentType: imageFile.type, upsert: false })
      if (error) throw new Error('Failed to upload image')
      const { data: { publicUrl } } = supabase.storage.from('period_img').getPublicUrl(filename)
      imagePath = publicUrl
    }

    await prisma.period.create({ data: { period, year, image: imagePath } })
    revalidatePath('/admin/angkatan')
    return { message: 'Angkatan berhasil ditambahkan' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal menambahkan angkatan' }
  }
}

export async function updatePeriod(prevState: any, formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    const period = parseInt(formData.get('period') as string)
    const year = parseInt(formData.get('year') as string)

    const imageFile = formData.get('image') as File
    let imagePath = formData.get('currentImage') as string

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const { error } = await supabase.storage.from('period_img').upload(filename, buffer, { contentType: imageFile.type, upsert: false })
      if (error) throw new Error('Failed to upload image')
      const { data: { publicUrl } } = supabase.storage.from('period_img').getPublicUrl(filename)
      imagePath = publicUrl
    }

    await prisma.period.update({ where: { id }, data: { period, year, image: imagePath } })
    revalidatePath('/admin/angkatan')
    return { message: 'Angkatan berhasil diperbarui' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal memperbarui angkatan' }
  }
}

export async function deletePeriod(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  try {
    const period = await prisma.period.findUnique({ where: { id } })
    if (period?.image && period.image.includes('supabase.co')) {
      const filename = period.image.split('/').pop()
      if (filename) await supabase.storage.from('period_img').remove([filename])
    }
    await prisma.period.delete({ where: { id } })
    revalidatePath('/admin/angkatan')
    return { message: 'Angkatan berhasil dihapus' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal menghapus angkatan' }
  }
}

// ── Member Actions ────────────────────────────────────────────────────────────

export async function createMember(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const ig = formData.get('ig') as string
    const position = formData.get('position') as string
    const periodId = parseInt(formData.get('periodId') as string)

    const imageFile = formData.get('image') as File
    let imagePath = ''

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const { error } = await supabase.storage.from('members_img').upload(filename, buffer, { contentType: imageFile.type, upsert: false })
      if (error) throw new Error('Failed to upload image')
      const { data: { publicUrl } } = supabase.storage.from('members_img').getPublicUrl(filename)
      imagePath = publicUrl
    }

    await prisma.member.create({ data: { name, ig, position, periodId, image: imagePath } })
    revalidatePath('/admin/angkatan')
    return { message: 'Member berhasil ditambahkan' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal menambahkan member' }
  }
}

export async function updateMember(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const ig = formData.get('ig') as string
    const position = formData.get('position') as string
    const periodId = parseInt(formData.get('periodId') as string)

    const imageFile = formData.get('image') as File
    let imagePath = formData.get('currentImage') as string

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const { error } = await supabase.storage.from('members_img').upload(filename, buffer, { contentType: imageFile.type, upsert: false })
      if (error) throw new Error('Failed to upload image')
      const { data: { publicUrl } } = supabase.storage.from('members_img').getPublicUrl(filename)
      imagePath = publicUrl
    }

    await prisma.member.update({ where: { id }, data: { name, ig, position, periodId, image: imagePath } })
    revalidatePath('/admin/angkatan')
    return { message: 'Member berhasil diperbarui' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal memperbarui member' }
  }
}

export async function deleteMember(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const member = await prisma.member.findUnique({ where: { id } })
    if (member?.image && member.image.includes('supabase.co')) {
      const filename = member.image.split('/').pop()
      if (filename) await supabase.storage.from('members_img').remove([filename])
    }
    await prisma.member.delete({ where: { id } })
    revalidatePath('/admin/angkatan')
    return { message: 'Member berhasil dihapus' }
  } catch (e) {
    console.error(e)
    return { error: 'Gagal menghapus member' }
  }
}
