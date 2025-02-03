import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./Gdsapi.css";
import PermissionButtonGroup from "../permissions/PermissionButton";

const GdsApiSettings = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Duffel: false,
    Amadeus: false,
    KIU: false,
  });
  const [serverType, setServerType] = useState<{ [key: string]: string }>({
    Duffel: "Test Server",
    Amadeus: "Test Server",
    KIU: "Test Server",
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleServerChange = (tab: string, type: string) => {
    setServerType((prev) => ({ ...prev, [tab]: type }));
  };

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
                        <span
                          className={`glider ${
                            serverType[tab] === "Test Server"
                              ? "test"
                              : "production"
                          }`}
                        ></span>

                        <input
                          type="radio"
                          id={`${tab}-radio-1`}
                          name={`${tab}-tabs`}
                          checked={serverType[tab] === "Test Server"}
                          onChange={() =>
                            handleServerChange(tab, "Test Server")
                          }
                        />
                        <label className="tab" htmlFor={`${tab}-radio-1`}>
                          Test Server
                        </label>

                        <input
                          type="radio"
                          id={`${tab}-radio-2`}
                          name={`${tab}-tabs`}
                          checked={serverType[tab] === "Production Server"}
                          onChange={() =>
                            handleServerChange(tab, "Production Server")
                          }
                        />
                        <label className="tab" htmlFor={`${tab}-radio-2`}>
                          Production Server
                        </label>
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
                  <PermissionButtonGroup
                    resource="settings"
                    action="create|update"
                  >
                    <button className="bg-blue rounded-lg text-white py-1 px-3 mt-2">
                      Save Changes
                    </button>
                  </PermissionButtonGroup>
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
