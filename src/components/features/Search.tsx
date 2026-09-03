'use client'

import { Search as SearchIcon } from 'lucide-react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Search({ value, onChange, placeholder = "Search for products, categories..." }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </div>
  )
}
