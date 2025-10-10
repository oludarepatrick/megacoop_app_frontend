import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ninSchema, type NinFormData } from "@/schemas/kycSchema"

export const KYCNIN = ({onSuccess}: {onSuccess: () => void}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<NinFormData>({
        resolver: zodResolver(ninSchema)

    })

    const handleSubmitNIN = (data: NinFormData) => {
        console.log("DATA SUBMITTED", data)
        reset();
        onSuccess();
        
    }

    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20" onSubmit={handleSubmit(handleSubmitNIN)} >
            <Label htmlFor="NIN">Enter your NIN</Label>
            <Input type="text" id="NIN" {...register("nin")}  className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" />
            { errors.nin && <p className="text-sm text-red-500 mt-1">{errors.nin.message}</p> }
            <Button className="bg-megagreen hover:bg-megagreen/80">verify</Button>
        </form>
    )
}




