import { axiosInstance } from "@/provider/axios";
import { useEffect, useState } from "react";

export type GdsData = {
    gds: 'DUFFEL' | 'AMADEUS' | 'KIU';
    testApiKey: string;
    productionApiKey: string;
    productionApiSecret: string;
    testApiSecret: string;
    mode: 'PRODUCTION' | 'TEST';
}

export default function useFetchGdsSetting() {
    const [gdsData, setGdsData] = useState<GdsData[]>([]);
    const [loadingGdsData, setLoadingGdsData] = useState(false);

    const fetchData = async () => {
        setLoadingGdsData(true);
        const response = await axiosInstance('/gds/creds');
        if (response.data?.success) {
            const data = response.data.data.map(({ id, ...rest }: { id: string; } & GdsData) => rest);
            setGdsData(data);
        }
        setLoadingGdsData(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return { gdsData, loadingGdsData, fetchData };
}