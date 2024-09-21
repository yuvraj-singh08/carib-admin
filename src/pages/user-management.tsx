import ManageUserTable from "@/components/manage-user/manage-user-table";
import { ContentLayout } from "@/components/shared/content-layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4">
        <div className="w-full h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white h-14 flex items-center justify-start px-6 gap-6 relative overflow-hidden">
              <TabsTrigger value="user" className="data-[state=active]:group">
                User
              </TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger
                value="rolePermission"
                className="data-[state=active]:group"
              >
                Role & Permission
              </TabsTrigger>
              {activeTab === "user" && (
                <div className="w-20 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-4" />
              )}
              {activeTab === "rolePermission" && (
                <div className="w-40 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-32" />
              )}
            </TabsList>
            <TabsContent value="user">
              <ManageUserTable/>
            </TabsContent>
            <TabsContent value="rolePermission">
              Role & Permission Content
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ContentLayout>
  );
};
