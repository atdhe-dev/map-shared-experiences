import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'

function ControlsInner({ onZoomIn, onZoomOut, onLocate }: {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
}) {
  return (
    <div className="map-controls-bubble map-controls-bubble--inset" aria-label="Map controls">
      <div className="map-controls-bubble__inner">
        <button type="button" className="map-control-btn" aria-label="Zoom in" onClick={onZoomIn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
        <button type="button" className="map-control-btn" aria-label="Zoom out" onClick={onZoomOut}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="map-controls-bubble__divider" aria-hidden="true" />
        <button type="button" className="map-control-btn map-control-btn--locate" aria-label="My location" onClick={onLocate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** Map zoom/locate controls portaled into map-shell (mobile). */
export function MapControlsBubble() {
  const map = useMap()
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const shell = map.getContainer().closest('.map-shell')
    setHost(shell instanceof HTMLElement ? shell : null)
  }, [map])

  if (!host) return null

  return createPortal(
    <ControlsInner
      onZoomIn={() => map.zoomIn()}
      onZoomOut={() => map.zoomOut()}
      onLocate={() => map.locate({ setView: true, maxZoom: 13 })}
    />,
    host,
  )
}
