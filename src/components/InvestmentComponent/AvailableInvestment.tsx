import type { ApiInvestment, AvailableInvestment, DetailedInvestment, SimpleInvestment } from "@/types/investmentType";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Button } from "../ui/button";
import { useState } from "react";
import PooledInvestmentModal from "./PooledInvestmentModal";
import HousingInvestmentModal from "./HousingInvestmentModal";
import InvestmentTypeModal from "./InvestmentTypeModal";
import InvestPayment from "./InvestPayment";
import InvestmentConfirmPayment from "./InvestmentConfirmPayment";
import { InvestmentSuccessModal } from "./InvestmentSuccessModal";
import { InvestPaymentFailedModal } from "./investmentSecondaryModals";
import type { InvestPaymentFormData } from "@/schemas/investSchema";
import ApiInvestmentModal from "./ApiInvestmentModal";

type AvailableInvestmentProps = {
  cards: AvailableInvestment[];
  investmentlength: number;
};

const AvailableInvestments = ({ cards, investmentlength }: AvailableInvestmentProps) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<AvailableInvestment | null>(null);
  const [investmentData, setInvestmentData] = useState<InvestPaymentFormData | null>(null);

  const closeAllModals = () => {
    setDetailsModalOpen(false);
    setTypeModalOpen(false);
    setPaymentModalOpen(false);
    setConfirmPaymentModalOpen(false);
    setSuccessModalOpen(false);
    setFailureModalOpen(false);
  };

  // Step 1: Apply clicked → open type modal
  const handleApplyClick = () => {
    setDetailsModalOpen(false);
    setTypeModalOpen(true);
  };

  // Step 2: API investment selected → go straight to payment modal
  const handleAPIPaymentProceed = (data: InvestPaymentFormData) => {
    setInvestmentData({ ...data, consent: true });
    closeAllModals();
    setPaymentModalOpen(true);
  };

  // Step 2b: Pooled/Housing → type selected → go to payment modal
  const handleProceedToPayment = (data: InvestPaymentFormData) => {
    setInvestmentData({ ...data, consent: true });
    closeAllModals();
    setPaymentModalOpen(true);
  };

  // Step 3: Payment done → go to confirmation
  const handleProceedToConfirmation = (data: InvestPaymentFormData) => {
    setInvestmentData(data);
    closeAllModals();
    setConfirmPaymentModalOpen(true);
  };

  // Step 4: Payment confirmed
  const handlePaymentSuccess = () => {
    closeAllModals();
    setSuccessModalOpen(true);
  };

  const handlePaymentFailure = () => {
    closeAllModals();
    setFailureModalOpen(true);
  };

  const handleCancelTransaction = () => {
    closeAllModals();
    setSelectedInvestment(null);
    setInvestmentData(null);
  };

  const handleCompleteFlow = () => {
    closeAllModals();
    setSelectedInvestment(null);
    setInvestmentData(null);
  };

  return (
    <div className="mt-4">
        <p className="text-megagreen font-medium pb-4">Available {" "}
            <span className="bg-pink-300/70 text-pink-600  rounded-full inline-flex p-1 px-2 text-xs">
                {investmentlength}
            </span>
        </p>
      {/* Carousel */}
      <Carousel>
        <CarouselContent className="gap-3">
          {cards.map((card) => (
            <CarouselItem key={card.id} className="max-w-100">
              <Card className="bg-[#06152A] h-[280px] pt-5 justify-between">
                <CardContent className="flex gap-2 justify-between items-center text-white">
                  <div className="space-y-2">
                    <h3 className="max-w-[164px] text-[20px] font-semibold leading-6">{card.title}</h3>
                    <div
                      className={`${
                        card.detailType === "housing" ? "bg-[#E1A728]" : "bg-[#D56F1F]"
                      } p-2 text-sm rounded-lg font-semibold`}
                    >
                      <h4 className="text-xs">Minimum Investment</h4>
                      <p className="text-base">{card.minimum_amount.toLocaleString()}K</p>
                      <p>ROI - {card.roi}</p>
                      <p>Duration - {card.vesting_period}</p>
                    </div>
                  </div>
                  <div className="max-w-36 self-end">
                    <img src={card.image} alt="" aria-hidden="true" className="w-full h-36 object-contain" />
                  </div>
                </CardContent>
                <Button
                  className="bg-megagreen w-3/4 self-center rounded-full hover:bg-megagreen/60"
                  onClick={() => {
                    setSelectedInvestment(card);
                    setDetailsModalOpen(true);
                  }}
                >
                  View Details to Apply
                </Button>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-10" />
        <CarouselNext className="mr-30" />
        <CarouselDots />
      </Carousel>

      {/* Modals */}
      {detailsModalOpen && selectedInvestment && (
        <>
          {selectedInvestment.detailType === "pooled" && (
            <PooledInvestmentModal
              isOpen={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              onApply={handleApplyClick}
              modalData={selectedInvestment as SimpleInvestment}
            />
          )}
          {selectedInvestment.detailType === "housing" && (
            <HousingInvestmentModal
              isOpen={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              onApply={handleApplyClick}
              modalData={selectedInvestment as DetailedInvestment}
            />
          )}
          {selectedInvestment.detailType === "api" && (
            <ApiInvestmentModal
              isOpen={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              onApply={handleAPIPaymentProceed}
              modalData={selectedInvestment as ApiInvestment}
            />
          )}
        </>
      )}

      {typeModalOpen && selectedInvestment && (
        <InvestmentTypeModal
          isOpen={typeModalOpen}
          onClose={() => setTypeModalOpen(false)}
          modalData={selectedInvestment as SimpleInvestment | DetailedInvestment}
          investmentType={selectedInvestment.detailType as "pooled" | "housing"}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {paymentModalOpen && investmentData && (
        <InvestPayment
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          investData={investmentData}
          onProceedToConfirmation={handleProceedToConfirmation}
        />
      )}

      {confirmPaymentModalOpen && investmentData && (
        <InvestmentConfirmPayment
          isOpen={confirmPaymentModalOpen}
          onClose={() => setConfirmPaymentModalOpen(false)}
          onCancel={handleCancelTransaction}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          investData={investmentData}
          amount={investmentData.amount || 0}
        />
      )}

      {successModalOpen && <InvestmentSuccessModal isOpen={successModalOpen} onClose={handleCompleteFlow} onConfirm={handleCompleteFlow} />}
      {failureModalOpen && <InvestPaymentFailedModal isOpen={failureModalOpen} onClose={handleCompleteFlow} />}
    </div>
  );
};

export default AvailableInvestments;