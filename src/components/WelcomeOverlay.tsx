import { useEffect } from 'react'
import { WELCOME_DISMISSED_KEY } from '../lib/constants'
import { useLocalStorageBoolean } from '../hooks'
import { Button } from './ui/Button'
import { LogoMark } from './layout/Logo'

interface WelcomeOverlayProps {
  onExplore: () => void
  onShare: () => void
  onActiveChange?: (active: boolean) => void
}

export function WelcomeOverlay({ onExplore, onShare, onActiveChange }: WelcomeOverlayProps) {
  const [dismissed, setDismissed] = useLocalStorageBoolean(WELCOME_DISMISSED_KEY)

  useEffect(() => {
    onActiveChange?.(!dismissed)
  }, [dismissed, onActiveChange])

  if (dismissed) return null

  const handleDismiss = (action: 'explore' | 'share') => {
    setDismissed(true)
    if (action === 'explore') onExplore()
    else onShare()
  }

  return (
    <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-overlay__backdrop" aria-hidden />
      <div className="welcome-overlay__body">
        <div className="welcome-panel animate-scale-in">
          <div className="welcome-panel-accent" aria-hidden />
          <div className="welcome-panel__logo">
            <LogoMark size={44} />
          </div>
          <div className="welcome-panel__divider" aria-hidden />
          <h1 id="welcome-title" className="welcome-panel__title animate-gentle-rise" style={{ animationDelay: '0.1s' }}>
            Discover memories, stories and moments shared across North Macedonia.
          </h1>
          <p className="welcome-panel__desc animate-gentle-rise" style={{ animationDelay: '0.15s' }}>
            A living map of human experience — each place holds a story waiting to be read.
          </p>
          <div className="welcome-panel__actions animate-gentle-rise" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              variant="warm"
              className="welcome-panel__btn"
              onClick={() => handleDismiss('explore')}
            >
              Explore the map
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="welcome-panel__btn"
              onClick={() => handleDismiss('share')}
            >
              Share a memory
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
