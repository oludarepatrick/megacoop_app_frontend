import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import AccountSetupModal from "@/components/AccountSetupModal";
import { useAuthStore } from "@/store/authStore";
import profileAvatar from "@/assets/profile-avatar.png"
import { Landmark } from "lucide-react";
import { useAccountInfo } from "@/hooks/useProfile";


export default function Profile() {
    const {user} = useAuthStore();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

    const {data: accountData, isLoading} = useAccountInfo();
    console.log(accountData)

    const userAccountDetails = accountData?.[0]


    return (
        <div className="font-poppins rounded-xl shadow-sm space-y-6 pb-4 px-4 sm:px-0" >
            <div className="flex gap-6 items-center p-4 border-b-2 border-b-megagreen/60 shadow-lg">
                <div>
                    <img src={user?.passport || profileAvatar} alt="user profile image" />
                </div>
                <div>
                    <h2 className="font-semibold text-lg">{[user?.first_name, user?.middle_name, user?.last_name].join(" ")}</h2>
                    <p className="text-muted-foreground text-sm">Member ID: {user?.member_id}</p>
                </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
                <span className="text-megagreen font-semibold bg-[#D2EEDE] text-xs p-1 inline-block">Personal Information</span>
                <div>
                    <p className="text-muted-foreground">First Name</p>
                    <p className="font-medium">{user?.first_name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Middle Name</p>
                    <p className="font-medium">{user?.middle_name || "Nil"}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Last Name</p>
                    <p className="font-medium">{user?.last_name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">D.O.B</p>
                    <p className="font-medium">{user?.dob}</p>
                </div>
            </div>
            {isLoading ? (
                <div className="text-muted-foreground text-sm px-6">
                    Loading your bank details...
                    </div>
                ) : accountData?.length === 0 ? "" : (
                <div className="flex justify-between items-center flex-wrap gap-4 sm:max-w-lg w-full border-2 border-megagreen/60 rounded-lg p-4 sm:mx-4">
                    <div className="flex gap-6 items-center">
                        <span className="block bg-megaorange/30 p-2 rounded-sm text-megagreen">

                            <Landmark />
                        </span>
                    
                        <div className="space-y-3">
                            <div>
                                <p className="text-megagreen font-medium">Bank Name</p>
                                <p className="text-sm text-muted-foreground">{userAccountDetails?.bank_name}</p>
                            </div>
                            <div>
                                <p className="text-megagreen font-medium">Account Name</p>
                                <p className="text-sm text-muted-foreground">{userAccountDetails?.account_holder_name}</p>
                            </div>
                        </div>
                    </div>
                    <span className="inline-block text-lg text-megagreen bg-megagreen/30 p-2 font-semibold rounded-sm max-w-[150px] w-full text-center">{userAccountDetails?.account_number || 1234678351}</span>
                </div>)

            }
            {
                userAccountDetails ? (
                    <Button className={cn("bg-megagreen hover:bg-emerald-500 text-xs sm:mx-4 ",
                        isLoading ? "hidden" : ""
                    )}
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        Update Bank Details
                    </Button>
                ): (
                    <Button className={cn("bg-megagreen hover:bg-emerald-500 text-xs sm:mx-4",
                        isLoading ? "hidden" : ""
                    )}
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        Add Bank Details
                    </Button>
                )
            }
            <AccountSetupModal open={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
        </div>
    )
}



// import { useEffect, useState } from "react"
// // import { useQuery } from "@tanstack/react-query";
// // import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils";
// // import { formatCurrency, formatDate } from "@/common/utils";
// import AccountSetupModal from "@/components/AccountSetupModal";
// // import PageLoader from "@/components/PageLoader";
// // import type { Loan } from "@/types/loanTypes";
// import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
// import { useForm } from "react-hook-form";
// import { combinedSchema, type ProfileDetailsData } from "@/schemas/profileSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { useAuthStore } from "@/store/authStore";
// import { Label } from '@radix-ui/react-label';


// export default function Profile() {
//     const userProfileDetails = useAuthStore(state => state.user);
//     const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

//     const profileDetailsForm = useForm<ProfileDetailsData>({
//         resolver: zodResolver(combinedSchema),
//         defaultValues: {
//             first_name: userProfileDetails?.first_name || "",
//             middle_name: userProfileDetails?.middle_name || "",
//             last_name: userProfileDetails?.last_name || "",
//             email: userProfileDetails?.email || "",
//             phone: userProfileDetails?.phone || "",
//             gender: "",
//             dob: "",
//             age_range: "",
//             bank_name: "",
//             account_number: "",
//             account_holder_name: "",
//         },
//     });


//     // 👇 whenever loansData or creditLimitData changes, sync it to local state
//     useEffect(() => {


//     }, []);

// return (
//         <div className="space-y-8 min-h-screen">

//             <Form {...profileDetailsForm}>
//                 <div className="space-y-7 w-full rounded-lg">
//                     {/* <form className="space-y-7"> */}
//                     {/* Personal info form fields */}
//                     <h3 className="text-sm text-green-200 bg-green-800 w-fit px-2 py-1 rounded">Personal Information</h3>
//                     <div className="grid grid-cols-1  md:grid-cols-2 gap-7 ">
//                         <FormField
//                             // control={personalInfoForm.control}
//                             control={profileDetailsForm.control}
//                             defaultValue={userProfileDetails?.first_name || ""}

//                             name="first_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Label htmlFor="first_name" className="">First Name</Label>
//                                     <FormControl>
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="First name"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             // control={personalInfoForm.control}
//                             control={profileDetailsForm.control}
//                             defaultValue={userProfileDetails?.middle_name || ""}
//                             name="middle_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Label htmlFor="middle_name" className="">Middle Name</Label>
//                                     <FormControl>
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Middle name"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     {/* ... other personal info fields */}
//                     <div className="grid grid-cols-1  md:grid-cols-2 gap-7 ">
//                         <FormField
//                             // control={personalInfoForm.control}
//                             control={profileDetailsForm.control}
//                             defaultValue={userProfileDetails?.last_name || ""}
//                             name="last_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Label htmlFor="last_name" className="">Last Name</Label>
//                                     <FormControl>
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Last name" {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             // control={personalInfoForm.control}
//                             control={profileDetailsForm.control}
//                             defaultValue={userProfileDetails?.email || ""}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Label htmlFor="email" className="">Email</Label>
//                                     <FormControl>
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Email"
//                                             type="email" {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//                         <FormField
//                             control={profileDetailsForm.control}
//                             defaultValue={userProfileDetails?.phone || ""}
//                             name="phone"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Label htmlFor="phone" className="">Phone</Label>
//                                     <FormControl>
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Phone"
//                                             {...field}
//                                             // readOnly={!!userProfileDetails?.phone}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             // control={personalInfoForm.control}
//                             control={profileDetailsForm.control}
//                             name="dob"
//                             render={({ field }) => (
//                                 <FormItem className="w-full">
//                                     <Label htmlFor="dob" className="">DOB</Label>
//                                     <FormControl >
//                                         <Input
//                                             placeholder="DOB"
//                                             className={`w-full h-11 pr-3 appearance-none [&::-webkit-datetime-edit]:text-left [&::-webkit-datetime-edit]:pl-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:!right-[30px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:flex`}
//                                             type="date"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <h3 className="text-sm text-green-200 bg-green-800 w-fit px-2 py-1 rounded">Account Information</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//                         <FormField
//                             // control={accountInfoForm.control}
//                             control={profileDetailsForm.control}
//                             name="bank_name"
//                             render={({ field }) => (
//                                 <FormItem className="w-full ">
//                                     <Label htmlFor="bank_name" className="">Bank Name</Label>
//                                     <FormControl >
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Bank Name"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             // control={accountInfoForm.control}
//                             control={profileDetailsForm.control}
//                             name="account_number"
//                             render={({ field }) => (
//                                 <FormItem className="w-full ">
//                                     <Label htmlFor="account_number" className="">Account Number</Label>
//                                     <FormControl >
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Account Number"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//                         <FormField
//                             // control={accountInfoForm.control}
//                             control={profileDetailsForm.control}
//                             name="account_holder_name"
//                             render={({ field }) => (
//                                 <FormItem className="w-full ">
//                                     <Label htmlFor="account_name" className="">Account Name</Label>
//                                     <FormControl >
//                                         <Input
//                                             className='h-11 bg-green-50'
//                                             placeholder="Account Name"
//                                             {...field}
//                                             readOnly
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                 </div>
//             </Form>


//             <Button
//                 // disabled={remainingLimit <= 0}
//                 className={cn(
//                     "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto",

//                 )}
//                 onClick={() => setIsAccountModalOpen(true)}
//             >
//                 Set up Account
//             </Button>


//             <AccountSetupModal open={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
//         </div>
//     )
// }
