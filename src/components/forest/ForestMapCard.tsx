import { Link } from 'react-router-dom'
import { TreeArt } from '@/components/tree'
import { Card } from '@/components/ui'
import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'

export interface ForestUserSummary {
  publicId: string
  nickname: string
  treeStage: TreeStage
  totalPoints: number
}

export interface ForestMapCardProps {
  user: ForestUserSummary
}

export function ForestMapCard({ user }: ForestMapCardProps) {
  return (
    <Link
      to={`/forest/u/${user.publicId}`}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card
        variant="soft"
        padding="md"
        className="aspect-square transition-all hover:shadow-lift hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-primary">
            <TreeArt
              stage={user.treeStage}
              className="h-12 w-12"
              title={`${TREE_STAGE_DISPLAY[user.treeStage]} 단계`}
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="line-clamp-1 text-sm font-bold">{user.nickname}</p>
            <p className="text-xs font-semibold text-primary">
              {TREE_STAGE_DISPLAY[user.treeStage]}
            </p>
          </div>
          <p className="numeric text-xs text-fg-muted">
            {user.totalPoints} P
          </p>
        </div>
      </Card>
    </Link>
  )
}
