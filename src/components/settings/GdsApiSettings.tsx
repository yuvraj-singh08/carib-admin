import { useState } from "react";

const GdsApiSettings = () => {
  const [activeTab, setActiveTab] = useState("Duffel");
  const [serverType, setServerType] = useState<{ [key: string]: string }>({
    Duffel: "Test Server",
    Amadeus: "Test Server",
    KIU: "Test Server",
  });

  return (
    <div className="flex flex-col items-center p-6">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6 rounded-xl bg-white shadow-sm ">
        {["Duffel", "Amadeus", "KIU"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === tab ? "bg-blue-600 text-blue" : "bg-gray-400 text-black"
            } hover:bg-blue-500 hover:text-blue`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* API Settings Sections */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <label className="font-semibold">Select Server:</label>
          <div className="flex gap-4 mt-2">
            {["Test Server", "Production Server"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={activeTab}
                  value={type}
                  checked={serverType[activeTab] === type}
                  onChange={() =>
                    setServerType((prev) => ({ ...prev, [activeTab]: type }))
                  }
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Input Fields based on Server Selection */}
        <div>
          {activeTab === "Duffel" && (
            <input
              type="text"
              placeholder={
                serverType.Duffel === "Test Server"
                  ? "Duffel Test API Key"
                  : "Duffel Production API Key"
              }
              className="w-full p-2 border rounded-lg"
            />
          )}
          {activeTab !== "Duffel" && (
            <>
              <input
                type="text"
                placeholder="API Key"
                className="w-full p-2 border rounded-lg mb-4"
              />
              <input
                type="text"
                placeholder="Secret Key"
                className="w-full p-2 border rounded-lg"
              />
            </>
          )}
        </div>

        {/* Save Changes Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-all">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default GdsApiSettings;