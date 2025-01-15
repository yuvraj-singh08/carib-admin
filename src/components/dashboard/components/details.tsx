import React from "react";

interface Passenger {
  eTicketNumber: number;
  pnrNumber: string;
  status: "Pending" | "Confirm";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
}

const passengers: Passenger[] = [
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles = {
    Pending: "text-orange-500",
    Confirm: "text-green-500",
  };

  return <span className={statusStyles[status as keyof typeof statusStyles]}>{status}</span>;
};

const PassengerTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">E-Ticket Number</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PNR Number</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">First Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Last Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Gender</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.eTicketNumber} className="border-b">
              <td className="px-4 py-2 text-sm text-gray-700">{passenger.eTicketNumber}</td>
              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.pnrNumber}</td>
              <td className="px-4 py-2 text-sm">
                <StatusBadge status={passenger.status} />
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.firstName}</td>
              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{passenger.lastName}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{passenger.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
