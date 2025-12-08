import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import LoanPreviewModal from "./LoanPreviewModal";
import LoanSuccessModal from './LoanSucessModal';
import {
  type LoanFormValues,
  formSchema,
  type StepProps,
  step1Schema,
  step2Schema,
  // step3Schema,
  step4Schema,
  type CalculateLoan
} from '../../types/loanTypes';
import {
  fetchCreditLimit,
  verifyGuarantor,
  // fetchUserDetails,
  submitLoanApplication,
  // submitLoanDocuments
} from '../../services/loanService';
import { LoanProgressBar } from './LoanProgressBar';
import { CreditLimitDisplay } from './CreditLimitDisplay';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2LoanDetails } from './Step2LoanDetails';
// import { Step3DocumentUpload } from './Step3DocumentUpload';
import { Step4Review } from './Step4Review';
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
// import { useNavigate } from 'react-router-dom';
// import type { AxiosError } from 'axios';

const LoanModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const user = useAuthStore(state => state.user);
  const theme = useThemeStore(state => state.theme);
  console.log('User from store:', user);
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [guarantorVerifiedData, setGuarantorVerifiedData] = useState<{ firstname: string; lastname: string; phone: string } | null>(null);
  const [guarantorMessage, setGuarantorMessage] = useState<string>("");
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);
  const [loanApplicationId, setLoanApplicationId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ title: string; description: string } | null>(null);
  const [loanCalc, setLoanCalc] = useState<CalculateLoan | null>(null);
  // const navigate = useNavigate();


  const calculateLoan = (
  amount: number,
  durationInMonths: number,
  frequency: string,
  interestRate = 10.5
) => {
  const principal = amount;
  const months = durationInMonths;
  const rate = interestRate / 100;

  const monthlyPrincipal = principal / months;

  let balance = principal;
  let totalInterest = 0;
  const schedule: {
    month: number;
    principalPaid: number;
    interest: number;
    total: number;
    balance: number;
  }[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * rate;
    const total = monthlyPrincipal + interest;

    schedule.push({
      month: i,
      principalPaid: monthlyPrincipal,
      interest,
      total,
      balance,
    });

    totalInterest += interest;
    balance -= monthlyPrincipal;
  }

  const totalPayable = principal + totalInterest;

  // --- repayment schedule based on frequency ---
  let numberOfPayments = months;
  if (frequency === "weekly") numberOfPayments = months * 4;
  if (frequency === "quarterly") numberOfPayments = months / 3;

    // round installment to nearest integer
    const installment = Math.round(totalPayable / numberOfPayments);
    console.log('Calculated loan details:', {
      schedule,
      totalInterest,
      totalPayable,
      installment,
      numberOfPayments,
    });
  return {
    schedule,
    totalInterest,
    totalPayable,
    installment,
    numberOfPayments,
  };
};

  
  const methods = useForm<LoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      state: '',
      city: '',
      guarantorIsMember: '',
      guarantorEmail: '',
      guarantorFirstname: '',
      guarantorLastname: '',
      guarantorPhone: '',
      reason: '',
      loanAmount: 0,
      duration: '',
      repaymentFrequency: '',
      autoPayment: false,
      documents: [],
      agree: false,
    },
    mode: 'onBlur',
  });

  const { data: creditLimit, isLoading } = useQuery({
    queryKey: ['credit-limit'],
    queryFn: fetchCreditLimit,
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        ...methods.getValues(),
        firstName: user.first_name || '',
        middleName: user.middle_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
      });
    }
  }, [user, methods]);

  const handleVerifyGuarantor = async () => {
    const email = methods.getValues('guarantorEmail');
    if (!email) {
      setVerificationError('Please enter guarantor email');
      return;
    }

    if (user && email === user.email) {
      setVerificationError('You cannot use your own email as guarantor');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      const guarantorData = await verifyGuarantor(email);
console.log('Guarantor data:', guarantorData);
      if (guarantorData) {
        setGuarantorVerifiedData({
          // name: guarantorData.firstname + ' ' + guarantorData.lastname,
          firstname: guarantorData.firstname,
          lastname: guarantorData.lastname,
          phone: guarantorData.phone,
        });
        
        setGuarantorMessage(guarantorData.message || 'Guarantor verified successfully');

      } else {
        setGuarantorVerifiedData(null);
        methods.setValue('guarantorFirstname', '');
        methods.setValue('guarantorLastname', '');
        setVerificationError('Guarantor not found. Please check the email and try again.');
        setGuarantorMessage(guarantorData || 'Guarantor not found. Please check the email and try again.');
      }
      setShowGuarantorModal(true); // show modal with message
    } catch (error: any) {
      console.error('Guarantor verification error:', error);

      // ✅ Axios error pattern: extract message from API response
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to verify guarantor. Please check the email and try again.';

      setGuarantorMessage(apiMessage);
      setGuarantorVerifiedData(null);
      methods.setValue('guarantorFirstname', '');
      methods.setValue('guarantorLastname', '');
      setShowGuarantorModal(true); // show modal with error message
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGuarantorMemberChange = (value: string) => {
    methods.setValue('guarantorIsMember', value);
    methods.setValue('guarantorEmail', '');
    methods.setValue('guarantorFirstname', '');
    methods.setValue('guarantorLastname', '');
    setVerificationError('');
  };

  const handleNext = async () => {
    let schema;
    if (step === 1) schema = step1Schema;
    if (step === 2) schema = step2Schema;
    // if (step === 3) schema = step3Schema;
    if (step === 3) schema = step4Schema;

    const values = methods.getValues();
    try {
      schema?.parse(values);

      // Mark step as completed
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }

      if (step === 2) {
        // Instead of going straight to step 3, show preview and calculate loan details
        const amount = Number(values.loanAmount);
  const duration = Number(values.duration);
  const frequency = values.repaymentFrequency;

  const result = calculateLoan(amount, duration, frequency);

  setLoanCalc(result);
        setShowPreview(true);
      } else if (step === 3) {
        // ✅ Submit documents to separate API
        // await handleDocumentSubmit(values);
        await handleLoanSubmit();
      } else if (step < 3 && step !== 2) {
        setStep(step + 1);
      } else {
        handleSubmit(values);
      }
    } catch (error) {
      methods.trigger();

      // Log validation errors for debugging
      if (typeof error === 'object' && error !== null && 'errors' in error) {

        console.log('Validation errors:', error.errors);
      }
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleLoanSubmit = async () => {
    setIsVerifying(true);
    try {
      const values = methods.getValues();
      // destructure to submit only amount, reason, duration, repaymentFrequency, autoPayment, guarantor email, rest of guarantor details as an object
      const { loanAmount, reason, duration, repaymentFrequency, autoPayment, guarantorEmail } = values;
      // convert duration to number
      const durationInMonths = Number(duration);
      const payload = {
        amount: loanAmount,
        term_type: repaymentFrequency,
        term_value: durationInMonths,
        auto_payment: autoPayment,
        purpose: reason,
        guarantor_email: guarantorEmail,
        // guarantor: {
        //   firstname: values.guarantorFirstname || '',
        //   lastname: values.guarantorLastname || '',
        //   phone: values.guarantorPhone || '',
        //   email: guarantorEmail || '',
        //   // firstname: '',
        //   // lastname: '',
        //   // phone: '',
        //   // email: '',
        // },
        guarantor:
    methods.watch('guarantorIsMember') === 'no'
    ? {
        firstname: values.guarantorFirstname || '',
        lastname: values.guarantorLastname || '',
        phone: values.guarantorPhone || '',
        email: guarantorEmail || '',
      }
    : null

      };
      const response = await submitLoanApplication(payload);
      console.log('Loan application submitted successfully:', response);
      if (response && response.message) {
        setLoanApplicationId(response.loan.id);
        setShowSuccessModal(true);
      }
      return response;
    } catch (error: any) {
      console.error('Failed to submit loan application:', error);
      // setVerificationError('Failed to submit loan application. Please try again.');
      setVerificationError(error ? error.response.data.message : 'Failed to submit loan application. Please try again.');
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  // const handleDocumentSubmit = async (values: LoanFormValues) => {
  //   try {
  //     if (!loanApplicationId) {
  //       console.error('No loan application ID found');
  //       setAlert({
  //         title: 'Submission Error',
  //         description: 'No loan application ID found. Please start over.'
  //       });
  //       return;
  //     }

  //     const documents = values.documents || [];
  //     const validDocuments = documents.filter(doc => doc instanceof File);

  //     if (validDocuments.length < 4) {
  //       methods.setError('documents', {
  //         type: 'manual',
  //         message: 'Please upload all 4 required documents'
  //       });
  //       setAlert({
  //         title: 'Missing Documents',
  //         description: 'Please upload all 4 required documents before submitting.'
  //       });
  //       return;
  //     }

  //     // ✅ SUBMIT DOCUMENTS TO SEPARATE API
  //     const documentResponse = await submitLoanDocuments(loanApplicationId, validDocuments);
  //     console.log('Documents submitted successfully:', documentResponse);




  //     if (documentResponse && documentResponse.message) {
  //       // setAlert({ 
  //       //   title: 'Success',
  //       //   description: documentResponse.message
  //       // });
  //       setStep(4); // Move to review step
  //       // ✅ SHOW SUCCESS MODAL
  //       setShowSuccessModal(true);
  //       setAlert(null);
  //     }

  //   } catch (error) {
  //     console.error('Failed to submit documents:', error);
  //     // Handle document submission error
  //     setAlert({
  //       title: 'Submission Failed',
  //       description: 'Failed to submit documents. Please try again.'
  //     });
  //   }
  // };


  const handleSubmit = (values: LoanFormValues) => {
    console.log('Submitting loan request:', values);
    // Close the preview modal
    setShowPreview(false);
    // Show the success modal
    setShowSuccessModal(true);
  };

  const stepProps: StepProps = {
    methods,
    creditLimit,
    isLoading,
    isVerifying,
    verificationError,
    onVerifyGuarantor: handleVerifyGuarantor,
    onGuarantorMemberChange: handleGuarantorMemberChange,
    alert,
    setAlert,
    loanApplicationId,
    setLoanApplicationId
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`relative  ${theme === 'dark' ? 'bg-black' : 'bg-white'} backdrop-blur-xl rounded-2xl shadow-xl w-full  p-6 overflow-y-auto ${step === 4 ? 'max-h-[105vh] ' : 'max-h-[90vh] max-w-2xl'}`}>
        <h2 className="text-xl font-bold mb-4 text-green-800"></h2>

        {/* floating close button */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => {
            onClose();
            setStep(1);
            methods.reset();
            setCompletedSteps([]);
          }}
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        <LoanProgressBar step={step} />
        <CreditLimitDisplay isLoading={isLoading} creditLimit={creditLimit} />

        <FormProvider {...methods}>
          <Form {...methods}>
            {step === 1 && <Step1PersonalInfo {...stepProps} />}
            {step === 2 && <Step2LoanDetails {...stepProps} />}
            {/* {step === 3 && <Step3DocumentUpload {...stepProps} />} */}
            
            {step === 3 && <Step4Review {...stepProps} />}
            {/* {step === 4 && <Step3DocumentUpload {...stepProps} />} */}
          </Form>

          {/* guarantor Confirmation Modal */}
          <Dialog open={showGuarantorModal} onOpenChange={setShowGuarantorModal}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className={guarantorVerifiedData ? "text-green-700" : "text-red-700"}>Guarantor Verification</DialogTitle>
                <DialogDescription>{guarantorMessage}</DialogDescription>
              </DialogHeader>

              {guarantorVerifiedData ? (
                <>
                  <div className="border rounded-md p-4 bg-emerald-50 mt-3 text-gray-800">
                    <p><strong>Name:</strong> {guarantorVerifiedData.firstname} {guarantorVerifiedData.lastname}</p>
                    <p><strong>Phone:</strong> {guarantorVerifiedData.phone}</p>
                  </div>


                  <p className="mt-4 text-sm text-gray-600">
                    Is this your guarantor’s correct information?
                  </p>

                  <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowGuarantorModal(false);
                        setGuarantorVerifiedData(null);
                      }}
                    >
                      No
                    </Button>

                    <Button
                      onClick={() => {
                        if (guarantorVerifiedData) {
                          methods.setValue('guarantorFirstname', guarantorVerifiedData.firstname);
                          methods.setValue('guarantorLastname', guarantorVerifiedData.lastname);
                          methods.setValue('guarantorPhone', guarantorVerifiedData.phone);
                        }
                        setShowGuarantorModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Yes
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => {
                        setShowGuarantorModal(false);
                        setGuarantorVerifiedData(null);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      OK
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </FormProvider>

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <div />
          )}
          <Button className="bg-green-500 hover:bg-green-600" onClick={handleNext} disabled={isVerifying}>
            {/* {step === 3 ? 'Submit Documents' : step === 2 ? 'Apply' : 'Next'} */}
            {step === 3 ? 'Submit Application' : step === 2 ? 'Apply' : 'Next'}
          </Button>
        </div>
      </div>

      <LoanPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={async () => {
          setShowPreview(false);
          setStep(3);
        }}
        values={{
          reason: methods.getValues("reason"),
          loanAmount: methods.getValues("loanAmount"),
          duration: methods.getValues("duration"),
          repaymentFrequency: methods.getValues("repaymentFrequency"),
          autoPayment: methods.getValues("autoPayment"),
        }}
        loanCalc={loanCalc}
      />

      <LoanSuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
          setStep(1);
          methods.reset();
          setCompletedSteps([]);
        }}
        onConfirm={async () => {
          setShowSuccessModal(false);
          onClose();
          setStep(1);
          methods.reset();
          setCompletedSteps([]);
          // navigate('/savings-loan?view=loan');
        }}
        values={{
          reason: methods.getValues("reason"),
          loanAmount: methods.getValues("loanAmount"),
          duration: methods.getValues("duration"),
          repaymentFrequency: methods.getValues("repaymentFrequency"),
          autoPayment: methods.getValues("autoPayment"),
        }}
        loanCalc={loanCalc}
      />
    </div>
  );
};

export default LoanModal;


// onConfirm={async () => {
        //   try {
        //     const response = await handleLoanSubmit();
        //     if (response) {
        //       setShowPreview(false);
        //       setStep(3); // Move to document upload step after preview
        //     }
        //   } catch (error) {
        //     console.error('Error during loan submission:', error);
        //     // Optionally, show an error message to the user
        //     // Keep preview open to let user try again
        //     setShowPreview(true);
        //   }
// }}
        
{/* <Button className="bg-green-500 hover:bg-green-600" onClick={step === 4 ? () => handleSubmit(methods.getValues()) : handleNext}>
            {step === 4 ? 'Submit' : step === 2 ? 'Apply' : 'Next'}
          </Button> */}

           // Additional validation for step 3 - check if all 4 documents are uploaded
      // if (step === 3) {
      //   const documents = values.documents || [];
      //   const validDocuments = documents.filter(doc => doc instanceof File);

      //   if (validDocuments.length < 4) {
      //     methods.setError('documents', {
      //       type: 'manual',
      //       message: 'Please upload all 4 required documents'
      //     });
      //     return;
      //   }
      // }

      // Mark step as completed
      // if (!completedSteps.includes(step)) {
      //   setCompletedSteps([...completedSteps, step]);
      // }

       // Fetch user details when the modal opens
  //   const { data: userDetails } = useQuery({
  //   queryKey: ['user-details'],
  //   queryFn: fetchUserDetails,
  //   enabled: open, // Only run when modal is open
  // });