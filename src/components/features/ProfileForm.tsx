'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, type ProfileData } from '@/src/actions/user'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  initialData: ProfileData
  role: 'artisan' | 'customer' | 'b2b'
  redirectTo?: string
}

export function ProfileForm({ initialData, role, redirectTo }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ProfileData>({
    name: initialData.name || '',
    phone_number: initialData.phone_number || '',
    address: initialData.address || '',
    specialised_in: initialData.specialised_in || '',
    company_name: initialData.company_name || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile(formData)
      setSuccess(true)
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border bg-green-400/10 p-3 text-sm text-green-500">
          Profile updated successfully!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="+1 234 567 8900"
          />
        </div>

        {role === 'b2b' && (
          <div>
            <label htmlFor="company_name" className="mb-2 block text-sm font-medium text-foreground">
              Company Name
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Acme Corp"
              required
            />
          </div>
        )}

        {role === 'artisan' && (
          <>
            <div>
              <label htmlFor="specialised_in" className="mb-2 block text-sm font-medium text-foreground">
                Specialised In
              </label>
              <input
                id="specialised_in"
                name="specialised_in"
                type="text"
                value={formData.specialised_in}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                placeholder="Pottery, Woodworking, etc."
              />
            </div>
            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-foreground">
                Workshop Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
                placeholder="123 Artisan Lane..."
              />
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Save Changes
      </button>
    </form>
  )
}
