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
        {["Duffel", "Amadeus", "KIU"].map((tab) => (
          <div key={tab} className="bg-white rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 font-semibold bg-gray-100 hover:bg-gray-200"
              onClick={() => toggleSection(tab)}
            >
              {tab} API
              {openSections[tab] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections[tab] && (
              <div className="p-4 border-t">
                <div className="mb-4 flex items-center">
                  <label className="font-semibold">Select Mode:</label>
                  <div className="flex gap-4">
                    <div className="container">
                      <div className="tabs w-fit relative">
                        <span className={`glider ${serverType[tab] === "Test Server" ? "test" : "production"}`}></span>

                        <input
                          type="radio"
                          id={`${tab}-radio-1`}
                          name={`${tab}-tabs`}
                          checked={serverType[tab] === "Test Server"}
                          onChange={() => handleServerChange(tab, "Test Server")}
                        />
                        <label className="tab" htmlFor={`${tab}-radio-1`}>Test Server</label>

                        <input
                          type="radio"
                          id={`${tab}-radio-2`}
                          name={`${tab}-tabs`}
                          checked={serverType[tab] === "Production Server"}
                          onChange={() => handleServerChange(tab, "Production Server")}
                        />
                        <label className="tab" htmlFor={`${tab}-radio-2`}>Production Server</label>
                      </div>
                    </div>

                  </div>
                </div>
                <div>
                  <p className="text-sm">{serverType[tab]} API Key</p>
                  <input
                    type="text"
                    placeholder={`${serverType[tab]} API Key`}
                    className="w-full p-2 border rounded-lg my-1"
                  />
                  {tab !== "Duffel" && (
                    <>
                      <p className="text-sm">{serverType[tab]} Secret Key</p>
                      <input
                        type="text"
                        placeholder={`${serverType[tab]} Secret Key`}
                        className="w-full p-2 border rounded-lg my-1 mb-2"
                      />
                    </>
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <button className="bg-blue rounded-lg text-white py-1 px-3 mt-2">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GdsApiSettings;
