import ProfileForm from "@/components/profile/update-profile-form"
import { ContentLayout } from "@/components/shared/content-layout"


const ProfilePage = () => {
  return (
    <ContentLayout>
    <main className="w-full min-h-screen flex flex-col gap-4 ">
     <ProfileForm />
    </main>
  </ContentLayout>
  )
}

export default ProfilePage