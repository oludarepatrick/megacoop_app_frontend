import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useVerifyLoginOtp, useResendLoginOtp } from "@/hooks/useAuth";

interface ConfirmSignInProps {
  loginEmail: string;
  loginPassword?: string;
}

export default function ConfirmSignIn({ loginEmail, loginPassword }: ConfirmSignInProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use authentication hook
  const verifyOtp = useVerifyLoginOtp(
    () => {
      setStatusMessage("✅ Code verified successfully. Redirecting...");
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1000);
    },
    (error) => {
      setStatusMessage(`❌ ${error}`);
    }
  );

  // Resend OTP hook
  const resendOtp = useResendLoginOtp(
    () => {
      setStatusMessage("✅ OTP resent successfully!");
      setTimer(30);
      setTimerActive(true);
      setTimeout(() => setStatusMessage(null), 3000);
    },
    (error) => {
      setStatusMessage(`❌ ${error}`);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  );

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timer]);

  // Handle OTP change
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }

    // if last digit filled → fire request
    if (index === 5 && value) {
      const fullCode = newOtp.join("");
      verifyOtp.mutate({ email: loginEmail, otp: fullCode });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h4 className="text-lg font-medium text-gray-700 mb-2">Confirm Sign In</h4>
      <p className="text-sm text-[#14AB55] mb-6">
        We have sent a 6-digit code to your email{" "}
        {loginEmail ? loginEmail.replace(/(.{2})(.*)(?=@)/, "$1****") : ""}
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mb-4">
        {otp.map((digit, idx) => (
            <Input
                key={idx}
                ref={(el) => {
                    inputRefs.current[idx] = el;
                    return; // ensures it returns void
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:ring-2 focus:ring-green-500"
            />
        ))}
      </div>

      {/* Resend Section */}
      <div className="mb-6 text-sm">
        <span className="text-gray-600">Didn’t receive code?</span>{" "}
        {timerActive ? (
          <span className="text-gray-500">Resend in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (loginPassword) {
                resendOtp.mutate({ email: loginEmail, password: loginPassword });
              } else {
                setStatusMessage("❌ Unable to resend - missing credentials");
              }
            }}
            className="text-[#14AB55] hover:underline disabled:text-gray-400"
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? "Sending..." : "Resend Code"}
          </button>
        )}
      </div>

      {/* Disabled button for UI consistency */}
      <Button
        disabled
        className="w-full h-11 bg-[#14AB55] text-white opacity-50 cursor-not-allowed"
      >
        {verifyOtp.isPending ? (
          <>
            Verifying... <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          </>
        ) : (
          "Proceed to Sign In"
        )}
      </Button>

      {/* Status Message */}
      {statusMessage && (
        <p
          className={`mt-4 text-sm ${
            statusMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
