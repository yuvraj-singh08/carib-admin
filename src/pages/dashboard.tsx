import FilterFlighTable from "@/components/dashboard/filter-flights-table";
import { ContentLayout } from "@/components/shared/content-layout";
import { BookingStatusCountsOptions } from "@/constants/booking-status-count";

import { selectBookingStatusCounts } from "@/redux/booking";

import { useSelector } from "react-redux";

const DashboardPage = () => {
  const bookingCounts = useSelector(selectBookingStatusCounts);
  const bookingStatusCountsOptions = BookingStatusCountsOptions(bookingCounts);

  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4 ">
        <div className="w-full h-full grid grid-cols-10 gap-2 md:gap-4">
          {bookingStatusCountsOptions.map((option, index) => (
            <div
              key={index}
              className="col-span-4 md:col-span-2 2xl:col-span-2 w-full border h-[100px] 2xl:h-[120px] bg-[#fff] rounded-xl flex items-center gap-3 justify-center"
            >
              <img
                src={option.icon}
                alt="icon"
                className="object-cover size-8 md:size-10 pointer-events-none select-none"
              />
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-xl md:text-2xl font-medium">
                  {option.count}
                </h1>
                <span className="text-xs font-medium text-black/70">
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <FilterFlighTable />
      </main>
    </ContentLayout>
  );
};

export default DashboardPage;
