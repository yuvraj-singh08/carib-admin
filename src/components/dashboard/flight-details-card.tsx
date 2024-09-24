import { format } from "date-fns";
import { Clock, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import moment from "moment";
import { flightDuration, getCityByCode, LayoverTime } from "@/lib/utils";

interface FlightdetailsCardProps {
  data: any;
}

export const FlightdetailsCard = ({ data }: FlightdetailsCardProps) => {
  const [sliceData, setSliceData] = useState<any>([]);

  useEffect(() => {
    setSliceData(data?.slices);
    console.log(data);
  }, [data, sliceData]);

  const arrivalTime = moment(
    data?.slices?.[data?.slices?.length - 1]?.segments?.[
      data?.slices?.[data?.slices?.length - 1]?.segments?.length - 1
    ]?.arriving_at
  );
  const departureTime = moment(data?.slices?.[0]?.segments?.[0]?.departing_at);
  let mins = arrivalTime.diff(departureTime, "minutes");
  const hours = Math.floor(mins / 60);
  mins = mins % 60;

  const duration = `${hours}hr ${mins}min`;

  return (
    <>
      <div className="w-[550px] flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 justify-between py-3 md:py-1 mb-2">
        <div className="w-full flex items-center gap-3">
          <h1 className="text-xl font-semibold">
            {getCityByCode(data?.slices?.[0]?.segments?.[0]?.origin?.iata_code)}
          </h1>
          <MoveRight className="size-5" />
          <h1 className="text-xl font-semibold">
            {getCityByCode(
              data?.slices?.[data?.slices?.length - 1]?.segments?.[
                data?.slices?.[data?.slices?.length - 1]?.segments?.length - 1
              ]?.destination?.iata_code
            )}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4 w-[400px]">
          <div className="flex flex-col gap-1">
            <p>Duration</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Clock className="size-3" />
              {duration}
            </p>
          </div>
          <Button>Book Now</Button>
        </div>
      </div>
      {sliceData?.map((slice: any, sliceIndex: number) => (
        <div key={sliceIndex}>
          {slice?.segments?.map((segment: any, segmentsIndex: number) => (
            <div key={segmentsIndex}>
              <div className="w-full flex flex-col md:flex-row gap-6 md:gap-0 border h-full rounded-md px-4 md:px-6 py-5 shadow-md items-start md:items-center justify-between mb-4">
                <div className="flex flex-col gap-8">
                  <div className="flex w-full gap-12">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-semibold">
                        {format(new Date(segment?.departing_at), "dd MMM yyyy")}
                      </h1>
                      <p className="text-sm">
                        {format(new Date(segment?.departing_at), "HH:mm")}
                      </p>
                      <p className="text-sm mt-4">
                        {flightDuration(
                          segment?.departing_at,
                          segment?.arriving_at
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col items-start gap-1">
                        <h1 className="text-lg font-semibold flex items-center">
                          {getCityByCode(segment?.origin?.iata_code)} ∙{" "}
                          {segment?.origin?.iata_code}
                        </h1>
                        <p className="text-sm">
                          {
                            data?.slices?.[0]?.segments?.[0]?.origin
                              ?.airport_name
                          }
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 mt-4">
                        <h1 className="text-[14px] font-medium flex items-center gap-1">
                          {segment?.operating_carrier?.logo_symbol_url ? (
                            <img
                              src={segment?.operating_carrier?.logo_symbol_url}
                              alt="airline"
                              className="size-6"
                            />
                          ) : (
                            <img
                              src="/filter/air1.png"
                              alt="airline"
                              className="size-6"
                            />
                          )}
                          {segment?.operating_carrier?.name}
                        </h1>
                        <div className="flex flex-col border-l-fuchsia-50 gap-2 mt-2">
                          <h1 className="text-[14px] font-medium flex items-center gap-1">
                            Connection info
                          </h1>
                          <p className="text-sm font-medium">Airline :</p>
                          <p className="text-sm font-medium">
                            Operating airline :
                          </p>
                          <p className="text-sm font-medium">Flight no :</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-semibold">
                        {format(new Date(segment?.arriving_at), "dd MMM yyyy")}
                      </h1>
                      <p className="text-sm">
                        {format(new Date(segment?.arriving_at), "HH:mm")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-semibold">
                        {getCityByCode(segment?.destination?.iata_code)} ∙{" "}
                        {segment?.destination?.iata_code}
                      </h1>
                      <p className="text-sm">
                        {segment?.destination?.airport_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-full flex flex-col gap-2 md:gap-3 items-start md:items-end justify-center">
                  <p className="text-sm font-medium">
                    {segment?.operating_carrier?.name}
                  </p>
                  <p className="text-sm font-medium">
                    {segment?.operating_carrier?.iata_code}
                  </p>
                  <p className="text-sm font-medium">
                    {segment?.operating_carrier_flight_number}
                  </p>
                </div>
              </div>
              {slice?.segments?.length - 1 > segmentsIndex && (
                <div
                  key={segmentsIndex}
                  className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pl-3 md:pl-6 gap-4 md:gap-0 my-5"
                >
                  <div className="flex items-start flex-col gap-1 w-full md:w-3/4">
                    <p className="text-sm font-medium flex gap-2 items-center">
                      <img
                        src="/filter/travel-icon.png"
                        alt="travel"
                        className="size-4 -mt-1"
                      />
                      layover of{" "}
                      {LayoverTime(
                        segment?.arriving_at,
                        slice?.segments?.[segmentsIndex + 1]?.departing_at
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {sliceData?.length - 1 > sliceIndex && (
            <div
              key={sliceIndex}
              className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pl-3 md:pl-6 gap-4 md:gap-0 my-5"
            >
              <div className="flex items-start flex-col gap-1 w-full md:w-3/4">
                <p className="text-sm font-medium flex gap-2 items-center">
                  <Clock className="size-3" />
                  layover of{" "}
                  {LayoverTime(
                    slice?.segments?.[slice?.segments?.length - 1]?.arriving_at,
                    sliceData?.[sliceIndex + 1]?.segments?.[0]?.departing_at
                  )}
                </p>
                <p className="text-sm font-medium flex gap-2 items-center">
                  <img
                    src="/filter/travel-icon.png"
                    alt="travel"
                    className="size-4 -mt-1"
                  />
                  You have a Self-transfer in Santo Domingo. Please review the
                  Travel
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
