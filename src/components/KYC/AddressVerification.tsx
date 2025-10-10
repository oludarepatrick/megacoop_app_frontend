import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, type AddressFormData } from "@/schemas/kycSchema"

export const AddressUpload = ({onSuccess}: {onSuccess: () => void}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema)
    })

    const handleSubmitAddress = (data: AddressFormData) => {
        console.log("DATA SUBMITTED", data)
        reset();
        onSuccess();
        
    }
    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-6 mt-20" onSubmit={handleSubmit(handleSubmitAddress)} >
            <div className="flex flex-col gap-4">
                <Label htmlFor="bvn">Enter your Address</Label>
                <Input 
                    type="text" 
                    id="bvn" {...register("address")} 
                    className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md"
                    placeholder="No 2 Smc  Quarters Ikoyi Layos Banana Ireland"
                 />
                { errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p> }
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
