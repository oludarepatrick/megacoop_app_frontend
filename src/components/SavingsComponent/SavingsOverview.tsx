import { Card, CardContent, CardTitle } from "../ui/card";
import { useAuthStore } from "@/store/authStore";
import SavingsCard from "../SavingsCard";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useUserWallet } from "@/hooks/useAuth";
import { useTrendingProducts } from "@/hooks/useProducts";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";

const SavingsOverview = () => {
    const user = useAuthStore(state => state.user);
    const { data } = useUserWallet();
    const { data: products, isLoading } = useTrendingProducts(4); // Get 4 products
    const navigate = useNavigate();
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Auto-slide carousel every 3 seconds
    useEffect(() => {
        if (!products || products.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === products.length - 1 ? 0 : prevIndex + 1
            );
        }, 2000);
        
        return () => clearInterval(interval);
    }, [products]);
    
    // Handle manual dot click
    const handleDotClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleBuyNow = () => {
        if (!products || products.length === 0) return;
        // const currentProduct = products[currentImageIndex];
        navigate(`/user/market-place`);
        // navigate(`/user/market-place/product/${currentProduct.id}`);
    };
    
    return (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Card className="md:col-span-8 bg-gradient-to-br from-[#06152A] to-[#0E5D36] p-0 px-6 py-4 text-white md:justify-center">
                <SavingsCard amount={data?.total_savings.toLocaleString() || 0} firstName={user?.first_name || "dear"} />
            </Card>
            
            <Card className="md:col-span-4 bg-[#06152A] border-none text-white">
                <CardContent className="px-4">
                    {isLoading ? (
                        <div className="flex gap-4 items-start md:items-center">
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                                <Skeleton className="h-10 w-24 bg-gray-700" />
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-2 w-2 rounded-full bg-gray-700" />
                                    ))}
                                </div>
                            </div>
                            <Skeleton className="w-[120px] h-[120px] bg-gray-700" />
                        </div>
                    ) : !products || products.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No products available
                        </div>
                    ) : (
                        <div className="flex gap-4 items-start md:items-center">
                            <div className="flex-1 space-y-3">
                                <CardTitle className="text-sm md:text-base leading-tight">
                                    {products[currentImageIndex]?.product_name || "Best Deal Online Gadget"}
                                </CardTitle>
                                <Button 
                                    onClick={handleBuyNow}
                                    className="bg-megagold text-black rounded-xl text-xs md:text-sm px-3 py-2 hover:bg-megagold/90"
                                >
                                    Buy now
                                </Button>
                                
                                {/* Carousel Dots */}
                                <div className="flex justify-start gap-2 mt-3">
                                    {products.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDotClick(index)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === currentImageIndex 
                                                    ? 'w-6 bg-megagreen' 
                                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                            aria-label={`Go to product ${index + 1}`}
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
                                    {products.map((product) => (
                                        <img 
                                            key={product.product_id}
                                            src={product.images?.[0] || "/placeholder-product.png"} 
                                            alt={product.product_name} 
                                            className="w-full object-cover flex-shrink-0 rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}

export default SavingsOverview;

// import { Card, CardContent, CardTitle } from "../ui/card";
// import { useAuthStore } from "@/store/authStore";
// import SavingsCard from "../SavingsCard";
// import { Button } from "../ui/button";
// import { useState, useEffect } from "react";
// import Watch from "../../assets/watch-product.png"
// import { useUserWallet } from "@/hooks/useAuth";

// // Array of product images for carousel
// const productImages = [
//     Watch,
//     Watch, // Replace with different product images
//     Watch, // Replace with different product images
//     Watch, // Replace with different product images
// ];

// const SavingsOverview = () => {
//     const user = useAuthStore(state => state.user);
//     const {data} = useUserWallet()
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
//     // Auto-slide carousel every 3 seconds
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentImageIndex((prevIndex) => 
//                 prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
//             );
//         }, 2000);
        
//         return () => clearInterval(interval);
//     }, []);
    
//     // Handle manual dot click
//     const handleDotClick = (index: number) => {
//         setCurrentImageIndex(index);
//     };
    
//     return (
//         <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
//             <Card className="md:col-span-8 bg-gradient-to-br from-[#06152A] to-[#0E5D36] p-0 px-6 py-4 text-white md:justify-center">
//                 <SavingsCard amount={data?.total_savings.toLocaleString() || 0} firstName={user?.first_name || "dear"} />
//             </Card>
//             <Card className="md:col-span-4 bg-[#06152A] border-none text-white">
//                 <CardContent className="px-4">
//                     <div className="flex gap-4 items-start md:items-center">
//                         <div className="flex-1 space-y-3">
//                             <CardTitle className="text-sm md:text-base leading-tight">Best Deal Online Gadget</CardTitle>
//                             <Button className="bg-megagold text-black rounded-xl text-xs md:text-sm px-3 py-2">Buy now</Button>
                            
//                             {/* Carousel Dots */}
//                             <div className="flex justify-start gap-2 mt-3">
//                                 {productImages.map((_, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => handleDotClick(index)}
//                                         className={` h-2 rounded-full transition-all duration-300 ${
//                                             index === currentImageIndex 
//                                                 ? 'w-6 bg-megagreen' 
//                                                 : 'w-2 bg-gray-300 hover:bg-gray-400'
//                                         }`}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
                        
//                         {/* Carousel Image */}
//                         <div className="flex-shrink-0 w-full md:w-auto max-w-[120px] md:max-w-[100px] xl:max-w-[150px] relative overflow-hidden">
//                             <div 
//                                 className="flex transition-transform duration-500 ease-in-out"
//                                 style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
//                             >
//                                 {productImages.map((image, index) => (
//                                     <img 
//                                         key={index}
//                                         src={image} 
//                                         alt={`product-image-${index + 1}`} 
//                                         className="w-full object-cover flex-shrink-0"
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//         </section>
//     )
// }

// export default SavingsOverview ;
