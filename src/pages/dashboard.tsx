import { FlightSearchSection } from "@/components/dashboard/flight-search-form";
import { ContentLayout } from "@/components/shared/content-layout";
import { TicketStatusCountsOptions } from "@/constants/dashboard";

const DashboardPage = () => {
  return (
    <ContentLayout>
      <main className="w-full min-h-screen bg-lightGray flex flex-col gap-4">
        <FlightSearchSection />
        <div className="w-full h-full grid grid-cols-8 gap-2 md:gap-4">
          {TicketStatusCountsOptions.map((option, index) => (
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
                <h1 className="text-xl md:text-2xl font-medium">{option.count}</h1>
                <span className="text-sm font-medium text-black/70">
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </ContentLayout>
  );
};

export default DashboardPage;
