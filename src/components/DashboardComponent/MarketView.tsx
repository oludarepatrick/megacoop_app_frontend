import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import oraimo from "../../assets/marketplace/face-cream-display.png"
import watch from "../../assets/marketplace/casual-t-shirt.png"
import image3 from "../../assets/marketplace/wireless-headphones.png"
import { Button } from "../ui/button";
import { StackedCarousel } from "../ui/stacked-carousel";
import { useState } from "react";

const products = [
  { id: 1, img: oraimo, name: "Oraimo Smart Watch", brand: "oraimo" },
  { id: 2, img: image3, name: "Oraimo Earbuds", brand: "oraimo" },
  { id: 3, img: watch, name: "Oraimo Power Bank", brand: "oraimo" },  
];

const MarketView = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    const handleBuyNow = () => {
        const currentProduct = products[currentProductIndex];
        console.log("Buying:", currentProduct.name);
        // Add your buy logic here (open modal, navigate to product page, etc.)
    };
    return (
        <Card className="px-4 py-4">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
            </CardHeader>
            
            <CardContent className="px-0">
                <StackedCarousel
                    items={products.map(product => ({
                        id: product.id.toString(), // Convert to string
                        content: (
                            <div className="w-full h-full rounded-3xl flex flex-col gap-6 px-6">
                                {/* <div className="w-full overflow-hidden rounded-2xl bg-muted flex items-center justify-center"> */}
                                    <img src={product.img} alt={product.name} className="object-cover aspect-square rounded-2xl" />
                                {/* </div> */}
                                
                            </div>
                        )
                    }))}
                    autoPlay={true}
                    autoPlayInterval={2000}
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