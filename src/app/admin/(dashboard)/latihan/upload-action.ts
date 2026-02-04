'use server'

import { supabase } from '@/lib/supabase'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('latihan_img')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
        console.error('Supabase upload error details:', JSON.stringify(error, null, 2));
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('latihan_img')
      .getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { error: error.message || 'Failed to upload image' }
  }
}
