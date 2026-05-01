import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'default' | 'dark' | 'pixel'

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

/**
 * Theme toggle.
 *  - default: cream / forest (기본 컨셉, light)
 *  - dark:    long-form 가독성 최적화 — DesignGuide §12
 *  - pixel:   Minecraft 스타일 Easter egg (픽셀 폰트 + 아이콘 + 하드 그림자)
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'default',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'nf:theme',
      version: 4,
      migrate: (persisted) => {
        const obj = (persisted ?? {}) as { mode?: string }
        if (
          obj.mode !== 'default' &&
          obj.mode !== 'dark' &&
          obj.mode !== 'pixel'
        ) {
          return { mode: 'default' as ThemeMode }
        }
        return { mode: obj.mode as ThemeMode }
      },
    },
  ),
)
