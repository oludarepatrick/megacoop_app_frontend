import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import type { StepProps } from '../../types/loanTypes';

export const Step1PersonalInfo = ({
    methods,
    isVerifying,
    verificationError,
    onVerifyGuarantor,
    onGuarantorMemberChange
}: StepProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <label className="text-sm font-medium">First Name</label>
                            <FormControl>
                                <Input placeholder="Enter first name" {...field} className='h-11 bg-green-50' />
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
                                <Input placeholder="Enter middle name" {...field} className='h-11 bg-green-50' />
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

            {/* Email, Phone, Address, State, City, Guarantor Section */}
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
                <p className="text-lg text-green-500 font-medium ">Add a Guarantor</p>
                
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <FormField
                            control={methods.control}
                            name="guarantorIsMember"
                            render={({ field }) => (
                                <FormItem className="flex space-x-3">
                                    <label className="text-sm font-medium mt-2">Is Guarantor a MegaCoop Member?</label>
                                    <div className="flex flex-col space-y-1">
                                        <Select onValueChange={onGuarantorMemberChange} defaultValue={field.value}>
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
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Member and Non-member guarantor fields... */}
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
                                        onClick={onVerifyGuarantor}
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

                                {/* <FormField
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
                                                <Input placeholder="Enter guarantor full name" {...field} className="bg-green-50 h-11" />
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
                
            </div>
        </div>
    );
};