// components/AuthForm.tsx
import { useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
type CombinedFormData = PersonalInfoFormData & AccountInfoFormData;
type CombinedAccessCodeData = AccessCodeFormData & PersonalInfoFormData & AccountInfoFormData;
type LoginFormData = z.infer<typeof loginSchema>;

interface AuthFormProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    signUpStep: number;
    onSignUpStepChange: (step: number) => void;
    loginStep: number;
    onLoginStepChange: (step: number) => void;
    //   userProfileDetails: CombinedAccessCodeData | null;
    //   setUserProfileDetails: (details: CombinedAccessCodeData | null) => void;
    userEmail: string;
    userPhone: string;
    loginEmail: string;
    onError: (message: string) => void;
    onUserEmailChange: (email: string) => void;
    onUserPhoneChange: (phone: string) => void;
    onLoginEmailChange: (email: string) => void;
    API_BASE_URL: string;
    imgHeight?: number;
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
    onError,
    onUserEmailChange,
    onUserPhoneChange,
    onLoginEmailChange,
    API_BASE_URL,
    imgHeight
}: AuthFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoFormData | null>(null);
    const [userProfileDetails, setUserProfileDetails] = useState<CombinedAccessCodeData | null>(null);

    // API mutations
    const verifyAccessCode = useMutation({
        mutationFn: (accessCode: string) => {
            return axios.post(`${API_BASE_URL}user/validate-code`, { code: accessCode });
        },
        onSuccess: (response) => {
            onSignUpStepChange(2);
            setUserProfileDetails(response.data);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Invalid access code");
        },
    });

    const submitSignUpData = useMutation({
        mutationFn: (data: CombinedFormData) => {
            return axios.post(`${API_BASE_URL}user/complete-signup`,
                { ...data, code: userProfileDetails?.code },
                jsonConfig
            );
        },
        onSuccess: () => {
            onSignUpStepChange(4);
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
        onSuccess: () => {
            onLoginStepChange(2);
            return <Navigate to="/dashboard" replace />;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            onError(error.response?.data?.message || "Error logging in");
        },
    });

    const verifyEmailCode = useMutation({
        mutationFn: (code: string) => {
            const formData = new FormData();
            formData.append('token', code);
            formData.append('email', userEmail);
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
            formData.append('phone', userPhone);
            return axios.post(`${API_BASE_URL}user/verify-phone`, formData, formConfig);
        },
        onSuccess: () => {
            onSignUpStepChange(6);
            onTabChange("login");
            onLoginStepChange(1);
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

    const personalInfoForm = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: userProfileDetails?.first_name || "Emeka",
            middle_name: userProfileDetails?.middle_name || "",
            last_name: userProfileDetails?.last_name || "Victor",
            email: userProfileDetails?.email || "neogreat@example.com",
            phone: userProfileDetails?.phone || "09025697028",
            gender: "",
            dob: "",
            age_range: "",
            code: userProfileDetails?.code || "zswewd12",
        },
    });

    const accountInfoForm = useForm<AccountInfoFormData>({
        resolver: zodResolver(accountInfoSchema),
        defaultValues: {
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

    const onPersonalInfoSubmit = (data: PersonalInfoFormData) => {
        onUserEmailChange(data.email);
        onUserPhoneChange(data.phone);
        setPersonalInfoData(data);
        onSignUpStepChange(3);
    };

    const onAccountInfoSubmit = (data: AccountInfoFormData) => {
        if (personalInfoData) {
            const combinedData = { ...personalInfoData, ...data };
            submitSignUpData.mutate(combinedData);
        }
    };

    const onEmailVerificationSubmit = (data: VerificationFormData) => {
        verifyEmailCode.mutate(data.verificationCode);
    };

    const onPhoneVerificationSubmit = (data: VerificationFormData) => {
        verifyPhoneCode.mutate(data.verificationCode);
    };

    const onLoginSubmit = (data: LoginFormData) => {
        loginUser.mutate(data);
    };

    const handleBackToPersonalInfo = () => {
        onSignUpStepChange(2);
    };

    const renderSignUpStep = () => {
        switch (signUpStep) {
            case 1:
                return (
                    <div>
                        {/* <div className="text-center mb-6">
              <ProgressSteps currentStep={signUpStep} totalSteps={4} />
              <p className="text-sm text-[#14AB55] mb-6">
                Please input the access code that was sent to you via your Email to continue
              </p>
            </div> */}
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
                        <Form {...personalInfoForm}>
                            <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-7">
                                {/* Personal info form fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={personalInfoForm.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className='h-11 bg-green-50' placeholder="First name" {...field} readOnly />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={personalInfoForm.control}
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
                                    control={personalInfoForm.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className='h-11 bg-green-50'
                                                    placeholder="Last name" {...field}
                                                    // readOnly={!!userProfileDetails?.lastName}
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personalInfoForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className='h-11 bg-green-50'
                                                    placeholder="Email"
                                                    type="email" {...field}
                                                    // readOnly={!!userProfileDetails?.email}
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personalInfoForm.control}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={personalInfoForm.control}
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
                                        control={personalInfoForm.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl >
                                                    <Input
                                                        placeholder="DOB"
                                                        className="w-full h-11 appearance-none [&::-webkit-datetime-edit]:w-full [&::-webkit-datetime-edit-fields-wrapper]:flex [&::-webkit-datetime-edit-fields-wrapper]:w-full"
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
                                    control={personalInfoForm.control}
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
                                <Button type="submit" className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11">
                                    Continue
                                </Button>
                            </form>
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
                        <Form {...accountInfoForm}>
                            <form onSubmit={accountInfoForm.handleSubmit(onAccountInfoSubmit)} className="space-y-6">
                                {/* Account info form fields */}
                                <FormField
                                    control={accountInfoForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Home Address" {...field} className='h-11' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* ... other account info fields */}
                                <FormField
                                    control={accountInfoForm.control}
                                    name="whatshapp_no"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="WhatsApp (Optional)" {...field} className='h-11' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={accountInfoForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Password"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                        className="pr-10 h-11"
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
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                    <Button type="button" variant="outline" onClick={handleBackToPersonalInfo} className="h-11 lg:w-auto w-full">
                                        ← Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitSignUpData.isPending}
                                        className="h-11 lg:w-auto w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800"
                                    >
                                        {submitSignUpData.isPending ? <>Processing... <PageLoader /></> : "Continue"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                );

            case 4:
            case 5:
                return (
                    <VerificationStep
                        step={signUpStep}
                        userEmail={userEmail}
                        userPhone={userPhone}
                        verificationForm={verificationForm}
                        onEmailVerificationSubmit={onEmailVerificationSubmit}
                        onPhoneVerificationSubmit={onPhoneVerificationSubmit}
                        verifyEmailCode={verifyEmailCode}
                        verifyPhoneCode={verifyPhoneCode}
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
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 w-full rounded-lg">
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
                            <Button type="submit" className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11 disabled:bg-green-300 disabled:text-gray-800" disabled={loginUser.isPending}>
                                {loginUser.isPending ? <>Signing In... <PageLoader /></> : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </div>
            );
        } else if (loginStep === 2) {
            return <ConfirmSignIn loginEmail={loginEmail} />;
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

                        {signUpStep === 1 && (
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

// Helper components
const ProgressSteps = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="flex justify-center items-center my-2">
        {Array.from({ length: totalSteps }, (_, idx) => (
            <div key={idx + 1} className="flex items-center lg:w-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= idx + 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                    {idx + 1}
                </div>
                {idx < totalSteps - 1 && (
                    <div className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] ${currentStep > idx + 1 ? "bg-[#14AB55]" : "bg-gray-300"
                        }`} />
                )}
            </div>
        ))}
    </div>
);

const VerificationStep = ({
    step,
    userEmail,
    userPhone,
    verificationForm,
    onEmailVerificationSubmit,
    onPhoneVerificationSubmit,
    verifyEmailCode,
    verifyPhoneCode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => (
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
            <form onSubmit={step === 4 ? verificationForm.handleSubmit(onEmailVerificationSubmit) : verificationForm.handleSubmit(onPhoneVerificationSubmit)} className="space-y-6">
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
            </form>
        </Form>
    </div>
);

export default AuthForm;