import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import { Separator } from "../ui/separator";

export function Navbar() {
  return (
    <header className="h-14 md:h-20 flex items-center justify-between md:justify-end sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="relative">
            <Input
              placeholder="Search product..."
              className="w-[210px] rounded-xl hidden md:block h-10 pl-9"
            />
            <Search className="size-5 shrink-0 text-gray absolute top-2.5 left-2" />
          </div>
          <div className="size-9 shrink-0 rounded-full flex items-center justify-center relative cursor-pointer">
            <img
              src="/icons/bell.png"
              alt="bell"
              className="object-cover size-5"
            />
            <span className="size-5  shrink-0 absolute flex items-center text-white justify-center -top-2 -right-1 rounded-full bg-gradient-to-r from-[rgba(43,178,254,1)] to-[rgba(34,202,173,1)] text-[12px] font-medium">
              2
            </span>
          </div>
          <div className="size-8 rounded-full flex items-center justify-center object-contain cursor-pointer">
            <img
              src="/language/english.png"
              alt="region"
              className="w-full h-full object-cover"
            />
          </div>
          <Separator orientation="vertical" className="h-[34px]" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
