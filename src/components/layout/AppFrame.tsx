import type { ReactNode } from 'react'

interface AppFrameProps {
  children: ReactNode
  mode?: 'desk' | 'map'
}

export function AppFrame({ children, mode = 'desk' }: AppFrameProps) {
  return (
    <div className={`app-viewport app-viewport--${mode}`}>
      <div className="app-frame">
        <div className="app-map-region">{children}</div>
      </div>
    </div>
  )
}
