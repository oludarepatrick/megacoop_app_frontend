import { Mail, MessageCircleMore } from "lucide-react"
import whatsAppIcon from "@/assets/whatsapp-icon.svg"
import telegramIcon from "@/assets/telegram-icon.svg"
import discordIcon from "@/assets/discord-icon.svg"

export default function Help() {

    return (
        <div className="font-poppins rounded-xl shadow-sm space-y-6 py-6 sm:px-0 w-[548px] mx-auto" >
            <h2 className="text-center font-medium text-megagreen/80 text-lg">Help/Support Service</h2>

            <div className="sm:max-w-lg w-full border border-megagreen/10 rounded-lg p-4 sm:mx-4 space-y-3">
                <div className="flex gap-4 items-center">
                    <div className="bg-megagreen/70 h-9 w-9 rounded-md flex items-center justify-center text-white">
                        <MessageCircleMore />
                    </div>
                    <div className="">
                        <h3 className="text-megagreen/70 font-semibold">Chat with us</h3>
                        <span className="text-xs text-muted-foreground">Send us a message now</span>
                    </div>
                </div>
                <div className="flex justify-around gap-4">
                    <p className="text-megagreen/70 font-semibold">09099345604</p>
                    <div className="flex gap-4 items-center">
                        <img src={whatsAppIcon} alt="social-icon-whatsapp"/>
                        <img src={telegramIcon} alt="social-icon-telegram"/>
                        <img src={discordIcon} alt="social-icon-discord"/>
                    </div>
                </div>
                <div className="flex justify-around gap-4 items-center" >
                    <div className="">
                        <h3 className="text-megagreen/70 font-semibold">Email us</h3>
                        <span className="text-xs text-muted-foreground">megacoopsupport@gmail.com</span>
                        <p className="text-megagreen/70 font-medium">Reply within 24hrs working day</p>
                    </div>
                    <span className="icon">
                        <Mail className="text-megaorange" />
                    </span>
                </div>
            </div>
        </div>
    )
}