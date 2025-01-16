"use client"
import { Button } from '@/components/ui/button'
import BookingDetails from './BookingDetails'
import FlightSegment from './FlightSegment'
import PriceBreakup from './PriceBreakup'
import PassengerTable from './details'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FlightBooking = () => {
  const navigate = useNavigate();
  return (
    <div className=" p-4 rounded-md shadow-md flex flex-col gap-4 mt-8">
      <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2 w-fit"
        >
          <ArrowLeft size={16} />
          Back to List
        </Button>
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
