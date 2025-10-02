import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthCarousel from '@/components/AuthCarousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
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
const sendPasswordSchema = z.object({
    email: z.string().email("Invalid email"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set the path of the error to confirmPassword field
});

type SendPasswordFormData = z.infer<typeof sendPasswordSchema>;


const NewPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
    const [imgHeight, setImgHeight] = useState<number | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ if email or token missing, redirect or show error
  useEffect(() => {
    if (!email || !token) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, token, navigate]);

    // forms
    const SendPasswordForm = useForm<SendPasswordFormData>({
        resolver: zodResolver(sendPasswordSchema),
        defaultValues: {
            email,
            token,
            password: "",
            confirmPassword: "",
        },
    });

    // API mutations
    const sendResetPasswordMutation = useMutation({
        mutationFn: (data: SendPasswordFormData) => {
            return axios.post(`${API_BASE_URL}user/reset-password`,
                {
                    email: data.email,
                    token: data.token,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                });
        },

        onSuccess: (data) => {
            console.log("Password reset successful:", data);
            setSuccessMessage("Password has been reset successfully. Please login with your new password.");
            navigate('/login');

        }, onError: (error) => {
            if (error instanceof AxiosError) {
                console.error("Error sending reset email:", error.response?.data || error.message);
                const message = error.response?.data?.message || "Failed to reset password. Please try again.";
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
    const onSendPasswordSubmit = (data: SendPasswordFormData) => {
        sendResetPasswordMutation.mutate(data);
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
                                <div className="w-full">
                        <p className="text-sm text-center text-[#14AB55] mb-6 min-w-[35px]">
                            Enter your new password and confirm Password here!
                        </p>
                        <Form {...SendPasswordForm}>
                            <form onSubmit={SendPasswordForm.handleSubmit(onSendPasswordSubmit)} className="space-y-6">
                                <input type="hidden" {...SendPasswordForm.register("email")} value={email || ""} />
                                <input type="hidden" {...SendPasswordForm.register("token")} value={token || ""} />
                                <FormField
                                    control={SendPasswordForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <>
                                         <FormItem>
                                            <FormLabel>Password</FormLabel>
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
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <FormMessage />
                                             </FormItem>
                                            </>
                                    )}
                                    />
                                <FormField
                                    control={SendPasswordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <>
                                         <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Confirm Password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        {...field}
                                                        className="pr-10 h-11"
                                                    />
                                                </FormControl>
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <FormMessage />
                                             </FormItem>
                                            </>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                                    disabled={sendResetPasswordMutation.isPending}
                                >
                                    {sendResetPasswordMutation.isPending ? <>Sending... <PageLoader /></> : 'Reset Password'}
                                </Button>
                            </form>
                        </Form>
                        {successMessage && <p className="text-sm text-center text-green-600 mt-4">{successMessage}</p>}
                    </div>
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

export default NewPassword;