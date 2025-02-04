import { GdsData } from "@/hooks/useFetchGdsSetting";
import { axiosInstance } from "@/provider/axios";
import toast from "react-hot-toast";

export const updateGdsData = async (payload: GdsData) => {
    try {
        const apiUrl = '/gds/creds/update';
        const response = await axiosInstance.post(apiUrl, payload);
        return response.data;
    } catch (error: any) {
        toast.error("Failed to update data: " + (error.response.data.message || error.message))
    }
}

export const restartServer = async () => {
    try {
        const apiUrl = '/server/restart';
        const response = await axiosInstance.post(apiUrl);
        if (response.data?.success) {
            toast.success("Server Restarted Successfully!")
        }
        return response.data;
    } catch (error) {
        toast.error("Failed to restart server")
    }
}