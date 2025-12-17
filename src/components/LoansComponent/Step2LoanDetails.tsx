import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from "../ui/switch";
// import { Link } from 'react-router-dom';
import LoanImage1 from "../../assets/loan-request-image1.png";
import LoanImage2 from "../../assets/loan-request-image2.png";
import type { StepProps } from '../../types/loanTypes';

export const Step2LoanDetails = ({
    methods,
    creditLimit,
    // isLoading
}: StepProps) => {
    return (
        <>
            {(creditLimit?.credit_limit ?? 0) > 1000 ? (
            <>
                <FormField
                control={methods.control}
                name="loanAmount"
                render={({ field }) => (
                    <FormItem className="pb-2 w-1/3 mx-auto">
                        <FormControl>
                            <Input
                                type="number"
                                min={1000}
                                max={creditLimit?.credit_limit}
                                step={1000}
                                placeholder="Enter loan amount"
                                {...field}
                                value={field.value ?? 1000}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="h-11 text-center w-full font-bold rounded-none text-3xl border-0 border-b border-gray-300 shadow-none"
                                style={{ fontSize: '1rem' }}
                                // readOnly
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            
            {/* Range slider, loan type, duration, frequency, auto payment, agreement */}
            <div className="flex justify-between mb-6 gap-2">
                <p className="flex flex-col items-center mb-4">
                    <span className="font-medium text-sm">₦1000</span>
                    <span className="text-xs text-gray-500">Minimum</span>
                </p>
                <Input
                    type="range"
                    min={1000}
                    max={creditLimit?.credit_limit ?? 100000}
                    step={1000}
                    className="w-full accent-green-500"
                    value={methods.watch('loanAmount') || 1000}
                    onChange={(e) => methods.setValue('loanAmount', Number(e.target.value))}
                />
                <p className="flex flex-col items-center mb-4">
                    <span className="font-medium text-sm">₦{creditLimit?.credit_limit?.toLocaleString() || '100,000'}</span>
                    <span className="text-xs text-gray-500">Maximum</span>
                </p>
            </div>
            </>
            ) : (
                <div className="p-4 mb-6 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
                    <span className="font-medium">Notice:</span> Your credit limit is too low to request a loan. Please contact support for assistance.
                </div>
            )}
            <div className="md:flex md:flex-col gap-4">
                <FormField
                    control={methods.control}
                    name="reason"
                    render={({ field }) => (
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
                                    <SelectItem value="1">1 month</SelectItem>
                                    <SelectItem value="2">2 months</SelectItem>
                                    <SelectItem value="3">3 months</SelectItem>
                                    <SelectItem value="4">4 months</SelectItem>
                                    <SelectItem value="5">5 months</SelectItem>
                                    <SelectItem value="6">6 months</SelectItem>
                                    <SelectItem value="9">9 months</SelectItem>
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
                                    <SelectItem value='week'>Weekly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                    {/* <SelectItem value="quarterly">Quarterly</SelectItem> */}
                                    {/* only show quarterly if user selects duration 3,6,9,12 months */}
                                    {methods.watch('duration') && ['3', '6', '9', '12'].includes(methods.watch('duration')) && (
                                        <SelectItem value="quarter">Quarterly</SelectItem>
                                    )}
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

                {/* <FormField
                    control={methods.control}
                    name="agree"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pb-2 mx-auto">
                            <label className="flex mt-2 text-sm md:justify-center text-sm text-gray-700 gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className='items-start' />
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
                /> */}
            </div>
            <div className="flex align-middle mt-2 justify-center md:w-[100%] mx-auto">
                <img src={LoanImage1} alt="Loan Request 1" className="w-1/2 md:w-1/3 object-contain" />
                <img src={LoanImage2} alt="Loan Request 2" className="w-1/2 md:w-1/3 object-contain" />
            </div>
        </>
    );
};