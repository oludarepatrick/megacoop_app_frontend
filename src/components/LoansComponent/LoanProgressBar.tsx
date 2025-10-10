import { Progress } from "@/components/ui/progress";

const steps = [
  { number: 1, label: 'Personal Information' },
  { number: 2, label: 'Further Details' },
  { number: 3, label: 'Document Upload' },
  { number: 4, label: 'Review' },
];

interface LoanProgressBarProps {
  step: number;
}

export const LoanProgressBar = ({ step }: LoanProgressBarProps) => {
  return (
    <div className="mb-8 relative w-full">
      {/* Full dotted baseline */}
      {step < 4 && (
        <div className="absolute top-3 left-0 right-0 border-t-2 border-dotted border-gray-300"></div>
      )}

      {/* Green progress line */}
      <Progress
        className="absolute top-3 left-0 h-[2px] bg-green-500 transition-all duration-500"
        style={{
          // width: `${((step - 0.7) / (steps.length - 0.2)) * 100}%`,
          width: `${(step === 4 ? (step - 0.7) / (steps.length - 0.2) * 100 : (step - 0.6) / (steps.length - 0.2) * 100)}%`,
        }}
      />

      {/* Step markers */}
      <div className="flex justify-between items-start relative z-10 w-full">
        {steps.map((stepItem) => {
          const isActive = step === stepItem.number;
          const isCompleted = step >= stepItem.number;
          return (
            <div key={stepItem.number} className="flex flex-col items-center w-full">
              {/* Circle marker */}
              {isActive ? (
                <div className="relative flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-green-500"></div>
                </div>
              ) : (
                <div className="w-6 h-6"></div>
              )}

              {/* Label */}
              <span
                className={`mt-2 mr-4 md:mr-1 text-sm font-medium ${
                  isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};