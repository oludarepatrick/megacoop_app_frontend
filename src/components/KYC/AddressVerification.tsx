import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, type AddressFormData } from "@/schemas/kycSchema"
import { useState } from "react";
import { useKYCNavigation } from "@/hooks/useKYC";
import { useMutation } from "@tanstack/react-query";
import { kycService } from "@/services/kycService";
import { AxiosError } from "axios";

export const AddressUpload = ({onSuccess}: {onSuccess: () => void}) => {
    const [apiError, setApiError] = useState<string>("");
    const {refreshKYCStatus} = useKYCNavigation();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema)
    })

    const AddressUploadMutation = useMutation({
            mutationFn: (data: AddressFormData) => kycService.submitAddress(data),
            onSuccess: async (response) => {
                console.log("Address upload verification successful", response);
                setApiError("");
                await refreshKYCStatus();
                reset();
                onSuccess();
            },
            onError: (error: AxiosError<{message: string}>) => {
                console.log("Address Upload verification failed", error);
                setApiError(error.response?.data?.message || "Address Upload verification failed. Please try again.")
            }
        })

    const handleSubmitAddress = (data: AddressFormData) => {
        console.log("DATA SUBMITTED", data)
        setApiError("")

        AddressUploadMutation.mutate(data);
    }
    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-6 mt-20" onSubmit={handleSubmit(handleSubmitAddress)} >
            <div className="flex flex-col gap-4">
                <Label htmlFor="bvn">Enter your Address</Label>
                <Input 
                    type="text" 
                    id="bvn" {...register("address")}
                    disabled={AddressUploadMutation.isPending}
                    className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md"
                    placeholder="No 2 Smc  Quarters Ikoyi Layos Banana Ireland"
                 />
                { errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p> }
            </div>
            <div className=" flex flex-col gap-4 ">
                <Label htmlFor="upload">Upload proof of address (e.g. utility bill)</Label>
                <Input type="file" id="upload" 
                    {...register("proof_of_address")}
                    disabled={AddressUploadMutation.isPending}
                    className="py-8 border border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                />
                { errors.proof_of_address && <p className="text-sm text-red-500 mt-1">{String(errors.proof_of_address.message) || 'File error'}</p> }
            </div>
            <Button className="bg-megagreen hover:bg-megagreen/80" disabled={AddressUploadMutation.isPending}>
                {AddressUploadMutation.isPending ? "verifying..." : "Submit and proceed"}
            </Button>
            { apiError && <p className="text-sm text-red-500 mt-1">{apiError}</p> }
        </form>
    )
}
