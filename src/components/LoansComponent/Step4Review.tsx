// Step4Review.tsx
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import type { StepProps } from '../../types/loanTypes';
import LoanSuccessModal from './LoanSucessModal';


export const Step4Review = ({ methods }: StepProps) => {
  return (
    <FormField
      control={methods.control}
      name="agree"
      render={({ field }) => (
        <FormItem>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={field.value} onChange={field.onChange} />
            <span>I confirm the loan details are correct</span>
          </label>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};