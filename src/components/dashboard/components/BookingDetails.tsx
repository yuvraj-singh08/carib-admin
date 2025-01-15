import React from "react";
// import { AiOutlineDownload, AiOutlineMail } from "react-icons/ai";

const BookingDetails: React.FC = () => {
  return (
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
      {/* <div className="mt-4 flex justify-between">
        <button className="flex items-center gap-2 text-primary">
          <AiOutlineDownload size={18} />
          <span>Download E-ticket(s)</span>
        </button>
        <button className="flex items-center gap-2 text-primary">
          <AiOutlineMail size={18} />
          <span>Email/SMS E-Ticket(s)</span>
        </button>
      </div> */}
    </div>
  );
};

export default BookingDetails;
