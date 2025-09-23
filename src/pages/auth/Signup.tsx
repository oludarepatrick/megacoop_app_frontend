import {  useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import megacoop_logo from '../../assets/megacoop-logo-1.png';
import { Eye, EyeOff } from 'lucide-react';
import SuccessIcon from '../../assets/signup_successfull_icon.png';
import ErrorIcon from '../../assets/error_icon.png';
import SuccessfulSignUpBg from '../../assets/signup_success_background_img.png';
import CarouselImage from '../../assets/signup_carousel_image.jpg'
import { AnimatePresence, motion } from 'framer-motion';
import { formConfig, jsonConfig } from '@/common/utils';
import { Label } from '@radix-ui/react-label';
import ConfirmSignIn from './ConfirmLogin';

// API base URL
// const API_BASE_URL = process.env.VITE_API_URL || 'https://megacoopapi-850900907647.us-central1.run.app/api';
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://34.56.64.14/api/v1/';
console.log("API_BASE_URL", API_BASE_URL);

// Zod schemas for form validation
const accessCodeSchema = z.object({
    code: z
        .string()
        .nonempty("Access code is required") // when empty
        .length(8, "Put in your 8 digit access code"), // when not exactly 8
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
    // secondaryEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const verificationSchema = z.object({
    verificationCode: z.string().min(1, "Verification code is required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const carouselItems = [
    {
        title: "Seamless Transactions",
        desc: "Secure your future with fast loans, easy savings, and exclusive deals",
    },
    {
        title: "Smart Savings",
        desc: "Grow your wealth with automated contributions and flexible withdrawals",
    },
    {
        title: "Community Support",
        desc: "Join a network of like-minded individuals achieving financial freedom",
    },
    {
        title: "Trusted Security",
        desc: "Your data and funds are protected with top-tier security measures",
    },
];

// Types
type AccessCodeFormData = z.infer<typeof accessCodeSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;
type CombinedFormData = PersonalInfoFormData & AccountInfoFormData;
type CombinedAccessCodeData = AccessCodeFormData & PersonalInfoFormData & AccountInfoFormData;
type LoginFormData = z.infer<typeof loginSchema>;

const SignUpLoginPage = () => {
    const location = useLocation();
    console.log(location.pathname);
    const [activeTab, setActiveTab] = useState<string>(location.pathname === '/login' ? 'login' : 'signup');
    const [signUpStep, setSignUpStep] = useState(1);
    const [loginStep, setLoginStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("09025697028");
    const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoFormData | null>(null);
    const [userProfileDetails, setUserProfileDetails] = useState<CombinedAccessCodeData | null>(null);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(true);
    const imgRef = useRef<HTMLImageElement | null>(null)
    const [imgHeight, setImgHeight] = useState<number | undefined>(undefined)
    const [current, setCurrent] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [emailTimer, setEmailTimer] = useState(30);
    const [phoneTimer, setPhoneTimer] = useState(30);
    const [emailTimerActive, setEmailTimerActive] = useState(true);
    const [phoneTimerActive, setPhoneTimerActive] = useState(true);
    const [loginEmail, setLoginEmail] = useState("");
    


    // use effect for email timer
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

    // use effect for phone timer
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

    // Auto change carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % carouselItems.length);
        }, 4000); // every 4 seconds
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!imgRef.current) return

        // Observe image size changes
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setImgHeight(entry.contentRect.height)
            }
        })

        resizeObserver.observe(imgRef.current)

        return () => resizeObserver.disconnect()
    }, [])

    useEffect(() => {
        setActiveTab(location.pathname === "/login" ? "login" : "signup");
    }, [location.pathname]);

    // Access code form
    const accessCodeForm = useForm<AccessCodeFormData>({
        resolver: zodResolver(accessCodeSchema),
        defaultValues: {
            code: "",
        },
    });

    // Login form
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Personal info form
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

    // Account info form
    const accountInfoForm = useForm<AccountInfoFormData>({
        resolver: zodResolver(accountInfoSchema),
        defaultValues: {
            address: "",
            whatshapp_no: "",
            // secondaryEmail: "",
            password: "",
        },
    });

    // Verification form
    const verificationForm = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            verificationCode: "",
        },
        
    });

    // API calls
    const verifyAccessCode = useMutation({
        mutationFn: (accessCode: string) => {
            return axios.post(`${API_BASE_URL}user/validate-code`, {
                // accessCode
                code: accessCode
            });
        },
        onSuccess: (response) => {
            setShowSuccessModal(true);
            setUserProfileDetails(response.data);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || "Invalid access code");
            setShowErrorModal(true);
        },
    });

    const submitSignUpData = useMutation({
        mutationFn: (data: CombinedFormData) => {
            return axios.post(`${API_BASE_URL}user/complete-signup`, { ...data, code: userProfileDetails?.code }, jsonConfig);
        },
        onSuccess: () => {
            setSignUpStep(4);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || "Error submitting information");
            setShowErrorModal(true);
        },
    });

    const loginUser = useMutation({
        mutationFn: (data: LoginFormData) => {
            setLoginEmail(data.email);
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            return axios.post(`${API_BASE_URL}user/login`, formData, formConfig);
        },
        onSuccess: () => {
            // Handle successful login (e.g., redirect, show message)
            // setLoginEmail(loginForm.getValues("email"));
            setLoginStep(2);
            console.log("Login successful");
            return <Navigate to="/dashboard" replace />;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || "Error logging in");
            setShowErrorModal(true);
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
            setSignUpStep(5);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || "Invalid verification code");
            setShowErrorModal(true);
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
            setSignUpStep(6);
            setShowCongratulationsModal(true);
            setActiveTab("login");
            setLoginStep(1);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || "Invalid verification code");
            setShowErrorModal(true);
        },
    });

    

    // Form handlers
    const onAccessCodeSubmit = (data: AccessCodeFormData) => {
        verifyAccessCode.mutate(data.code);
    };

    const onPersonalInfoSubmit = (data: PersonalInfoFormData) => {
        console.log("data", data)
        setUserEmail(data.email);
        setUserPhone(data.phone);
        setPersonalInfoData(data);
        setSignUpStep(3);
    };
    console.log("personalInfoData", personalInfoData);

    const onAccountInfoSubmit = (data: AccountInfoFormData) => {
        if (personalInfoData) {
            const combinedData = { ...personalInfoData, ...data };
            submitSignUpData.mutate(combinedData);
        }
    };

    const onEmailVerificationSubmit = (data: VerificationFormData) => {
        verifyEmailCode.mutate(data.verificationCode);
    };

    const onLoginSubmit = (data: LoginFormData) => {
        loginUser.mutate(data);
    };

    const resendCode = useMutation({
        mutationFn: (type: 'email' | 'phone') => {
            const endpoint = type === 'email' ? 'user/send-email-verification-token' : 'user/send-phone-verification-otp';
            // const payload = type === 'email' ? { email: userEmail } : { phone: userPhone };
            const formData = new FormData();
            if (type === 'email') {
                formData.append('email', userEmail);
            } else {
                formData.append('phone', userPhone);
            }
            console.log(`Resending ${type} code to`, formData);
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
            setErrorMessage(error.response?.data?.message || "Error resending code");
            setShowErrorModal(true);
        },
    });

    console.log("resendCode variables:", resendCode);

    // handler for resending code based on type
    const handleResendCode = (type: 'email' | 'phone') => {
        if (!resendCode.isPending) {
            resendCode.mutate(type);
        }
    };

    const onPhoneVerificationSubmit = (data: VerificationFormData) => {
        verifyPhoneCode.mutate(data.verificationCode);
    };

    const handleProceed = () => {
        if (userProfileDetails) {
            personalInfoForm.reset({
                first_name: userProfileDetails.first_name ?? "emeka",
                middle_name: userProfileDetails.middle_name ?? "",
                last_name: userProfileDetails.last_name ?? "victor",
                email: userProfileDetails.email ?? "",
                phone: userProfileDetails.phone ?? "09025697028",
                code: userProfileDetails.code ?? "",
            });
        }
        setShowSuccessModal(false);
        setSignUpStep(2);
    };
    console.log("phone", userPhone);


    const handleStartJourney = () => {
        setSignUpStep(1);
        setActiveTab("login");
        personalInfoForm.reset();
        accountInfoForm.reset();
    };

    const handleBackToPersonalInfo = () => {
        setSignUpStep(2);
    };

    return (
        <div className=" flex flex-row justify-between items-center  bg-transparent px-4 overflow-hidden relative">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute  -bottom-50 right-[-120px] h-[300px] w-[300px] rounded-full bg-transparent border-[60px] border-[#0F7033] opacity-50 z-0 "
            />

            <div className="rounded-[16px] relative hidden lg:flex  p-0 items-stretch overflow-hidden">
                <img
                    ref={imgRef}
                    src={CarouselImage}
                    alt="Sign Up"

                    className="inset-0 max-w-full max-h-[95vh] object-contain object-left filter sepia saturate-0 hue-rotate-120"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#14AB55]/70 to-[#14AB55]/70" >
                    {/* Content */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between mix-blend-normal">
                        {/* Top Text */}
                        <div className="text-center mt-12 px-4">
                            <h4 className="text-3xl md:text-3xl font-extrabold text-white">
                                Welcome to Megacoop
                            </h4>
                            <p className="mt-2 text-white/90">
                                Your Gateway to Financial Freedom.
                            </p>
                        </div>

                        {/* Carousel */}
                        <div className="text-center mb-12 px-6 ">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ x: "100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "-100%", opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    onAnimationComplete={() => {
                                        // Animation complete callback if needed
                                        setActiveIndex(current);
                                    }}
                                    className="w-full"
                                >
                                    <h2 className="text-2xl font-bold text-white">
                                        {carouselItems[current].title}
                                    </h2>
                                    <p className="text-white/80 mt-2 max-w-lg mx-auto">
                                        {carouselItems[current].desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots */}
                            <div className="flex justify-center mt-4 space-x-2 relative">
                                {carouselItems.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === activeIndex ? "bg-green-400" : "bg-white/50 hover:bg-white"
                                            }`}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="overflow-hidden items-stretch flex  justify-center p-4 flex-1 relative">
                <Card className="overflow-auto scrollbar-hide w-full lg:border-0 shadow-none max-w-md h-[100vh] lg:h-[70vh] z-10 lg:bg-transparent"
                    style={{ height: imgHeight ? `${imgHeight}px` : "auto" }}
                >

                    <CardHeader className="text-center mb-[-20px] pt-0 ">
                        <img src={megacoop_logo} alt="MegaCoop Logo" className="mx-auto  w-32 h-auto object-contain" />
                    </CardHeader>
                    <CardContent className="w-full relative">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col ">
                            {signUpStep === 1 && activeTab === "signup" && (
                                <div className="text-center mb-6">

                                    <div className="flex justify-center items-center  my-2">
                                        {[1, 2, 3, 4].map((step, idx) => (
                                            <div key={step} className="flex items-center lg:w-full ">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                                ${signUpStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                >
                                                    {step}
                                                </div>
                                                {/* Line between steps (except last) */}
                                                {idx < 3 && (
                                                    <div
                                                        className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] 
                                                       ${signUpStep > step ? "bg-[#14AB55]" : "bg-gray-300"}`}
                                                     
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-[#14AB55] mb-6 min-w-[35px]">
                                        Please input the access code that was sent to you via your Email to continue
                                    </p>
                                </div>
                            )}
                            {signUpStep === 1 && (
                                <div>

                                    <TabsList className="grid grid-cols-2 mb-6 items-center justify-center w-full  mx-auto">
                                        <TabsTrigger value="signup" className="data-[state=active]:bg-[#14AB55] data-[state=active]:text-white" >Sign Up</TabsTrigger>
                                        <TabsTrigger value="login" className="data-[state=active]:bg-[#14AB55] data-[state=active]:text-white">Sign In</TabsTrigger>
                                    </TabsList>
                                </div>
                            )}

                            {/* Sign Up Tab */}
                            <TabsContent value="signup">
                                {signUpStep === 1 && (
                                    <div>


                                        <Form {...accessCodeForm}>
                                            <form onSubmit={accessCodeForm.handleSubmit(onAccessCodeSubmit)} className="space-y-4">
                                                <FormField
                                                    control={accessCodeForm.control}
                                                    name="code"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Access Code" {...field}
                                                                    value={field.value || ""}
                                                                />
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
                                                    {verifyAccessCode.isPending ? (
                                                        <>
                                                            Verifying...
                                                            <PageLoader />
                                                        </>
                                                    ) : (
                                                        "Verify Now"
                                                    )}
                                                </Button>

                                            </form>
                                        </Form>
                                    </div>
                                )}

                                {signUpStep === 2 && (
                                    <div>
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center  my-4">
                                                {[1, 2, 3, 4].map((step, idx) => (
                                                    <div key={step} className="flex items-center lg:w-full ">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                                ${signUpStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                        >
                                                            {step}
                                                        </div>
                                                        {/* Line between steps (except last) */}
                                                        {idx < 3 && (
                                                            <div
                                                                className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] 
                                                       ${signUpStep > step ? "bg-[#14AB55]" : "bg-gray-300"}`}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#14AB55] mb-6">
                                                Please input your DOB, Gender and Age to proceed
                                            </p>
                                        </div>

                                        <Form {...personalInfoForm}>
                                            <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-7">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={personalInfoForm.control}
                                                        name="first_name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        className='h-11 bg-green-50'
                                                                        placeholder="First name" {...field}
                                                                        // readOnly={!!userProfileDetails?.firstName}
                                                                        readOnly
                                                                    />
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
                                                <Button type="submit" className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11" disabled={personalInfoForm.formState.isSubmitting}>
                                                    Continue
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                )}

                                {signUpStep === 3 && (
                                    <div>
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center  my-4">
                                                {[1, 2, 3, 4].map((step, idx) => (
                                                    <div key={step} className="flex items-center lg:w-full ">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                                ${signUpStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                        >
                                                            {step}
                                                        </div>
                                                        {/* Line between steps (except last) */}
                                                        {idx < 3 && (
                                                            <div
                                                                className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] 
                                                       ${signUpStep > step ? "bg-[#14AB55]" : "bg-gray-300"}`}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#14AB55] mb-6">
                                                Hey! You are now one step away from completing your Sign Up
                                            </p>
                                        </div>


                                        <Form {...accountInfoForm}>
                                            <form onSubmit={accountInfoForm.handleSubmit(onAccountInfoSubmit)} className="space-y-6">
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
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleBackToPersonalInfo}
                                                        className="h-11 lg:w-auto w-full"
                                                    >
                                                        ← Previous
                                                    </Button>

                                                    <Button
                                                        type="submit"
                                                        disabled={submitSignUpData.isPending}
                                                        className="h-11 lg:w-auto w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800"
                                                    >
                                                        
                                                        {submitSignUpData.isPending ? (
                                                            <>
                                                                Processing...
                                                                <PageLoader />
                                                            </>
                                                        ) : (
                                                            "Continue"
                                                        )}
                                                    </Button>
                                                </div>

                                            </form>
                                        </Form>
                                    </div>
                                )}

                                {signUpStep === 4 && (
                                    <div>
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center  my-4">
                                                {[1, 2, 3, 4].map((step, idx) => (
                                                    <div key={step} className="flex items-center lg:w-full ">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                                ${signUpStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                        >
                                                            {step}
                                                        </div>
                                                        {/* Line between steps (except last) */}
                                                        {idx < 3 && (
                                                            <div
                                                                className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px]  
                                                       ${signUpStep > step ? "bg-[#14AB55]" : "bg-gray-300"}`}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#14AB55] mb-6">
                                                We have sent a verification code to your email {userEmail ? userEmail.replace(/(.{2})(.*)(?=@)/, '$1****') : ''}
                                            </p>
                                        </div>


                                        <Form {...verificationForm}>
                                            <form onSubmit={verificationForm.handleSubmit(onEmailVerificationSubmit)} className="space-y-6">
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
                                                {/* resend code section for email verification */}
                                                <div>
                                                <Button
                                                    type="submit"
                                                    disabled={verifyEmailCode.isPending}
                                                    className='w-full h-11 bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800'
                                                >
                                                    {verifyEmailCode.isPending ? (
                                                        <>
                                                            Verifying...
                                                            <PageLoader />
                                                        </>
                                                    ) : (
                                                        "Verify Email"
                                                    )}
                                                </Button>
                                                    <div className="flex items-center justify-center text-sm my-3">
                                                    <span className="text-gray-600">Didn't get code?</span>
                                                    {emailTimerActive ? (
                                                        <span className="text-gray-500">Resend in {emailTimer}s</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResendCode('email')}
                                                            className="text-[#14AB55] hover:underline disabled:text-gray-400"
                                                            disabled={resendCode.isPending}
                                                        >
                                                            {resendCode.isPending ? "Sending..." : "Resend Code"}
                                                        </button>
                                                    )}
                                                </div>
                                                </div>
                                            </form>
                                        </Form>
                                    </div>
                                )}

                                {(signUpStep === 5) && (
                                    <div>
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center  my-4">
                                                {[1, 2, 3, 4].map((step, idx) => (
                                                    <div key={step} className="flex items-center lg:w-full ">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                                ${signUpStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                        >
                                                            {step}
                                                        </div>
                                                        {/* Line between steps (except last) */}
                                                        {idx < 3 && (
                                                            <div
                                                                className={`flex-1 h-[2px] mx-0 my-0 min-w-[35px] md:min-w-[90px] 
                                                       ${signUpStep > step ? "bg-[#14AB55]" : "bg-gray-300"}`}

                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#14AB55] mb-6">
                                                We have sent a verification code to your phone {userPhone ? userPhone.slice(0, 3) + '****' + userPhone.slice(-4) : ''}
                                            </p>
                                        </div>

                                        <Form {...verificationForm}>
                                            <form onSubmit={verificationForm.handleSubmit(onPhoneVerificationSubmit)} className="space-y-6">
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
                                                {/* resend code section for phone verification */}
                                            <div>
                                                <Button
                                                    type="submit"
                                                    className='w-full h-11 bg-[#14AB55] text-white hover:bg-[#0f8b3d] disabled:bg-green-300 disabled:text-gray-800'
                                                    disabled={verifyPhoneCode.isPending}
                                                >
                                                    {verifyPhoneCode.isPending ? (
                                                        <>
                                                            Verifying...
                                                        
                                                            <PageLoader />
                                                        </>
                                                    ) : (
                                                        "Verify Phone"
                                                    )}
                                                </Button>
                                                    <div className="flex items-center justify-center text-sm my-3">
                                                    <span className="text-gray-600">Didn't get code?</span>
                                                    {phoneTimerActive ? (
                                                        <span className="text-gray-500">Resend in {phoneTimer}s</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResendCode('phone')}
                                                            className="text-[#14AB55] hover:underline disabled:text-gray-400"
                                                            disabled={resendCode.isPending}
                                                        >
                                                            {resendCode.isPending ? "Sending..." : "Resend Code"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            </form>
                                        </Form>
                                    </div>
                                )}

                                {signUpStep === 6 && (

                                    <Dialog
                                        open={showCongratulationsModal}
                                        onOpenChange={(isOpen) => {
                                            setShowCongratulationsModal(isOpen);
                                            if (!isOpen) {
                                                // Force user into login tab after closing modal
                                                setActiveTab("login");
                                                setSignUpStep(1); // Reset sign-up step for future sign-ups
                                            }
                                        }}
                                    >
                                        <DialogContent
                                            className="w-[310px] max-w-[310px] h-[310px] rounded-lg shadow-lg bg-cover bg-center "
                                            style={{ backgroundImage: `url('${SuccessfulSignUpBg}')` }}
                                        >

                                            <DialogHeader>
                                            </DialogHeader>
                                            <DialogFooter className=" flex align-center justify-center sm:flex-col space-y-2">
                                                <Button onClick={handleStartJourney} className=" bg-green-600 hover:bg-green-700 mb-[-10px] md:mb-10">
                                                    Let's Start
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                )}
                            </TabsContent>

                            {/* Login Tab */}
                            <TabsContent value="login">
                                {loginStep === 1 && (
                                    <div className="space-y-6  w-full  rounded-lg">
                                    <Form {...loginForm} >
                                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6  w-full  rounded-lg">
                                            {/* Email */}
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label>Email</Label>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Email" {...field}
                                                                value={field.value || ""}
                                                                type="email"
                                                                className="w-full h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Password */}
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label>Password</Label>
                                                        <div className="relative w-full">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Password" {...field}
                                                                    value={field.value || ""}
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

                                            {/* Remember me + Forgot password */}
                                            <div className="flex items-center justify-between text-sm">
                                                {/* Remember me */}
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <Input

                                                        type="checkbox" className="sr-only peer"
                                                    />
                                                    {/* custom box that reacts to the checkbox state */}
                                                    <span
                                                        className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center transition-colors peer-checked:bg-green-600 peer-checked:border-green-600 peer-focus:ring-2 peer-focus:ring-green-300"
                                                        aria-hidden="true"
                                                    >
                                                        {/* checkmark — hidden by default, shown when peer is checked */}
                                                        <svg
                                                            className="hidden peer-checked:block w-3 h-3 text-white"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-gray-700">Remember me</span>
                                                </label>

                                                {/* Forgot password link */}
                                                <NavLink
                                                    to="/forgot-password"
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Forgot password?
                                                </NavLink>
                                            </div>

                                            <Button type="submit" className="w-full bg-[#14AB55] text-white hover:bg-[#0f8b3d] h-11 disabled:bg-green-300 disabled:text-gray-800" disabled={loginUser.isPending}>
                                                {loginUser.isPending ? (
                                                    <>
                                                        Signing In...
                                                        <PageLoader />
                                                    </>
                                                ) : (
                                                    "Sign In"
                                                )}
                                            </Button>

                                        </form>
                                    </Form>
                                </div>
                                )}
                                {loginStep === 2 && (
                                    <ConfirmSignIn loginEmail={loginEmail} />
                                )}
                                        
                            </TabsContent>
                        </Tabs>


                    </CardContent>
                    {/* agree to terms text that is always located at the bottom */}
                    <CardFooter className="mt-auto text-xs text-center text-gray-500 pt-0 pb-4 px-4 lg:px-8">
                        <p>
                            By signing up to create an account, I accept Company's{" "}
                            <a href="/terms" className="text-green-600 hover:underline">
                                Terms of use
                            </a>{" "}
                            &{" "}
                            <a href="/privacy" className="text-green-600 hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </CardFooter>
                </Card>



                {/* Success Modal */}
                <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal} >
                    <DialogContent className="w-[310px] max-w-[310px]"  >
                        <img src={SuccessIcon} alt="Success" className="relative top-[-48px] w-12 h-12 mx-auto" />
                        <DialogHeader>
                            <DialogTitle className="text-green-600 mx-auto mb-4">Verification Successful!</DialogTitle>
                            <DialogDescription className="text-green-600 mx-auto mb-4 text-center">
                                Click on proceed to move to the next step.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className=" flex align-center justify-center sm:flex-col space-y-2">
                            <Button onClick={handleProceed} className=" bg-green-600 hover:bg-green-700">
                                Proceed
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Error Modal */}
                <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>

                    <DialogContent className="w-[310px] max-w-[310px]">
                        <img src={ErrorIcon} alt="Error" className="relative top-[-45px] w-12 h-12 mx-auto" />
                        <DialogHeader>
                            <DialogTitle className="text-red-600 mx-auto mb-4">Verification Error!</DialogTitle>
                            <DialogDescription className="text-red-600 mx-auto mb-4 text-center">
                                {errorMessage || "Please contact admin or try again later."}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className=" flex align-center justify-center sm:flex-col space-y-2">
                            <Button onClick={() => setShowErrorModal(false)}>Try Again</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default SignUpLoginPage;




