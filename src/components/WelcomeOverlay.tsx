import { WELCOME_DISMISSED_KEY } from '../lib/constants'
import { useLocalStorageBoolean } from '../hooks'
import { Button } from './ui/Button'
import { LogoMark } from './layout/Logo'

interface WelcomeOverlayProps {
  onExplore: () => void
  onShare: () => void
}

export function WelcomeOverlay({ onExplore, onShare }: WelcomeOverlayProps) {
  const [dismissed, setDismissed] = useLocalStorageBoolean(WELCOME_DISMISSED_KEY)

  if (dismissed) return null

  const handleDismiss = (action: 'explore' | 'share') => {
    setDismissed(true)
    if (action === 'explore') onExplore()
    else onShare()
  }

  return (
    <div className="absolute inset-0 z-[1500] flex items-center justify-center p-6 rounded-[inherit]">
      <div className="absolute inset-0 bg-charcoal/35 backdrop-blur-md animate-fade-in rounded-[inherit]" />
      <div className="welcome-panel relative rounded-[32px] p-10 sm:p-12 max-w-lg w-full animate-scale-in text-center overflow-hidden">
        <div className="welcome-panel-accent" />
        <div className="flex justify-center mb-3">
          <LogoMark size={52} />
        </div>
        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-terracotta-light to-gold mx-auto my-5 animate-gentle-rise" style={{ animationDelay: '0.1s' }} />
        <h1
          className="font-display text-3xl sm:text-[2rem] font-semibold text-charcoal leading-tight mb-4 animate-gentle-rise"
          style={{ animationDelay: '0.15s' }}
        >
          Discover memories, stories and moments shared across North Macedonia.
        </h1>
        <p
          className="text-charcoal-soft text-sm leading-relaxed mb-10 max-w-sm mx-auto animate-gentle-rise"
          style={{ animationDelay: '0.2s' }}
        >
          A living map of human experience — each place holds a story waiting to be read.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-gentle-rise" style={{ animationDelay: '0.25s' }}>
          <Button size="lg" variant="warm" className="min-w-[150px]" onClick={() => handleDismiss('explore')}>
            Explore the map
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="min-w-[150px]"
            onClick={() => handleDismiss('share')}
          >
            Share a memory
          </Button>
        </div>
      </div>
    </div>
  )
}
