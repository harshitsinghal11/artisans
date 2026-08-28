import type { Language } from './dictionaries'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export function readClientLanguage(): Language {
  if (typeof document === 'undefined') {
    return 'en'
  }

  const match = document.cookie.match(new RegExp(`(^| )${LOCALE_COOKIE}=([^;]+)`))
  return match?.[2] === 'hi' ? 'hi' : 'en'
}

export function writeClientLanguage(language: Language) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${LOCALE_COOKIE}=${language}; path=/; max-age=31536000`
}
