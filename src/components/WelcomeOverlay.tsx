import { useEffect } from 'react'
import { WELCOME_DISMISSED_KEY } from '../lib/constants'
import { useLocalStorageBoolean } from '../hooks'

interface WelcomeOverlayProps {
  onExplore: () => void
  onShare: () => void
  onActiveChange?: (active: boolean) => void
}

export function WelcomeOverlay({ onShare, onActiveChange }: WelcomeOverlayProps) {
  const [dismissed, setDismissed] = useLocalStorageBoolean(WELCOME_DISMISSED_KEY)

  useEffect(() => {
    onActiveChange?.(!dismissed)
  }, [dismissed, onActiveChange])

  if (dismissed) return null

  return (
    <div className="welcome-diary" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-diary__inner">
        <p className="welcome-diary__eyebrow">unsent</p>
        <h2 id="welcome-title" className="welcome-diary__mark">
          Words people never got to say
        </h2>
        <div className="welcome-diary__actions">
          <button
            type="button"
            className="welcome-diary__btn"
            onClick={() => setDismissed(true)}
          >
            Read
          </button>
          <button
            type="button"
            className="welcome-diary__btn welcome-diary__btn--ghost"
            onClick={() => {
              setDismissed(true)
              onShare()
            }}
          >
            Write
          </button>
        </div>
      </div>
    </div>
  )
}
