"use client";

import { Button } from '@/components/ui/button';
// import BookingDetails from './BookingDetails';
// import FlightSegment from './FlightSegment';
// import PriceBreakup from './PriceBreakup';
// import PassengerTable from './details';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlightDetails, updateFlightDetails } from '@/redux/flightSlice';
import { AppDispatch, RootState } from '@/provider/redux-provider';
import flight from "../../../../public/icons/flight.png";
import { BsCash } from "react-icons/bs";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFastfood } from "react-icons/md";

interface Passenger {
  eTicketNumber: number;
  pnrNumber: string;
  status: "Pending" | "Confirm";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
}

const initialPassengers: Passenger[] = [
  {
    eTicketNumber: 1,
    pnrNumber: "A1GEZX",
    status: "Pending",
    firstName: "Animesh",
    lastName: "Sadh",
    gender: "Male",
  },
  {
    eTicketNumber: 2,
    pnrNumber: "A25EZX",
    status: "Confirm",
    firstName: "Animesh",
    lastName: "Sadh",
    gender: "Male",
  },
];

const FlightBooking: React.FC = () => {

  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL params
  const dispatch = useDispatch<AppDispatch>();
  const { flightDetails, loading, error } = useSelector((state: RootState) => state.flight);
  const [selectedOption, setSelectedOption] = useState("FAILED_BOOKING");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers);
  
    const handleStatusChange = (eTicketNumber: number, newStatus: "Pending" | "Confirm") => {
      setPassengers((prevPassengers) =>
        prevPassengers.map((passenger) =>
          passenger.eTicketNumber === eTicketNumber
            ? { ...passenger, status: newStatus }
            : passenger
        )
      );
    };

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



  useEffect(() => {
    if (bookingId) {
      dispatch(fetchFlightDetails(bookingId)); // Dispatch the action with the bookingId
      console.log(flightDetails);
    }
  }, [dispatch, bookingId]);

  const handleSave = () => {
    const updatedData = {
      // Collect updated data from your form components
    };
    if (bookingId) {
      dispatch(updateFlightDetails({ bookingId, updatedData })); // Dispatch with bookingId and updated data
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 rounded-md shadow-md flex flex-col gap-4 mt-8">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="flex items-center gap-2 w-fit"
      >
        <ArrowLeft size={16} />
        Back to List
      </Button>

      <div className=" p-6 rounded-md shadow-md " style={{
        background: "linear-gradient(to bottom, #D1E2FF, #97C3FC)",
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-primary">Your Flight booking has completed!</h1>
            <p className="text-sm text-gray">Booking ID - <span className=" text-black">NF7A9EF251183092517</span></p>
          </div>
          <p className="text-sm text-black"><span className=" text-gray">Booked On -</span> 12 Aug, 2024</p>
        </div>
        <div className="mt-4 bg-white p-4 rounded-md shadow-md w-fit">
          <h2 className="text-lg font-bold text-primary">Chennai ⇆ Jabalpur</h2>
          <p className="text-sm text-gray-500">Thu 22 Aug '24 • 1 Traveller(s)</p>
        </div>

      </div>


      <div className="w-full flex gap-2">

        <div className="bg-white p-4 mt-4 rounded-md shadow-md w-full h-fit">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold text-primary">Chennai → Mumbai → Jabalpur</h2>
            <p className="text-sm text-gray-500">2h 10m</p>
          </div>

          {/* 1st Flight Data */}
          <div className="mt-4 flex items-center gap-4">
            <div className=" flex-1 flex gap-2">
              <img src="https://www.shutterstock.com/image-vector/indigo-app-logo-kerala-india-260nw-2403547037.jpg" alt="" className=" h-10" />
              <div className=" flex flex-col">
                <p className=" text-sm text-gray">IndiGo</p>
                <p className=" text-sm text-gray">6E-5093</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="">Chennai - MAA</p>
              <p className="">04:45, 22 Aug '24</p>
              <hr className="flex-1 border-t border-black" />
              <p className="text-xs text-gray">Chennai International Airport, Terminal 1</p>
            </div>
            <div className=" flex-1 flex flex-col justify-center items-center">
              <img src={flight} />
              <hr className="flex-1 border-t border-dashed border-black mx-2" />
              <p className=" text-sm text-gray">2:10 hr</p>
            </div>
            <div className="flex-1">
              {/* <FaPlaneArrival className="text-primary" /> */}
              <p className="">Mumbai - BOM</p>
              <p className="">06:55, 22 Aug '24</p>
              <hr className="flex-1 border-t border-black w-full" />
              <p className="text-xs text-gray">Chhatrapati Shivaji International Airport, Terminal 1</p>
            </div>
          </div>
          <div className=" flex gap-4 mt-4">
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Regular Fair</p>
            </div>
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Saver</p>
            </div>
          </div>
          <div className=" flex gap-4 mt-4">
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Economy</p>
            </div>
            <div className=" flex gap-2 items-center">
              <LuBaggageClaim className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Check In -Details Not Available</p>
            </div>
            <div className=" flex gap-2 items-center">
              <LuBaggageClaim className=" text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Carry On -Details Not Available</p>
            </div>
          </div>

          {/* layover details */}
          <div className=" my-8">
            <hr className=" border-t border-dashed border-black mx-2" />
            <div className=" flex gap-2 py-3 justify-around">
              <MdOutlineFastfood className=" text-gray" />
              <p className=" text-xs text-gray">3h 5m layover</p>
              <p className=" text-xs text-gray">Stopover in Mumbai (BOM), you will have to change the FLIGHT</p>
            </div>
            <hr className=" border-t border-dashed border-black mx-2" />
          </div>

          {/* 2nd Flight Data */}
          <div className="mt-4 flex items-center gap-4">
            <div className=" flex-1 flex gap-2">
              <img src="https://www.shutterstock.com/image-vector/indigo-app-logo-kerala-india-260nw-2403547037.jpg" alt="" className=" h-10" />
              <div className=" flex flex-col">
                <p className=" text-sm text-gray">IndiGo</p>
                <p className=" text-sm text-gray">6E-5093</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="">Mumbai - BOM</p>
              <p className="">10:00, 22 Aug`24</p>
              <hr className="flex-1 border-t border-black" />
              <p className="text-xs text-gray">Chhatrapati Shivaji International Airport, Terminal 2</p>
            </div>
            <div className=" flex-1 flex flex-col justify-center items-center">
              <img src={flight} />
              <hr className="flex-1 border-t border-dashed border-black mx-2" />
              <p className=" text-sm text-gray">2:10 hr</p>
            </div>
            <div className="flex-1">
              {/* <FaPlaneArrival className="text-primary" /> */}
              <p className="">Jabalpur - JLR</p>
              <p className="">11:45, 22 Aug`24</p>
              <hr className="flex-1 border-t border-black w-full" />
              <p className="text-xs text-gray">Jabalpur Airport</p>
            </div>
          </div>
          <div className=" flex gap-4 mt-4">
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Regular Fair</p>
            </div>
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Saver</p>
            </div>
          </div>
          <div className=" flex gap-4 mt-4">
            <div className=" flex gap-2 items-center">
              <BsCash className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Economy</p>
            </div>
            <div className=" flex gap-2 items-center">
              <LuBaggageClaim className="text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Check In -Details Not Available</p>
            </div>
            <div className=" flex gap-2 items-center">
              <LuBaggageClaim className=" text-gray text-xl" />
              <p className=" text-xs font-light text-gray">Carry On -Details Not Available</p>
            </div>
          </div>

        </div>



        <div className="w-1/2">
          <div className="bg-white p-4 rounded-md shadow-md mt-4 flex">
            <p>Payment Type - </p>
            <p className=" text-blue"> Bitcoin</p>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md mt-4">
            <p>Booking Status</p>

            <div className=" flex justify-between items-center gap-1">
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

              <Button size="icon" variant="secondary">
                <img
                  src="/icons/plane.png"
                  alt="icon"
                  className="size-4 shrink-0"
                />
              </Button>
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
                  <span>(Baggage)</span>
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">E-Ticket Number</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PNR Number</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Gender</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((passenger) => (
              <tr key={passenger.eTicketNumber} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-700">{passenger.eTicketNumber}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.pnrNumber}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.firstName}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.lastName}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{passenger.gender}</td>
                <td className="px-4 py-2 text-sm">
                  <select
                    value={passenger.status}
                    onChange={(e) => handleStatusChange(passenger.eTicketNumber, e.target.value as "Pending" | "Confirm")}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirm">Confirm</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleSave} className="w-fit bg-green-500 rounded-md text-white px-4 py-1">
        Save Changes
      </button>
    </div>
  );
};

export default FlightBooking;
