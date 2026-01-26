'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function createEvent(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const description = formData.get('description') as string
    const details = formData.get('details') as string
    const location = formData.get('location') as string
    const participants = formData.get('participants') as string
    
    const imageFile = formData.get('image') as File
    let imagePath = ''

    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const { error } = await supabase.storage
        .from('events_img')
        .upload(filename, buffer, {
          contentType: imageFile.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error('Failed to upload image')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('events_img')
        .getPublicUrl(filename)
        
      imagePath = publicUrl
    }

    await prisma.event.create({
      data: {
        title,
        date,
        description,
        details,
        location,
        participants,
        image: imagePath,
      },
    })

    revalidatePath('/admin/events')
    return { message: 'Event created successfully' }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create event' }
  }
}

export async function deleteEvent(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const event = await prisma.event.findUnique({ where: { id } })
    
    if (event?.image && event.image.includes('supabase.co')) {
      const filename = event.image.split('/').pop()
      if (filename) {
        const { error } = await supabase.storage
          .from('events_img')
          .remove([filename])
        
        if (error) {
          console.error('Error deleting image from storage:', error)
        }
      }
    }

    await prisma.event.delete({
      where: { id },
    })
    revalidatePath('/admin/events')
    return { message: 'Event deleted successfully' }
  } catch (e) {
    console.error('Failed to delete event', e)
    return { error: 'Failed to delete event' }
  }
}

export async function updateEvent(prevState: any, formData: FormData) {
    try {
      const id = formData.get('id') as string
      const title = formData.get('title') as string
      const date = formData.get('date') as string
      const description = formData.get('description') as string
      const details = formData.get('details') as string
      const location = formData.get('location') as string
      const participants = formData.get('participants') as string
      
      const imageFile = formData.get('image') as File
      let imagePath = formData.get('currentImage') as string
  
      if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { error } = await supabase.storage
          .from('events_img')
          .upload(filename, buffer, {
            contentType: imageFile.type,
            upsert: false
          })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error('Failed to upload image')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('events_img')
          .getPublicUrl(filename)
          
        imagePath = publicUrl
      }
  
      await prisma.event.update({
        where: { id },
        data: {
          title,
          date,
          description,
          details,
          location,
          participants,
          image: imagePath,
        },
      })
  
      revalidatePath('/admin/events')
      return { message: 'Event updated successfully' }
    } catch (e) {
      console.error(e)
      return { error: 'Failed to update event' }
    }
}
