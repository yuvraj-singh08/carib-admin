import { ContentLayout } from "@/components/shared/content-layout";
import SupplierFlightRulesTable from "@/components/supplier/supplier-firewall-rules-table";

const SupplierFirewallPage = () => {
  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4 ">
        <SupplierFlightRulesTable />
      </main>
    </ContentLayout>
  );
};

export default SupplierFirewallPage;
