import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bvnSchema, type BvnFormData } from "@/schemas/kycSchema"

export const KYCBVN = ({onSuccess}: {onSuccess: () => void}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<BvnFormData>({
        resolver: zodResolver(bvnSchema)
    })

    const handleSubmitBNV = (data: BvnFormData) => {
        console.log("DATA SUBMITTED", data)
        reset();
        onSuccess();
        
    }

    return (
        <form className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20" onSubmit={handleSubmit(handleSubmitBNV)} >
            <Label htmlFor="bvn">Enter your BVN</Label>
            <Input type="text" id="bvn" {...register("bvn")} className="py-5 border-gray-300 rounded-md focus:!outline-none focus:!ring focus:!ring-megagreen focus:!shadow-md" />
            { errors.bvn && <p className="text-sm text-red-500 mt-1">{errors.bvn.message}</p> }
            <Button className="bg-megagreen hover:bg-megagreen/80">verify</Button>
        </form>
    )
}
