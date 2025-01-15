import React, { useState } from "react";

const PriceBreakup: React.FC = () => {

    const [selectedOption, setSelectedOption] = useState("FAILED_BOOKING");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const options = [
        { label: "TICKETED", color: "bg-green-500" },
        { label: "PENDING_TICKET", color: "bg-yellow-500" },
        { label: "PENDING_PAYMENT", color: "bg-orange-500" },
        { label: "EXPIRED", color: "bg-white" },
        { label: "FAILED_BOOKING", color: "bg-red-500" },
    ];

    const getSelectedOptionColor = () =>
        options.find((option) => option.label === selectedOption)?.color || "";

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleOptionClick = (optionLabel: string) => {
        setSelectedOption(optionLabel);
        setIsDropdownOpen(false); // Close the dropdown after selecting an option
    };


    return (
        <div className="w-1/2">
            <div className="bg-white p-4 rounded-md shadow-md mt-4 flex">
                <p>Payment Type - </p>
                <p className=" text-blue"> Bitcoin</p>
            </div>

            <div className="bg-white p-4 rounded-md shadow-md mt-4">
                <p>Booking Status</p>
                <div className="relative inline-block w-64 mt-1">
                    <div
                        className={`w-full px-4 py-2 text-black border rounded cursor-pointer ${getSelectedOptionColor()}`}
                        onClick={toggleDropdown}
                    >
                        {selectedOption}
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute w-full mt-2 bg-white border rounded shadow-lg z-10">
                            {options.map((option) => (
                                <div
                                    key={option.label}
                                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray`}
                                    onClick={() => handleOptionClick(option.label)}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={selectedOption === option.label}
                                        readOnly
                                        className="mr-2"
                                    />
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-white p-4 rounded-md shadow-md mt-4">
                <h2 className="text-lg font-bold text-primary">Price Breakup</h2>
                <ul className="mt-2 text-sm text-gray-600 flex flex-col gap-4">
                    <li className="flex justify-between">
                        <span>Airline Base Fare</span>
                        <span>₹ 10131</span>
                    </li>
                    <hr />
                    <li className="flex justify-between">
                        <span>Airline Taxes</span>
                        <span>₹ 2446</span>
                    </li>
                    <hr />
                    <li className="flex justify-between">
                        <span>MMT Convenience Fee</span>
                        <span>₹ 525</span>
                    </li>
                    <hr />
                    <li className="flex justify-between">
                        <div className=" flex flex-col">
                            <span>Ancillary Charges</span>
                            <span>(Seat/Baggage/Meal Charges)</span>
                        </div>
                        <span>₹ 350</span>
                    </li>
                </ul>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹ 13452</span>
                </div>
            </div>
        </div>
    );
};

export default PriceBreakup;
