import BookingTicketsTable from "@/components/manage-booked-tickets/manage-tickets-table";
import { ContentLayout } from "@/components/shared/content-layout";
import { TicketStatusCountsOptions } from "@/constants/status-count";
import { selectTicketStatusCounts } from "@/redux/tickets";
import { useSelector } from "react-redux";

const TicketsPage = () => {
  const ticketCounts = useSelector(selectTicketStatusCounts);
  const ticketStatusCountsOptions = TicketStatusCountsOptions(ticketCounts);

  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4 ">
        <div className="w-full h-full grid grid-cols-8 gap-2 md:gap-4 mt-4">
          {ticketStatusCountsOptions.map((option, index) => (
            <div
              key={index}
              className="col-span-4 md:col-span-2 2xl:col-span-2 w-full border h-[100px] 2xl:h-[120px] bg-[#fff] rounded-xl flex items-center gap-3 justify-center"
            >
              <img
                src={option.icon}
                alt="icon"
                className="object-cover size-8 md:size-14 pointer-events-none select-none"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-medium">
                  {option.count}
                </h1>
                <span className="text-sm font-medium text-black/70">
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <BookingTicketsTable />
      </main>
    </ContentLayout>
  );
};

export default TicketsPage;
