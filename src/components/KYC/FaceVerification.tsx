import { useRef } from "react"
import { Button } from "../ui/button"
import Webcam from "react-webcam"
import { useFaceVerification } from "@/hooks/useFaceVerification"
import facialImg from "@/assets/facial-img.png"

export const FaceVerification = ({onSuccess}: {onSuccess: () => void}) => {
    const webcamRef = useRef<Webcam>(null)
    
    const {
        step,
        capturedImage,
        isStarting,
        isSending,
        handleStart,
        handleCapture,
        handleRetake,
        handleSubmit,
        setStep
    } = useFaceVerification(onSuccess)
    
    const handleCaptureClick = () => handleCapture(webcamRef)
    
    const handleSubmitClick = async () => {
        await handleSubmit()
        if (step === 'complete') {
            onSuccess()
        }
    }

    return (
        <div className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20">
            {step === 'instructions' && (
                <>
                    <img src={facialImg} alt="Face verification instructions" />
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Position your face clearly in the camera and click start to begin verification.
                        </p>
                    </div>
                    <Button 
                        onClick={handleStart} 
                        disabled={isStarting}
                        className="bg-megagreen hover:bg-megagreen/80"
                    >
                        {isStarting ? "Starting..." : "Start Verification"}
                    </Button>
                </>
            )}

            {/* Camera View */}
            {step === 'camera' && (
                <>
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">
                            Position your face in the center and click capture
                        </p>
                    </div>
                    
                    <div className="relative">
                        <Webcam 
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="rounded-lg shadow-lg w-full"
                            videoConstraints={{
                                facingMode: "user",
                                width: 640,
                                height: 480,
                            }}
                        />
                        
                        {/* Face guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="sm:w-48 sm:h-60 w-38 h-44 border-2 border-megagreen rounded-full opacity-50" />
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                        <Button 
                            onClick={handleCaptureClick}
                            className="bg-megagreen hover:bg-megagreen/80 flex-1"
                        >
                            Capture Photo
                        </Button>
                        <Button 
                            onClick={() => setStep('instructions')}
                            variant="outline"
                            className="px-4"
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}

            {/* Image Preview */}
            {step === 'captured' && capturedImage && (
                <>
                    <div className="text-center mb-4">
                        <h3 className="font-semibold text-lg mb-2">
                            Review Your Photo
                        </h3>
                        <p className="text-sm text-gray-600">
                            Make sure your face is clear and well-lit
                        </p>
                    </div>
                    
                    <div className="relative max-w-[200px] mx-auto ">
                        <img 
                            src={capturedImage} 
                            alt="Captured face" 
                            className="w-full p-2 " 
                        />
                        
                        {/* Corner frames for styling */}
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-10 border-l-10 border-megagreen rounded-lg" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-10 border-r-10 border-megagreen rounded-lg" />
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-10 border-l-10 border-megagreen rounded-lg" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-10 border-r-10 border-megagreen rounded-lg" />
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                        <Button 
                            onClick={handleSubmitClick}
                            disabled={isSending}
                            className="bg-megagreen hover:bg-megagreen/80 flex-1"
                        >
                            {isSending ? "Submitting..." : "Submit Photo"}
                        </Button>
                        <Button 
                            onClick={handleRetake}
                            variant="outline"
                            disabled={isSending}
                            className="px-4"
                        >
                            Retake
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
