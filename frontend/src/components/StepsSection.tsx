import StepAccordion from "./StepAccordion"
import { useStore } from '../store/useStore'

function StepsSection() {
  const steps = useStore((state) => state.steps)
  const activeStep = useStore((state) => state.activeStep)
  const setActiveStep = useStore((state) => state.setActiveStep)

  if (!steps?.length) {
    return null
  }

  return (
    <div>
      {steps.map((stepData, index) => {
        const nextStep = steps[index + 1]

        return (
          <StepAccordion
            key={stepData.id}
            step={stepData.id}
            title={stepData.title}
            icon={stepData.icon}
            isActive={activeStep === stepData.id}
            onToggle={() => setActiveStep(activeStep === stepData.id ? 0 : stepData.id)}
            onNext={() => {
              if (nextStep) setActiveStep(nextStep.id)
            }}
            nextStepTitle={nextStep?.title ?? null}
            stepsTotal={steps.length}
          />
        )
      })}
    </div>
  )
}

export default StepsSection
