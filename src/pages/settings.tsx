import EMailSettingsForm from "@/components/landing-settings/email-settings-form";
import PermissionGroup from "@/components/permissions/PermissionGroup";
import GdsApiSettings from "@/components/settings/GdsApiSettings";
import CouponManagementSystemTable from "@/components/settings/manage-deals-table";
import ManagepaymentCms from "@/components/settings/manage-payment-cms";
import BaggageSettings from "@/components/settings/baggageSettings";
import ManagePaymentGateway from "@/components/settings/manage-payment-gateway";
import { ContentLayout } from "@/components/shared/content-layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import FareTable from "@/components/settings/fare-settings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("deals");

  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4">
        <div className="w-full h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white h-14 flex items-center justify-start px-6 gap-6 relative overflow-x-auto overflow-y-hidden"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}>
              <TabsTrigger value="deals" className="data-[state=active]:group">
                Special Deals
                {activeTab === "deals" && (
                <div className="absolute w-[9%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="payment"className="data-[state=active]:group">Payment Gateway setting
              {activeTab === "payment" && (
                <div className="absolute w-[16%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="email">Email SMTP setting
              {activeTab === "email" && (
                <div className="absolute w-[13%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="paymentCms">Payment CMS
              {activeTab === "paymentCms" && (
                <div className="absolute w-[9%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="GDSAPI">GDS API Settings
              {activeTab === "GDSAPI" && (
                <div className="absolute w-[11%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="baggage">Baggage Settings
              {activeTab === "baggage" && (
                <div className="absolute w-[11%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />

              <TabsTrigger value="fare">Fare Settings
              {activeTab === "fare" && (
                <div className="absolute w-[11%] h-4 bg-[#90BF5F] rounded-xl bottom-0 -mb-3" />
              )}
              </TabsTrigger>
              
              
              
              
              
              
            </TabsList>
            <TabsContent value="deals">
              <PermissionGroup resource="settings" action="view">
                <CouponManagementSystemTable />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="payment">
              <PermissionGroup resource="settings" action="view">
                <ManagePaymentGateway />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="email">
              <PermissionGroup resource="settings" action="view">
                <EMailSettingsForm />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="paymentCms">
              <PermissionGroup resource="settings" action="view">
                <ManagepaymentCms />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="GDSAPI">
              <PermissionGroup resource="settings" action="view">
                <GdsApiSettings />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="baggage">
              <PermissionGroup resource="settings" action="view">
                <BaggageSettings />
              </PermissionGroup>
            </TabsContent>
            <TabsContent value="fare">
              <PermissionGroup resource="settings" action="view">
              <FareTable/>
              </PermissionGroup>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ContentLayout>
  );
};

export default SettingsPage;
