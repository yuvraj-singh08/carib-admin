import CustomerDetailsTable from "@/components/customer-details/customer-details-table";
import { ContentLayout } from "@/components/shared/content-layout";

const CustomerDetailsPage = () => {
  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4 ">
        <CustomerDetailsTable />
      </main>
    </ContentLayout>
  );
};

export default CustomerDetailsPage;
