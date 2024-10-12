import FeesCommissionManagerTable from "@/components/manage-commissions/manage-airlines-commison-table";
import { ContentLayout } from "@/components/shared/content-layout";

const ManageCommisionPage = () => {
  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4">
        <FeesCommissionManagerTable />
      </main>
    </ContentLayout>
  );
};

export default ManageCommisionPage;
