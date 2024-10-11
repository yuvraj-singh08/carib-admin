import { LayoutGrid, Loader, LogOut, User } from "lucide-react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  avatarSrc: string;
  role?: string;
}

interface UserNavProps {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

export function UserNav({ user, loading, logout }: UserNavProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    // If loading, show a spinner or placeholder
    return (
      <div className="flex items-center gap-3">
        <Loader className="animate-spin size-5 text-blue" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <Avatar className="size-8 md:size-9 shrink-0">
                    <AvatarImage src={user?.avatarSrc} alt="avtar" />
                    <AvatarFallback className="bg-transparent border border-black/50">
                      {user?.firstname[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="size-4 shrink-0 absolute flex items-center text-white justify-center bottom-0 -right-1 rounded-full bg-[#22CAAD] text-[12px] font-medium border-white border-[2px]" />
                </div>
                <div className="flex flex-col gap-[2px] items-start">
                  <p className="text-[14px] md:text-sm font-medium leading-none capitalize">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-[10px] md:text-[12px]">
                    {user?.role}
                  </p>
                </div>
                <BsFillCaretDownFill className="size-3 md:size-4 text-gray" />
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/profile" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
