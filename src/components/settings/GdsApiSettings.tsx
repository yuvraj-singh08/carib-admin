import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./Gdsapi.css";

const GdsApiSettings = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Duffel: false,
    Amadeus: false,
    KIU: false,
  });
  // const [serverType, setServerType] = useState<{ [key: string]: string }>({
  //   Duffel: "Test Server",
  //   Amadeus: "Test Server",
  //   KIU: "Test Server",
  // });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-md">
      <div className="w-full">

        {["Duffel API", "Amadeus API", "KIU API"].map((tab) => (
          <div key={tab} className=" bg-white rounded-lg overflow-hidden">
            <>
              <button
                className="w-full flex justify-between items-center p-4 font-semibold bg-gray-100 hover:bg-gray-200"
                onClick={() => toggleSection(tab)}
              >
                {tab}
                {openSections[tab] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections[tab] && (
                <div className="p-4 border-t">
                  <div className="mb-4 flex items-center">
                    <label className="font-semibold">Select Mode:</label>
                    <div className="flex gap-4">
                      <div className="container">
                        <div className="tabs w-fit">
                          <input type="radio" id="radio-1" name="tabs" checked/>
                            <label className="tab" htmlFor="radio-1">Test Server</label>
                            <input type="radio" id="radio-2" name="tabs"/>
                              <label className="tab" htmlFor="radio-2">Production Server</label>
                              
                                <span className="glider"></span>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div>
                  {tab === "Duffel API" ? (
                    <>
                      <p className="text-sm">Test Server API Key</p>
                      <input
                        type="text"
                        placeholder="Test API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                      <p className="text-sm mt-2">Production Server API Key</p>
                      <input
                        type="text"
                        placeholder="Production API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                    </>
                  ) : tab === "Amadeus API" ? (
                    <>
                    <p className="text-sm">Test Server API Key</p>
                      <input
                        type="text"
                        placeholder="Test API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                      <input
                        type="text"
                        placeholder="Test Secret Key"
                        className="w-full p-2 border rounded-lg my-1 mb-2"
                      />
                      <p className="text-sm mt-2">Production Server API Key</p>
                      <input
                        type="text"
                        placeholder="Production API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                      <input
                        type="text"
                        placeholder="Production Secret Key"
                        className="w-full p-2 border rounded-lg my-1 mb-2"
                      />
                    </>
                  ) : (
                    <>
                    <p className="text-sm">Test Server API Key</p>
                      <input
                        type="text"
                        placeholder="Test API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                      <input
                        type="text"
                        placeholder="Test Secret Key"
                        className="w-full p-2 border rounded-lg my-1 mb-2"
                      />
                      <p className="text-sm mt-2">Production Server API Key</p>
                      <input
                        type="text"
                        placeholder="Production API Key"
                        className="w-full p-2 border rounded-lg my-1"
                      />
                      <input
                        type="text"
                        placeholder="Production Secret Key"
                        className="w-full p-2 border rounded-lg my-1 mb-2"
                      />
                    </>
                  )}
                </div>
                      <div className=" w-full flex justify-end">
                      <button className=" bg-blue rounded-lg text-white py-1 px-3 mt-2"> Save Changes</button>
                    </div>
                    </div>
            )}
                    <hr />
                  </>
                </div>

              ))}
            </div>
          </div>
        );
};

        export default GdsApiSettings;