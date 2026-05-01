import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <span className="text-3xl" aria-hidden>
            🍂
          </span>
        </div>
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요</h1>
        <p className="text-sm text-fg-muted">
          이동하려던 숲이 사라진 것 같아요. 다시 둘러보러 가볼까요?
        </p>
        <Link to="/">
          <Button size="md">처음으로</Button>
        </Link>
      </div>
    </div>
  )
}
