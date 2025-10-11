import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IDUploadSchema, type UploadIDFormData } from "@/schemas/kycSchema"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "../ui/select";
import { useState } from "react";
import { useKYCNavigation } from "@/hooks/useKYC";
import { useMutation } from "@tanstack/react-query";
import { kycService } from "@/services/kycService";
import { AxiosError } from "axios";

export const IDUpload = ({onSuccess}: {onSuccess: () => void}) => {
    const [apiError, setApiError] = useState<string>("");
    const {refreshKYCStatus} = useKYCNavigation();

    const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm<UploadIDFormData>({
        resolver: zodResolver(IDUploadSchema)
    })

    const IDUploadMutation = useMutation({
        mutationFn: (data: UploadIDFormData) => kycService.submitIDUpload(data),
        onSuccess: async (response) => {
            console.log("ID upload verification successful", response);
            setApiError("");
            await refreshKYCStatus();
            reset();
            onSuccess();
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.log("ID Upload verification failed", error);
            setApiError(error.response?.data?.message || "ID Upload verification failed. Please try again.")
        }
    })

    const handleSubmitUploadData = (data: UploadIDFormData) => {
        console.log("DATA SUBMITTED", data);
        setApiError("");

        IDUploadMutation.mutate(data)        
    }
    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-6 mt-20" onSubmit={handleSubmit(handleSubmitUploadData)} >
            <div className="flex flex-col gap-4">
                <Label>Valid ID card</Label>
                <Select onValueChange={(value) => setValue("valid_id_card", value as "national-id-card" | "voters-card" | "drivers-license")}  disabled={IDUploadMutation.isPending}>
                    <SelectTrigger className="w-full border py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md">
                        <SelectValue placeholder="valid ID" />
                    </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="national-id-card">National ID card</SelectItem>
                            <SelectItem value="voters-card">Voters card</SelectItem>
                            <SelectItem value="drivers-license">Drivers License</SelectItem>
                        </SelectContent>
                    </Select>
                { errors.valid_id_card && <p className="text-sm text-red-500 mt-1">{errors.valid_id_card.message}</p> }
            </div>
            <div className=" flex flex-col gap-4 ">
                <Label htmlFor="upload">Upload Your ID card</Label>
                <Input type="file" id="upload" 
                    {...register("valid_id_card_path")}
                    disabled={IDUploadMutation.isPending}
                    className="py-8 border border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" 
                />
                { errors.valid_id_card_path && <p className="text-sm text-red-500 mt-1">{String(errors.valid_id_card_path.message) || 'File error'}</p> }
            </div>
            <Button className="bg-megagreen hover:bg-megagreen/80" disabled={IDUploadMutation.isPending}>
                {IDUploadMutation.isPending ? "verifying..." : "Submit and proceed"}
            </Button>
            { apiError && <p className="text-sm text-red-500 mt-1">{apiError}</p> }
        </form>
    )
}
