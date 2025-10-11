import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ninSchema, type NinFormData } from "@/schemas/kycSchema"
import { kycService } from "@/services/kycService"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useKYCNavigation } from "@/hooks/useKYC"
import { AxiosError } from "axios";

export const KYCNIN = ({onSuccess}: {onSuccess: () => void}) => {
    const [apiError, setApiError] = useState<string>("");
    const { refreshKYCStatus } = useKYCNavigation();
    
    const {register, handleSubmit, reset, formState: {errors}} = useForm<NinFormData>({
        resolver: zodResolver(ninSchema)
    });
    
    // Mutation for NIN verification
    const ninVerificationMutation = useMutation({
        mutationFn: (data: NinFormData) => kycService.NINVerification(data),
        onSuccess: async (response) => {
            console.log("NIN verification successful:", response);
            setApiError("");
            await refreshKYCStatus();
            reset();
            onSuccess();
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.error("NIN verification failed:", error);
            const errorMessage = error.response?.data?.message || "NIN verification failed. Please try again.";
            setApiError(errorMessage);
        }
    });

    const handleSubmitNIN = (data: NinFormData) => {
        console.log("Submitting NIN:", data);
        setApiError(""); // Clear previous errors
        ninVerificationMutation.mutate(data);
    }

    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20" onSubmit={handleSubmit(handleSubmitNIN)} >
            <Label htmlFor="NIN">Enter your NIN</Label>
            <Input type="text" id="NIN" 
                {...register("nin")} 
                className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                disabled={ninVerificationMutation.isPending}
            />
            {errors.nin && <p className="text-sm text-red-500 mt-1">{errors.nin.message}</p>}
            <Button type="submit" className="bg-megagreen hover:bg-megagreen/80" disabled={ninVerificationMutation.isPending} >
                {ninVerificationMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
            {apiError && <p className="text-sm text-red-500 mt-1">{apiError}</p>}
        </form>
    )
}