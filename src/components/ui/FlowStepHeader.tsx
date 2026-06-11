const STEPS = [
  { step: 1 as const, label: 'Place' },
  { step: 2 as const, label: 'Story' },
  { step: 3 as const, label: 'Share' },
]

function StepIndicator({ step, label }: { step: 1 | 2 | 3; label: string }) {
  return (
    <div className="share-flow-steps" aria-label={`Step ${step}: ${label}`}>
      {STEPS.map(({ step: n, label: stepLabel }) => (
        <div
          key={n}
          className={`share-flow-step${n === step ? ' share-flow-step--active' : ''}`}
        >
          <span className="share-flow-step__dot">{n}</span>
          <span className="share-flow-step__label">{stepLabel}</span>
        </div>
      ))}
    </div>
  )
}

export function FlowStepHeader({ step }: { step: 1 | 2 | 3 }) {
  const labels = {
    1: 'Choose a place',
    2: 'Tell your story',
    3: 'Share it',
  } as const
  return <StepIndicator step={step} label={labels[step]} />
}

export { StepIndicator }
