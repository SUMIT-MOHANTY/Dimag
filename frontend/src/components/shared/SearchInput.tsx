import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  debounceMs?: number
  className?: string
}

export function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(controlledValue || '')
  const debouncedValue = useDebounce(inputValue, debounceMs)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== inputValue) {
      setInputValue(controlledValue)
    }
  }, [controlledValue])

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
