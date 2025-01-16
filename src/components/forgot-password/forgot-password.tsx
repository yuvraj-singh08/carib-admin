import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/provider/axios";
import { Logo } from "../shared/logo";

const ForgotPasswordComponent: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [, setEmailSent] = useState<boolean>(false);
    const [otpStep, setOtpStep] = useState<boolean>(false);
    const navigate = useNavigate();

    const sendOtp = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                "https://travelcarib.tekniche.xyz/user/forgot-password",
                { email }
            );

            if (response.data.success) {
                toast.success("OTP sent to your email");
                setEmailSent(true);
                setOtpStep(true);
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while sending the OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                "https://travelcarib.tekniche.xyz/user/verify",
                { email, otp }
            );

            if (response.data.success) {
                toast.success("OTP verified successfully");
                sessionStorage.setItem("otpVerified", "true");
                navigate("/reset-password", { state: { email } });
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while verifying the OTP");
        } finally {
            setLoading(false);
        }
    };

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
                                Forgot Password 😢
                            </h1>
                            <p className="text-lg font-medium text-blue w-full md:w-[70%]">
                                Enter your email address below.
                            </p>
                        </div>
                        <div className="w-full md:w-3/5">
                            <div className="w-full flex flex-col items-center gap-4 mb-14 mt-5">
                                {!otpStep ? (
                                    <>
                                        <Input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            className="w-full"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Button
                                            disabled={loading || !email}
                                            className="w-[140px]"
                                            onClick={sendOtp}
                                        >
                                            {loading ? (
                                                <div className="flex justify-center items-center">
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                    Sending
                                                </div>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            type="text"
                                            placeholder="Enter OTP"
                                            className="w-full"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <Button
                                            disabled={loading || !otp}
                                            className="w-[140px]"
                                            onClick={verifyOtp}
                                        >
                                            {loading ? (
                                                <div className="flex justify-center items-center">
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                    Verifying
                                                </div>
                                            ) : (
                                                "Verify OTP"
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
    );
};

export default ForgotPasswordComponent;
