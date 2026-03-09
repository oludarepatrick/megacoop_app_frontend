import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { preRegisterSchema, type PreRegisterFormData } from "@/schemas/authSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/authService"
import type { AxiosError } from "axios"
import { useState } from "react"


type NewUserRegisterProps = {
    isOpen: boolean
    onClose: () => void
}

const NewUserRegister = ({ isOpen, onClose }: NewUserRegisterProps) => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const {register, handleSubmit, formState: { errors }, reset } = useForm<PreRegisterFormData>({
        resolver: zodResolver(preRegisterSchema)
    })

    const preRegisterMutation = useMutation({
        mutationFn: (data: PreRegisterFormData) => authService.preRegister(data),
        onSuccess: (response) => {
            console.log("Pre-registration successful", response)
            reset();
            onClose();
            setSuccessModalOpen(true);
            setSuccessMessage(
                `Our support team will 
                review your details and get in touch with you within 
                24hours to generate your access code.`
            );
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.log("Pre-registration failed", error)
            setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.")
        }
    })

    const handleSubmitRegistration = (data: PreRegisterFormData) => {
        console.log("Form submitted", data);
        setSuccessMessage("");
        setErrorMsg("");

        preRegisterMutation.mutate(data)
    }


    return (
        <>
            <Dialog open={isOpen} onOpenChange={open => {
                if(!open) {
                    onClose();
                    setErrorMsg("");
                    reset();
                }
            }}>
                <DialogContent className="font-manrope max-w-sm w-full">
                    <DialogHeader className="items-center"> 
                        <DialogTitle className="text-megaPrimary"> New User Registration</DialogTitle>
                        <DialogDescription>Welcome to our platform!</DialogDescription>
                    </DialogHeader>

                    {/* form fields would go here */}
                    <form  className="bg-white/80 rounded-lg space-y-4" onSubmit={handleSubmit(handleSubmitRegistration)}>
                        <div>
                            <Label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <Input
                                {...register("fullname")}
                                type="text" 
                                id="fullName" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg"
                                placeholder="enter your full name"
                                disabled={preRegisterMutation.isPending}
                                />
                            {errors.fullname && <p className="text-sm text-red-500 mt-1">{errors.fullname.message}</p>}

                        </div>
                        <div>
                            <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                {...register("email")}
                                type="email" 
                                id="email" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg"
                                placeholder="enter your email"
                                disabled={preRegisterMutation.isPending}
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                                Phone
                            </Label>
                            <Input
                                {...register("phone")}
                                type="tel" 
                                id="phone" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg"
                                placeholder="enter your phone number"
                                disabled={preRegisterMutation.isPending}
                            />
                            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>

                        <Button
                            type="submit" 
                            className="w-full bg-megagreen hover:bg-megagreen/90 text-white font-semibold py-2 px-4 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg"
                            disabled={preRegisterMutation.isPending}
                        >
                            {preRegisterMutation.isPending ? "Submitting" : "Register"}
                        </Button>
                        {errorMsg && <p className="text-sm text-red-500 mt-4 text-center">{errorMsg}</p>}
                    </form>

                </DialogContent>
            </Dialog>
        
            {/* Success Modal */}
            <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
                <DialogContent className=" max-w-sm w-full">
                    <DialogHeader>
                        <DialogTitle className="text-green-600 mx-auto mb-4">Registration Successful!</DialogTitle>
                        <DialogDescription className="text-green-600 mx-auto mb-4 text-center">
                            {successMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewUserRegister;