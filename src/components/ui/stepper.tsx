import { cn } from "@/lib/utils";
import pendingIcon from "@/assets/pending-icon.svg"

type Step = {
  label: string;
  icon?: string;
  isPending?: boolean; 
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <ol className="flex items-center w-full [&>li:last-child]:w-auto mb-10">
      {steps.map((step, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        return (
          <li
            key={index}
            className={cn(
              "flex w-full items-center relative",
              index < steps.length - 1 &&
                "after:content-[''] after:w-full after:h-1 after:border-b after:inline-block",
              isCompleted
                ? "after:border-megagreen"
                : "after:border-gray-200 dark:after:border-gray-700"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                isCompleted
                  ? "bg-megagreen text-white"
                  : isActive
                  ? "bg-megagreen text-white"
                  : "border-icon border"
              )}
            >
              {isCompleted ? (
                step.isPending ? (
                  <img src={pendingIcon} alt="" />
                  
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 16 12"
                  >
                    <path d="M1 5.917 5.724 10.5 15 1.5" />
                  </svg>
                )
              ) : step.icon ? (
                step.icon
              ) : (
                index + 1
              )}
            </span>

            <span
              className={cn(
                "absolute top-10 text-center left-1 text-xs max-w-[70px] hidden sm:block",
                index === 2 && "-left-4",
                index === 3 && "-left-2",
                index === 4 && "-left-4",
                isCompleted
                  ? `text-megagreen ${index === 3 && "-left-4"}` 
                  : "text-icon"
              )}
            >
              {step.label}
              {step.isPending && isCompleted && (
                <p className="text-[8px] text-black rounded-full mt-1 bg-megaorange px-2 py-1 ">
                  Under Review
                </p>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
};








// import React from "react";
// import { cn } from "@/lib/utils"; // if you use shadcn/utils, else just join classnames

// type Step = {
//   label: string;
//   icon?: React.ReactNode;
// };

// interface StepperProps {
//   steps: Step[];
//   currentStep: number;
// }

// export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
//   return (
//     <ol className="flex items-center w-full [&>li:last-child]:w-auto mb-10">
//       {steps.map((step, index) => {
//         const isCompleted = index + 1 < currentStep;
//         const isActive = index + 1 === currentStep;

//         return (
//           <li
//             key={index}
//             className={cn(
//               "flex w-full items-center relative",
//               index < steps.length - 1 &&
//                 "after:content-[''] after:w-full after:h-1 after:border-b after:inline-block",
//               isCompleted
//                 ? "after:border-megagreen "
//                 : "after:border-gray-200 dark:after:border-gray-700"
//             )}
//           >
//             <span
//               className={cn(
//                 "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
//                 isCompleted
//                   ? "bg-megagreen text-white"
//                   : isActive
//                   ? "bg-megagreen text-white"
//                   : "border-megagreen border "
//               )}
//             >
//               {isCompleted ? (
//                 // ✅ checkmark
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 16 12"
//                 >
//                   <path d="M1 5.917 5.724 10.5 15 1.5" />
//                 </svg>
//               ) : step.icon ? (
//                 step.icon
//               ) : (
//                 index + 1
//               )}
//             </span>
//             <span
//                 className={cn(
//                     "absolute top-10 text-center text-megagreen text-xs max-w-[60px] hidden sm:block",
//                     index === 2 && "-left-3", 
//                     index === 4 && "-left-3",
//                 )}
//             >
//                 {step.label}
//             </span>
//           </li>
//         );
//       })}
//     </ol>
//   );
// };
