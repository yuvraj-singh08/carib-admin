import React, { useState } from "react";

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

const PassengerTable: React.FC = () => {
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

  return (
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
  );
};

export default PassengerTable;
