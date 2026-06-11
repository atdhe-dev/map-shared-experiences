import type { ReactNode } from 'react'

interface AppFrameProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function AppFrame({ children, sidebar }: AppFrameProps) {
  return (
    <div className="app-viewport">
      <div className="app-frame">
        {sidebar}
        <div className="app-map-region">{children}</div>
      </div>
    </div>
  )
}
