import axios from "axios";
import type { SendMessageResponse, SendMessageSchema, StartSessionResponse } from "../type";

// Create an Axios instance with default configuration
const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})


export const ChatApi = {
    startSession: async(): Promise<StartSessionResponse> => {
        const response = await apiInstance.post("/ai-chat/start", null, {
            timeout: 10000,
        });
        return response.data;
    },

    sendMessage: async(data: SendMessageSchema): Promise<SendMessageResponse> => {
        const response = await apiInstance.post("/ai-chat/message", data, {
            timeout: 30000,
        });
        return response.data;
    }
}