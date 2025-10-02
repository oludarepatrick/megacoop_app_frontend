interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps = ({ currentStep, totalSteps }: ProgressStepsProps) => (
  <div className="flex justify-center items-center my-2">
    {Array.from({ length: totalSteps }, (_, idx) => (
      <div key={idx + 1} className="flex items-center lg:w-full">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= idx + 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          {idx + 1}
        </div>
        {idx < totalSteps - 1 && (
          <div
            className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] ${
              currentStep > idx + 1 ? "bg-[#14AB55]" : "bg-gray-300"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

export default ProgressSteps;