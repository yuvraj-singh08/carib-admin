

interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div >
      {/* <Navbar /> */}
      <div className="container pt-8 pb-8 px-4 md:px-5 bg-lightGray/40">{children}</div>
    </div>
  );
}
