import { useTableLoader } from "@/hooks/loader";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  const { loading } = useTableLoader();

  return (
    <div className="overflow-x-hidden">
      {/* <Navbar /> */}

      {loading ? (
        <div className="flex justify-center items-center min-h-[90vh]">
          <div className="w-50 h-50 relative">
            <img
              src="/icons/loader.svg"
              alt="loader icon"
              className="w-full h-full object-contain opacity-65 animate-spin"
              style={{ transformOrigin: "center center" }}
            />
          </div>
        </div>
      ) : (
        <div className="container pt-8 pb-8 px-4 md:px-4 bg-lightGray/40">
          {children}
        </div>
      )}
    </div>
  );
}
