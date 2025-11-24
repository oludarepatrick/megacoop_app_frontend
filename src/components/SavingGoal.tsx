import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart } from "recharts";
import { useCancelSavingPlan, usePartialWithdrawSaving, useSavingPlans } from "@/hooks/useSaving";
import PageLoader from "./PageLoader";
import SavingGoalDetailModal from "./SavingsComponent/SavingGoalDetailModal";
import { useState } from "react";
import type { SavingPlan } from "@/types/savingType";
import ConfirmModal from "./ConfirmModal";
import PartialWithdrawModal from "./SavingsComponent/PartialWithdrawModal";
import { SavingPlanSuccessModal } from "./SavingsComponent/SavingPlanSuccessModal";


const colors = ["#037BCB", "#03CBB3", "#FB18BB", "#F59E0B", "#10B981"];


const SavingGoal= () => {
    const [selectedGoal, setSelectedGoal] = useState<SavingPlan | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [amountModal, setAmountModal] = useState(false)
    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean
        description: string
    }>({isOpen: false, description: ""})

    const {data: goals = [], isLoading} = useSavingPlans();

    const {mutate, isPending} = useCancelSavingPlan(()=>{
        setIsConfirmModalOpen(false)
        // setSelectedGoal(null)
        setSuccessModal({
            isOpen: true,
            description: "Saving goal has been terminated successfully"
        })
    })
    const {mutate: partialWithdraw, isPending: loading} = usePartialWithdrawSaving(()=>{
        setIsConfirmModalOpen(false)
        // setSelectedGoal(null)
        setSuccessModal({
            isOpen: true,
            description: "Transaction successfull, check your wallet balance"
        })
    })

    const handleTerminate = () => {
        if(!selectedGoal) return
        mutate({saving_id: selectedGoal.id})
    }

    const handlePartialWithdraw = (amount: number) => {
        if(!selectedGoal) return
        partialWithdraw({
            saving_id: selectedGoal?.id,
            amount: amount
        })
    }
    

    return (
        // <section className="">
        <Card className="px-4 py-4 ">
            <CardHeader className="flex justify-between items px-2">
                <CardTitle className="text-xl font-semibold">Saving Goals</CardTitle>
                <Link to="" className="text-footertext text-sm ">See All</Link>
            </CardHeader>
            { isLoading ? <PageLoader/> : (

                <CardContent className="p-0 flex flex-col gap-4">
                    {goals.map((goal, index) => {
                        const percent = Math.min(Math.round((goal.total_saved / goal.target_amount) * 100), 100)
                        const color = colors[index % colors.length]
                        const data = [
                            { value: percent},
                            {value: 100 - percent},
                        ]
                        return (
                            <div key={goal.id} 
                                className="flex items-center justify-between  gap-4 rounded-lg bg-card border shadow-sm p-2"
                                onClick={() => setSelectedGoal(goal)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12">
                                        <PieChart width={48} height={48}>
                                            <Pie
                                                data={data}
                                                dataKey="value"
                                                innerRadius={16}
                                                outerRadius={24}
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                <Cell key="progress" fill={color}  />
                                                <Cell key="rest" fill={color} fillOpacity={0.4}/>
                                            </Pie>
                                        </PieChart>
                                        <div className="text-xs absolute inset-0 flex items-center justify-center font-bold ">
                                            {percent}%
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-main text-sm">{goal.goal_name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {/* {goal.saving_status === "ongoing" && "Ongoing"} */}
                                            {goal.saving_status === "ongoing" ? "Ongoing" : "Completed"}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="text-muted-foreground w-4 h-4" />
                            </div>
                            
                        )
                    })}
                </CardContent>
            )}

            {selectedGoal && (
                <SavingGoalDetailModal
                    isOpen={!!selectedGoal}
                    onClose={()=>{setSelectedGoal(null)}}
                    savings={selectedGoal}
                    onConfirm={()=> setIsConfirmModalOpen(true)}
                    onProceed={() => setAmountModal(true)}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={()=> setIsConfirmModalOpen(false)}
                onProceed={handleTerminate}
                isPending={isPending}
            />

            {selectedGoal && (
                <PartialWithdrawModal
                    isOpen={amountModal}
                    onClose={()=> setAmountModal(false)}
                    isPending={loading}
                    savedAmount={selectedGoal?.total_saved}
                    onSubmit={handlePartialWithdraw}
                />
            )}

            <SavingPlanSuccessModal
                isOpen={successModal.isOpen}
                onConfirm={()=> {
                    setSuccessModal({isOpen:false, description: ""})
                    setAmountModal(false)
                    setSelectedGoal(null)
                }}
                onClose={()=> setSuccessModal({isOpen:false, description: ""})}
                description={successModal.description}
            />


        </Card>
        // </section>
    )
}

export default SavingGoal;

