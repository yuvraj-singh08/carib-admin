import EMailSettingsForm from "@/components/landing-settings/email-settings-form";
import CouponManagementSystemTable from "@/components/settings/manage-deals-table";
import ManagePaymentGateway from "@/components/settings/manage-payment-gateway";
import { ContentLayout } from "@/components/shared/content-layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("deals");

  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4">
        <div className="w-full h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white h-14 flex items-center justify-start px-6 gap-6 relative overflow-hidden">
              <TabsTrigger value="deals" className="data-[state=active]:group">
                Special Deals
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger
                value="payment"
                className="data-[state=active]:group"
              >
                Payment Gateway setting
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="email">Email SMTP setting</TabsTrigger>
              {activeTab === "deals" && (
                <div className="w-36 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-4" />
              )}
              {activeTab === "payment" && (
                <div className="w-48 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-48" />
              )}
              {activeTab === "email" && (
                <div className="w-48 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 right-[380px]" />
              )}
            </TabsList>
            <TabsContent value="deals">
                <CouponManagementSystemTable/>
            </TabsContent>
            <TabsContent value="payment">
            <ManagePaymentGateway/>
            </TabsContent>
            <TabsContent value="email">
              <EMailSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ContentLayout>
  );
};

export default SettingsPage;
