// Step4Review.tsx
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import type { StepProps } from '../../types/loanTypes';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';



export const Step4Review = ({ methods, verificationError }: StepProps) => {
  return (
    <div className="mb-4">
      <FormField
        control={methods.control}
        name="agree"
        render={({ field }) => (
          <FormItem className="flex flex-col pb-2 mx-auto">
            <label className="flex mt-2 text-sm md:justify-center items-center text-sm text-gray-700 gap-2">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} className='flex items-center justify-center' />
              {/* <span className='break-words text-center' >I agree to the <Link className='text-green-500' to="/terms">terms & conditions</Link> and <Link className='text-green-500' to="/privacy">privacy policy</Link></span> */}
              <span className="break-words text-left">
                I agree to the{' '}
                <Link className="text-green-500 underline underline-offset-2" to="/terms">
                  terms & conditions
                </Link>{' '}
                and{' '}
                <Link className="text-green-500 underline underline-offset-2" to="/privacy">
                  privacy policy{' '}
                </Link>
                and also confirm that the loan details provided are correct.
              </span>
            </label>
            <FormMessage className="items-start" />
          </FormItem>
        )}
      />
      {verificationError && (
        <p className="text-red-600 text-sm mt-2 text-center">{verificationError}</p>
      )}

    </div>
  );
};