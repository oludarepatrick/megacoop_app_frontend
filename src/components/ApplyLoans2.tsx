import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as z from 'zod';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoanPreviewModal from "../components/LoansComponent/LoanPreviewModal"
import { Textarea } from '../components/ui/textarea';
import { Link } from 'react-router-dom';
import { Switch } from "../components/ui/switch"
import LoanImage1 from "../../assets/loan-request-image1.png"
import LoanImage2 from "../../assets/loan-request-image2.png"


// Step schemas
const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().min(1, 'Middle name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required').max(10, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  hasGuarantor: z.boolean().refine((val) => val === true, 'You must add a guarantor to proceed'),
  // guarantorIsMember: z.string().optional(),
  guarantorIsMember: z.string().min(1, 'Select an option'),
  // guarantorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  // guarantorName: z.string().optional(),
  // guarantorPhone: z.string().optional(),
  // guarantorUsername: z.string().optional(),
  guarantorEmail: z.string().email('Invalid email address').min(1, 'Guarantor email is required'),
  guarantorName: z.string().min(1, 'Guarantor name is required'),
  guarantorPhone: z.string().min(1, 'Guarantor phone number is required'),
  // guarantorUsername: z.string().min(1, 'Guarantor username is required'),
});

const step2Schema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  loanAmount: z.number().min(1000, 'Minimum loan is ₦1,000'),
  duration: z.string().min(1, 'Select duration'),
  repaymentFrequency: z.string().min(1, 'Select repayment frequency'),
  autoPayment: z.boolean(),
  agree: z.boolean().refine((val) => val === true, 'You must agree before submitting'),
});

const step3Schema = z.object({
  documents: z.any().refine((files) => files?.length > 0, 'Please upload required documents'),
});

const step4Schema = z.object({
  agree: z.boolean().refine((val) => val === true, 'You must agree before submitting'),
});

// Merge schemas for global form
const formSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

type LoanFormValues = z.infer<typeof formSchema>;

// API fetch for credit limit
const fetchCreditLimit = async () => {
  const { data } = await axios.get('/api/credit-limit');
  return data.limit;
};

// API to verify guarantor
const verifyGuarantor = async (email: string) => {
  const { data } = await axios.get(`/api/verify-guarantor?email=${email}`);
  return data;
};

const LoanModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

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
      hasGuarantor: false as boolean,
      guarantorIsMember: '',
      guarantorEmail: '',
      guarantorName: '',
      guarantorPhone: '',
      // guarantorUsername: '',
      reason: '',
      loanAmount: 0,
      duration: '',
      repaymentFrequency: '',
      autoPayment: false,
      documents: null,
      agree: false,
    },
    mode: 'onBlur',
  });

  const { data: creditLimit, isLoading } = useQuery({
    queryKey: ['credit-limit'],
    queryFn: fetchCreditLimit,
  });

  const handleVerifyGuarantor = async () => {
    const email = methods.getValues('guarantorEmail');
    if (!email) {
      setVerificationError('Please enter guarantor email');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    
    try {
      const guarantorData = await verifyGuarantor(email);
      
      // Auto-fill the guarantor fields with the response data
      methods.setValue('guarantorName', guarantorData.name);
      methods.setValue('guarantorPhone', guarantorData.phone);
      // methods.setValue('guarantorUsername', guarantorData.username);
    } catch (error) {
      setVerificationError('Failed to verify guarantor. Please check the email and try again.');
      console.error(error);
      // Clear fields if verification fails
      methods.setValue('guarantorName', '');
      methods.setValue('guarantorPhone', '');
      // methods.setValue('guarantorUsername', '');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGuarantorMemberChange = (value: string) => {
    methods.setValue('guarantorIsMember', value);
    // Clear fields when switching between member types
    methods.setValue('guarantorEmail', '');
    methods.setValue('guarantorName', '');
    methods.setValue('guarantorPhone', '');
    // methods.setValue('guarantorUsername', '');
    setVerificationError('');
  };

  const handleNext = async () => {
    let schema;
    if (step === 1) schema = step1Schema;
    if (step === 2) schema = step2Schema;
    if (step === 3) schema = step3Schema;
    if (step === 4) schema = step4Schema;

    const values = methods.getValues();
    try {
      schema?.parse(values);
      
      // Mark step as completed
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }

      if (step === 2) {
        // Instead of going straight to step 3, show preview
        setShowPreview(true);
      } else if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit(values);
      }
    } catch {
      methods.trigger();
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = (values: LoanFormValues) => {
    console.log('Submitting loan request:', values);
    // axios.post('/api/loans', values);
    onClose();
  };

  // Progress bar steps
  const steps = [
    { number: 1, label: 'Personal Information' },
    { number: 2, label: 'Further Details' },
    { number: 3, label: 'Document Upload' },
    { number: 4, label: 'Review' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-green-800">Loan Request</h2>
        
        {/* Progress Bar */}
        <div className="mb-8 relative w-full">
          {/* Full dotted baseline */}
          <div className="absolute top-3 left-0 right-0 border-t-2 border-dotted border-gray-300"></div>

          {/* Green progress line (length depends on step) */}
          {/* <div
    className="absolute top-3 left-0 h-[2px] bg-green-500 transition-all duration-500"
    style={{
      width: `${((step - 1) / (steps.length - 1.2)) * 100}%`, // grows with step
    }}
  ></div> */}
          <Progress
            // value={((step - 1) / (steps.length - 1)) * 100}
            // value={(step / steps.length) * 100}
            className="absolute top-3 left-0 h-[2px] bg-green-500 transition-all duration-500"
            style={{
              width: `${((step - 0.6) / (steps.length - 0.2)) * 100}%`, // grows with step
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
                    <div className="w-6 h-6"></div> // keep spacing consistent
                  )}

                  {/* Label */}
                  <span
                    className={`mt-2 mr-4 md:mr-1 text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credit Limit Display */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-green-500">
            {isLoading ? (
              'Loading credit limit...'
            ) : (
              <>
                Your credit limit:{' '}
                <span className="font-semibold text-gray-700">
                  ₦{creditLimit?.toLocaleString() || '100,000'}
                </span>
              </>
            )}
            
          </p>
          <div className="text-xs text-center text-white w-4 h-4 bg-green-500 rounded-full">?</div>
        </div>


        <FormProvider {...methods}>
          <Form {...methods}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">First Name</label>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            className='h-11 bg-green-50'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">Middle Name</label>
                        <FormControl>
                          <Input
                            placeholder="Enter middle name"
                            {...field}
                            className='h-11 bg-green-50'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">Last Name</label>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} className='h-11 bg-green-50' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Email</label>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} className='h-11 bg-green-50' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Phone Number</label>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                            +234
                          </span>
                          <Input 
                            placeholder="e.g 8031234567" 
                            {...field}
                            className='h-11 bg-green-50 rounded-l-none'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <FormField
                  control={methods.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Address</label>
                      <FormControl>
                        <Textarea
                          placeholder="Enter address"
                          {...field}
                          rows={3}
                          className='bg-green-50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">State</label>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} className='h-11 bg-green-50' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-sm font-medium">City</label>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} className='h-11 bg-green-50' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Guarantor Section */}
                <div className="border-t pt-4">
                  <FormField
                    control={methods.control}
                    name="hasGuarantor"
                    render={({ field }) => (
                      <FormItem>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={field.value} 
                            // {...field}
                            onChange={field.onChange} 
                          />
                          <span className="text-sm font-medium">Add a Guarantor</span>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {methods.watch('hasGuarantor') && (
                    <div
                      className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <FormField
  control={methods.control}
  name="guarantorIsMember"
  render={({ field }) => (
    <FormItem className="flex  space-x-3">
      <label className="text-sm font-medium mt-2 ">
        Is Guarantor a MegaCoop Member?
      </label>
      <div className="flex flex-col space-y-1"> 
        <Select onValueChange={handleGuarantorMemberChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage  />
      </div>
      
    </FormItem>
  )}
/>


                      {methods.watch('guarantorIsMember') === 'yes' && (
                        <>
                          <div
                            className="flex gap-2 items-end"
                            
                            
                          >
                            <FormField
                              control={methods.control}
                              name="guarantorEmail"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <label className="text-sm font-medium">Guarantor Email</label>
                                  <FormControl>
                                    <Input 
                                      type="email" 
                                      placeholder="Enter guarantor email" 
                                      {...field} 
                                      className="bg-green-50 h-11"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button 
                              type="button" 
                              onClick={handleVerifyGuarantor}
                              disabled={isVerifying}
                              className="mt-1 bg-green-600 hover:bg-green-700 text-white h-11 pointer-events-auto"
                            >
                              {isVerifying ? 'Verifying...' : 'Verify'}
                            </Button>
                            
                          </div>
                          {verificationError && (
                            <p className="text-sm text-red-500">{verificationError}</p>
                          )}

                          <FormField
                            control={methods.control}
                            name="guarantorName"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Guarantor Name</label>
                                <FormControl>
                                  <Input 
                                    placeholder="Guarantor name" 
                                    {...field} 
                                    readOnly 
                                    className="bg-green-50 h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={methods.control}
                            name="guarantorPhone"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Phone Number</label>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                      +234
                                    </span>
                                    <Input 
                                      className="rounded-l-none bg-green-50 h-11" 
                                      placeholder="Phone number" 
                                      {...field} 
                                      readOnly
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* <FormField
                            control={methods.control}
                            name="guarantorUsername"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Guarantor Username</label>
                                <FormControl>
                                  <Input 
                                    placeholder="Guarantor username" 
                                    {...field} 
                                    readOnly 
                                    className="bg-green-50 h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                        </>
                      )}

                      {methods.watch('guarantorIsMember') === 'no' && (
                        <>
                          <FormField
                            control={methods.control}
                            name="guarantorName"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Guarantor Full Name</label>
                                <FormControl>
                                  <Input placeholder="Enter guarantor full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={methods.control}
                            name="guarantorEmail"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Guarantor Email</label>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="Enter guarantor email" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={methods.control}
                            name="guarantorPhone"
                            render={({ field }) => (
                              <FormItem>
                                <label className="text-sm font-medium">Phone Number</label>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                      +234
                                    </span>
                                    <Input 
                                      className="rounded-l-none" 
                                      placeholder="Enter phone number" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other steps remain the same */}
            {step === 2 && (
              <>
              {/* <div className=""> */}
                <FormField
                  control={methods.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem className="pb-2 w-1/3 mx-auto">
                      {/* <label className="text-sm font-medium">Loan Amount (₦)</label> */}
                      <FormControl>
                        <Input
                          type="number"
                          min={1000}
                          max={creditLimit ?? undefined}
                          step={1000}
                          placeholder="Enter loan amount"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="h-11 text-center w-full font-bold rounded-none text-3xl border-0 border-b border-gray-300 shadow-none"
                          style={{fontSize: '1rem'}}
                          readOnly
                        />
                      </FormControl>
                      {/* <p className="text-xs text-gray-500">
                        {isLoading ? 'Loading credit limit...' : `Credit limit: ₦${creditLimit?.toLocaleString()}`}
                      </p> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between mb-6 gap-2">
                  <p className="flex flex-col items-center mb-4">
                    <span className="font-medium text-sm">₦1000</span>
                    <span className="text-xs text-gray-500">Minimum</span>
                  </p>
                  <Input
                  type="range"
                  min={1000}
                  max={creditLimit ?? 100000}
                  step={1000}
                  className="w-full accent-green-500"
                  value={methods.watch('loanAmount') || 1000}
                  onChange={(e) => methods.setValue('loanAmount', Number(e.target.value))}
                />
                  <p className="flex flex-col items-center mb-4">
                    <span className="font-medium text-sm">₦{creditLimit?.toLocaleString() || '100,000'}</span>
                    <span className="text-xs text-gray-500">Maximum</span>
                  </p>
                </div>
                {/* </div> */}
                <div className="md:flex md:flex-col gap-4">
                <FormField
                                control={methods.control}
                                name="reason"
                                render={({ field }) => (
                                  // <FormItem>
                                  //   <label className="text-sm font-medium">Loan Type</label>
                                  //   <FormControl>
                                  //     <Input placeholder="Enter reason" {...field} />
                                  //   </FormControl>
                                  //   <FormMessage />
                                  // </FormItem>
                                  <FormItem className="flex flex-col items-start pb-2 md:w-[60%] mx-auto">
                      <label className="text-sm font-medium">Loan Type</label>
                      <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      >
                        <FormControl className="w-full h-11 bg-green-50">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Loan Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent >
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                                )}
                              />
                            
                
                <FormField
                  control={methods.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start pb-2 md:w-[60%] mx-auto">
                      <label className="text-sm font-medium">Loan Duration</label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-full h-11 bg-green-50">
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="repaymentFrequency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start pb-2 md:w-[60%] mx-auto">
                      <label className="text-sm font-medium">Repayment Frequency</label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-full h-11 bg-green-50">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='weekly'>Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="autoPayment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between gap-3 cursor-pointer space-x-2  md:w-[60%] mx-auto mb-1">
                      <div className="flex items-center justify-between gap-3 cursor-pointer">
                    <FormLabel className="flex items-center gap-3">
                        Auto Payment
                    </FormLabel>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className='bg-green-700' />
                </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                control={methods.control}
                name="agree"
                render={({ field }) => (
                  <FormItem className="flex flex-col pb-2 mx-auto">
                    <label className="flex mt-2 text-sm md:justify-center text-sm text-gray-700 gap-2">
                      <input type="checkbox" checked={field.value} onChange={field.onChange} className='items-start' />
                      {/* <span className='break-words text-center' >I agree to the <Link className='text-green-500' to="/terms">terms & conditions</Link> and <Link className='text-green-500' to="/privacy">privacy policy</Link></span> */}
                      <span className="break-words text-center">
          I agree to the{' '}
          <Link className="text-green-500 underline underline-offset-2" to="/terms">
            terms & conditions
          </Link>{' '}
          and{' '}
          <Link className="text-green-500 underline underline-offset-2" to="/privacy">
            privacy policy
          </Link>
        </span>
                    </label>
                    <FormMessage className="items-start" />
                  </FormItem>
                )}
                  />
                </div>
                <div className="flex align-middle mt-2 justify-center md:w-[100%] mx-auto">
                  <img src={LoanImage1} alt="Loan Request 1" className="w-1/2 md:w-1/3 object-contain" />
                  <img src={LoanImage2} alt="Loan Request 2" className="w-1/2 md:w-1/3 object-contain" />
                </div>
              </>
            )}

            {step === 3 && (
              <FormField
                control={methods.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">Upload Documents</label>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 4 && (
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
            )}
          </Form>
        </FormProvider>

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button className="bg-green-500 hover:bg-green-600" onClick={handleNext}>{step === 4 ? 'Submit' : 'Next'}</Button>
        </div>
      </div>

      {/* step 2 preview modal integration */}
      <LoanPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={() => {
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
      />
    </div>
  );
};

export default LoanModal;