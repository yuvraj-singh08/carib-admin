import { restartServer, updateGdsData } from "@/services/GdsSettingService";
import "./Gdsapi.css";
import GdsInput from "./GdsInput";
import useFetchGdsSetting, { GdsData } from "@/hooks/useFetchGdsSetting";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";


const GdsApiSettings = () => {
  const { gdsData, loadingGdsData, fetchData } = useFetchGdsSetting();

  const onSubmit = async (payload: GdsData) => {
    const response = await updateGdsData(payload);
    if (response.success) {
      toast.success("Updated Data Successfully")
      fetchData();
    }
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-md">
      <div className="w-full">
        <div className=" my-4 flex justify-between">
          <div className="text-xl font-semibold">You can modify GDS details here.</div>
          <button
            type="button"
            className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-colors"
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to restart server?");
              if (confirmed) {
                restartServer();
              }
            }}
          >
            Restart Server
          </button>
        </div>
        {loadingGdsData ? <LoadingSpinner /> : (
          gdsData.map((data) => (
            <>
              <GdsInput key={data.gds} onSubmit={onSubmit} data={data} />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default GdsApiSettings;
