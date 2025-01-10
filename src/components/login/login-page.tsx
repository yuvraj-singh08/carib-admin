import { Logo } from "../shared/logo";
import { LogInForm } from "./login-form";

import { useAuthMiddleware } from "@/authMiddleware";
export const Loginpage = () => {
  useAuthMiddleware();
  return (
    <div className="w-full h-full bg-white pt-0 md:pt-8">
      <div className="w-full h-full flex flex-col-reverse md:flex-row">
        <div className="w-full md:w-1/2">
          <img
            src="/login/login.png"
            alt="login banner"
            className="object-cover pointer-events-none select-none w-full md:w-[90%]"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start py-2 md:py-8 gap-3 md:gap-4 px-5 md:pl-10">
          <div className="flex flex-col gap-4 items-start pt-3 md:pt-8">
            <div className="w-full md:w-3/5 flex items-center justify-center mb-2">
              <Logo width="w-20" />
            </div>
            <h1 className="text-2xl md:text-4xl text-[#3B529E] font-semibold">
              Welcome Admin 👋
            </h1>
            
          </div>
          <div className="w-full md:w-3/5">
            <LogInForm />
          </div>
          
        </div>
      </div>
    </div>
  );
};
