import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IDUploadSchema, type UploadIDFormData } from "@/schemas/kycSchema"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "../ui/select";

export const IDUPload = ({onSuccess}: {onSuccess: () => void}) => {
    const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm<UploadIDFormData>({
        resolver: zodResolver(IDUploadSchema)
    })

    const handleSubmitUploadData = (data: UploadIDFormData) => {
        console.log("DATA SUBMITTED", data)
        reset();
        onSuccess();
        
    }
    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-6 mt-20" onSubmit={handleSubmit(handleSubmitUploadData)} >
            <div className="flex flex-col gap-4">
                <Label>Valid ID card</Label>
                <Select onValueChange={(value)=> setValue("card_type", value as "international-passport" | "drivers-license" | "others")}>
                    <SelectTrigger className="w-full border py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md">
                        <SelectValue placeholder="valid ID" />
                    </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="international-passport">International Passport</SelectItem>
                            <SelectItem value="drivers-license">Drivers License</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                    </Select>
                { errors.card_type && <p className="text-sm text-red-500 mt-1">{errors.card_type.message}</p> }
            </div>
            <div className=" flex flex-col gap-4 ">
                <Label htmlFor="upload">Upload Your ID card</Label>
                <Input type="file" id="upload" {...register("file")} className="py-8 border border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" />
                { errors.file && <p className="text-sm text-red-500 mt-1">{String(errors.file.message) || 'File error'}</p> }
            </div>
            <Button className="bg-megagreen hover:bg-megagreen/80">Submit and proceed</Button>
        </form>
    )
}
