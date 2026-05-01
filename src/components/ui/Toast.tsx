import { useToastStore } from '@/stores/toastStore'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        'pointer-events-none fixed z-50 flex flex-col gap-2 px-4',
        'bottom-20 left-0 right-0 items-center',
        'desktop:bottom-auto desktop:left-auto desktop:right-6 desktop:top-20 desktop:items-end desktop:px-0',
      ].join(' ')}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto inline-flex max-w-sm items-center gap-2 rounded-full bg-foreground/95 px-4 py-2 text-sm text-white shadow-lift backdrop-blur"
        >
          {t.icon && <span aria-hidden>{t.icon}</span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
