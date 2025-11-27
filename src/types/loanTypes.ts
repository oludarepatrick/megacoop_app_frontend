import * as z from 'zod';

// Step schemas
export const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().min(1, 'Middle name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required').max(15, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
//   hasGuarantor: z.boolean().refine((val) => val === true, 'You must add a guarantor to proceed'),
  guarantorIsMember: z.string().min(1, 'Select an option'),
  guarantorEmail: z.string().email('Invalid email address').min(1, 'Guarantor email is required'),
  guarantorFirstname: z.string().min(1, 'Guarantor name is required'),
  guarantorLastname: z.string().min(1, 'Guarantor last name is required'),
  guarantorPhone: z.string().min(1, 'Guarantor phone number is required'),
});

export const step2Schema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  loanAmount: z.number().min(1000, 'Minimum loan is ₦1,000'),
  duration: z.string().min(1, 'Select duration'),
  repaymentFrequency: z.string().min(1, 'Select repayment frequency'),
  autoPayment: z.boolean(),
  // agree: z.boolean().refine((val) => val === true, 'You must agree before submitting'),
});


// step3Schema for document uploads
export const step3Schema = z.object({
  documents: z.array(z.instanceof(File)).min(4, 'Please upload all required documents'),
});

export const step4Schema = z.object({
  agree: z.boolean().refine((val) => val === true, 'You must agree before submitting'),
});

// Merge schemas for global form
export const formSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

export type LoanFormValues = z.infer<typeof formSchema>;

export type StepProps = {
  methods: any;
  creditLimit?: CreditLimit;
  isLoading?: boolean;
  isVerifying?: boolean;
  verificationError?: string;
  onVerifyGuarantor?: () => void;
  onGuarantorMemberChange?: (value: string) => void;
  alert?: { title: string; description: string } | null;
  setAlert?: React.Dispatch<React.SetStateAction<{ title: string; description: string } | null>>;
  loanApplicationId?: string | null;
  setLoanApplicationId?: React.Dispatch<React.SetStateAction<string | null>>;
};

export type Loan = {
  id: string;
  name: string;
  amount: number;
  repaymentDate: string; // ISO date
  status: "disbursed" | "active" | "overdue" | "paid" | "pending";
  // progress 0..100 percent (how much of loan already repaid)
  progress?: number;
  // any other fields the loan details page will need
};

export type CreditLimit = {
  credit_limit: number;
  remaining_limit: number;
  total_borrowed: number;
  total_savings: number;
  utilization_percentage: number;
};

export type CalculateLoan = {
  schedule: {
    month: number;
    principalPaid: number;
    interest: number;
    total: number;
    balance: number;
  }[];
  totalInterest: number;
  totalPayable: number;
  installment: number;
  numberOfPayments: number;
};
