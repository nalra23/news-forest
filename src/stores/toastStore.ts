import { create } from 'zustand'

export interface ToastItem {
  id: string
  message: string
  icon?: string
  durationMs: number
}

interface ToastStore {
  toasts: ToastItem[]
  show: (
    message: string,
    options?: { icon?: string; durationMs?: number },
  ) => void
  dismiss: (id: string) => void
}

let nextId = 0

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (message, options) => {
    const id = String(++nextId)
    const item: ToastItem = {
      id,
      message,
      icon: options?.icon,
      durationMs: options?.durationMs ?? 3000,
    }
    set((s) => ({ toasts: [...s.toasts, item] }))
    setTimeout(() => {
      get().dismiss(id)
    }, item.durationMs)
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
