'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

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

      const { error } = await supabase.storage
        .from('members_img')
        .upload(filename, buffer, {
          contentType: imageFile.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error('Failed to upload image')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('members_img')
        .getPublicUrl(filename)
        
      imagePath = publicUrl
    }

    await prisma.member.create({
      data: {
        name,
        ig,
        position,
        periodId,
        image: imagePath,
      },
    })

    revalidatePath('/admin/members')
    return { message: 'Member created successfully' }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create member' }
  }
}

export async function deleteMember(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const member = await prisma.member.findUnique({ where: { id } })
    
    if (member?.image && member.image.includes('supabase.co')) {
      const filename = member.image.split('/').pop()
      if (filename) {
        const { error } = await supabase.storage
          .from('members_img')
          .remove([filename])
        
        if (error) {
          console.error('Error deleting image from storage:', error)
        }
      }
    }

    await prisma.member.delete({
      where: { id },
    })
    revalidatePath('/admin/members')
    return { message: 'Member deleted successfully' }
  } catch (e) {
    console.error('Failed to delete member', e)
    return { error: 'Failed to delete member' }
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

        const { error } = await supabase.storage
          .from('members_img')
          .upload(filename, buffer, {
            contentType: imageFile.type,
            upsert: false
          })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error('Failed to upload image')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('members_img')
          .getPublicUrl(filename)
          
        imagePath = publicUrl
      }
  
      await prisma.member.update({
        where: { id },
        data: {
          name,
          ig,
          position,
          periodId,
          image: imagePath,
        },
      })
  
      revalidatePath('/admin/members')
      return { message: 'Member updated successfully' }
    } catch (e) {
      console.error(e)
      return { error: 'Failed to update member' }
    }
}
