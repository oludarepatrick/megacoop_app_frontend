import type { Transaction } from "@/pages/Transactions";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import Logo from "/Logo.svg";
import coffetiImg from "@/assets/coffetti-img.png"
import receiptBg from "@/assets/receipt-bcg.png"
import { Button } from "../ui/button";
import { Download, File, Image, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { useDownloadReceipt } from "@/hooks/useTransactionReceipt";
import { useRef } from "react";


type TransactionReceiptProps ={
    isOpen: boolean
    onClose: () => void;
    transactions: Transaction
}

const TransactionReceipt = ({isOpen, onClose, transactions}: TransactionReceiptProps) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const {downloadAsPDF, downloadAsImage} = useDownloadReceipt(receiptRef, `receipt-${transactions.id}`)

    return (
        <Dialog open={isOpen} onOpenChange ={onClose}>
            <DialogContent className="font-poppins sm:max-w-md p-0 pb-10 overflow-y-auto max-h-[90vh] scrollbar-hide">
                <DialogHeader className="text-center pt-4 rounded-lg bg-gradient-to-b from-[#E6FFE3] to to-white">
                    <div className="flex justify-center pb-8 relative">
                        <img 
                            src={coffetiImg} 
                            alt="" 
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            crossOrigin="anonymous"
                        />
                        <img 
                            src={Logo} 
                            alt="megacoop-logo" 
                            className="w-40 relative z-10" 
                            crossOrigin="anonymous"
                        />
                    </div>
                </DialogHeader>
                
                {/* <div className="mx-8 relative h-full" style={{backgroundImage: `url(${receiptBg})`, backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: ""}}>
                    <img src={receiptBg} className="" />
                    <h2>{transactions.description}</h2>
                </div> */}

                <div ref={receiptRef} className="relative sm:mx-8 ">
                    <div className="flex justify-center items-center max-w-90 mx-auto ">
                        <img src={receiptBg} alt="" className="w-full h-92 sm:h-full object-cover" crossOrigin="anonymous" />
                    </div>
                    <div className="absolute top-0 w-full text-white p-6">
                        <div className="" >
                            <h3 className="font-semibold text-center text-sm pb-3 border-b-2 border-dashed loose-dash">Transaction Summary</h3>

                            <div className="py-4 max-w-[307px] mx-auto [&_div]:grid [&_div]:grid-cols-2 space-y-3 text-sm">
                                <div>
                                    <h4>Description:</h4>
                                    <span className="font-medium">{transactions.description}</span>
                                </div>
                                <div>
                                    <h4>Type:</h4>
                                    <span className="font-medium">{transactions.type}</span>
                                </div>
                                <div>
                                    <h4>Amount:</h4>
                                    <span className="font-medium">₦{transactions.amount}</span>
                                </div>
                                <div>
                                    <h4>Date:</h4>
                                    <span className="font-medium">{transactions.date}</span>
                                </div>

                                <hr className="loose-dash my-8"/>

                                <div>
                                    <h4>Transaction ID:</h4>
                                    <span className="font-medium">{transactions.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center flex-wrap gap-4 mx-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-megagreen flex-1 font-normal"><Download/> Download</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="max-w-[180px]">
                            <DropdownMenuItem onClick={downloadAsPDF}><File className="text-megagreen" /> Download as PDF</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadAsImage("png")}><Image className="text-megagreen"/> Download as Image</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                
                    <Button variant="outline" className="border-megagreen text-megagreen flex-1"><Share2 />Share receipt</Button>

                </div>


            </DialogContent>
        </Dialog>
    )
}
export default TransactionReceipt;




// import type { Transaction } from "@/pages/Transactions";
// import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
// import Logo from "/Logo.svg";
// import coffetiImg from "@/assets/coffetti-img.png"
// import receiptBg from "@/assets/receipt-bcg.png"
// import { Button } from "../ui/button";
// import { Download, File, Image, Share2 } from "lucide-react";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
// import { useDownloadReceipt } from "@/hooks/useTransactionReceipt";
// import { useRef } from "react";


// type TransactionReceiptProps ={
//     isOpen: boolean
//     onClose: () => void;
//     transactions: Transaction
// }

// const TransactionReceipt = ({isOpen, onClose, transactions}: TransactionReceiptProps) => {
//     const receiptRef = useRef<HTMLDivElement>(null);
//     const {downloadAsPDF, downloadAsImage} = useDownloadReceipt(receiptRef, `receipt-${transactions.id}`)

//     return (
//         <Dialog open={isOpen} onOpenChange ={onClose}>
//             <DialogContent className="font-poppins sm:max-w-md p-0 pb-10 overflow-y-auto max-h-[90vh] scrollbar-hide">
//                 <DialogHeader className="text-center pt-4 rounded-lg bg-gradient-to-b from-[#E6FFE3] to to-white">
//                     <div
//                         className="flex justify-center pb-8 bg-no-repeat bg-bottom-center bg-cover"
//                         style={{ backgroundImage: `url(${coffetiImg})` }}
//                     >
//                         <img src={Logo} alt="megacoop-logo" className="w-40" />
//                     </div>
//                 </DialogHeader>
                
//                 {/* <div className="mx-8 relative h-full" style={{backgroundImage: `url(${receiptBg})`, backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: ""}}>
//                     <img src={receiptBg} className="" />
//                     <h2>{transactions.description}</h2>
//                 </div> */}

//                 <div ref={receiptRef} className="relative sm:mx-8 ">
//                     <div className="flex justify-center items-center max-w-90 mx-auto ">
//                         <img src={receiptBg} alt="" className="w-full h-92 sm:h-full object-cover" />
//                     </div>
//                     <div className="absolute top-0 w-full text-white p-6">
//                         <div className="" >
//                             <h3 className="font-semibold text-center text-sm pb-3 border-b-2 border-dashed loose-dash">Transaction Summary</h3>

//                             <div className="py-4 max-w-[307px] mx-auto [&_div]:grid [&_div]:grid-cols-2 space-y-3 text-sm">
//                                 <div>
//                                     <h4>Description:</h4>
//                                     <span className="font-medium">{transactions.description}</span>
//                                 </div>
//                                 <div>
//                                     <h4>Type:</h4>
//                                     <span className="font-medium">{transactions.type}</span>
//                                 </div>
//                                 <div>
//                                     <h4>Amount:</h4>
//                                     <span className="font-medium">₦{transactions.amount}</span>
//                                 </div>
//                                 <div>
//                                     <h4>Date:</h4>
//                                     <span className="font-medium">{transactions.date}</span>
//                                 </div>

//                                 <hr className="loose-dash my-8"/>

//                                 <div>
//                                     <h4>Transaction ID:</h4>
//                                     <span className="font-medium">{transactions.id}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-center flex-wrap gap-4 mx-10">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button className="bg-megagreen flex-1 font-normal"><Download/> Download</Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="start" className="max-w-[180px]">
//                             <DropdownMenuItem onClick={downloadAsPDF}><File className="text-megagreen" /> Download as PDF</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => downloadAsImage("png")}><Image className="text-megagreen"/> Download as Image</DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
                
//                     <Button variant="outline" className="border-megagreen text-megagreen flex-1"><Share2 /> Download</Button>

//                 </div>


//             </DialogContent>
//         </Dialog>
//     )
// }
// export default TransactionReceipt;