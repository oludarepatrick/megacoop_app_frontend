import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {    
    const navigate = useNavigate();

    return (
        <main role="main" aria-labelledby="not-found-page-heading">
            <section className="min-h-screen flex items-center justify-center py-6 bg-megagrey">
                <Card className="w-full max-w-2xl font-manrope">
                    <CardContent className="flex flex-col justify-center text-center gap-4 p-6">
                        <h1
                            className="text-4xl font-bold text-center text-megagreen border-b pb-4"
                            id="not-found-page-heading"
                        >
                        Ooops!
                        </h1>
                        <p className="text-3xl font-medium">Error 404</p>
                        <p className="text-2xl font-medium">Page you are looking for is not found</p>
                        <Button onClick={() => navigate("/")} className="self-center bg-megagreen rounded-full hover:bg-dark">Go Back to Home</Button>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}

export default NotFound;

