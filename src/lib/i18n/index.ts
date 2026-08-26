import { cookies } from 'next/headers'
import { Language, dictionaries } from './dictionaries'

export * from './dictionaries'

export async function getDictionary() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as Language
  return dictionaries[lang] || dictionaries.en
}
