import { useState } from "react";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1400);

  return (
    <div className="overflow-x-hidden">
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
        children
      )}
    </div>
  );
}
