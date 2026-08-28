import { NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { ROUTES } from '@/src/lib/navigation'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return ROUTES.DASHBOARD
  }

  return next
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = getSafeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && authData?.user) {
      // Check the user's role in the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (!profile?.role) {
        return NextResponse.redirect(`${origin}${ROUTES.SETUP}`)
      } else if (profile.role === 'customer') {
        return NextResponse.redirect(`${origin}${ROUTES.FEED}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?error=auth-callback-failed`)
}
