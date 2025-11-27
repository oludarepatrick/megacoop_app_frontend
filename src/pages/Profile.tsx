import { useEffect, useState } from "react"
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
// import { formatCurrency, formatDate } from "@/common/utils";
import AccountSetupModal from "@/components/AccountSetupModal";
// import PageLoader from "@/components/PageLoader";
// import type { Loan } from "@/types/loanTypes";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from "react-hook-form";
import { combinedSchema, type ProfileDetailsData } from "@/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Label } from '@radix-ui/react-label';


export default function Profile() {
    const userProfileDetails = useAuthStore(state => state.user);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

    const profileDetailsForm = useForm<ProfileDetailsData>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            first_name: userProfileDetails?.first_name || "",
            middle_name: userProfileDetails?.middle_name || "",
            last_name: userProfileDetails?.last_name || "",
            email: userProfileDetails?.email || "",
            phone: userProfileDetails?.phone || "",
            gender: "",
            dob: "",
            age_range: "",
            bank_name: "",
            account_number: "",
            account_holder_name: "",
        },
    });



    // const navigate = useNavigate();

    // --- Queries with dummy fallback using || so you can remove the fallback when API is ready
    //   const { data: creditLimitData, isLoading: creditLoading } = useQuery({
    //     queryKey: ["credit-limit"],
    //     queryFn: async () => {
    //       try {
    //         const v = await fetchCreditLimit();
    //         return v;
    //       } catch {
    //         // fallback dummy value
    //         return 65000; // dummy
    //       }
    //     },
    //   });



    // 👇 whenever loansData or creditLimitData changes, sync it to local state
    useEffect(() => {


    }, []);

return (
        <div className="space-y-8 min-h-screen">

            <Form {...profileDetailsForm}>
                <div className="space-y-7 w-full rounded-lg">
                    {/* <form className="space-y-7"> */}
                    {/* Personal info form fields */}
                    <h3 className="text-sm text-green-200 bg-green-800 w-fit px-2 py-1 rounded">Personal Information</h3>
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-7 ">
                        <FormField
                            // control={personalInfoForm.control}
                            control={profileDetailsForm.control}
                            defaultValue={userProfileDetails?.first_name || ""}

                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="first_name" className="">First Name</Label>
                                    <FormControl>
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="First name"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            // control={personalInfoForm.control}
                            control={profileDetailsForm.control}
                            defaultValue={userProfileDetails?.middle_name || ""}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="middle_name" className="">Middle Name</Label>
                                    <FormControl>
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Middle name"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* ... other personal info fields */}
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-7 ">
                        <FormField
                            // control={personalInfoForm.control}
                            control={profileDetailsForm.control}
                            defaultValue={userProfileDetails?.last_name || ""}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="last_name" className="">Last Name</Label>
                                    <FormControl>
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Last name" {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            // control={personalInfoForm.control}
                            control={profileDetailsForm.control}
                            defaultValue={userProfileDetails?.email || ""}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="email" className="">Email</Label>
                                    <FormControl>
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Email"
                                            type="email" {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <FormField
                            control={profileDetailsForm.control}
                            defaultValue={userProfileDetails?.phone || ""}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="phone" className="">Phone</Label>
                                    <FormControl>
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Phone"
                                            {...field}
                                            // readOnly={!!userProfileDetails?.phone}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            // control={personalInfoForm.control}
                            control={profileDetailsForm.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <Label htmlFor="dob" className="">DOB</Label>
                                    <FormControl >
                                        <Input
                                            placeholder="DOB"
                                            className={`w-full h-11 pr-3 appearance-none [&::-webkit-datetime-edit]:text-left [&::-webkit-datetime-edit]:pl-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:!right-[30px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:flex`}
                                            type="date"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h3 className="text-sm text-green-200 bg-green-800 w-fit px-2 py-1 rounded">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <FormField
                            // control={accountInfoForm.control}
                            control={profileDetailsForm.control}
                            name="bank_name"
                            render={({ field }) => (
                                <FormItem className="w-full ">
                                    <Label htmlFor="bank_name" className="">Bank Name</Label>
                                    <FormControl >
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Bank Name"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            // control={accountInfoForm.control}
                            control={profileDetailsForm.control}
                            name="account_number"
                            render={({ field }) => (
                                <FormItem className="w-full ">
                                    <Label htmlFor="account_number" className="">Account Number</Label>
                                    <FormControl >
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Account Number"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <FormField
                            // control={accountInfoForm.control}
                            control={profileDetailsForm.control}
                            name="account_holder_name"
                            render={({ field }) => (
                                <FormItem className="w-full ">
                                    <Label htmlFor="account_name" className="">Account Name</Label>
                                    <FormControl >
                                        <Input
                                            className='h-11 bg-green-50'
                                            placeholder="Account Name"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </Form>


            <Button
                // disabled={remainingLimit <= 0}
                className={cn(
                    "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto",

                )}
                onClick={() => setIsAccountModalOpen(true)}
            >
                Set up Account
            </Button>


            <AccountSetupModal open={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
        </div>
    )
}
