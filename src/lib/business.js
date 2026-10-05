import { supabase } from './supabase.js'

export async function getCurrentBusiness() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error('Не удалось определить текущего пользователя.')
  }

  const { data: membership, error: membershipError } = await supabase
    .from('business_users')
    .select('business_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    throw membershipError
  }

  if (!membership) {
    throw new Error('Для пользователя не найден связанный бизнес.')
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id, name, city, phone, telegram_username, working_hours')
    .eq('id', membership.business_id)
    .single()

  if (businessError) {
    throw businessError
  }

  return business
}
