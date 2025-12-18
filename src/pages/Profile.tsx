import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import AccountSetupModal from "@/components/AccountSetupModal";
import { useAuthStore } from "@/store/authStore";
import profileAvatar from "@/assets/profile-avatar.png"
import { Landmark, Wallet } from "lucide-react";
import { useAccountInfo } from "@/hooks/useProfile";
import { useUserWallet } from "@/hooks/useAuth";


export default function Profile() {
    const {user} = useAuthStore();
    const {data: bankDetails, isLoading:isLoadingWallet } = useUserWallet();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
    const {data: accountData, isLoading} = useAccountInfo();

    const userAccountDetails = accountData?.[0]


    return (
        <div className="font-poppins rounded-xl shadow-sm space-y-6 pb-4 px-4 sm:px-0" >
            <div className="flex gap-6 items-center p-4 border-b-2 border-b-megagreen/60 shadow-lg">
                <div className="">
                    <img src={user?.live_face_verification || profileAvatar} alt="user profile image" className="w-20 h-20 rounded-full object-cover" />
                </div>
                <div>
                    <h2 className="font-semibold text-lg">{[user?.first_name, user?.middle_name, user?.last_name].join(" ")}</h2>
                    <p className="text-muted-foreground text-sm">Member ID: {user?.member_id}</p>
                </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
                <span className="text-megagreen font-semibold bg-[#D2EEDE] text-xs p-1 inline-block">Personal Information</span>
                <div>
                    <p className="text-muted-foreground">First Name</p>
                    <p className="font-medium">{user?.first_name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Middle Name</p>
                    <p className="font-medium">{user?.middle_name || "Nil"}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Last Name</p>
                    <p className="font-medium">{user?.last_name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">D.O.B</p>
                    <p className="font-medium">{user?.dob}</p>
                </div>
            </div>

            {/* Wallet funding account details */}
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold bg-blue-50 text-xs p-1 inline-block">Wallet Funding Account</span>
                    <span className="text-xs text-muted-foreground italic">(Use this account to fund your wallet)</span>
                </div>

                {isLoadingWallet ? (
                    <div className="text-muted-foreground text-sm px-6">
                        Loading wallet details...
                    </div>
                ) : !bankDetails ? (
                    <div className="text-sm text-muted-foreground italic px-6">
                        Unable to load wallet funding account. Please try again later.
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center flex-wrap gap-4 sm:max-w-lg w-full border-2 border-blue-500/60 rounded-lg p-4 bg-blue-50/30">
                            <div className="flex gap-6 items-center">
                                <span className="block bg-blue-100 p-2 rounded-sm text-blue-600">
                                    <Wallet className="w-6 h-6" />
                                </span>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-blue-600 font-medium">Bank Name</p>
                                        <p className="text-sm text-muted-foreground">{bankDetails?.bank_name || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <span className="inline-block text-lg text-blue-600 bg-blue-600/20 p-2 font-semibold rounded-sm max-w-[150px] w-full text-center">
                                {bankDetails?.account_no || "N/A"}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground italic px-4">
                            ⚠️ This account is exclusively for funding your MegaCoop wallet. Deposits are automatically credited.
                        </p>
                    </>
                )}
            </div>

            {/* Withdrawal account */}
            {isLoading ? (
                <div className="text-muted-foreground text-sm px-6">
                    Loading your bank details...
                    </div>
                ) : accountData?.length === 0 || !userAccountDetails ? (
                    <div className="p-4">
                        <span className="text-megagreen font-semibold bg-[#D2EEDE] text-xs p-1 inline-block mb-3">Withdrawal Account</span>
                        <p className="text-sm text-muted-foreground italic">No bank details added yet. Add your account for withdrawals.</p>
                    </div>
                ) : (
                <div className="flex justify-between items-center flex-wrap gap-4 sm:max-w-lg w-full border-2 border-megagreen/60 rounded-lg p-4 sm:mx-4">
                    <div className="flex gap-6 items-center">
                        <span className="block bg-megaorange/30 p-2 rounded-sm text-megagreen">
                            <Landmark />
                        </span>
                    
                        <div className="space-y-3">
                            <div>
                                <p className="text-megagreen font-medium">Bank Name</p>
                                <p className="text-sm text-muted-foreground">{userAccountDetails?.bank_name || "N/A" }</p>
                            </div>
                            <div>
                                <p className="text-megagreen font-medium">Account Name</p>
                                <p className="text-sm text-muted-foreground">{userAccountDetails?.account_holder_name || "N/A" }</p>
                            </div>
                        </div>
                    </div>
                    <span className="inline-block text-lg text-megagreen bg-megagreen/30 p-2 font-semibold rounded-sm max-w-[150px] w-full text-center">{userAccountDetails?.account_number || "N/A" }</span>
                </div>)

            }
            {
                userAccountDetails ? (
                    <Button className={cn("bg-megagreen hover:bg-emerald-500 text-xs sm:mx-4 ",
                        isLoading ? "hidden" : ""
                    )}
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        Update Bank Details
                    </Button>
                ): (
                    <Button className={cn("bg-megagreen hover:bg-emerald-500 text-xs sm:mx-4",
                        isLoading ? "hidden" : ""
                    )}
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        Add Bank Details
                    </Button>
                )
            }
            <AccountSetupModal open={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
        </div>
    )
}