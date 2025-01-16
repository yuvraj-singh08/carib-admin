import ResetPasswordComponnent from "./ResetPasswordComponnent";
import { Logo } from "@/components/shared/logo";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const otpVerified = sessionStorage.getItem("otpVerified");
    if (otpVerified !== "true") {
      toast.error("Unauthorized access. Please verify your OTP.");
      navigate("/forgot-password"); // Redirect to forgot-password page
    }
  }, [navigate]);

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
            <div className="w-full md:w-3/5 flex items-center justify-center mb-2 opacity-0">
              <Logo width="w-20" />
            </div>
            <h1 className="text-2xl md:text-4xl text-[#3B529E] font-semibold">
              Reset Password ✨
            </h1>
            
          </div>
          <div className="w-full md:w-3/5">
            <ResetPasswordComponnent />
          </div>
          <div className="w-full md:w-3/5 -mt-10">
            <img src="/login/Or.png" alt="or" className="object-cover" />
          </div>
          <div className="w-full md:w-3/5 flex flex-col gap-2 items-center justify-center">
            <p className="text-sm text-blue">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#3B529E]">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
