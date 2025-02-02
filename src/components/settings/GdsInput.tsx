import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GdsData } from "@/hooks/useFetchGdsSetting";

// Define the GDS form schema
const gdsFormSchema = z.object({
  gds: z.enum(['DUFFEL', 'AMADEUS', 'KIU']),
  mode: z.enum(['PRODUCTION', 'TEST']),
  testApiKey: z.string().min(1, "Test API Key is required"),
  productionApiKey: z.string().min(1, "Production API Key is required"),
  productionApiSecret: z.string().min(1, "Production Secret Key is required"),
  testApiSecret: z.string().min(1, "Test Secret Key is required"),
});

export interface GdsInputProps {
  data: z.infer<typeof gdsFormSchema>;
  onSubmit: (payload: GdsData) => void;
}

export default function GdsInput({ data, onSubmit }: GdsInputProps) {
  const [sectionOpen, setSectionOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<z.infer<typeof gdsFormSchema>>({
    defaultValues: data,
  });
  console.log("Haha")
  const currentMode = watch("mode");
  const currentGds = watch("gds");

  // Toggle section open/closed
  const toggleSection = () => {
    setSectionOpen((prev) => !prev);
  };

  // Handle mode change
  const handleModeChange = (mode: 'TEST' | 'PRODUCTION') => {
    setValue('mode', mode, { shouldValidate: true });
  };

  // Handle form submission
  const handleFormSubmit = async (formData: z.infer<typeof gdsFormSchema>) => {
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex justify-between items-center p-4 font-semibold bg-gray-100 hover:bg-gray-200"
        onClick={toggleSection}
      >
        {currentGds} API
        {sectionOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {sectionOpen && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 border-t">
          <div className="mb-4">
            <label className="font-semibold block mb-2">Select Mode:</label>
            <div className="tabs w-fit relative">
              <span className={`glider ${currentMode === "TEST" ? "test" : "production"}`}></span>

              {/* Test Mode Radio */}
              <input
                type="radio"
                id={`test-mode-${currentGds}`} // Unique ID per GDS
                value="TEST"
                checked={currentMode === "TEST"}
                {...register("mode")}
                onChange={() => handleModeChange("TEST")}
                className="hidden"
              />
              <label
                className="tab"
                htmlFor={`test-mode-${currentGds}`} // Match the unique ID
              >
                Test Server
              </label>

              {/* Production Mode Radio */}
              <input
                type="radio"
                id={`prod-mode-${currentGds}`} // Unique ID per GDS
                value="PRODUCTION"
                checked={currentMode === "PRODUCTION"}
                {...register("mode")}
                onChange={() => handleModeChange("PRODUCTION")}
                className="hidden"
              />
              <label
                className="tab"
                htmlFor={`prod-mode-${currentGds}`} // Match the unique ID
              >
                Production Server
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm">Test API Key</label>
              <input
                type="text"
                {...register("testApiKey")}
                className="w-full p-2 border rounded-lg mt-1"
                placeholder="API Key"
              />
              {errors.testApiKey && (
                <p className="text-red-500 text-sm mt-1">{errors.testApiKey.message}</p>
              )}
            </div>

            {currentGds !== "DUFFEL" && (
              <div>
                <label className="text-sm">Test Secret Key</label>
                <input
                  type="text"
                  {...register("testApiSecret")}
                  className="w-full p-2 border rounded-lg mt-1"
                  placeholder="Secret Key"
                />
                {errors.testApiSecret && (
                  <p className="text-red-500 text-sm mt-1">{errors.testApiSecret.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm">Production API Key</label>
              <input
                type="text"
                {...register("productionApiKey")}
                className="w-full p-2 border rounded-lg mt-1"
                placeholder="API Key"
              />
              {errors.productionApiKey && (
                <p className="text-red-500 text-sm mt-1">{errors.productionApiKey.message}</p>
              )}
            </div>

            {currentGds !== "DUFFEL" && (
              <div>
                <label className="text-sm">Production Secret Key</label>
                <input
                  type="text"
                  {...register("productionApiSecret")}
                  className="w-full p-2 border rounded-lg mt-1"
                  placeholder="Secret Key"
                />
                {errors.productionApiSecret && (
                  <p className="text-red-500 text-sm mt-1">{errors.productionApiSecret.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="w-full flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export { gdsFormSchema };