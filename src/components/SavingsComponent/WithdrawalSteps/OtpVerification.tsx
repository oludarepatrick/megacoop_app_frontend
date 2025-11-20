import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type OtpVerificationProps = {
    phone: string
    onVerify: () => void
    isPending: boolean
}
const OtpVerification = ({phone, onVerify, isPending}: OtpVerificationProps) => {
    const [timer, setTimer] = useState(30);
    const [otp, setOtp] = useState<string[]>(Array(5).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


    useEffect(()=> {
        if(timer <= 0) return;

        const interval = setInterval(()=>{
            setTimer(prev => prev-1);
        }, 1000)

        return () => clearInterval(interval)
    }, [timer]);

    // handle otp input change
    const handleInputChange = (index: number, value:string) => {
        if(!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if(value && index < 4){
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if(e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index -1]?.focus();
        };
    }

    const handleResent = () => {
        setTimer(30);
        setOtp(Array(5).fill(""))
        inputRefs.current[0]?.focus();
    }


    return (
        <div className="max-w-[400px] w-full mx-auto p-4 pb-12 flex flex-col gap-5 sm:px-0">
            <p className="text-center text-gray-600 text-sm">
                We have sent a 5 digit OTP to your phone <br />
                <span className="text-megagreen">{phone}</span>
            </p>
            {/* OTP Input box */}
            <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                    <Input
                        key={index}
                        ref={(el) => {inputRefs.current[index] = el;
                            return; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center sm:text-lg font-semibold border rounded-md focus:ring-2 focus:ring-green-500"
                    />
                ))}
            </div>
            <div className="mb-6 text-sm text-center font-medium">
                <span className="text-gray-600">Didn’t receive code?</span>{" "}
                {timer > 0 ? (
                    <span className="text-megagreen">Resend in {timer}s</span>
                ): (
                    <button className="bg-transparent hover:underline text-megagreen cursor-pointer" onClick={handleResent}>
                        Resend OTP
                    </button>
                )}
            </div>

            <Button className="bg-megagreen hover:bg-green-600"
                onClick={onVerify}
                disabled={isPending}
            >
                <Check/> Withdraw Money
            </Button>
        </div>
    )
}
export default OtpVerification;