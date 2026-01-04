import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { StackedCarousel } from "../ui/stacked-carousel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrendingProducts } from "@/hooks/useProducts";
import { Skeleton } from "../ui/skeleton"; // Add skeleton for loading

const MarketView = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const navigate = useNavigate();
    
    // Fetch 3 trending products
    const { data: products, isLoading, isError } = useTrendingProducts(3);

    const handleBuyNow = () => {
        if (!products || products.length === 0) return;
        
        const currentProduct = products[currentProductIndex];
        console.log("Buying:", currentProduct.product_name);
        
        // Navigate to specific product page
        navigate(`/user/market-place`);
        // navigate(`/user/market-place/product/${currentProduct.product_id}`);
    };

    // Loading state
    if (isLoading) {
        return (
            <Card className="px-4 py-4">
                <CardHeader className="flex justify-between px-2">
                    <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <Skeleton className="h-80 md:h-96 rounded-3xl" />
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (isError || !products || products.length === 0) {
        return (
            <Card className="px-4 py-4">
                <CardHeader className="flex justify-between px-2">
                    <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="text-center py-12 text-muted-foreground">
                        No trending products available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="px-4 py-4">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
            </CardHeader>
            
            <CardContent className="px-0">
                <StackedCarousel
                    items={products.map(product => ({
                        id: product.product_id.toString(),
                        content: (
                            <div className="w-full h-full rounded-3xl flex flex-col gap-6 px-6">
                                <img 
                                    src={product.images?.[0] || "/placeholder-product.png"} 
                                    alt={product.product_name} 
                                    className="object-cover aspect-square rounded-2xl" 
                                />
                            </div>
                        )
                    }))}
                    autoPlay={true}
                    autoPlayInterval={3000}
                    showControls={false}
                    showIndicators
                    onSlideChange={(index) => {
                        setCurrentProductIndex(index);
                    }}
                    cardClassName="h-80 md:h-96 lg:h-112"
                />
                <div className="mt-4 flex justify-center">
                    <Button
                        onClick={handleBuyNow}
                        className="bg-[#D4AF37] hover:bg-[#C5A028] text-black rounded-full px-10 py-6 text-lg font-bold shadow-lg transition-all transform hover:scale-105"
                    >
                        Buy now
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MarketView;



// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import oraimo from "../../assets/marketplace/face-cream-display.png"
// import watch from "../../assets/marketplace/casual-t-shirt.png"
// import image3 from "../../assets/marketplace/wireless-headphones.png"
// import { Button } from "../ui/button";
// import { StackedCarousel } from "../ui/stacked-carousel";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const products = [
//   { id: 1, img: oraimo, name: "Oraimo Smart Watch", brand: "oraimo" },
//   { id: 2, img: image3, name: "Oraimo Earbuds", brand: "oraimo" },
//   { id: 3, img: watch, name: "Oraimo Power Bank", brand: "oraimo" },  
// ];

// const MarketView = () => {
//     const [currentProductIndex, setCurrentProductIndex] = useState(0);

//     const navigate = useNavigate()

//     const handleBuyNow = () => {
//         const currentProduct = products[currentProductIndex];
//         console.log("Buying:", currentProduct.name);
//         navigate("/user/market-place")
//         // Add your buy logic here (open modal, navigate to product page, etc.)
//     };
//     return (
//         <Card className="px-4 py-4">
//             <CardHeader className="flex justify-between px-2">
//                 <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
//             </CardHeader>
            
//             <CardContent className="px-0">
//                 <StackedCarousel
//                     items={products.map(product => ({
//                         id: product.id.toString(), // Convert to string
//                         content: (
//                             <div className="w-full h-full rounded-3xl flex flex-col gap-6 px-6">
//                                 {/* <div className="w-full overflow-hidden rounded-2xl bg-muted flex items-center justify-center"> */}
//                                     <img src={product.img} alt={product.name} className="object-cover aspect-square rounded-2xl" />
//                                 {/* </div> */}
                                
//                             </div>
//                         )
//                     }))}
//                     autoPlay={true}
//                     autoPlayInterval={2000}
//                     showControls={false}
//                     showIndicators
//                     onSlideChange={(index) => {
//                         setCurrentProductIndex(index);
//                     }}
//                     cardClassName="h-80 md:h-96 lg:h-112"
                    
                    
//                 />
//                 <div className="mt-4 flex justify-center">
//                     <Button
//                         onClick={handleBuyNow}
//                         className="bg-[#D4AF37] hover:bg-[#C5A028] text-black rounded-full px-10 py-6 text-lg font-bold shadow-lg transition-all transform hover:scale-105"
//                     >
//                         Buy now
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default MarketView;