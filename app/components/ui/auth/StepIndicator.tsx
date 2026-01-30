// app/components/ui/auth/StepIndicator.tsx
export const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < currentStep ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );