import { useRef, useState } from "react"
import { Button } from "../ui/button"
import Webcam from "react-webcam"
import facialImg from "@/assets/facial-img.png"

export const FaceVerification = ({onSuccess}: {onSuccess: () => void}) => {
    const webcamRef = useRef<Webcam>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [isCapturing, setIsCapturing] = useState(false)

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if(imageSrc) setCapturedImage(imageSrc);
    };

    const handleStart = () => {
        setIsCapturing(true);
        setCapturedImage(null);
    }

    const handleRetake = () => {
        setCapturedImage(null);
        setIsCapturing(true);
    }

    const handleVerify = () => {
        if(!capturedImage) return;
        console.log("verifying", capturedImage);
        onSuccess();
    }


    return (
        <div className="max-w-[358px] mx-auto flex flex-col gap-4 mt-20">
            {!isCapturing && !capturedImage && (
                <>
                    <img src={facialImg} alt="" />
                    <Button onClick={handleStart} className="bg-megagreen hover:bg-megagreen/80">Start </Button>
                </>
            )}

            {isCapturing && !capturedImage && (
                <>
                    <Webcam 
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="rounded-lg shadow-lg"
                        videoConstraints={{
                            facingMode: "user",
                            width: 300,
                            height: 300,
                        }}
                    />
                    <Button
                        onClick={capture}
                        className="bg-megagreen hover:bg-megagreen/80"
                    >
                        capture
                    </Button>
                </>
            )}

            { capturedImage && (
                <>
                <div className="flex flex-col items-center gap-3">
                    <div className="relative rounded-lg p-6">
                        <img 
                            src={capturedImage} alt="captured-face" 
                            className="rounded-lg w-[150px] h-[150px]" 
                        />
                        {/* corner frames */}
                        <span className="absolute top-2 left-2 w-10 h-10 border-t-10 border-l-10 border-megagreen rounded-lg"></span>
                        <span className="absolute top-2 right-2 w-10 h-10 border-t-10 border-r-10 border-megagreen rounded-lg"></span>
                        <span className="absolute bottom-2 left-2 w-10 h-10 border-b-10 border-l-10 border-megagreen rounded-lg"></span>
                        <span className="absolute bottom-2 right-2 w-10 h-10 border-b-10 border-r-10 border-megagreen rounded-lg"></span>
                    </div>

                </div>
                    <div className="flex justify-between gap-4 flex-wrap justify-center items-center ">
                        <Button onClick={handleRetake} className="bg-megagreen hover:bg-megagreen/80">Retake</Button>
                        <Button onClick={handleVerify} className="bg-megagreen hover:bg-megagreen/80 px-6">verify</Button>
                    </div>
                </>
            )}
            

        </div>
    )
}
