"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlightDetails, updateFlightDetails } from "@/redux/flightSlice";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import flightIcon from "../../../../public/icons/flight.png";
// import { BsCash } from "react-icons/bs";
import { LuBaggageClaim } from "react-icons/lu";
// import { MdOutlineFastfood } from "react-icons/md";
import { sendBookingEmail } from '@/redux/booking';
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FlightBooking: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { flightDetails, loading, error } = useSelector(
    (state: RootState) => state.flight
  );
  console.log("flightDetails", flightDetails);
  const [selectedOption, setSelectedOption] = useState("FAILED_BOOKING");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
 
  const emailSending = useSelector((state: RootState) => state.bookings.emailSending);
  const emailError = useSelector((state: RootState) => state.bookings.emailError);

  const options = [
    { label: "TICKETED", color: "bg-green-500" },
    { label: "PENDING_TICKET", color: "bg-yellow-500" },
    { label: "PENDING_PAYMENT", color: "bg-orange-500" },
    { label: "EXPIRED", color: "bg-white" },
    { label: "FAILED_BOOKING", color: "bg-red-500" },
  ];


  const handleSendEmail = async (bookingId: string) => {
    setOpen(false);
    try {
      await dispatch(sendBookingEmail(bookingId)).unwrap();
      toast.success("Email sent successfully");
    } catch (error) {
      // Now we're using the error from Redux state to show in toast
      console.log(error);
      const errorMessage = emailError[bookingId] || "Failed to send email";
      toast.error(errorMessage);
    }
  };

  

  // const getSelectedOptionColor = () =>
  //   options.find((option) => option.label === selectedOption)?.color || "";

  // const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // const handleOptionClick = (optionLabel: string) => {
  //   setSelectedOption(optionLabel);
  //   setIsDropdownOpen(false); // Close the dropdown after selecting an option
  // };
  useEffect(() => {
    if (bookingId) {
      dispatch(fetchFlightDetails(bookingId));
    }
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (flightDetails?.adminStatus) {
      setSelectedOption(flightDetails.adminStatus);
    }
  }, [flightDetails]);

  const formatDuration = (duration: string) => {
    if (!duration) return "N/A";
    return duration.replace("PT", "").replace("H", "h ").replace("M", "m");
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
      };
    } catch {
      return { time: "N/A", date: "N/A" };
    }
  };

  // const calculateLayover = (arrival: string, nextDeparture: string) => {
  //   try {
  //     const diff = new Date(nextDeparture).getTime() - new Date(arrival).getTime();
  //     const hours = Math.floor(diff / 1000 / 60 / 60);
  //     const minutes = Math.floor((diff / 1000 / 60) % 60);
  //     return `${hours}h ${minutes}m`;
  //   } catch {
  //     return "N/A";
  //   }
  // };

  const calculateTimeDifferences = (flightDetails: any) => {
    const timeDifferences: any = [];

    if (!flightDetails?.itenaries) return [];

    flightDetails.itenaries.forEach((itinerary: any, index: any) => {
      // Get the arriving_at of current itinerary
      const currentArrival = itinerary?.slices?.[0]?.segments?.[0]?.arriving_at;

      // Get the departing_at of next itinerary if it exists
      const nextDeparture =
        flightDetails.itenaries[index + 1]?.slices?.[0]?.segments?.[0]
          ?.departing_at;

      if (currentArrival && nextDeparture) {
        const arrivalTime = new Date(currentArrival);
        const departureTime = new Date(nextDeparture);
        //@ts-ignore
        const diffInMilliseconds = departureTime - arrivalTime;
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

        timeDifferences.push({
          from: currentArrival,
          to: nextDeparture,
          differenceHours: diffInHours,
        });
      }
    });
    console.log("timeDifferences", timeDifferences);

    return timeDifferences;
  };
  const [layovers, setLayovers] = useState();
  console.log("layovers", layovers);

  useEffect(() => {
    if (flightDetails) {
      setLayovers(calculateTimeDifferences(flightDetails?.flightDetails));
      console.log("lyovers in effect", layovers);
      console.log(
        "calculateTimeDifferences()",
        calculateTimeDifferences(flightDetails.flightDetails)
      );
    }
  }, [flightDetails]);

  const getItineraries = () => {
    if (!flightDetails) return [];
    const fd = flightDetails.flightDetails;
    return fd.itenaries?.length ? fd.itenaries : [fd];
  };

  const getFlightRoute = () => {
    const itineraries = getItineraries();
    if (!itineraries.length) return "N/A";

    const route = [];
    for (const it of itineraries) {
      route.push(it.origin?.iata_code || "N/A");
    }
    route.push(
      itineraries[itineraries.length - 1].destination?.iata_code || "N/A"
    );

    return route.join(" → ");
  };

  const handleStatusChange = (ticketNumber: number, newStatus: string) => {
    console.log("Status changed:", ticketNumber, newStatus);
  };

  const handleSave = () => {
    if (bookingId) {
      dispatch(
        updateFlightDetails({
          bookingId,
          updatedData: { status: selectedOption },
        })
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!flightDetails) return <div>No booking found</div>;

      const LoadingSpinner = () => (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );

  const passengers = flightDetails.passenger
    ? JSON.parse(flightDetails.passenger)
    : [];
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

      <div className="p-6 rounded-md shadow-md bg-gradient-to-b from-[#D1E2FF] to-[#97C3FC]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-primary">
              Booking Status: {flightDetails.adminStatus.toLowerCase()}
            </h1>
            <p className="text-sm text-gray">
              ID: <span className="text-black">{flightDetails.id}</span>
            </p>
          </div>
          <p className="text-sm text-black">
            Booked: {new Date(flightDetails.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4 bg-white p-4 rounded-md shadow-md w-fit">
          <h2 className="text-lg font-bold text-primary">{getFlightRoute()}</h2>
          <p className="text-sm text-gray-500">
            {
              formatDateTime(
                getItineraries()[0]?.slices?.[0]?.segments?.[0]?.departing_at
              ).date
            }{" "}
            •{flightDetails.passenger?.length || 0} Travellers
          </p>
        </div>
      </div>

      <div className="w-full flex gap-2">
        <div className="bg-white p-4 mt-4 rounded-md shadow-md w-full h-fit">
          {getItineraries().map((itinerary: any, itineraryIndex: any) => (
            <div key={itineraryIndex} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {itineraryIndex === 0 ? "Outbound Journey" : "Return Journey"}
              </h3>

              {itinerary.slices?.map((slice: any, sliceIndex: any) => (
                <div key={sliceIndex}>
                  {slice.segments?.map((segment: any, segmentIndex: any) => {
                    const departure = formatDateTime(segment.departing_at);
                    const arrival = formatDateTime(segment.arriving_at);

                    return (
                      <div key={segmentIndex} className="mb-6">
                        <div className="flex items-center gap-4">
                          {/* Airline Info */}
                          <div className="flex-1 flex gap-2 items-center">
                            <img
                              src={
                                segment.operating_carrier?.logo_symbol_url ||
                                "/default-airline.png"
                              }
                              alt="Airline"
                              className="h-10 w-10 object-contain"
                            />
                            <div> 
                              <p className="text-sm font-medium">
                                {segment.operating_carrier?.name ||
                                  "Unknown Airline"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Flight{" "}
                                {segment.operating_carrier_flight_number ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Departure */}
                          <div className="flex-1">
                            <p className="font-medium">
                              {segment.origin?.iata_code || "N/A"}
                            </p>
                            <p className="text-sm">{departure.time}</p>
                            <p className="text-xs text-gray-500">
                              {segment.origin?.name || "N/A"}
                              {segment.origin_terminal &&
                                `, T${segment.origin_terminal}`}
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="flex-1 flex flex-col items-center">
                            <img
                              src={flightIcon}
                              alt="Duration"
                              className="h-6 w-6"
                            />
                            <p className="text-sm text-gray-500">
                              {formatDuration(segment.duration)}
                            </p>
                          </div>

                          {/* Arrival */}
                          <div className="flex-1">
                            <p className="font-medium">
                              {segment.destination?.iata_code || "N/A"}
                            </p>
                            <p className="text-sm">{arrival.time}</p>
                            <p className="text-xs text-gray-500">
                              {segment.destination?.name || "N/A"}
                              {segment.destination_terminal &&
                                `, T${segment.destination_terminal}`}
                            </p>
                          </div>
                        </div>

                        {/* Baggage Info */}
                        <div className="mt-4 flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <LuBaggageClaim className="text-gray-500" />
                            <span>
                              Checked: {segment.checkedBaggage || 0}x23kg
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LuBaggageClaim className="text-gray-500" />
                            <span>Cabin: {segment.cabinBaggage || 1}x7kg</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar Section */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <div className="relative">
                  <div
                    className={`px-4 py-2 border rounded cursor-pointer ${
                      options.find((o) => o.label === selectedOption)?.color
                    }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedOption}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                      {options.map((option) => (
                        <div
                          key={option.label}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedOption(option.label);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${option.color} mr-2`}
                          />
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="text-blue-600">Credit Card</span>
              </div>

              <Popover onOpenChange={setOpen} open={open}>
              <PopoverTrigger asChild>
                <Button 
                  variant="secondary"
                  type="button"
                  disabled={emailSending[bookingId as string]}
                >
                  {emailSending[bookingId as string] ? (
                    <LoadingSpinner />
                  ) : (
                    <img
                      src="/icons/plane.png"
                      alt="icon"
                      className="w-4 h-4 shrink-0"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 shadow-lg rounded-lg border border-gray-200 p-6 bg-white mr-7">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Confirm Action</h4>
                    <p className="text-sm text-gray-500">
                      Do you want to send the email?
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpen(false)}
                    >
                      No
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendEmail(bookingId as string)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Fare:</span>
                <span>
                  {flightDetails.currency}{" "}
                  {flightDetails.baseFare?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees:</span>
                <span>
                  {flightDetails.currency}{" "}
                  {flightDetails.tax_fee_surges?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Other Charges:</span>
                <span>
                  {flightDetails.currency}{" "}
                  {flightDetails.otherCharges?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="pt-2 border-t font-medium flex justify-between">
                <span>Total:</span>
                <span>
                  {flightDetails.currency}{" "}
                  {flightDetails.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passengers Table */}
      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Passenger</th>
              <th className="px-4 py-3 text-left">PNR</th>
              <th className="px-4 py-3 text-left">E-Ticket</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* {flightDetails.passenger?.map((p: string, index: number) => {
              try {
                const passenger = JSON.parse(p);
                const subBooking = flightDetails.subBooking?.[index] || {};
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      {passenger.firstName} {passenger.lastName}
                      <span className="block text-sm text-gray-500">
                        {passenger.gender === "m" ? "Male" : "Female"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {subBooking.pnr || "Not Found"}
                    </td>
                    <td className="px-4 py-3">
                      {subBooking.ticketNumber?.toString() || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={subBooking.status || "pending"}
                        onChange={(e) => handleStatusChange(subBooking.ticketNumber, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    </td>
                  </tr>
                );
              } catch {
                return (
                  <tr key={index}>
                    <td colSpan={4} className="px-4 py-3 text-red-500">
                      Error loading passenger data
                    </td>
                  </tr>
                );
              }
            })} */}

            {Array.isArray(passengers) &&
              passengers.map((passenger: any, index: number) => {
                const subBooking = flightDetails.subBooking?.[index] || {};

                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      {passenger.firstName} {passenger.lastName}
                      <span className="block text-sm text-gray-500">
                        {passenger.gender === "m" ? "Male" : "Female"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {subBooking.pnr || flightDetails?.flightDetails?.slices[0]?.PNR || "Not Found"}
                    </td>
                    <td className="px-4 py-3">
                      {subBooking.ticketNumber?.toString() || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={subBooking.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(
                            subBooking.ticketNumber,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="w-fit bg-green-500 text-white px-4 py-2 rounded-md self-end"
      >
        Save Changes
      </button>
    </div>
  );
};

export default FlightBooking;
