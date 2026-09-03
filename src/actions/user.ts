'use server'

import { createClient } from '@/src/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(role: 'artisan' | 'customer' | 'b2b') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, role })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  return { success: true, role }
}

export interface ProfileData {
  name?: string
  phone_number?: string
  address?: string
  specialised_in?: string
  company_name?: string
}

export async function updateProfile(data: ProfileData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile')
  revalidatePath('/more')
  return { success: true }
}
