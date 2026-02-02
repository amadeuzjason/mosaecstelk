'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabaseAdmin.storage
      .from('latihan_img')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
        console.error('Supabase upload error:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('latihan_img')
      .getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload image' }
  }
}
