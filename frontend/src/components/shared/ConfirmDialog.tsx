import { ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-primary hover:bg-primary/90',
  }

  const iconStyles = {
    danger: 'text-red-600 bg-red-100',
    warning: 'text-amber-600 bg-amber-100',
    info: 'text-primary bg-primary/10',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-full flex-shrink-0', iconStyles[variant])}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
            {children}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn('px-4 py-2 text-white rounded-lg transition-colors', variantStyles[variant])}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
