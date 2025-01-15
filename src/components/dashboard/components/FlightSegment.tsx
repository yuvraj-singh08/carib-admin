import React from "react";
import flight from "../../../../public/icons/flight.png";
import { BsCash } from "react-icons/bs";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFastfood } from "react-icons/md";

const FlightSegment: React.FC = () => {
  return (
    <>
    <div className="bg-white p-4 mt-4 rounded-md shadow-md w-full h-fit">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-primary">Chennai → Mumbai → Jabalpur</h2>
        <p className="text-sm text-gray-500">2h 10m</p>
      </div>

      {/* 1st Flight Data */}
      <div className="mt-4 flex items-center gap-4">
        <div className=" flex-1 flex gap-2">
            <img src="https://www.shutterstock.com/image-vector/indigo-app-logo-kerala-india-260nw-2403547037.jpg" alt="" className=" h-10"/>
            <div className=" flex flex-col">
                <p className=" text-sm text-gray">IndiGo</p>
                <p className=" text-sm text-gray">6E-5093</p>
            </div>
        </div>
        <div className="flex-1">
          <p className="">Chennai - MAA</p>
          <p className="">04:45, 22 Aug '24</p>
          <hr className="flex-1 border-t border-black"/>
          <p className="text-xs text-gray">Chennai International Airport, Terminal 1</p>
        </div>
        <div className=" flex-1 flex flex-col justify-center items-center">
        <img src={flight} />
        <hr className="flex-1 border-t border-dashed border-black mx-2"/>
        <p className=" text-sm text-gray">2:10 hr</p>
        </div>
        <div className="flex-1">
          {/* <FaPlaneArrival className="text-primary" /> */}
          <p className="">Mumbai - BOM</p>
          <p className="">06:55, 22 Aug '24</p>
          <hr className="flex-1 border-t border-black w-full"/>
          <p className="text-xs text-gray">Chhatrapati Shivaji International Airport, Terminal 1</p>
        </div>
      </div>
      <div className=" flex gap-4 mt-4">
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Regular Fair</p>
        </div>
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Saver</p>
        </div>
      </div>
      <div className=" flex gap-4 mt-4">
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Economy</p>
        </div>
        <div className=" flex gap-2 items-center">
            <LuBaggageClaim className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Check In -Details Not Available</p>
        </div>
        <div className=" flex gap-2 items-center">
            <LuBaggageClaim className=" text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Carry On -Details Not Available</p>
        </div>
      </div>

      {/* layover details */}
      <div className=" my-8">
      <hr className=" border-t border-dashed border-black mx-2"/>
      <div className=" flex gap-2 py-3 justify-around">
        <MdOutlineFastfood className=" text-gray"/>
        <p className=" text-xs text-gray">3h 5m layover</p>
        <p className=" text-xs text-gray">Stopover in Mumbai (BOM), you will have to change the FLIGHT</p>
      </div>
      <hr className=" border-t border-dashed border-black mx-2"/>
      </div>

      {/* 2nd Flight Data */}
      <div className="mt-4 flex items-center gap-4">
        <div className=" flex-1 flex gap-2">
            <img src="https://www.shutterstock.com/image-vector/indigo-app-logo-kerala-india-260nw-2403547037.jpg" alt="" className=" h-10"/>
            <div className=" flex flex-col">
                <p className=" text-sm text-gray">IndiGo</p>
                <p className=" text-sm text-gray">6E-5093</p>
            </div>
        </div>
        <div className="flex-1">
          <p className="">Mumbai - BOM</p>
          <p className="">10:00, 22 Aug`24</p>
          <hr className="flex-1 border-t border-black"/>
          <p className="text-xs text-gray">Chhatrapati Shivaji International Airport, Terminal 2</p>
        </div>
        <div className=" flex-1 flex flex-col justify-center items-center">
        <img src={flight} />
        <hr className="flex-1 border-t border-dashed border-black mx-2"/>
        <p className=" text-sm text-gray">2:10 hr</p>
        </div>
        <div className="flex-1">
          {/* <FaPlaneArrival className="text-primary" /> */}
          <p className="">Jabalpur - JLR</p>
          <p className="">11:45, 22 Aug`24</p>
          <hr className="flex-1 border-t border-black w-full"/>
          <p className="text-xs text-gray">Jabalpur Airport</p>
        </div>
      </div>
      <div className=" flex gap-4 mt-4">
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Regular Fair</p>
        </div>
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Saver</p>
        </div>
      </div>
      <div className=" flex gap-4 mt-4">
        <div className=" flex gap-2 items-center">
            <BsCash className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Economy</p>
        </div>
        <div className=" flex gap-2 items-center">
            <LuBaggageClaim className="text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Check In -Details Not Available</p>
        </div>
        <div className=" flex gap-2 items-center">
            <LuBaggageClaim className=" text-gray text-xl"/>
            <p className=" text-xs font-light text-gray">Carry On -Details Not Available</p>
        </div>
      </div>

    </div>

    
    </>
  );
};

export default FlightSegment;
