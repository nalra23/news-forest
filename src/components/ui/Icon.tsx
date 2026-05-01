import { clsx } from 'clsx'
import { useThemeStore } from '@/stores'
import { PixelIcon, type PixelIconName } from './PixelIcon'

export interface IconProps {
  /** Pixel 모드일 때 사용할 픽셀 아이콘 이름 */
  name: PixelIconName
  /** Default 모드일 때 사용할 emoji */
  emoji: string
  className?: string
  title?: string
}

/**
 * 테마 모드에 따라 emoji ↔ pixel SVG 자동 분기.
 * - default: emoji 텍스트 노드
 * - pixel: 16x16 PixelIcon SVG (현재 텍스트 크기에 맞게 size 자동)
 */
export function Icon({ name, emoji, className, title }: IconProps) {
  const mode = useThemeStore((s) => s.mode)

  if (mode === 'pixel') {
    return (
      <PixelIcon
        name={name}
        title={title}
        className={clsx('inline-block', className)}
      />
    )
  }

  return (
    <span
      aria-hidden={!title}
      aria-label={title}
      className={clsx(
        'inline-flex items-center justify-center leading-none',
        className,
      )}
    >
      {emoji}
    </span>
  )
}
