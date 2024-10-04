import CookieSettingsForm from "@/components/landing-settings/cookie-settings-form";
import SocialProvidersForm from "@/components/landing-settings/socials-settings";
import PrivacyPolicyForm from "@/components/landing-settings/text-editor";
import { ContentLayout } from "@/components/shared/content-layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const LandingPageSettings = () => {
  const [activeTab, setActiveTab] = useState("cookie");
  return (
    <ContentLayout>
      <main className="w-full min-h-screen flex flex-col gap-4">
        <div className="w-full h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white h-14 flex items-center justify-start px-6 gap-6 relative overflow-hidden">
              <TabsTrigger value="cookie">Cookie Setting</TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="terms">Terms & Condition</TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              <TabsTrigger value="socials">Social Media</TabsTrigger>
              <Separator orientation="vertical" className="h-[34px]" />
              {activeTab === "cookie" && (
                <div className="w-36 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-4" />
              )}
              {activeTab === "privacy" && (
                <div className="w-32 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-48" />
              )}
              {activeTab === "terms" && (
                <div className="w-44 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-[350px]" />
              )}
              {activeTab === "socials" && (
                <div className="w-32 h-4 bg-[#90BF5F] rounded-xl absolute -bottom-2.5 left-[550px]" />
              )}
            </TabsList>
            <TabsContent value="cookie">
              <CookieSettingsForm />
            </TabsContent>
            <TabsContent value="privacy">
              <PrivacyPolicyForm />
            </TabsContent>
            <TabsContent value="terms">three</TabsContent>
            <TabsContent value="socials">
              <SocialProvidersForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ContentLayout>
  );
};

export default LandingPageSettings;
