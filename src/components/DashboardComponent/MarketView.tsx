import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import oraimo from "../../assets/oraimo-product.svg"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { Button } from "../ui/button";



const products = [
  { id: 1, img: oraimo},
  { id: 2, img: oraimo},
  { id: 3, img: oraimo},  
  
]

const MarketView= () => {
    
    return (
        // <section className="">
        <Card className="px-4 py-4 ">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-xl font-semibold">Trending Product</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel plugins={[Autoplay({delay: 2000}),]}>
                    <CarouselContent>
                        {products.map(product => (
                            <CarouselItem key={product.id} className="flex items-center flex-col justify-center gap-4">
                                <img src={product.img} alt="trending-products" />
                                <Button className="bg-megagold rounded-2xl">Buy now</Button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots/>
                </Carousel>
                
            </CardContent>
        </Card>
        // </section>
    )
}

export default MarketView;