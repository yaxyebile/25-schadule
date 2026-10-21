'use client'

import { useEffect, useId, useRef } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-popover p-0 text-popover-foreground shadow-xl backdrop:bg-foreground/30 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-missed/10 text-missed">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            <p id={descriptionId} className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" size="lg" onClick={onCancel} autoFocus className="px-4">
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={onConfirm}
            className="bg-missed px-4 text-primary-foreground hover:bg-missed/90"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
