import AvailableInvestments from "@/components/InvestmentComponent/AvailableInvestment";
import InvestmentCards from "@/components/InvestmentComponent/InvestmentCards";
import InvestmentPortfolio from "@/components/InvestmentComponent/InvestmentPortfolio";
import TrendingInvestment from "@/components/InvestmentComponent/TrendingInvestment";
import PageLoader from "@/components/PageLoader";
import { useInvestmentData, 
    useActiveInvestments, 
    useUserInvestment,
    useTrendingInvestment} from "@/hooks/useInvestment";

const Investment = () => {
    const { data: investmentData, isLoading, isError } = useInvestmentData();
    const { data: allInvestment} = useActiveInvestments();
    const { data: userInvestment = [], isLoading: loading} = useUserInvestment()
    const { data: trendingInvestment = [], isLoading: loadingInvestment } = useTrendingInvestment();

    if (isLoading) return <PageLoader />;
    if (isError) return <div className="text-red-500">Error loading investment data. Please try again later.</div>;

    return (
        <div className="font-poppins">
            <InvestmentCards data={investmentData} totalInvestment={userInvestment} />
            <AvailableInvestments cards={allInvestment || [] } investmentlength={allInvestment.length}/>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-7 flex flex-col gap-5">
                    <InvestmentPortfolio investments={userInvestment} isLoading={loading} />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-5">
                    <TrendingInvestment trendingInvestment={trendingInvestment} isLoading={loadingInvestment} />
                </div>
            </div>
        </div>
    )
}

export default Investment;