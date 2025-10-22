import type { AvailableInvestment, SimpleInvestmentModal, DetailedInvestmentModal } from "@/types/investmentType";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext } from "../ui/carousel";
import { Button } from "../ui/button";
import { useState } from "react";
import PooledInvestmentModal from "./PooledInvestmentModal";
import HousingInvestmentModal from "./HousingInvestmentModal";
import InvestmentTypeModal from "./InvestmentTypeModal";
import InvestPayment from "./InvestPayment";
import InvestmentConfirmPayment from "./InvestmentConfirmPayment";
import { InvestmentSuccessModal } from "./InvestmentSuccessModal";
import { InvestPaymentFailedModal } from "./investmentSecondaryModals";
import type { PooledFormData, HousingFormData } from "@/schemas/investSchema";

type AvailableInvestmentProps = {
    cards: AvailableInvestment[]
}

const AvailableInvestments = ({cards} : AvailableInvestmentProps) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [typeModalOpen, setTypeModalOpen] = useState(false)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [failureModalOpen, setFailureModalOpen] = useState(false)
    const [selectedInvestment, setSelectedInvestment] = useState<AvailableInvestment | null>(null)
    const [investmentData, setInvestmentData] = useState<PooledFormData | HousingFormData | null>(null)
    const [investmentAmount, setInvestmentAmount] = useState<number>(0)
    
    const handleApplyClick = () => {
        setDetailsModalOpen(false)
        setTypeModalOpen(true)
    }
    
    const handleProceedToPayment = (data: PooledFormData | HousingFormData) => {
        setInvestmentData(data)
        setPaymentModalOpen(true)
    }
    
    const handleProceedToConfirmation = (amount: number) => {
        setInvestmentAmount(amount)
        setConfirmPaymentModalOpen(true)
    }
    
    const handlePaymentSuccess = () => {
        setConfirmPaymentModalOpen(false)
        setSuccessModalOpen(true)
    }
    
    const handlePaymentFailure = () => {
        setConfirmPaymentModalOpen(false)
        setFailureModalOpen(true)
    }
    
    const handleCancelTransaction = () => {
        setConfirmPaymentModalOpen(false)
        setPaymentModalOpen(false)
        setTypeModalOpen(false)
        setDetailsModalOpen(false)
        setSelectedInvestment(null)
        setInvestmentData(null)
        setInvestmentAmount(0)
    }
    
    const handleCompleteFlow = () => {
        setSuccessModalOpen(false)
        setFailureModalOpen(false)
        setSelectedInvestment(null)
        setInvestmentData(null)
        setInvestmentAmount(0)
    }

    return (
        <div className="mt-4">
            <Carousel>
                <CarouselContent className="gap-3">
                    {cards.map((card) => (
                        <CarouselItem key={card.card.id} className="max-w-100">
                            <Card className="bg-[#06152A]">
                                <CardContent className="flex gap-2 justify-between items-center text-white ">
                                    <div className="space-y-2">
                                        <h3 className="max-w-[164px] text-[20px] font-semibold leading-6 ">{card.card.name}</h3>
                                        <div className={`${card.card.detailType === 'pooled' ? "bg-[#D56F1F]" : "bg-[#E1A728]"} p-2 text-sm rounded-lg font-semibold`}>
                                            <h4 className="text-xs">Minimum Investment</h4>
                                            <p className="text-base">{card.card.minInvestment.toLocaleString()}K</p>
                                            <p>ROI - {card.card.expectedReturn}</p>
                                            <p>Duration - {card.card.duration}</p>
                                        </div>
                                    </div>
                                    <div className="max-w-36 self-end">
                                        <img src={card.card.image} alt="" aria-hidden="true" className="w-full h-36 object-contain " />
                                    </div>
                                </CardContent>
                                <Button 
                                    className="bg-megagreen w-3/4 self-center rounded-full hover:bg-megagreen/60" 
                                    onClick={() => {
                                        setSelectedInvestment(card)
                                        setDetailsModalOpen(true)
                                    }}
                                >
                                    View Details to Apply
                                </Button>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext className="mr-30"/>
                <CarouselDots/>
            </Carousel>

            {/* Conditional Modal Rendering */}
            {detailsModalOpen && selectedInvestment && (
                <>
                    {selectedInvestment.card.detailType === 'pooled' && (
                        <PooledInvestmentModal
                            isOpen={detailsModalOpen}
                            onClose={() => {
                                setDetailsModalOpen(false)
                                setSelectedInvestment(null)
                            }}
                            onApply={handleApplyClick}
                            cardData={selectedInvestment.card}
                            modalData={selectedInvestment.modalData as SimpleInvestmentModal}
                        />
                    )}
                    {selectedInvestment.card.detailType === 'housing' && (
                        <HousingInvestmentModal
                            isOpen={detailsModalOpen}
                            onClose={() => {
                                setDetailsModalOpen(false)
                                setSelectedInvestment(null)
                            }}
                            onApply={handleApplyClick}
                            cardData={selectedInvestment.card}
                            modalData={selectedInvestment.modalData as DetailedInvestmentModal}
                        />
                    )}
                </>
            )}

            {/* Investment Type Modal */}
            {typeModalOpen && selectedInvestment && (
                <InvestmentTypeModal
                    isOpen={typeModalOpen}
                    onClose={() => {
                        setTypeModalOpen(false)
                        setSelectedInvestment(null)
                    }}
                    cardData={selectedInvestment.card}
                    modalData={selectedInvestment.modalData as SimpleInvestmentModal}
                    investmentType={selectedInvestment.card.detailType as "pooled" | "housing"}
                    onProceedToPayment={handleProceedToPayment}
                />
            )}
            
            {/* Payment Modal */}
            {paymentModalOpen && investmentData && (
                <InvestPayment
                    isOpen={paymentModalOpen}
                    onClose={() => {
                        setPaymentModalOpen(false)
                        setInvestmentData(null)
                    }}
                    investData={investmentData}
                    onProceedToConfirmation={handleProceedToConfirmation}
                />
            )}

            {/* Confirmation Payment Modal */}
            {confirmPaymentModalOpen && investmentData && (
                <InvestmentConfirmPayment
                    isOpen={confirmPaymentModalOpen}
                    onClose={() => {
                        setConfirmPaymentModalOpen(false)
                        setInvestmentData(null)
                    }}
                    onCancel={handleCancelTransaction}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    investData={investmentData}
                    amount={investmentAmount}
                />
            )}
            {/* Success Modal */}
            {successModalOpen && (
                <InvestmentSuccessModal
                    isOpen={successModalOpen}
                    onClose={handleCompleteFlow}
                    onConfirm={handleCompleteFlow}
                />
            )}
            {/* Failure Modal */}
            {failureModalOpen && (
                <InvestPaymentFailedModal
                    isOpen={failureModalOpen}
                    onClose={handleCompleteFlow}
                />
            )}
        </div>
    )
}
export default AvailableInvestments;