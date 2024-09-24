import { BadgePercent, Dot, Heart, Ticket } from "lucide-react";
import { MdFlight } from "react-icons/md";
import { Button } from "../ui/button";
import { format } from "date-fns";
import moment from "moment";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { SingleFlightCard } from "./single-card";
import { ScrollArea } from "../ui/scroll-area";
import { getCityByCode } from "@/lib/utils";
import { FlightdetailsCard } from "./flight-details-card";

interface MainCardProps {
  data: any;
}

export const FlightsCard = ({ data }: MainCardProps) => {
  const arrivalTime = moment(
    data.slices[data.slices.length - 1].segments[
      data.slices[data.slices.length - 1].segments.length - 1
    ].arriving_at
  );
  const departureTime = moment(data.slices[0].segments[0].departing_at);
  let mins = arrivalTime.diff(departureTime, "minutes");
  const hours = Math.floor(mins / 60);
  mins = mins % 60;

  const duration = `${hours}hr ${mins}min`;

  return (
    <div className="w-full bg-white px-4 md:px-8 py-3 md:py-4">
      {/* Header Details */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-0">
        <div className="text-lg font-semibold flex items-center gap-1">
          <img
            src="/filter/air1.png"
            alt="airline"
            className="object-cover size-6 shrink-0"
          />
          Airlince name
        </div>
        <div className="flex items-center gap-1">
          <Heart className="size-5 shrink-0" />
          <h1 className="text-lg font-normal flex items-center gap-1">
            Travel Class:
            <span className="font-semibold capitalize">{data.cabin_class}</span>
          </h1>
        </div>
      </div>
      {/* Body Details */}
      <div className="w-full flex flex-col md:flex-row py-4">
        <div className="w-full md:w-5/6 bg-[#EAF0F0] rounded-lg h-full flex flex-col gap-3 py-3 md:py-6 px-3 md:px-4">
          <h1 className="text-[13px] md:text-[15px] font-semibold">
            {format(
              new Date(data.slices[0].segments[0].departing_at),
              "dd MMM yyyy"
            )}
          </h1>
          <div className="flex items-center justify-between w-full gap-1">
            <div className="flex flex-col gap-1 w-1/5">
              <h1 className="text-sm md:text-lg font-semibold">
                {format(
                  new Date(data.slices[0].segments[0].departing_at),
                  "HH:mm"
                )}
              </h1>
              <p className="text-sm font-medium">
                {data?.slices[0]?.segments[0]?.origin?.iata_code}
              </p>
              <p className="text-sm font-medium">
                {getCityByCode(data?.slices[0]?.segments[0]?.origin?.iata_code)}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Dot className="size-8 md:size-10 text-[#7EB1E0] shrink-0 -ml-5 md:ml-0" />
              <img
                src="/filter/line.png"
                alt="line"
                className="w-[50px] md:w-[90px] -ml-5 md:-ml-3"
              />
              <p className="text-[10px] md:text-sm text-blue font-medium pr-4 pl-3 text-center">
                {duration}
              </p>
              <img
                src="/filter/line.png"
                alt="line"
                className="w-[50px] md:w-[90px] -ml-5 md:-ml-3"
              />
              <MdFlight className="size-4 md:size-6 text-[#7EB1E0] rotate-90 shrink-0" />
            </div>
            <div className="flex flex-col gap-1 w-1/5">
              <h1 className="text-sm md:text-lg font-semibold">
                {format(
                  data.slices[data.slices.length - 1].segments[
                    data.slices[data.slices.length - 1].segments.length - 1
                  ].arriving_at,
                  "HH:mm"
                )}
              </h1>
              <p className="text-sm font-medium">
                {
                  data.slices[data.slices.length - 1].segments[
                    data.slices[data.slices.length - 1].segments.length - 1
                  ].destination?.iata_code
                }
              </p>
              <p className="text-sm font-medium">
                {getCityByCode(
                  data.slices[data.slices.length - 1].segments[
                    data.slices[data.slices.length - 1].segments.length - 1
                  ].destination?.iata_code
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/6 flex flex-col items-center pl-0 md:pl-3 py-5 gap-3">
          <div className="flex items-start flex-col">
            <h1 className="text-xl md:text-2xl font-semibold">
              {data.total_amount}
            </h1>
            <p className="text-[11px] text-green font-medium pt-[0.5px] flex items-center gap-1">
              $500 OFF
              <span>
                <BadgePercent className="size-3 shrink-0" />
              </span>
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full ml-4" size="sm">
                Book Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader className="py-2">
                <DialogTitle className="text-blue">Trip summary</DialogTitle>
              </DialogHeader>
              <ScrollArea className="w-full h-[80vh]">
                <FlightdetailsCard data={data} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full md:w-5/6 flex items-center justify-between">
          <h1 className="text-sm md:text-lg font-medium text-center">
            100 seats remaining
          </h1>
          <h1 className="text-sm md:text-lg font-medium text-orange text-center">
            Partially Refundable
          </h1>
          <h1 className="text-sm md:text-lg font-medium text-violet text-center">
            View flight details
          </h1>
        </div>
        <img
          src="/filter/big-line.png"
          alt="line"
          className="object-cover w-full"
        />
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <h1 className="text-[12px] font-medium flex items-center gap-1">
              <Ticket className="size-3 text-black fill-black" />
              Separate tickets booked together for cheaper price
            </h1>
            <h1 className="text-[12px] font-medium flex items-center gap-1">
              <img
                src="/filter/tavelator.png"
                alt="travle"
                className="size-4 -mt-1"
              />
              Change of Terminal
            </h1>
            {data?.slices.length > 1 && (
              <h1 className="text-[12px] font-medium flex items-center gap-1">
                <img
                  src="/filter/travel.png"
                  alt="travle"
                  className="size-4 -mt-1"
                />
                Self Transfer
              </h1>
            )}
          </div>
          <div className="px-2 py-[1px] bg-green text-white rounded-full">
            Cheapest
          </div>
        </div>
      </div>
    </div>
  );
};
