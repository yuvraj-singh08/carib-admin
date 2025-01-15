"use client"
import BookingDetails from './BookingDetails'
import FlightSegment from './FlightSegment'
import PriceBreakup from './PriceBreakup'
import PassengerTable from './details'

const FlightBooking = () => {
  return (
    <div className=" p-4 rounded-md shadow-md flex flex-col gap-4 mt-8">
      <BookingDetails/>
      <div className=" w-full flex gap-2">
      <FlightSegment/>
      <PriceBreakup/>
      </div>
      <PassengerTable/>
      <button className=' w-fit bg-green-500 rounded-md text-white px-4 py-1'>Save Changes</button>
    </div>
  )
}

export default FlightBooking
