import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
// Import extracted schemas, types, and hooks
import {
    accessCodeSchema,
    combinedSchema,
    verificationSchema,
    loginSchema,
    type AccessCodeFormData,
    type VerificationFormData,
    type CombinedFormData,
    type CombinedAccessCodeData,
    type LoginFormData,
    type FinalSubmitData
} from '@/schemas/authSchemas';
import {
    useVerifyAccessCode,
    useSendEmailVerification,
    useSendLoginEmailVerification,
    useSendPhoneVerification,
    useResendCode,
    useSubmitSignUpData,
    useVerifyEmailCode,
    useVerifyPhoneCode
} from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalstorage';
import type { AuthFormProps } from '@/types/auth';
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
import ProgressSteps from './AuthProgressSteps';
import VerificationStep from './AuthVerificationStep';
import { Checkbox } from './ui/checkbox';

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
    imgHeight,
    setShowCongratulationsModal,
}: AuthFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [userProfileDetails, setUserProfileDetails] = useState<CombinedAccessCodeData | null>(null);
    const [emailTimer, setEmailTimer] = useState(30);
    const [phoneTimer, setPhoneTimer] = useState(30);
    const [emailTimerActive, setEmailTimerActive] = useState(true);
    const [phoneTimerActive, setPhoneTimerActive] = useState(true);
     const [rememberMe, setRememberMe] = useLocalStorage('rememberMe', false);
    const [savedCredentials, setSavedCredentials] = useLocalStorage<{ email: string; password: string } | null>(
        'userCredentials',
        null
    );

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        },
    });

    // Load saved credentials when component mounts
    useEffect(() => {
        if (rememberMe && savedCredentials) {
            loginForm.reset({
                ...loginForm.getValues(),
                email: savedCredentials.email,
                password: savedCredentials.password,
                rememberMe: true
            });
        }
    }, [rememberMe, savedCredentials, loginForm]);

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

    // API mutations using custom hooks
    const verifyAccessCode = useVerifyAccessCode(
        (response) => {
            setUserProfileDetails(response);
            setShowSuccessModal(true);
        },
        onError
    );

    const sendEmailVerification = useSendEmailVerification(onError);
    
    const sendLoginEmailVerification = useSendLoginEmailVerification(onError);

const sendPhoneVerification = useSendPhoneVerification(onError);

    // Resend code mutation
    const resendCode = useResendCode(
        (type) => {
            if (type === 'email') {
                setEmailTimer(30);
                setEmailTimerActive(true);
            } else {
                setPhoneTimer(30);
                setPhoneTimerActive(true);
            }
        },
        onError
    );


    const submitSignUpData = useSubmitSignUpData(
        () => {
            // onSignUpStepChange(6);
            setShowCongratulationsModal(true)

            onTabChange("login");
            onLoginStepChange(1);
            setTimeout(() => {
                setShowCongratulationsModal(false);
            }, 5000);
        },
        onError
    );

    const verifyEmailCode = useVerifyEmailCode(
        () => {
            onSignUpStepChange(5);
        },
        onError
    );

    const verifyPhoneCode = useVerifyPhoneCode(
        () => {
            console.log("Phone verified successfully");
            console.log("signUpForm", signUpForm.getValues());
            console.log("is signUpForm valid", signUpForm.formState.isValid);
            // if (signUpForm.formState.isValid) {
            const data = signUpForm.getValues();
            onFinalSubmit(data);
            // }
        },
        onError
    );

    // Forms
    const accessCodeForm = useForm<AccessCodeFormData>({
        resolver: zodResolver(accessCodeSchema),
        defaultValues: { code: "" },
    });

    


    const signUpForm = useForm<CombinedFormData>({
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
        console.log("Access code submitted:", data);
        verifyAccessCode.mutate(data);
    };

    const onEmailVerificationSubmit = (data: VerificationFormData) => {
        verifyEmailCode.mutate({ code: data.verificationCode, email: userProfileDetails?.email || userEmail });
    };

    const onPhoneVerificationSubmit = (data: VerificationFormData) => {
        verifyPhoneCode.mutate({ code: data.verificationCode, phone: userProfileDetails?.phone || userPhone });
    };

    // Resend code handler
    const handleResendCode = (type: 'email' | 'phone') => {
        if (!resendCode.isPending) {
            const email = userProfileDetails?.email || userEmail;
            const phone = userProfileDetails?.phone || userPhone;
            resendCode.mutate({ type, email, phone });
        }
    };

    const handleBackToPersonalInfo = () => {
        onSignUpStepChange(2);
        if (userProfileDetails) {
            signUpForm.reset({
                ...signUpForm.getValues(), // keep other values
                first_name: userProfileDetails.first_name || "",
                middle_name: userProfileDetails.middle_name || "",
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
  submitSignUpData.mutate({ data: stripped as FinalSubmitData, userProfileDetails });

    };

    // const handleLoginProceed = async () => {
        
    //     const isLoginValid = await loginForm.trigger([
    //         "email",
    //         "password"
    //     ]);

    //     if (isLoginValid) {
    //         // Send email verification code
    //         try {
    //             const { email, password } = loginForm.getValues();
    //             console.log('Email to send verification to:', email);
    //             console.log('Password length:', password ? password.length : 'NO PASSWORD');
    //             onLoginEmailChange(email);
    //             const result = await sendLoginEmailVerification.mutateAsync({ email, password });
    //             console.log("Login email verification code sent:", result);
    //             onLoginStepChange(2);
    //         } catch (error) {
    //             // Error handling is done in the mutation
    //             console.error("Failed to send login email verification code:", error);
    //         }
    //     } else {
    //         console.log('Form validation failed');
    //     }
    // };

     // Update handleLoginProceed to save credentials
    
    const handleRememberMeChange = (checked: boolean) => {
        loginForm.setValue('rememberMe', checked);
        setRememberMe(checked);
        
        if (!checked) {
            // Clear saved credentials if remember me is unchecked
            setSavedCredentials(null);
        }
    };

    const clearSavedCredentials = () => {
        setSavedCredentials(null);
        setRememberMe(false);
        loginForm.setValue('rememberMe', false);
        loginForm.reset({
            email: '',
            password: '',
            rememberMe: false
        });
    };
    
    const handleLoginProceed = async () => {
        console.log('handleLoginProceed called');
        console.log('Current form values:', loginForm.getValues());
        
        const isLoginValid = await loginForm.trigger([
            "email",
            "password"
        ]);
        
        console.log('Form validation result:', isLoginValid);

        if (isLoginValid) {
            // Save credentials if remember me is checked
            const formData = loginForm.getValues();
            if (formData.rememberMe) {
                setSavedCredentials({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Clear saved credentials if remember me is unchecked
                setSavedCredentials(null);
            }

            // Send email verification code
            try {
                const { email, password } = formData;
                console.log('Email to send verification to:', email);
                console.log('Password length:', password ? password.length : 'NO PASSWORD');
                onLoginEmailChange(email);
                const result = await sendLoginEmailVerification.mutateAsync({ email, password });
                console.log("Login email verification code sent:", result);
                onLoginStepChange(2);
            } catch (error) {
                console.error("Failed to send login email verification code:", error);
            }
        } else {
            console.log('Form validation failed');
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
            const email = userProfileDetails?.email || '';
            const phone = userProfileDetails?.phone || '';
            const results = await Promise.all([
                sendEmailVerification.mutateAsync(email),
                sendPhoneVerification.mutateAsync(phone)
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
      middle_name: userProfileDetails.middle_name || "",
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
                                <Checkbox
                                    id="remember-me"
                                    checked={loginForm.watch("rememberMe")}
                                    onCheckedChange={handleRememberMeChange}
                                />
                                    <span className="text-gray-700">Remember me</span>
                                </label>
                                <NavLink to="/forgot-password" className="text-green-600 hover:underline">
                                    Forgot password?
                                </NavLink>
                        </div>
                        
                        {savedCredentials && (
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={clearSavedCredentials}
                                    className="text-red-600 hover:underline text-xs"
                                >
                                    Clear saved credentials
                                </button>
                            </div>
                        )}
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
                    loginPassword={loginForm.getValues().password}
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