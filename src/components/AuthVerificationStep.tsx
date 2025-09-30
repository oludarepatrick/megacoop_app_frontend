// components/auth/VerificationStep.tsx
import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';
import { AxiosError, type AxiosResponse } from 'axios';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageLoader from '@/components/PageLoader';
import ProgressSteps from './AuthProgressSteps';

export interface VerificationStepProps {
  step: number;
  userEmail: string;
  userPhone: string;
  verificationForm: UseFormReturn<{ verificationCode: string }>;
  onEmailVerificationSubmit: (data: { verificationCode: string }) => void;
  onPhoneVerificationSubmit: (data: { verificationCode: string }) => void;
  verifyEmailCode: UseMutationResult<AxiosResponse, AxiosError, string>;
  verifyPhoneCode: UseMutationResult<AxiosResponse, AxiosError, string>;
  emailTimer: number;
  phoneTimer: number;
  emailTimerActive: boolean;
  phoneTimerActive: boolean;
  handleResendCode: (type: 'email' | 'phone') => void;
  resendCode: UseMutationResult<AxiosResponse, AxiosError, 'email' | 'phone'>;
}

const VerificationStep = ({
  step,
  userEmail,
  userPhone,
  verificationForm,
  onEmailVerificationSubmit,
  onPhoneVerificationSubmit,
  verifyEmailCode,
  verifyPhoneCode,
  emailTimer,
  phoneTimer,
  emailTimerActive,
  phoneTimerActive,
  handleResendCode,
  resendCode
}: VerificationStepProps) => (
  <div>
    <div className="text-center mb-6">
      <ProgressSteps currentStep={step} totalSteps={4} />
      <p className="text-sm text-[#14AB55] mb-6">
        {step === 4
          ? `We have sent a verification code to your email ${userEmail ? userEmail.replace(/(.{2})(.*)(?=@)/, '$1****') : ''}`
          : `We have sent a verification code to your phone ${userPhone ? userPhone.slice(0, 3) + '****' + userPhone.slice(-4) : ''}`
        }
      </p>
    </div>
    <Form {...verificationForm}>
      <form 
        onSubmit={step === 4 ? 
          verificationForm.handleSubmit(onEmailVerificationSubmit) : 
          verificationForm.handleSubmit(onPhoneVerificationSubmit)
        } 
        className="space-y-6"
      >
        <FormField
          control={verificationForm.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Verification Code" {...field} className='h-11' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={step === 4 ? verifyEmailCode.isPending : verifyPhoneCode.isPending}
          className='w-full h-11 bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800'
        >
          {step === 4
            ? (verifyEmailCode.isPending ? <>Verifying... <PageLoader /></> : "Verify Email")
            : (verifyPhoneCode.isPending ? <>Verifying... <PageLoader /></> : "Verify Phone")
          }
        </Button>
        {/* Resend Code Section */}
        <div className="flex items-center justify-center text-sm my-3">
          <span className="text-gray-600">Didn't get code?</span>
          {step === 4 ? (
            emailTimerActive ? (
              <span className="text-gray-500 ml-2">Resend in {emailTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={() => handleResendCode('email')}
                className="text-[#14AB55] hover:underline disabled:text-gray-400 ml-2"
                disabled={resendCode.isPending}
              >
                {resendCode.isPending ? "Sending..." : "Resend Code"}
              </button>
            )
          ) : (
            phoneTimerActive ? (
              <span className="text-gray-500 ml-2">Resend in {phoneTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={() => handleResendCode('phone')}
                className="text-[#14AB55] hover:underline disabled:text-gray-400 ml-2"
                disabled={resendCode.isPending}
              >
                {resendCode.isPending ? "Sending..." : "Resend Code"}
              </button>
            )
          )}
        </div>
      </form>
    </Form>
  </div>
);

export default VerificationStep;