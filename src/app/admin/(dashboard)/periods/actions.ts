'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function createPeriod(prevState: any, formData: FormData) {
  try {
    const period = parseInt(formData.get('period') as string)
    const year = parseInt(formData.get('year') as string)

    // Check uniqueness manually if needed, though Prisma will throw unique constraint error
    const existing = await prisma.period.findUnique({ where: { period } })
    if (existing) {
        return { error: 'Period number already exists' }
    }

    const imageFile = formData.get('image') as File
    let imagePath = ''

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const { error } = await supabase.storage
        .from('period_img')
        .upload(filename, buffer, {
          contentType: imageFile.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error('Failed to upload image')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('period_img')
        .getPublicUrl(filename)
        
      imagePath = publicUrl
    }

    await prisma.period.create({
      data: {
        period,
        year,
        image: imagePath,
      },
    })

    revalidatePath('/admin/periods')
    return { message: 'Period created successfully' }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create period' }
  }
}

export async function deletePeriod(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  try {
    const period = await prisma.period.findUnique({ where: { id } })
    
    if (period?.image && period.image.includes('supabase.co')) {
      const filename = period.image.split('/').pop()
      if (filename) {
        const { error } = await supabase.storage
          .from('period_img')
          .remove([filename])
        
        if (error) {
          console.error('Error deleting image from storage:', error)
        }
      }
    }

    await prisma.period.delete({
      where: { id },
    })
    revalidatePath('/admin/periods')
    return { message: 'Period deleted successfully' }
  } catch (e) {
    console.error('Failed to delete period', e)
    return { error: 'Failed to delete period' }
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

        const { error } = await supabase.storage
          .from('period_img')
          .upload(filename, buffer, {
            contentType: imageFile.type,
            upsert: false
          })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error('Failed to upload image')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('period_img')
          .getPublicUrl(filename)
          
        imagePath = publicUrl
      }
  
      await prisma.period.update({
        where: { id },
        data: {
          period,
          year,
          image: imagePath,
        },
      })
  
      revalidatePath('/admin/periods')
      return { message: 'Period updated successfully' }
    } catch (e) {
      console.error(e)
      return { error: 'Failed to update period' }
    }
  }
