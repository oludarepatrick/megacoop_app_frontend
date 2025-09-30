import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthCarousel from '@/components/AuthCarousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import ErrorIcon from '../../assets/Error_icon.png';
import megacoop_logo from '../../assets/megacoop-logo-1.png';
import PageLoader from '@/components/PageLoader';


const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://34.170.169.65/api/v1/';

// Zod schemas
const sendEmailSchema = z.object({
    email: z.string().nonempty("email is required").email("Invalid email format"),
});

type SendEmailFormData = z.infer<typeof sendEmailSchema>;


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [imgHeight, setImgHeight] = useState<number | undefined>(undefined);
    const [userEmail, setUserEmail] = useState("");
    // const [userPhone, setUserPhone] = useState("");
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    // forms
    const SendEmailForm = useForm<SendEmailFormData>({
        resolver: zodResolver(sendEmailSchema),
        defaultValues: {
            email: "",
        },
    });

    // API mutations
    const sendResetEmailMutation = useMutation({
        mutationFn: (data: SendEmailFormData) => {
            return axios.post(`${API_BASE_URL}/auth/forgot-password`, { email: data.email });
        },

        onSuccess: (data) => {
            console.log("Reset email sent successfully:", data);
            setSuccessMessage("Link for reset password has been sent to this email");
            setForgotPasswordStep(2);
            
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                console.error("Error sending reset email:", error.response?.data || error.message);
                const message = error.response?.data?.message || "Failed to send reset email. Please try again.";
                handleError(message);
            } else {
                console.error("Unexpected error:", error);
                handleError("An unexpected error occurred. Please try again.");
            }
        },
    });

    const handleError = (message: string) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    };

    // Form handlers
    const onSendEmailSubmit = (data: SendEmailFormData) => {
        sendResetEmailMutation.mutate(data);
        setUserEmail(data.email);
    };


    const renderforgotPasswordStep = () => {
        switch (forgotPasswordStep) {
            case 1:
                return (
                    <div className="w-full">
                        <p className="text-sm text-center text-[#14AB55] mb-6 min-w-[35px]">
                            Forgot password! Enter your registered email to reset password
                        </p>
                        <Form {...SendEmailForm}>
                            <form onSubmit={SendEmailForm.handleSubmit(onSendEmailSubmit)} className="space-y-7">
                                <FormField
                                    control={SendEmailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='h-11 bg-green-50'
                                                    placeholder="Email"
                                                    type="email" {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                                    disabled={sendResetEmailMutation.isPending}
                                >
                                    {sendResetEmailMutation.isPending ? <>Sending... <PageLoader /></> : 'Reset Password'}
                                </Button>
                            </form>
                        </Form>
                        {successMessage && <p className="text-sm text-center text-green-600 mt-4">{successMessage} <br /> <span className="text-gray-500">{userEmail.replace(/(.{4})(.*)(@.*)/, "$1****$3")}</span></p>}
                    </div>
                );
            case 2:
                return (
                    <div className="w-full">
                        <p className="text-sm text-[#14AB55] mb-6 min-w-[35px]">
                        Please check your email for the password reset link.
                        </p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                        >
                            Back to Login
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-row justify-between h-165 lg:h-auto lg:items-center bg-transparent px-4 overflow-hidden relative">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute -bottom-50 right-[-120px] h-[400px] w-[400px] rounded-full bg-transparent border-[100px] border-[#0F7033] opacity-50 z-0"
            />

            <AuthCarousel
                imgHeight={imgHeight}
                onImgHeightChange={setImgHeight}
            />


            <div className="overflow-hidden items-stretch flex justify-center p-4 flex-1 relative">
                        <Card
                            className="overflow-auto scrollbar-hide w-full lg:border-0 shadow-none max-w-md z-10 lg:bg-transparent"
                            style={{ height: imgHeight ? `${imgHeight}px` : "auto" }}
                        >
                            <CardHeader className="text-center mb-[-20px] pt-0">
                                <img src={megacoop_logo} alt="MegaCoop Logo" className="mx-auto w-32 h-auto object-contain" />
                            </CardHeader>
                            <CardContent className="w-full relative">
                                {forgotPasswordStep === 1 && (
                                    <>
                                       
                                        {renderforgotPasswordStep()}
                                    </>
                                    )}
                                    
                                
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
                    <DialogFooter className="flex align-center justify-center sm:flex-col space-y-2">
                        <Button onClick={() => setShowErrorModal(false)}>Try Again</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default ForgotPassword;