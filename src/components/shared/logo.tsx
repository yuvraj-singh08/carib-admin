import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const Logo = ({width}:{width?:string}) => {
  return (
    <Link to="/" className="flex items-center bg-white rounded-[50%] justify-center">
      <img
        src="/logo.png"
        alt="Travel Caribe"
        className={cn("object-cover pointer-events-none select-none w-8 md:w-14 h-auto", width)}
      />
    </Link>
  );
};
