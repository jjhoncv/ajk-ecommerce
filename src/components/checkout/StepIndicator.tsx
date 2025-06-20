import { CheckoutStep } from '@/types/checkout'

interface StepIndicatorProps {
  currentStep: CheckoutStep
}

const steps = [
  { key: 'shipping', label: 'Envío', number: 1 },
  { key: 'payment', label: 'Pago', number: 2 },
  { key: 'review', label: 'Revisar', number: 3 },
  { key: 'processing', label: 'Procesando', number: 4 }
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const getCurrentStepNumber = () => {
    return steps.find(step => step.key === currentStep)?.number || 1
  }

  const currentStepNumber = getCurrentStepNumber()

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.key} className={`${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
              {step.number < currentStepNumber ? (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
              ) : step.number === currentStepNumber ? (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
              )}

              <div className={`
                relative flex h-8 w-8 items-center justify-center rounded-full
                ${step.number < currentStepNumber
                  ? 'bg-indigo-600 text-white'
                  : step.number === currentStepNumber
                    ? 'border-2 border-indigo-600 bg-white text-indigo-600'
                    : 'border-2 border-gray-300 bg-white text-gray-500'
                }
              `}>
                {step.number < currentStepNumber ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              <div className="mt-2 text-xs font-medium text-gray-900">
                {step.label}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}