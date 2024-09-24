import SearchManagement from "@/components/search-management/search-management-form-table"
import { ContentLayout } from "@/components/shared/content-layout"

const SearchManagementPage = () => {
  return (
    <ContentLayout>
    <main className="w-full min-h-screen flex flex-col gap-4 ">
   <SearchManagement />
    </main>
  </ContentLayout>
  )
}

export default SearchManagementPage