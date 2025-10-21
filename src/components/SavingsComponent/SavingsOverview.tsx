import { Card, CardContent, CardTitle } from "../ui/card";
import { useAuthStore } from "@/store/authStore";
import SavingsCard from "../SavingsCard";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Watch from "../../assets/watch-product.png"
import { useUserWallet } from "@/hooks/useAuth";

// Array of product images for carousel
const productImages = [
    Watch,
    Watch, // Replace with different product images
    Watch, // Replace with different product images
    Watch, // Replace with different product images
];

const SavingsOverview = () => {
    const user = useAuthStore(state => state.user);
    const {data} = useUserWallet()
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Auto-slide carousel every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 2000);
        
        return () => clearInterval(interval);
    }, []);
    
    // Handle manual dot click
    const handleDotClick = (index: number) => {
        setCurrentImageIndex(index);
    };
    
    return (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Card className="md:col-span-8 bg-gradient-to-br from-[#06152A] to-[#0E5D36] p-0 px-6 py-4 text-white md:justify-center">
                <SavingsCard amount={data?.total_savings.toLocaleString() || 0} firstName={user?.first_name || "dear"} />
            </Card>
            <Card className="md:col-span-4 bg-[#06152A] border-none text-white">
                <CardContent className="px-4">
                    <div className="flex gap-4 items-start md:items-center">
                        <div className="flex-1 space-y-3">
                            <CardTitle className="text-sm md:text-base leading-tight">Best Deal Online Gadget</CardTitle>
                            <Button className="bg-megagold text-black rounded-xl text-xs md:text-sm px-3 py-2">Buy now</Button>
                            
                            {/* Carousel Dots */}
                            <div className="flex justify-start gap-2 mt-3">
                                {productImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        className={` h-2 rounded-full transition-all duration-300 ${
                                            index === currentImageIndex 
                                                ? 'w-6 bg-megagreen' 
                                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Carousel Image */}
                        <div className="flex-shrink-0 w-full md:w-auto max-w-[120px] md:max-w-[100px] xl:max-w-[150px] relative overflow-hidden">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {productImages.map((image, index) => (
                                    <img 
                                        key={index}
                                        src={image} 
                                        alt={`product-image-${index + 1}`} 
                                        className="w-full object-cover flex-shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </section>
    )
}

export default SavingsOverview ;
