import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bvnSchema, type BvnFormData } from "@/schemas/kycSchema"
import { useKYCNavigation } from "@/hooks/useKYC";
import { useMutation } from "@tanstack/react-query";
import { kycService } from "@/services/kycService";
import { useState } from "react";
import { AxiosError } from "axios";

export const KYCBVN = ({onSuccess}: {onSuccess: () => void}) => {
    const [apiError, setApiError] = useState<string>("");
    const { refreshKYCStatus } = useKYCNavigation();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<BvnFormData>({
        resolver: zodResolver(bvnSchema)
    })

    const bvnVerificationMutation = useMutation({
        mutationFn: (data:BvnFormData) => kycService.BVNVerification(data),
        onSuccess: async (response) => {
            console.log("BVN Verification successful", response);
            setApiError("");
            await refreshKYCStatus();
            reset();
            onSuccess();
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.log("BVN Verification failed", error);
            setApiError(error.response?.data?.message || "BVN verification failed. Please try again.")
        }
    })

    const handleSubmitBVN = (data: BvnFormData) => {
        console.log("DATA SUBMITTED", data)
        setApiError("");

        bvnVerificationMutation.mutate(data)
    }

    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20" onSubmit={handleSubmit(handleSubmitBVN)} >
            <Label htmlFor="bvn">Enter your BVN</Label>
            <Input type="text" id="bvn" 
                {...register("bvn")} 
                disabled={bvnVerificationMutation.isPending} 
                className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md"
            />
            { errors.bvn && <p className="text-sm text-red-500 mt-1">{errors.bvn.message}</p> }
            <Button className="bg-megagreen hover:bg-megagreen/80" disabled={bvnVerificationMutation.isPending}>
               {bvnVerificationMutation.isPending ? "verifying..." : "verify"}
            </Button>
            { apiError && <p className="text-sm text-red-500 mt-1">{apiError}</p> }
        </form>
    )
}
