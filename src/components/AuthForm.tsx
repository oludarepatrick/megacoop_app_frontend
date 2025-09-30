import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageLoader from '@/components/PageLoader';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import megacoop_logo from '../assets/megacoop-logo-1.png';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import ConfirmSignIn from '../pages/auth/ConfirmLogin';
import { formConfig, jsonConfig } from '@/common/utils';
import ProgressSteps from './AuthProgressSteps';
import VerificationStep from './AuthVerificationStep';

// Zod schemas
const accessCodeSchema = z.object({
    code: z.string().nonempty("Access code is required").length(8, "Put in your 8 digit access code"),
});

const personalInfoSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().min(1, "Middle name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    age_range: z.string().min(1, "Age range is required"),
    code: z.string().optional(),
});

const accountInfoSchema = z.object({
    address: z.string().min(1, "Home address is required"),
    whatshapp_no: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// const combinedSchema = personalInfoSchema.merge(accountInfoSchema);
const combinedSchema = personalInfoSchema.and(accountInfoSchema);


const verificationSchema = z.object({
    verificationCode: z.string().min(1, "Verification code is required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// Types
type AccessCodeFormData = z.infer<typeof accessCodeSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;
type CombinedFormData = z.infer<typeof combinedSchema>;
type CombinedAccessCodeData = AccessCodeFormData & PersonalInfoFormData & AccountInfoFormData;
type LoginFormData = z.infer<typeof loginSchema>;
type FinalSubmitData = Omit<z.infer<typeof combinedSchema>,"first_name" | "middle_name" | "last_name" | "email" | "phone">;

interface AuthFormProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    signUpStep: number;
    onSignUpStepChange: (step: number) => void;
    loginStep: number;
    onLoginStepChange: (step: number) => void;
    userEmail: string;
    userPhone: string;
    loginEmail: string;
    setShowSuccessModal: (show: boolean) => void;
    onError: (message: string) => void;
    onUserEmailChange: (email: string) => void;
    onUserPhoneChange: (phone: string) => void;
    onLoginEmailChange: (email: string) => void;
    API_BASE_URL: string;
    imgHeight?: number;
    setShowCongratulationsModal: (show: boolean) => void;
}

const AuthForm = ({
    activeTab,
    onTabChange,
    signUpStep,
    onSignUpStepChange,
    loginStep,
    onLoginStepChange,
    userEmail,
    userPhone,
    loginEmail,
    setShowSuccessModal,
    onError,
    onLoginEmailChange,
    API_BASE_URL,
    imgHeight,
    setShowCongratulationsModal,
}: AuthFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [userProfileDetails, setUserProfileDetails] = useState<CombinedAccessCodeData | null>(null);
    const [emailTimer, setEmailTimer] = useState(30);
    const [phoneTimer, setPhoneTimer] = useState(30);
    const [emailTimerActive, setEmailTimerActive] = useState(true);
    const [phoneTimerActive, setPhoneTimerActive] = useState(true);
    console.log("userProfileDetails", userProfileDetails);
    const navigate = useNavigate();
    

     useEffect(() => {
        let emailInterval: NodeJS.Timeout;
        if (emailTimerActive && emailTimer > 0) {
            emailInterval = setInterval(() => {
                setEmailTimer((prev) => prev - 1);
            }, 1000);
        } else if (emailTimer === 0) {
            setEmailTimerActive(false);
        }
        return () => clearInterval(emailInterval);
    }, [emailTimerActive, emailTimer]);

    useEffect(() => {
        let phoneInterval: NodeJS.Timeout;
        if (phoneTimerActive && phoneTimer > 0) {
            phoneInterval = setInterval(() => {
                setPhoneTimer((prev) => prev - 1);
            }, 1000);
        } else if (phoneTimer === 0) {
            setPhoneTimerActive(false);
        }
        return () => clearInterval(phoneInterval);
    }, [phoneTimerActive, phoneTimer]);

    // API mutations
    const verifyAccessCode = useMutation({
        mutationFn: (accessCode: string) => {
            return axios.post(`${API_BASE_URL}user/validate-code`, { code: accessCode });
        },
        onSuccess: (response) => {
            console.log("response", response)
            setUserProfileDetails(response.data);
            setShowSuccessModal(true);
            // onSignUpStepChange(2);
            
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid access code");
            console.log("error", error)
        },
    });

    const sendEmailVerification = useMutation({
    mutationFn: () => {
        const formData = new FormData();
        formData.append('email', userProfileDetails?.email || '');
        return axios.post(`${API_BASE_URL}user/send-email-verification-token`, formData, formConfig);
    },
    onSuccess: () => {
        console.log("Email verification code sent successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
        onError(error.response?.data?.message || "Error sending email verification code");
    },
    });
    
    const sendLoginEmailVerification = useMutation({
        mutationFn: () => {
            const { email } = loginForm.getValues();
            onLoginEmailChange(email);
            const formData = new FormData();
            formData.append('email', email);
            return axios.post(`${API_BASE_URL}user/send-login-verification-otp`, formData, formConfig);
        },
        onSuccess: (response) => {
            console.log("Login email verification code sent successfully", response);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error sending login email verification code");
        },
    });

const sendPhoneVerification = useMutation({
    mutationFn: () => {
        const formData = new FormData();
        formData.append('phone', userProfileDetails?.phone || '');
        return axios.post(`${API_BASE_URL}user/send-phone-verification-otp`, formData, formConfig);
    },
    onSuccess: () => {
        console.log("Phone verification code sent successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
        onError(error.response?.data?.message || "Error sending phone verification code");
    },
});

    // Resend code mutation
    const resendCode = useMutation({
        mutationFn: (type: 'email' | 'phone') => {
            const endpoint = type === 'email' ? 'user/send-email-verification-token' : 'user/send-phone-verification-otp';
            const formData = new FormData();
            if (type === 'email') {
                formData.append('email', userProfileDetails?.email || userEmail);
            } else {
                formData.append('phone', userProfileDetails?.phone || userPhone);
            }
            return axios.post(`${API_BASE_URL}${endpoint}`, formData, formConfig);
        },
        onSuccess: () => {
            if (resendCode.variables === 'email') {
                setEmailTimer(30);
                setEmailTimerActive(true);
            } else {
                setPhoneTimer(30);
                setPhoneTimerActive(true);
            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error resending code");
        },
    });


    const submitSignUpData = useMutation({
        mutationFn: (data: FinalSubmitData) => {
            const finalData = {
                ...data,
                code: userProfileDetails?.code,
                email: userProfileDetails?.email,
            };
            console.log("submitSignUpData finalData", finalData);
            return axios.post(`${API_BASE_URL}user/complete-signup`,
                // { ...data, code: userProfileDetails?.code },
                finalData,
                jsonConfig
            );
        },
        onSuccess: (response) => {
            console.log("submitSignUpData response", response);
            // onSignUpStepChange(6);
            setShowCongratulationsModal(true);
            onTabChange("login");
            onLoginStepChange(1);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error submitting information");
        },
    });

    const loginUser = useMutation({
        mutationFn: (data: LoginFormData) => {
            onLoginEmailChange(data.email);
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            return axios.post(`${API_BASE_URL}user/login`, formData, formConfig);
        },
        onSuccess: (response) => {
            // onLoginStepChange(2);
            console.log("loginUser response", response);
            // navigate to dashboard or home page after login 
            navigate("/user/dashboard");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error logging in");
            console.log("error", error)
        },
    });

    const verifyEmailCode = useMutation({
        mutationFn: (code: string) => {
            const formData = new FormData();
            formData.append('token', code);
            formData.append('email', userProfileDetails?.email || userEmail);
            return axios.post(`${API_BASE_URL}user/verify-email`, formData, formConfig);
        },
        onSuccess: () => {
            onSignUpStepChange(5);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid verification code");
        },
    });

    const verifyPhoneCode = useMutation({
        mutationFn: (code: string) => {
            const formData = new FormData();
            formData.append('token', code);
            formData.append('phone', userProfileDetails?.phone || userPhone);
            return axios.post(`${API_BASE_URL}user/verify-phone`, formData, formConfig);
        },
        onSuccess: () => {
            console.log("Phone verified successfully");
            console.log("signUpForm", signUpForm.getValues());
            console.log("is signUpForm valid", signUpForm.formState.isValid);
            // if (signUpForm.formState.isValid) {
            const data = signUpForm.getValues();
            onFinalSubmit(data);
            // }
            
            
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid verification code");
        },
    });

    // Forms
    const accessCodeForm = useForm<AccessCodeFormData>({
        resolver: zodResolver(accessCodeSchema),
        defaultValues: { code: "" },
    });

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });


    const signUpForm = useForm<CombinedFormData>({
  resolver: zodResolver(combinedSchema),
  defaultValues: {
    first_name: userProfileDetails?.first_name || "",
    middle_name: "",
    last_name: userProfileDetails?.last_name || "",
    email: userProfileDetails?.email || "",
    phone: userProfileDetails?.phone || "",
    gender: "",
    dob: "",
    age_range: "",
    address: "",
    whatshapp_no: "",
    password: "",
  },
});

    const verificationForm = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: { verificationCode: "" },
    });

    // Form handlers
    const onAccessCodeSubmit = (data: AccessCodeFormData) => {
        verifyAccessCode.mutate(data.code);
    };

    const onEmailVerificationSubmit = (data: VerificationFormData) => {
        verifyEmailCode.mutate(data.verificationCode);
    };

    const onPhoneVerificationSubmit = (data: VerificationFormData) => {
        verifyPhoneCode.mutate(data.verificationCode);
    };

    // Resend code handler
    const handleResendCode = (type: 'email' | 'phone') => {
        if (!resendCode.isPending) {
            resendCode.mutate(type);
        }
    };

    const onLoginSubmit = (data: LoginFormData) => {
        loginUser.mutate(data);
    };

    const handleBackToPersonalInfo = () => {
        onSignUpStepChange(2);
        if (userProfileDetails) {
            signUpForm.reset({
                ...signUpForm.getValues(), // keep other values
                first_name: userProfileDetails.first_name || "",
                last_name: userProfileDetails.last_name || "",
                email: userProfileDetails.email || "",
                phone: userProfileDetails.phone || "",
            });
        }
    };

    const onFinalSubmit = (data: CombinedFormData ) => {
    console.log("Final submit data", data);
    // destructure so we can keep email/phone but not send them
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, phone, first_name, middle_name, last_name, ...stripped } = data;
  

  // sending stripped fields to API
  submitSignUpData.mutate(stripped as FinalSubmitData);

    };

    const handleLoginProceed = async () => {
        const isLoginValid = await loginForm.trigger([
            "email",
            "password"
        ]);

        if (isLoginValid) {
            // Send email verification code
            try {
                const result = await sendLoginEmailVerification.mutateAsync();
                console.log("Login email verification code sent:", result);
                onLoginStepChange(2);
            } catch (error) {
                // Error handling is done in the mutation
                console.error("Failed to send login email verification code:", error);
            }
        }
    };

    const handleStep3Continue = async () => {
    const isValid = await signUpForm.trigger([
        "address",
        "password"
    ]);
    
    if (isValid) {
        // Send both email and phone verification codes
        try {
            const results = await Promise.all([
                sendEmailVerification.mutateAsync(),
                sendPhoneVerification.mutateAsync()
            ]);
            // If both calls successful, move to step 4
            console.log("Verification codes sent:", results);
            onSignUpStepChange(4);
        } catch (error) {
            // Error handling is done in the mutations
            console.error("Failed to send verification codes:", error);
        }
    }
};
    
    useEffect(() => {
  if (userProfileDetails) {
    signUpForm.reset({
      ...signUpForm.getValues(), // keep other values
      first_name: userProfileDetails.first_name || "",
      last_name: userProfileDetails.last_name || "",
      email: userProfileDetails.email || "",
      phone: userProfileDetails.phone || "",
    });
  }
}, [userProfileDetails, signUpForm]);


    

    const renderSignUpStep = () => {
        switch (signUpStep) {
            case 1:
                return (
                    <div>
                        <Form {...accessCodeForm}>
                            <form onSubmit={accessCodeForm.handleSubmit(onAccessCodeSubmit)} className="space-y-4">
                                <FormField
                                    control={accessCodeForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Access Code" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={verifyAccessCode.isPending}
                                    className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800 flex items-center justify-center gap-2"
                                >
                                    {verifyAccessCode.isPending ? <>Verifying... <PageLoader /></> : "Verify Now"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div className="text-center mb-6">
                            <ProgressSteps currentStep={signUpStep} totalSteps={4} />
                            <p className="text-sm text-[#14AB55] mb-6">
                                Please input your DOB, Gender and Age to proceed
                            </p>
                        </div>
                        <Form {...signUpForm}>
                            <div className="space-y-7 w-full rounded-lg">
                            {/* <form className="space-y-7"> */}
                                {/* Personal info form fields */}
                                <div className="grid grid-cols-1  md:grid-cols-2 gap-7 ">
                                    <FormField
                                        // control={personalInfoForm.control}
                                        control={signUpForm.control}
                                        defaultValue={userProfileDetails?.first_name || ""}
                                        
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
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
                                        control={signUpForm.control}
                                        defaultValue={userProfileDetails?.middle_name || ""}
                                        name="middle_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className='h-11' placeholder="Middle name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* ... other personal info fields */}
                                <FormField
                                    // control={personalInfoForm.control}
                                    control={signUpForm.control}
                                    defaultValue={userProfileDetails?.last_name || ""}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
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
                                    control={signUpForm.control}
                                    defaultValue={userProfileDetails?.email || ""}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
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
                                <FormField
                                    // control={personalInfoForm.control}
                                    control={signUpForm.control}
                                    defaultValue={userProfileDetails?.phone || ""}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                    <FormField
                                        // control={personalInfoForm.control}
                                        control={signUpForm.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="w-full ">
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full !h-11 min-h-0 px-3 py-0 flex items-center text-sm box-border">
                                                            <SelectValue placeholder="Gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        // control={personalInfoForm.control}
                                        control={signUpForm.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl >
                                                    <Input
                                                        placeholder="DOB"
                                                        // className="w-full h-11 appearance-none [&::-webkit-datetime-edit]:w-full [&::-webkit-datetime-edit-fields-wrapper]:flex [&::-webkit-datetime-edit-fields-wrapper]:w-full"
                                                        className={`
                                                          w-full h-11 pr-3
                                                          appearance-none 
                                                          [&::-webkit-datetime-edit]:text-left 
                                                          [&::-webkit-datetime-edit]:pl-0 
                                                          [&::-webkit-calendar-picker-indicator]:absolute 
                                                          [&::-webkit-calendar-picker-indicator]:!right-[30px] 
                                                          [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                          [&::-webkit-datetime-edit-fields-wrapper]:flex`}
                                                        type="date"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    // control={personalInfoForm.control}
                                    control={signUpForm.control}
                                    name="age_range"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full !h-11 min-h-0 px-3 py-0 flex items-center text-sm box-border">
                                                        <SelectValue placeholder="Age Range" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="18-30">18-30</SelectItem>
                                                    <SelectItem value="31-45">31-45</SelectItem>
                                                    <SelectItem value="46-60">46-60</SelectItem>
                                                    <SelectItem value="60+">60+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <Button type="submit" className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11">
                                    Continue
                                </Button> */}
                                <Button
                                    type="button"
                                    className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11"
                                    onClick={async () => {
                                        console.log("signUpForm values", signUpForm.getValues());
                                        const isValid = await signUpForm.trigger([
                                            "first_name",
                                            "middle_name",
                                            "last_name",
                                            "email",
                                            "phone",
                                            "gender",
                                            "dob",
                                            "age_range",
                                        ]);
                                        if (isValid) {
                                            onSignUpStepChange(3); // go next, no submit
                                        }
                                    }}
                                >
                                    Continue
                                </Button>
                                </div>
                            {/* </form> */}
                        </Form>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <div className="text-center mb-6">
                            <ProgressSteps currentStep={signUpStep} totalSteps={4} />
                            <p className="text-sm text-[#14AB55] mb-6">
                                Hey! You are now one step away from completing your Sign Up
                            </p>
                        </div>
                        
                        <Form {...signUpForm}>
                            {/* <form onSubmit={signUpForm.handleSubmit(onFinalSubmit)} className="space-y-6"> */}
                                {/* Account info form fields */}
                                <FormField
                                    control={signUpForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Home Address"
                                                    {...field}
                                                    className='h-11 mb-5'
                                                    // value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* ... other account info fields */}
                                <FormField
                                    control={signUpForm.control}
                                    name="whatshapp_no"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    inputMode="numeric" 
                                                    placeholder="WhatsApp (Optional)"
                                                    {...field}
                                                    className='h-11 mb-5'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <>
                                         {/* <FormItem> */}
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Password"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                        className="pr-10 h-11 mb-5"
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <FormMessage />
                                             {/* </FormItem> */}
                                            </>
                                    )}
                                />
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                    <Button type="button" variant="outline" onClick={handleBackToPersonalInfo} className="h-11 lg:w-auto w-full">
                                        ← Previous
                                    </Button>
                                    <Button
                                        type="button"
                                        disabled={sendEmailVerification.isPending || sendPhoneVerification.isPending}
                                            onClick={handleStep3Continue}
                                        className="h-11 lg:w-auto w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800"
                                    >
                                        {(sendEmailVerification.isPending || sendPhoneVerification.isPending) ? <>Processing... <PageLoader /></> : "Continue"}
                                    </Button>
                                </div>
                        </Form>
                    </div>
                );

            case 4:
            case 5:
                return (
                    <VerificationStep
                        step={signUpStep}
                        userEmail={userProfileDetails?.email || userEmail}
                        userPhone={userProfileDetails?.phone || userPhone}
                        verificationForm={verificationForm}
                        onEmailVerificationSubmit={onEmailVerificationSubmit}
                        onPhoneVerificationSubmit={onPhoneVerificationSubmit}
                        verifyEmailCode={verifyEmailCode}
                        verifyPhoneCode={verifyPhoneCode}
                        emailTimer={emailTimer}
                        phoneTimer={phoneTimer}
                        emailTimerActive={emailTimerActive}
                        phoneTimerActive={phoneTimerActive}
                        handleResendCode={handleResendCode}
                        resendCode={resendCode}
                    />
                );

            default:
                return null;
        }
    };

    const renderLoginStep = () => {
        if (loginStep === 1) {
            return (
                <div className="space-y-6 w-full rounded-lg">
                    <Form {...loginForm}>
                        {/* <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 w-full rounded-lg"> */}
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email</Label>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} type="email" className="w-full h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Password</Label>
                                        <div className="relative w-full">
                                            <FormControl>
                                                <Input
                                                    placeholder="Password"
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full pr-10 h-11"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Input type="checkbox" className="sr-only peer" />
                                    <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center transition-colors peer-checked:bg-green-600 peer-checked:border-green-600 peer-focus:ring-2 peer-focus:ring-green-300">
                                        <svg className="hidden peer-checked:block w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">Remember me</span>
                                </label>
                                <NavLink to="/forgot-password" className="text-green-600 hover:underline">
                                    Forgot password?
                                </NavLink>
                            </div>
                        <Button
                            type="button"
                            className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11 disabled:bg-green-300 disabled:text-gray-800"
                            disabled={sendLoginEmailVerification.isPending}
                            onClick={handleLoginProceed}
                        >
                                {sendLoginEmailVerification.isPending ? <>Signing In... <PageLoader /></> : "Sign In"}
                            </Button>
                        {/* </form> */}
                    </Form>
                </div>
            );
        } else if (loginStep === 2) {
            // return <ConfirmSignIn loginEmail={loginEmail} onLoginSubmit={onLoginSubmit} />;
            return (
                <ConfirmSignIn
                    loginEmail={loginEmail}
                    onLoginSubmit={() => {
                        // call mutate with stored form values
                        const values = loginForm.getValues();
                        onLoginSubmit(values);
                    }}
                />
            )
        }
    };

    return (
        <div className="overflow-hidden items-stretch flex justify-center p-4 flex-1 relative">
            <Card
                className="overflow-auto scrollbar-hide w-full lg:border-0 shadow-none max-w-md z-10 lg:bg-transparent"
                style={{ height: imgHeight ? `${imgHeight}px` : "auto" }}
            >
                <CardHeader className="text-center mb-[-20px] pt-0">
                    <img src={megacoop_logo} alt="MegaCoop Logo" className="mx-auto w-32 h-auto object-contain" />
                </CardHeader>
                <CardContent className="w-full relative">
                    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex flex-col">
                        {signUpStep === 1 && activeTab === "signup" && (
                            <div className="text-center mb-6">
                                <ProgressSteps currentStep={signUpStep} totalSteps={4} />
                                <p className="text-sm text-[#14AB55] mb-6 min-w-[35px]">
                                    Please input the access code that was sent to you via your Email to continue
                                </p>
                            </div>
                        )}

                        {signUpStep === 1 && loginStep === 1 && (
                            <TabsList className="grid grid-cols-2 mb-6 items-center justify-center w-full mx-auto">
                                <TabsTrigger value="signup" className="data-[state=active]:bg-[#14AB55] data-[state=active]:text-white">Sign Up</TabsTrigger>
                                <TabsTrigger value="login" className="data-[state=active]:bg-[#14AB55] data-[state=active]:text-white">Sign In</TabsTrigger>
                            </TabsList>
                        )}

                        <TabsContent value="signup">
                            {renderSignUpStep()}
                        </TabsContent>

                        <TabsContent value="login">
                            {renderLoginStep()}
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="mt-auto text-xs text-center text-gray-500 pt-0 pb-4 px-4 lg:px-8">
                    <p>
                        By signing up to create an account, I accept Company's{" "}
                        <a href="/terms" className="text-green-600 hover:underline">Terms of use</a>{" "}
                        &{" "}
                        <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};



export default AuthForm;